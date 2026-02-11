import { NextResponse } from "next/server";
import { Resend } from "resend";
import { getSupabase } from "@/lib/supabase";
import { EmailSignupData, EmailSignupResponse } from "@/types/email-signup";

let _resend: Resend | null = null;
function getResend(): Resend {
  if (!_resend) {
    _resend = new Resend(process.env.RESEND_API_KEY);
  }
  return _resend;
}

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "hello@finishultra.com";

// Rate limiting: Map of IP -> { count, resetTime }
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 5; // 5 requests per window

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  entry.count++;
  return entry.count > RATE_LIMIT_MAX;
}

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
    // Rate limiting
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
               request.headers.get("x-real-ip") ||
               "unknown";
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const data: EmailSignupData = await request.json();

    // Validate email
    if (!data.email || typeof data.email !== "string") {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const email = data.email.trim().toLowerCase();

    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address" },
        { status: 400 }
      );
    }

    // Truncate email to prevent abuse
    if (email.length > 254) {
      return NextResponse.json(
        { error: "Email address is too long" },
        { status: 400 }
      );
    }

    // Insert into Supabase
    const { error: dbError } = await getSupabase()
      .from("email_signups")
      .insert({ email });

    if (dbError) {
      // Handle unique constraint violation
      if (dbError.code === "23505") {
        return NextResponse.json(
          { error: "This email is already on the list" },
          { status: 409 }
        );
      }
      console.error("Supabase error:", dbError);
      return NextResponse.json(
        { error: "Failed to save email" },
        { status: 500 }
      );
    }

    const resend = getResend();

    // Send welcome email to the subscriber
    const welcomeHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2563eb;">Welcome to FinishUltra!</h1>
        <p>Thanks for signing up! You're now on the list to receive updates about our premium race nutrition kits.</p>
        <p>We'll keep you posted on:</p>
        <ul>
          <li>New product launches</li>
          <li>Exclusive deals and early access</li>
          <li>Tips for race day nutrition</li>
        </ul>
        <p>Stay fueled,<br>The FinishUltra Team</p>
      </div>
    `;

    const { error: welcomeError } = await resend.emails.send({
      from: "FinishUltra <noreply@finishultra.com>",
      to: email,
      subject: "Welcome to FinishUltra!",
      html: welcomeHtml,
    });

    if (welcomeError) {
      console.error("Welcome email error:", welcomeError);
    }

    // Send notification email to admin
    const adminHtml = `
      <h2>New Email Signup</h2>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      <p><strong>Time:</strong> ${new Date().toISOString()}</p>
    `;

    const { error: adminError } = await resend.emails.send({
      from: "FinishUltra <noreply@finishultra.com>",
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
