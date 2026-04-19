import { NextResponse } from "next/server";
import { Resend } from "resend";
import { getSupabase } from "@/lib/supabase";
import { createSupabaseServer } from "@/lib/supabase/server";
import { EmailSignupData, EmailSignupResponse } from "@/types/email-signup";
import { isEmailSignupRateLimited } from "@/lib/email-signup-rate-limit";
import {
  FROM,
  listUnsubscribeHeaders,
  welcomeEmailHtml,
  welcomeEmailText,
} from "@/lib/email/templates";

let _resend: Resend | null = null;
function getResend(): Resend {
  if (!_resend) {
    _resend = new Resend(process.env.RESEND_API_KEY);
  }
  return _resend;
}

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "finishultra@finishultra.com";

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function POST(request: Request): Promise<NextResponse<EmailSignupResponse>> {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";

    if (await isEmailSignupRateLimited(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const data: EmailSignupData = await request.json();

    if (!data.email || typeof data.email !== "string") {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const email = data.email.trim().toLowerCase();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address" },
        { status: 400 }
      );
    }

    if (email.length > 254) {
      return NextResponse.json(
        { error: "Email address is too long" },
        { status: 400 }
      );
    }

    const supabase = getSupabase();
    const now = new Date().toISOString();

    const supabaseAuth = await createSupabaseServer();
    const { data: { user } } = await supabaseAuth.auth.getUser();

    const { error: dbError } = await supabase.from("email_signups").insert({
      email,
      confirmed_at: now,
      user_id: user?.id ?? null,
    });

    if (dbError) {
      if (dbError.code === "23505") {
        const { data: existing } = await supabase
          .from("email_signups")
          .select("unsubscribed_at")
          .eq("email", email)
          .maybeSingle();

        if (existing?.unsubscribed_at) {
          const updateData: Record<string, unknown> = { unsubscribed_at: null, confirmed_at: now };
          if (user?.id) updateData.user_id = user.id;
          const { error: reErr } = await supabase
            .from("email_signups")
            .update(updateData)
            .eq("email", email);

          if (reErr) {
            console.error("Resubscribe error:", reErr);
            return NextResponse.json(
              { error: "Failed to save email" },
              { status: 500 }
            );
          }
        } else {
          return NextResponse.json(
            { error: "This email is already on the list" },
            { status: 409 }
          );
        }
      } else {
        console.error("Supabase error:", dbError);
        return NextResponse.json(
          { error: "Failed to save email" },
          { status: 500 }
        );
      }
    }

    const resend = getResend();

    let welcomeHeaders: Record<string, string> = {};
    try {
      welcomeHeaders = listUnsubscribeHeaders(email);
    } catch {
      // Missing NEWSLETTER_UNSUBSCRIBE_SECRET / ADMIN_PASSWORD — send without list headers
    }

    const { error: welcomeError } = await resend.emails.send({
      from: FROM,
      to: email,
      subject: "Welcome to FinishUltra!",
      html: welcomeEmailHtml(email),
      text: welcomeEmailText(email),
      headers: Object.keys(welcomeHeaders).length ? welcomeHeaders : undefined,
    });

    if (welcomeError) {
      console.error("Welcome email error:", JSON.stringify(welcomeError, null, 2));
    } else {
      console.log("Welcome email sent successfully to:", email);
    }

    const adminHtml = `
      <h2>New Email Signup</h2>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      <p><strong>Time:</strong> ${new Date().toISOString()}</p>
    `;

    const { error: adminError } = await resend.emails.send({
      from: FROM,
      to: ADMIN_EMAIL,
      subject: "New Email Signup",
      html: adminHtml,
    });

    if (adminError) {
      console.error("Admin notification error:", adminError);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
