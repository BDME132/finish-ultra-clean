import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { Resend } from "resend";
import { getSupabase } from "@/lib/supabase";
import { CustomKitFormData } from "@/types/custom-kit-request";

const resend = new Resend(process.env.RESEND_API_KEY);
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "hello@finishultra.com";

const VALID_DISTANCES = ["50K", "100K", "100M", "other"];
const VALID_EXPERIENCE = ["first", "few", "experienced"];
const VALID_BUDGETS = ["under-50", "50-100", "100-150", "150-plus"];
const VALID_DIETARY = ["vegan", "vegetarian", "gluten-free", "dairy-free", "none"];
const VALID_FLAVORS = ["sweet", "salty", "neutral", "fruity"];
const MAX_TEXT_LENGTH = 1000;
const MAX_SHORT_FIELD = 200;

// Rate limiting: Map of IP -> { count, resetTime }
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 5; // 5 requests per window

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function truncate(str: string, max: number): string {
  return str.length > max ? str.slice(0, max) : str;
}

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

const VALID_DISTANCES = ["50K", "100K", "100M", "other"];
const VALID_EXPERIENCE = ["first", "few", "experienced"];
const VALID_BUDGETS = ["under-50", "50-100", "100-150", "150-plus"];
const VALID_DIETARY = ["vegan", "vegetarian", "gluten-free", "dairy-free", "none"];
const VALID_FLAVORS = ["sweet", "salty", "neutral", "fruity"];
const MAX_TEXT_LENGTH = 1000;
const MAX_SHORT_FIELD = 200;

// Rate limiting: Map of IP -> { count, resetTime }
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 5; // 5 requests per window

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function truncate(str: string, max: number): string {
  return str.length > max ? str.slice(0, max) : str;
}

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

export async function POST(request: Request) {
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

    const data: CustomKitFormData = await request.json();

    // Validate required fields
    if (!data.name || !data.email || !data.targetDistance || !data.raceDate ||
        !data.experienceLevel || !data.budgetRange || !data.whenNeededBy) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Validate enum fields
    if (!VALID_DISTANCES.includes(data.targetDistance) ||
        !VALID_EXPERIENCE.includes(data.experienceLevel) ||
        !VALID_BUDGETS.includes(data.budgetRange)) {
      return NextResponse.json(
        { error: "Invalid field value" },
        { status: 400 }
      );
    }

    // Validate array fields
    if (Array.isArray(data.dietaryRestrictions) &&
        data.dietaryRestrictions.some((v: string) => !VALID_DIETARY.includes(v))) {
      return NextResponse.json(
        { error: "Invalid dietary restriction value" },
        { status: 400 }
      );
    }
    if (Array.isArray(data.flavorPreferences) &&
        data.flavorPreferences.some((v: string) => !VALID_FLAVORS.includes(v))) {
      return NextResponse.json(
        { error: "Invalid flavor preference value" },
        { status: 400 }
      );
    }

    // Truncate text fields to prevent abuse
    data.name = truncate(data.name, MAX_SHORT_FIELD);
    data.email = truncate(data.email, MAX_SHORT_FIELD);
    data.phone = truncate(data.phone || "", MAX_SHORT_FIELD);
    data.raceName = truncate(data.raceName || "", MAX_SHORT_FIELD);
    data.pastNutritionIssues = truncate(data.pastNutritionIssues || "", MAX_TEXT_LENGTH);
    data.additionalNotes = truncate(data.additionalNotes || "", MAX_TEXT_LENGTH);

    // Get user ID if logged in
    let userId: string | null = null;
    try {
      const cookieStore = await cookies();
      const supabaseAuth = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            getAll() {
              return cookieStore.getAll();
            },
            setAll() {
              // Not needed for reading
            },
          },
        }
      );
      const { data: { user } } = await supabaseAuth.auth.getUser();
      userId = user?.id ?? null;
    } catch {
      // If we can't get user, continue without user_id
    }

    // Insert into Supabase
    const { error: dbError } = await getSupabase()
      .from("custom_kit_requests")
      .insert({
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        target_distance: data.targetDistance,
        race_name: data.raceName || null,
        race_date: data.raceDate,
        experience_level: data.experienceLevel,
        dietary_restrictions: data.dietaryRestrictions,
        flavor_preferences: data.flavorPreferences,
        past_nutrition_issues: data.pastNutritionIssues || null,
        budget_range: data.budgetRange,
        when_needed_by: data.whenNeededBy,
        additional_notes: data.additionalNotes || null,
        user_id: userId,
      });

    if (dbError) {
      console.error("Supabase error:", dbError);
      return NextResponse.json(
        { error: "Failed to save request" },
        { status: 500 }
      );
    }

    // Send email notification (HTML-escape all user data)
    const emailHtml = `
      <h2>New Custom Kit Request</h2>

      <h3>Contact Information</h3>
      <p><strong>Name:</strong> ${escapeHtml(data.name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
      <p><strong>Phone:</strong> ${escapeHtml(data.phone || "Not provided")}</p>
      ${userId ? `<p><strong>User ID:</strong> ${escapeHtml(userId)}</p>` : ""}

      <h3>Race Details</h3>
      <p><strong>Target Distance:</strong> ${escapeHtml(data.targetDistance)}</p>
      <p><strong>Race Name:</strong> ${escapeHtml(data.raceName || "Not provided")}</p>
      <p><strong>Race Date:</strong> ${escapeHtml(data.raceDate)}</p>
      <p><strong>Experience Level:</strong> ${escapeHtml(data.experienceLevel)}</p>

      <h3>Nutrition &amp; Dietary</h3>
      <p><strong>Dietary Restrictions:</strong> ${data.dietaryRestrictions.length > 0 ? data.dietaryRestrictions.map(escapeHtml).join(", ") : "None"}</p>
      <p><strong>Flavor Preferences:</strong> ${data.flavorPreferences.length > 0 ? data.flavorPreferences.map(escapeHtml).join(", ") : "None specified"}</p>
      <p><strong>Past Nutrition Issues:</strong> ${escapeHtml(data.pastNutritionIssues || "None mentioned")}</p>

      <h3>Budget &amp; Timeline</h3>
      <p><strong>Budget Range:</strong> ${escapeHtml(data.budgetRange)}</p>
      <p><strong>When Needed By:</strong> ${escapeHtml(data.whenNeededBy)}</p>
      <p><strong>Additional Notes:</strong> ${escapeHtml(data.additionalNotes || "None")}</p>
    `;

    const { error: emailError } = await resend.emails.send({
      from: "FinishUltra <noreply@finishultra.com>",
      to: ADMIN_EMAIL,
      subject: `New Custom Kit Request from ${escapeHtml(data.name)}`,
      html: emailHtml,
    });

    if (emailError) {
      console.error("Resend error:", emailError);
      // Don't fail the request if email fails - data is already saved
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
