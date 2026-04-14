import { NextResponse } from "next/server";
import { hasAdminSession } from "@/lib/admin-server";
import { getSupabase, hasSupabaseServiceEnv } from "@/lib/supabase";
import {
  loadAdminBlogPostById,
  loadAdminBlogPostsServer,
  loadAdminBlogPostVersion,
} from "@/lib/blog-server";

type RouteProps = {
  params: Promise<{ id: string }>;
};

export async function POST(
  request: Request,
  { params }: RouteProps,
) {
  if (!(await hasAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!hasSupabaseServiceEnv()) {
    return NextResponse.json(
      { error: "Supabase service credentials are not configured." },
      { status: 503 },
    );
  }

  try {
    const { id } = await params;
    const { note } = (await request.json()) as { note?: string };
    const post = await loadAdminBlogPostById(id);
    if (!post || !post.latest_version_id) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const latestVersion = await loadAdminBlogPostVersion(post.latest_version_id);
    if (!latestVersion) {
      return NextResponse.json(
        { error: "Draft version not found" },
        { status: 404 },
      );
    }

    if (latestVersion.moderation_status !== "pending_review") {
      return NextResponse.json(
        { error: "Only pending posts can be rejected." },
        { status: 409 },
      );
    }

    const supabase = getSupabase();
    const { error } = await supabase
      .from("blog_post_versions")
      .update({
        moderation_status: "rejected",
        reviewer_note: typeof note === "string" && note.trim()
          ? note.trim()
          : "Please revise and resubmit.",
        reviewed_at: new Date().toISOString(),
      })
      .eq("id", latestVersion.id);

    if (error) {
      console.error("Reject blog post error:", error);
      return NextResponse.json(
        { error: "Failed to reject post" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      posts: await loadAdminBlogPostsServer(),
    });
  } catch (error) {
    console.error("Reject blog post route error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
