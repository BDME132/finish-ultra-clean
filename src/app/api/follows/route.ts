import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";
import { FOLLOW_PROFILE_FIELDS, type FollowEdge, type FollowProfile } from "@/lib/account/follows";

type Direction = "followers" | "following";

interface FollowRowMinimal {
  follower_user_id: string;
  followed_user_id: string;
  created_at: string;
}

async function loadProfilesByIds(
  supabase: Awaited<ReturnType<typeof createSupabaseServer>>,
  ids: string[],
): Promise<Map<string, FollowProfile>> {
  if (ids.length === 0) return new Map();
  const { data, error } = await supabase
    .from("profiles")
    .select(FOLLOW_PROFILE_FIELDS)
    .in("id", ids);
  if (error) {
    console.error("Profile lookup failed:", error);
    return new Map();
  }
  return new Map(((data as FollowProfile[]) ?? []).map((p) => [p.id, p]));
}

export async function GET(request: Request) {
  try {
    const supabase = await createSupabaseServer();
    const url = new URL(request.url);
    const direction = (url.searchParams.get("direction") as Direction | null) ?? null;
    const userId = url.searchParams.get("user_id");
    const target = url.searchParams.get("target_user_id");

    // Status check: am I (auth user) following target_user_id?
    if (target) {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return NextResponse.json({ following: false });
      const { data, error } = await supabase
        .from("follows")
        .select("follower_user_id")
        .eq("follower_user_id", user.id)
        .eq("followed_user_id", target)
        .maybeSingle();
      if (error) {
        console.error("Follow status check failed:", error);
        return NextResponse.json({ following: false });
      }
      return NextResponse.json({ following: !!data });
    }

    if (!userId) {
      return NextResponse.json({ error: "Missing user_id" }, { status: 400 });
    }

    if (direction === "followers" || direction === "following") {
      const idColumn = direction === "followers" ? "followed_user_id" : "follower_user_id";
      const otherColumn = direction === "followers" ? "follower_user_id" : "followed_user_id";

      const { data: rows, error } = await supabase
        .from("follows")
        .select("follower_user_id, followed_user_id, created_at")
        .eq(idColumn, userId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Follow list failed:", error);
        return NextResponse.json({ error: "Failed to load follows" }, { status: 500 });
      }

      const followRows = (rows as FollowRowMinimal[]) ?? [];
      const ids = followRows.map((row) =>
        otherColumn === "follower_user_id" ? row.follower_user_id : row.followed_user_id,
      );
      const profileMap = await loadProfilesByIds(supabase, ids);

      const edges: FollowEdge[] = followRows
        .map((row) => {
          const targetId =
            otherColumn === "follower_user_id" ? row.follower_user_id : row.followed_user_id;
          const profile = profileMap.get(targetId);
          if (!profile) return null;
          return { created_at: row.created_at, profile };
        })
        .filter((edge): edge is FollowEdge => edge !== null);

      return NextResponse.json({ edges });
    }

    // Default: return counts for the user_id
    const [{ count: followers }, { count: following }] = await Promise.all([
      supabase
        .from("follows")
        .select("follower_user_id", { count: "exact", head: true })
        .eq("followed_user_id", userId),
      supabase
        .from("follows")
        .select("followed_user_id", { count: "exact", head: true })
        .eq("follower_user_id", userId),
    ]);

    return NextResponse.json({
      followers: followers ?? 0,
      following: following ?? 0,
    });
  } catch (error) {
    console.error("Follows GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createSupabaseServer();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json().catch(() => null)) as { user_id?: string } | null;
    if (!body?.user_id) {
      return NextResponse.json({ error: "Missing user_id" }, { status: 400 });
    }
    if (body.user_id === user.id) {
      return NextResponse.json({ error: "You can't follow yourself" }, { status: 400 });
    }

    const { error } = await supabase
      .from("follows")
      .upsert(
        { follower_user_id: user.id, followed_user_id: body.user_id },
        { onConflict: "follower_user_id,followed_user_id" },
      );

    if (error) {
      console.error("Follow insert failed:", error);
      return NextResponse.json({ error: "Failed to follow" }, { status: 500 });
    }

    return NextResponse.json({ following: true });
  } catch (error) {
    console.error("Follows POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const supabase = await createSupabaseServer();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(request.url);
    const target = url.searchParams.get("user_id");
    if (!target) {
      return NextResponse.json({ error: "Missing user_id" }, { status: 400 });
    }

    const { error } = await supabase
      .from("follows")
      .delete()
      .eq("follower_user_id", user.id)
      .eq("followed_user_id", target);

    if (error) {
      console.error("Unfollow failed:", error);
      return NextResponse.json({ error: "Failed to unfollow" }, { status: 500 });
    }

    return NextResponse.json({ following: false });
  } catch (error) {
    console.error("Follows DELETE error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
