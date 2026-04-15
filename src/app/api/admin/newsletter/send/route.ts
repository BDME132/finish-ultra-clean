import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { Resend } from "resend";
import { verifySessionToken, COOKIE_NAME } from "@/lib/admin-auth";
import { getSupabase } from "@/lib/supabase";
import { SendNewsletterRequest, SendNewsletterResponse } from "@/types/newsletter";
import {
  FROM,
  appendNewsletterFooter,
  listUnsubscribeHeaders,
  newsletterPlainTextFallback,
} from "@/lib/email/templates";
import { uniqueNewsletterSlug } from "@/lib/newsletter-slug";

let _resend: Resend | null = null;
function getResend(): Resend {
  if (!_resend) {
    _resend = new Resend(process.env.RESEND_API_KEY);
  }
  return _resend;
}

const BATCH_SIZE = 100;
const BATCH_DELAY_MS = 1000;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function listHeadersFor(email: string): Record<string, string> | undefined {
  try {
    return listUnsubscribeHeaders(email);
  } catch {
    return undefined;
  }
}

export async function POST(
  request: Request
): Promise<NextResponse<SendNewsletterResponse>> {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get(COOKIE_NAME)?.value;

    if (!sessionToken || !verifySessionToken(sessionToken)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body: SendNewsletterRequest = await request.json();
    const { subject, body: emailBody, publishToArchive, archiveSlug } = body;

    if (!subject?.trim() || !emailBody?.trim()) {
      return NextResponse.json(
        { error: "Subject and body are required" },
        { status: 400 }
      );
    }

    const supabase = getSupabase();

    const { data: subscribers, error: fetchError } = await supabase
      .from("email_signups")
      .select("email")
      .is("unsubscribed_at", null);

    if (fetchError) {
      console.error("Error fetching subscribers:", fetchError);
      return NextResponse.json(
        { error: "Failed to fetch subscribers" },
        { status: 500 }
      );
    }

    if (!subscribers || subscribers.length === 0) {
      return NextResponse.json(
        { error: "No subscribers to send to" },
        { status: 400 }
      );
    }

    const resend = getResend();
    let successCount = 0;
    const errors: string[] = [];
    const subjectTrim = subject.trim();
    const bodyTrim = emailBody.trim();

    for (let i = 0; i < subscribers.length; i += BATCH_SIZE) {
      const batch = subscribers.slice(i, i + BATCH_SIZE);

      const payloads = batch.map((subscriber) => {
        const email = subscriber.email;
        const html = appendNewsletterFooter(bodyTrim, email);
        const text = newsletterPlainTextFallback(bodyTrim, email);
        const headers = listHeadersFor(email);
        return {
          from: FROM,
          to: email,
          subject: subjectTrim,
          html,
          text,
          ...(headers ? { headers } : {}),
        };
      });

      try {
        const result = await resend.batch.send(payloads);

        if (result.error) {
          console.error("Batch send error:", result.error);
          errors.push(
            `Batch ${Math.floor(i / BATCH_SIZE) + 1}: ${result.error.message}`
          );
        } else {
          successCount += batch.length;
        }
      } catch (batchError) {
        console.error("Batch error:", batchError);
        errors.push(
          `Batch ${Math.floor(i / BATCH_SIZE) + 1}: ${batchError instanceof Error ? batchError.message : "Unknown error"}`
        );
      }

      if (i + BATCH_SIZE < subscribers.length) {
        await delay(BATCH_DELAY_MS);
      }
    }

    const now = new Date().toISOString();
    let slug: string | null = null;
    let isPublished = false;
    let publishedAt: string | null = null;

    if (publishToArchive) {
      isPublished = true;
      publishedAt = now;
      const base = (archiveSlug && archiveSlug.trim()) || subjectTrim;
      slug = await uniqueNewsletterSlug(supabase, base);
    }

    const { error: logError } = await supabase.from("newsletters").insert({
      subject: subjectTrim,
      body: bodyTrim,
      recipient_count: successCount,
      is_published: isPublished,
      slug,
      published_at: publishedAt,
    });

    if (logError) {
      console.error("Error logging newsletter:", logError);
    }

    if (successCount === 0) {
      return NextResponse.json(
        { error: `Failed to send emails: ${errors.join(", ")}` },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      recipientCount: successCount,
    });
  } catch (error) {
    console.error("Error sending newsletter:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
