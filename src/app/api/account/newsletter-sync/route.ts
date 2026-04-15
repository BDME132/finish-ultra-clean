import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";
import { getSupabase } from "@/lib/supabase";

/**
 * Returns the newsletter subscription status for the logged-in user.
 * Subscription status is derived from email_signups.user_id — no profile flag needed.
 */
export async function GET(): Promise<NextResponse> {
  try {
    const auth = await createSupabaseServer();
    const {
      data: { user },
    } = await auth.auth.getUser();

    if (!user) {
      return NextResponse.json({ subscribed: false });
    }

    const supabase = getSupabase();

    const { data: row, error } = await supabase
      .from("email_signups")
      .select("id")
      .eq("user_id", user.id)
      .is("unsubscribed_at", null)
      .maybeSingle();

    if (error) {
      console.error("newsletter-sync lookup:", error);
      return NextResponse.json(
        { error: "Failed to check subscription status" },
        { status: 500 }
      );
    }

    return NextResponse.json({ subscribed: Boolean(row) });
  } catch (e) {
    console.error("newsletter-sync:", e);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
