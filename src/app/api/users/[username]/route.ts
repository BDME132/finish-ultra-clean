import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";
import {
  PROFILE_FIELDS,
  type AccountProfile,
  type PublicProfileSummary,
} from "@/lib/account/profile";

export async function GET(
  _request: Request,
  context: { params: Promise<{ username: string }> },
) {
  try {
    const { username } = await context.params;
    if (!username) {
      return NextResponse.json({ error: "Missing username" }, { status: 400 });
    }

    const supabase = await createSupabaseServer();

    const { data, error } = await supabase
      .from("profiles")
      .select(PROFILE_FIELDS)
      .ilike("username", username)
      .maybeSingle();

    if (error) {
      console.error("Public profile lookup failed:", error);
      return NextResponse.json({ error: "Failed to load profile" }, { status: 500 });
    }
    if (!data) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const profile = data as AccountProfile;

    if (profile.profile_visibility !== "public") {
      return NextResponse.json({ error: "This profile is private" }, { status: 403 });
    }

    const [
      { count: followers },
      { count: following },
    ] = await Promise.all([
      supabase
        .from("follows")
        .select("follower_user_id", { count: "exact", head: true })
        .eq("followed_user_id", profile.id),
      supabase
        .from("follows")
        .select("followed_user_id", { count: "exact", head: true })
        .eq("follower_user_id", profile.id),
    ]);

    const summary: PublicProfileSummary = {
      id: profile.id,
      username: profile.username ?? username,
      display_name: profile.display_name,
      bio: profile.bio,
      avatar_url: profile.avatar_url,
      location: profile.location,
      website_url: profile.website_url,
      goal_distance: profile.goal_distance,
      follower_count: followers ?? 0,
      following_count: following ?? 0,
    };

    // Recent public items
    const [{ data: kits }, { data: plans }, { data: races }] = await Promise.all([
      supabase
        .from("public_kits")
        .select("id, slug, kit_title, kit_subtitle, total_cost, published_at")
        .eq("user_id", profile.id)
        .order("published_at", { ascending: false })
        .limit(6),
      supabase
        .from("public_training_plans")
        .select("id, slug, plan_title, race_name, distance, level, race_date, published_at")
        .eq("user_id", profile.id)
        .order("published_at", { ascending: false })
        .limit(6),
      supabase
        .from("race_results")
        .select("id, race_name, race_date, distance, finish_time, dnf")
        .eq("user_id", profile.id)
        .order("race_date", { ascending: false })
        .limit(6),
    ]);

    return NextResponse.json({
      profile: summary,
      kits: kits ?? [],
      plans: plans ?? [],
      races: races ?? [],
    });
  } catch (error) {
    console.error("Public profile GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
