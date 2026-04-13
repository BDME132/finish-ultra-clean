import { NextResponse } from "next/server";
import {
  loadPublicBlogPostByIdServer,
  loadVisibleBlogCommentsServer,
  resolveBlogAuthorName,
} from "@/lib/blog-server";
import {
  createSupabaseServer,
  hasSupabaseServerEnv,
} from "@/lib/supabase/server";
import { materializeBlogComment, type BlogCommentRow } from "@/lib/blog";

type RouteProps = {
  params: Promise<{ slug: string }>;
};

export async function GET(
  _request: Request,
  { params }: RouteProps,
) {
  const { slug: postId } = await params;
  const comments = await loadVisibleBlogCommentsServer(postId);
  return NextResponse.json({ comments });
}

export async function POST(
  request: Request,
  { params }: RouteProps,
) {
  if (!hasSupabaseServerEnv()) {
    return NextResponse.json(
      { error: "Comments require Supabase configuration." },
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

    const post = await loadPublicBlogPostByIdServer(postId);
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const payload = (await request.json()) as { body?: unknown };
    const body = typeof payload.body === "string" ? payload.body : "";
    const trimmedBody = body.trim();

    if (trimmedBody.length < 2) {
      return NextResponse.json(
        { error: "Write a fuller comment before posting." },
        { status: 400 },
      );
    }

    if (trimmedBody.length > 2000) {
      return NextResponse.json(
        { error: "Comments must stay under 2,000 characters." },
        { status: 400 },
      );
    }

    const authorName = await resolveBlogAuthorName(supabase, user);
    const { data, error } = await supabase
      .from("blog_comments")
      .insert({
        post_id: post.id,
        author_user_id: user.id,
        author_name: authorName,
        body: trimmedBody,
        moderation_status: "visible",
      })
      .select("id, post_id, author_user_id, author_name, body, moderation_status, created_at, updated_at")
      .single();

    if (error || !data) {
      console.error("Create comment error:", error);
      return NextResponse.json(
        { error: "Failed to post comment" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      comment: materializeBlogComment(data as BlogCommentRow),
    });
  } catch (error) {
    console.error("Blog comments POST route error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
