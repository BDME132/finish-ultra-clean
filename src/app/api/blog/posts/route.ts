import { NextResponse } from "next/server";
import {
  buildUniqueBlogSlug,
  loadAuthorBlogPostForEditServer,
  loadPublicBlogPostsServer,
  resolveBlogAuthorName,
} from "@/lib/blog-server";
import {
  createSupabaseServer,
  hasSupabaseServerEnv,
} from "@/lib/supabase/server";
import {
  BlogPostFilters,
  getPublicBlogAuthorName,
} from "@/lib/blog";
import {
  buildVersionPayload,
  normalizeDraftInput,
  sanitizeBlogEditorInput,
} from "@/lib/blog-editor";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const filters: BlogPostFilters = {
    source:
      (searchParams.get("source") as BlogPostFilters["source"] | null) ?? undefined,
    category: searchParams.get("category") ?? undefined,
    limit: searchParams.get("limit")
      ? Number(searchParams.get("limit"))
      : undefined,
  };

  const posts = await loadPublicBlogPostsServer(filters);
  return NextResponse.json({ posts });
}

export async function POST(request: Request) {
  if (!hasSupabaseServerEnv()) {
    return NextResponse.json(
      { error: "Blog publishing requires Supabase configuration." },
      { status: 503 },
    );
  }

  try {
    const supabase = await createSupabaseServer();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const input = normalizeDraftInput(
      sanitizeBlogEditorInput(await request.json()),
    );
    const slug = await buildUniqueBlogSlug(input.title);
    const authorName =
      (await resolveBlogAuthorName(supabase, user)) ??
      getPublicBlogAuthorName(null, user.email ?? null);

    const { data: insertedPost, error: postError } = await supabase
      .from("blog_posts")
      .insert({
        slug,
        author_user_id: user.id,
        author_name: authorName,
        author_type: "member",
        visibility: "archived",
      })
      .select("id")
      .single();

    if (postError || !insertedPost) {
      console.error("Create blog post error:", postError);
      return NextResponse.json(
        { error: "Failed to create post draft" },
        { status: 500 },
      );
    }

    const { data: versionData, error: versionError } = await supabase
      .from("blog_post_versions")
      .insert({
        post_id: insertedPost.id,
        ...buildVersionPayload(input, "initial"),
        moderation_status: "draft",
      })
      .select("id")
      .single();

    if (versionError || !versionData) {
      console.error("Create blog version error:", versionError);
      return NextResponse.json(
        { error: "Failed to create post draft" },
        { status: 500 },
      );
    }

    const { error: updateError } = await supabase
      .from("blog_posts")
      .update({
        latest_version_id: versionData.id,
      })
      .eq("id", insertedPost.id);

    if (updateError) {
      console.error("Update blog post latest version error:", updateError);
    }

    const post = await loadAuthorBlogPostForEditServer(user.id, insertedPost.id);

    return NextResponse.json({
      success: true,
      post,
    });
  } catch (error) {
    console.error("Blog posts POST route error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
