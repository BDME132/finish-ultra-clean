import { NextResponse } from "next/server";
import { loadBlogPostRowByIdForAuthor } from "@/lib/blog-server";
import {
  createSupabaseServer,
  hasSupabaseServerEnv,
} from "@/lib/supabase/server";

type RouteProps = {
  params: Promise<{ slug: string }>;
};

export async function POST(
  _request: Request,
  { params }: RouteProps,
) {
  if (!hasSupabaseServerEnv()) {
    return NextResponse.json(
      { error: "Blog publishing requires Supabase configuration." },
      { status: 503 },
    );
  }

  try {
    const { slug: postId } = await params;
    const supabase = await createSupabaseServer();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const post = await loadBlogPostRowByIdForAuthor(user.id, postId);
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const { error } = await supabase
      .from("blog_posts")
      .update({
        visibility: "archived",
        updated_at: new Date().toISOString(),
      })
      .eq("id", post.id);

    if (error) {
      console.error("Archive post error:", error);
      return NextResponse.json(
        { error: "Failed to archive post" },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Archive post route error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
