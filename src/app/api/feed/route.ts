import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";
import {
  FEED_PAGE_SIZE,
  type FeedItem,
  type FeedItemWithAuthor,
} from "@/lib/account/feed";
import {
  FOLLOW_PROFILE_FIELDS,
  type FollowProfile,
} from "@/lib/account/follows";

export async function GET(request: Request) {
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
    const limit = Math.min(
      parseInt(url.searchParams.get("limit") ?? `${FEED_PAGE_SIZE}`, 10) || FEED_PAGE_SIZE,
      50,
    );
    const before = url.searchParams.get("before");

    const { data: followRows, error: followError } = await supabase
      .from("follows")
      .select("followed_user_id")
      .eq("follower_user_id", user.id);

    if (followError) {
      console.error("Feed: failed to load follows", followError);
      return NextResponse.json({ error: "Failed to load feed" }, { status: 500 });
    }

    const followedIds = ((followRows as { followed_user_id: string }[]) ?? []).map(
      (r) => r.followed_user_id,
    );

    if (followedIds.length === 0) {
      return NextResponse.json({ items: [] });
    }

    let query = supabase
      .from("account_feed_items")
      .select("item_type, item_id, author_user_id, title, subtitle, slug, published_at, updated_at")
      .in("author_user_id", followedIds)
      .order("published_at", { ascending: false })
      .limit(limit);

    if (before) {
      query = query.lt("published_at", before);
    }

    const { data: itemsData, error: itemsError } = await query;

    if (itemsError) {
      console.error("Feed: failed to load items", itemsError);
      return NextResponse.json({ error: "Failed to load feed" }, { status: 500 });
    }

    const items = (itemsData as FeedItem[]) ?? [];
    const authorIds = Array.from(new Set(items.map((i) => i.author_user_id)));

    let authorMap = new Map<string, FollowProfile>();
    if (authorIds.length > 0) {
      const { data: authors } = await supabase
        .from("profiles")
        .select(FOLLOW_PROFILE_FIELDS)
        .in("id", authorIds);
      authorMap = new Map(((authors as FollowProfile[]) ?? []).map((p) => [p.id, p]));
    }

    const enriched: FeedItemWithAuthor[] = items.map((item) => ({
      ...item,
      author: authorMap.get(item.author_user_id) ?? null,
    }));

    return NextResponse.json({ items: enriched });
  } catch (error) {
    console.error("Feed GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
