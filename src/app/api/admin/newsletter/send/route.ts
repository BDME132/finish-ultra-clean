import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { Resend } from "resend";
import { verifySessionToken, COOKIE_NAME } from "@/lib/admin-auth";
import { getSupabase } from "@/lib/supabase";
import { SendNewsletterRequest, SendNewsletterResponse } from "@/types/newsletter";

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

export async function POST(
  request: Request
): Promise<NextResponse<SendNewsletterResponse>> {
  try {
    // Verify admin access via session cookie
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get(COOKIE_NAME)?.value;

    if (!sessionToken || !verifySessionToken(sessionToken)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse request body
    const body: SendNewsletterRequest = await request.json();
    const { subject, body: emailBody } = body;

    if (!subject?.trim() || !emailBody?.trim()) {
      return NextResponse.json(
        { error: "Subject and body are required" },
        { status: 400 }
      );
    }

    // Fetch all subscribers
    const { data: subscribers, error: fetchError } = await getSupabase()
      .from("email_signups")
      .select("email");

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

    // Send emails in batches
    const resend = getResend();
    let successCount = 0;
    const errors: string[] = [];

    for (let i = 0; i < subscribers.length; i += BATCH_SIZE) {
      const batch = subscribers.slice(i, i + BATCH_SIZE);

      const emailPromises = batch.map((subscriber) => ({
        from: "FinishUltra <noreply@finishultra.com>",
        to: subscriber.email,
        subject: subject.trim(),
        html: emailBody.trim(),
      }));

      try {
        const result = await resend.batch.send(emailPromises);

        if (result.error) {
          console.error("Batch send error:", result.error);
          errors.push(`Batch ${Math.floor(i / BATCH_SIZE) + 1}: ${result.error.message}`);
        } else {
          successCount += batch.length;
        }
      } catch (batchError) {
        console.error("Batch error:", batchError);
        errors.push(
          `Batch ${Math.floor(i / BATCH_SIZE) + 1}: ${batchError instanceof Error ? batchError.message : "Unknown error"}`
        );
      }

      // Delay between batches to avoid rate limits
      if (i + BATCH_SIZE < subscribers.length) {
        await delay(BATCH_DELAY_MS);
      }
    }

    // Log newsletter to database
    const { error: logError } = await getSupabase().from("newsletters").insert({
      subject: subject.trim(),
      body: emailBody.trim(),
      recipient_count: successCount,
    });

    if (logError) {
      console.error("Error logging newsletter:", logError);
      // Don't fail the request, emails were already sent
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
