import { NextResponse } from "next/server";
import { hasAdminSession } from "@/lib/admin-server";
import { getSupabase, hasSupabaseServiceEnv } from "@/lib/supabase";
import { loadAdminBlogPostById, loadAdminBlogPostsServer } from "@/lib/blog-server";

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
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const { error } = await getSupabase()
      .from("blog_posts")
      .update({
        visibility: "archived",
        updated_at: new Date().toISOString(),
      })
      .eq("id", post.id);

    if (error) {
      console.error("Admin archive post error:", error);
      return NextResponse.json(
        { error: "Failed to archive post" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      posts: await loadAdminBlogPostsServer(),
    });
  } catch (error) {
    console.error("Admin archive post route error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
