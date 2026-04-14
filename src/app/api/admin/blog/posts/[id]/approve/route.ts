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
  _request: Request,
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
        { error: "Only pending posts can be approved." },
        { status: 409 },
      );
    }

    const supabase = getSupabase();
    const now = new Date().toISOString();

    const { error: versionError } = await supabase
      .from("blog_post_versions")
      .update({
        moderation_status: "approved",
        reviewer_note: null,
        reviewed_at: now,
      })
      .eq("id", latestVersion.id);

    if (versionError) {
      console.error("Approve blog post version error:", versionError);
      return NextResponse.json(
        { error: "Failed to approve post" },
        { status: 500 },
      );
    }

    const { error: postError } = await supabase
      .from("blog_posts")
      .update({
        published_version_id: latestVersion.id,
        latest_version_id: latestVersion.id,
        visibility: "public",
        published_at: post.published_at ?? now,
        updated_at: now,
      })
      .eq("id", post.id);

    if (postError) {
      console.error("Approve blog post error:", postError);
      return NextResponse.json(
        { error: "Failed to approve post" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      posts: await loadAdminBlogPostsServer(),
    });
  } catch (error) {
    console.error("Approve blog post route error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
