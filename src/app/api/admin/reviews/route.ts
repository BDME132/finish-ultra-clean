import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySessionToken, COOKIE_NAME } from "@/lib/admin-auth";
import { getSupabase } from "@/lib/supabase";

// GET — Fetch pending flags with joined content for admin moderation
export async function GET(): Promise<NextResponse> {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get(COOKIE_NAME)?.value;

    if (!sessionToken || !verifySessionToken(sessionToken)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = getSupabase();

    // Fetch pending flags, stats counts in parallel
    const [
      { data: flags, error: flagsError },
      { count: totalReviews, error: reviewsCountError },
      { count: totalComments, error: commentsCountError },
    ] = await Promise.all([
      supabase
        .from("content_flags")
        .select("*")
        .eq("status", "pending")
        .order("created_at", { ascending: false }),
      supabase
        .from("product_reviews")
        .select("id", { count: "exact", head: true }),
      supabase
        .from("product_comments")
        .select("id", { count: "exact", head: true }),
    ]);

    if (flagsError) {
      console.error("Error fetching flags:", flagsError);
      return NextResponse.json(
        { error: "Failed to fetch flags" },
        { status: 500 }
      );
    }

    if (reviewsCountError || commentsCountError) {
      console.error("Error fetching counts:", reviewsCountError || commentsCountError);
      return NextResponse.json(
        { error: "Failed to fetch stats" },
        { status: 500 }
      );
    }

    // Enrich each flag with the actual content it refers to
    const enrichedFlags = await Promise.all(
      (flags || []).map(async (flag: any) => {
        let contentPayload: {
          id: string;
          userId: string;
          productId: string;
          body: string;
          title: string | null;
          rating: number | null;
          status: string;
          createdAt: string;
          displayName: string | null;
        } | null = null;

        if (flag.content_type === "review") {
          const { data } = await supabase
            .from("product_reviews")
            .select("id, user_id, product_id, body, title, rating, status, created_at, profiles(display_name)")
            .eq("id", flag.content_id)
            .single();
          if (data) {
            const profile = Array.isArray(data.profiles) ? data.profiles[0] : data.profiles;
            contentPayload = {
              id: data.id,
              userId: data.user_id,
              productId: data.product_id,
              body: data.body,
              title: data.title ?? null,
              rating: data.rating ?? null,
              status: data.status,
              createdAt: data.created_at,
              displayName: profile?.display_name || null,
            };
          }
        } else if (flag.content_type === "comment") {
          const { data } = await supabase
            .from("product_comments")
            .select("id, user_id, product_id, body, status, created_at, profiles(display_name)")
            .eq("id", flag.content_id)
            .single();
          if (data) {
            const profile = Array.isArray(data.profiles) ? data.profiles[0] : data.profiles;
            contentPayload = {
              id: data.id,
              userId: data.user_id,
              productId: data.product_id,
              body: data.body,
              title: null,
              rating: null,
              status: data.status,
              createdAt: data.created_at,
              displayName: profile?.display_name || null,
            };
          }
        }

        return {
          id: flag.id,
          reporterId: flag.reporter_id,
          contentType: flag.content_type,
          contentId: flag.content_id,
          reason: flag.reason,
          details: flag.details,
          status: flag.status,
          createdAt: flag.created_at,
          content: contentPayload,
        };
      })
    );

    return NextResponse.json({
      flags: enrichedFlags,
      stats: {
        pendingFlags: enrichedFlags.length,
        totalReviews: totalReviews ?? 0,
        totalComments: totalComments ?? 0,
      },
    });
  } catch (error) {
    console.error("Admin reviews GET error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST — Take action on a flag (dismiss or hide content)
export async function POST(request: Request): Promise<NextResponse> {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get(COOKIE_NAME)?.value;

    if (!sessionToken || !verifySessionToken(sessionToken)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { flagId, action } = body;

    if (!flagId || !action) {
      return NextResponse.json(
        { error: "Missing required fields (flagId, action)" },
        { status: 400 }
      );
    }

    if (action !== "dismiss" && action !== "hide") {
      return NextResponse.json(
        { error: "Action must be 'dismiss' or 'hide'" },
        { status: 400 }
      );
    }

    const supabase = getSupabase();

    // Fetch the flag first to get content details
    const { data: flag, error: flagError } = await supabase
      .from("content_flags")
      .select("*")
      .eq("id", flagId)
      .single();

    if (flagError || !flag) {
      console.error("Error fetching flag:", flagError);
      return NextResponse.json(
        { error: "Flag not found" },
        { status: 404 }
      );
    }

    if (action === "dismiss") {
      const { error } = await supabase
        .from("content_flags")
        .update({ status: "dismissed" })
        .eq("id", flagId);

      if (error) {
        console.error("Error dismissing flag:", error);
        return NextResponse.json(
          { error: "Failed to dismiss flag" },
          { status: 500 }
        );
      }
    } else if (action === "hide") {
      // Hide the flagged content and resolve the flag
      const contentTable =
        flag.content_type === "review" ? "product_reviews" : "product_comments";

      const [{ error: contentError }, { error: flagUpdateError }] =
        await Promise.all([
          supabase
            .from(contentTable)
            .update({ status: "hidden" })
            .eq("id", flag.content_id),
          supabase
            .from("content_flags")
            .update({ status: "resolved" })
            .eq("id", flagId),
        ]);

      if (contentError) {
        console.error("Error hiding content:", contentError);
        return NextResponse.json(
          { error: "Failed to hide content" },
          { status: 500 }
        );
      }

      if (flagUpdateError) {
        console.error("Error resolving flag:", flagUpdateError);
        return NextResponse.json(
          { error: "Failed to resolve flag" },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin reviews POST error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
