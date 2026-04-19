import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";
import {
  GOAL_DISTANCES,
  PROFILE_FIELDS,
  type AccountProfile,
  type ProfileVisibility,
  validateUsername,
} from "@/lib/account/profile";

const VISIBILITIES: ProfileVisibility[] = ["public", "private"];

function nullableString(input: unknown, max = 500): string | null {
  if (input === null || input === undefined) return null;
  if (typeof input !== "string") return null;
  const trimmed = input.trim();
  if (!trimmed) return null;
  return trimmed.slice(0, max);
}

export async function GET() {
  try {
    const supabase = await createSupabaseServer();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Try the full extended profile first; fall back to the legacy columns if the
    // migration hasn't been applied yet (new columns don't exist in the DB).
    let profile: AccountProfile | null = null;

    const { data, error } = await supabase
      .from("profiles")
      .select(PROFILE_FIELDS)
      .eq("id", user.id)
      .maybeSingle();

    if (error) {
      // 42703 = "column does not exist" — migration not yet applied; try base fields
      const code = (error as { code?: string }).code;
      if (code === "42703" || code === "PGRST200") {
        const { data: baseData, error: baseError } = await supabase
          .from("profiles")
          .select("id, display_name, is_newsletter_subscriber, updated_at")
          .eq("id", user.id)
          .maybeSingle();

        if (baseError) {
          console.error("Error loading base profile:", baseError);
          return NextResponse.json({ error: "Failed to load profile" }, { status: 500 });
        }

        // Return a synthetic AccountProfile with default values for new fields
        if (baseData) {
          profile = {
            ...(baseData as { id: string; display_name: string | null; updated_at: string | null }),
            username: null,
            bio: null,
            avatar_url: null,
            location: null,
            website_url: null,
            profile_visibility: "public",
            goal_distance: null,
          };
        }
      } else {
        console.error("Error loading profile:", error);
        return NextResponse.json({ error: "Failed to load profile" }, { status: 500 });
      }
    } else {
      profile = (data as AccountProfile) ?? null;
    }

    return NextResponse.json({ profile });
  } catch (error) {
    console.error("Profile GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const supabase = await createSupabaseServer();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid body" }, { status: 400 });
    }

    const updates: Record<string, unknown> = {};

    if ("display_name" in body) {
      updates.display_name = nullableString(body.display_name, 80);
    }

    if ("username" in body) {
      const usernameRaw = nullableString(body.username, 40);
      if (usernameRaw) {
        const lower = usernameRaw.toLowerCase();
        const validation = validateUsername(lower);
        if (!validation.ok) {
          return NextResponse.json({ error: validation.reason }, { status: 400 });
        }

        const { data: existing, error: lookupError } = await supabase
          .from("profiles")
          .select("id")
          .ilike("username", lower)
          .neq("id", user.id)
          .maybeSingle();

        if (lookupError) {
          console.error("Username lookup failed:", lookupError);
          return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
        }
        if (existing) {
          return NextResponse.json({ error: "That username is already taken." }, { status: 409 });
        }

        updates.username = lower;
      } else {
        updates.username = null;
      }
    }

    if ("bio" in body) updates.bio = nullableString(body.bio, 500);
    if ("location" in body) updates.location = nullableString(body.location, 80);
    if ("website_url" in body) updates.website_url = nullableString(body.website_url, 200);
    if ("avatar_url" in body) updates.avatar_url = nullableString(body.avatar_url, 500);

    if ("profile_visibility" in body) {
      const v = body.profile_visibility;
      if (typeof v !== "string" || !VISIBILITIES.includes(v as ProfileVisibility)) {
        return NextResponse.json({ error: "Invalid visibility" }, { status: 400 });
      }
      updates.profile_visibility = v;
    }

    if ("goal_distance" in body) {
      const v = body.goal_distance;
      if (v === null || v === "") {
        updates.goal_distance = null;
      } else if (typeof v === "string" && (GOAL_DISTANCES as readonly string[]).includes(v)) {
        updates.goal_distance = v;
      } else {
        return NextResponse.json({ error: "Invalid goal distance" }, { status: 400 });
      }
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 });
    }

    updates.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from("profiles")
      .upsert({ id: user.id, ...updates }, { onConflict: "id" })
      .select(PROFILE_FIELDS)
      .single();

    if (error) {
      console.error("Error updating profile:", error);
      const code = (error as { code?: string }).code;
      // Postgres unique violation
      if (code === "23505") {
        return NextResponse.json({ error: "That username is already taken." }, { status: 409 });
      }
      // Column doesn't exist — migration not applied; only write base fields
      if (code === "42703") {
        const baseUpdates: Record<string, unknown> = {};
        if ("display_name" in updates) baseUpdates.display_name = updates.display_name;
        baseUpdates.updated_at = updates.updated_at;

        const { error: baseError } = await supabase
          .from("profiles")
          .upsert({ id: user.id, ...baseUpdates }, { onConflict: "id" });

        if (baseError) {
          console.error("Error updating base profile:", baseError);
          return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
        }

        // Return a synthetic profile response
        return NextResponse.json({
          profile: {
            id: user.id,
            display_name: (baseUpdates.display_name as string | null) ?? null,
            username: null,
            bio: null,
            avatar_url: null,
            location: null,
            website_url: null,
            profile_visibility: "public",
            goal_distance: null,
          } satisfies AccountProfile,
        });
      }
      return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
    }

    return NextResponse.json({ profile: data as AccountProfile });
  } catch (error) {
    console.error("Profile PUT error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
