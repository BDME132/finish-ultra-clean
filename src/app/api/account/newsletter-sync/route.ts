import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";
import { getSupabase } from "@/lib/supabase";

/**
 * Syncs `profiles.is_newsletter_subscriber` with `email_signups` for the logged-in user's email.
 */
export async function GET(): Promise<NextResponse> {
  try {
    const auth = await createSupabaseServer();
    const {
      data: { user },
    } = await auth.auth.getUser();

    if (!user?.email) {
      return NextResponse.json({ subscribed: false, synced: false });
    }

    const email = user.email.trim().toLowerCase();
    const supabase = getSupabase();

    const { data: row, error } = await supabase
      .from("email_signups")
      .select("email")
      .eq("email", email)
      .is("unsubscribed_at", null)
      .maybeSingle();

    if (error) {
      console.error("newsletter-sync lookup:", error);
      return NextResponse.json(
        { error: "Failed to sync subscription status" },
        { status: 500 }
      );
    }

    const subscribed = Boolean(row);

    const { error: upErr } = await supabase
      .from("profiles")
      .update({ is_newsletter_subscriber: subscribed, updated_at: new Date().toISOString() })
      .eq("id", user.id);

    if (upErr) {
      console.error("newsletter-sync profile:", upErr);
      return NextResponse.json(
        { error: "Failed to update profile" },
        { status: 500 }
      );
    }

    return NextResponse.json({ subscribed, synced: true });
  } catch (e) {
    console.error("newsletter-sync:", e);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
