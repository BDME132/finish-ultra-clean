import { NextResponse } from "next/server";
import {
  buildUniqueBlogSlug,
  loadAuthorBlogPostForEditServer,
  loadBlogPostRowByIdForAuthor,
  loadBlogVersionsForPost,
  loadPublicBlogPostBySlugServer,
  resolveBlogAuthorName,
} from "@/lib/blog-server";
import {
  createSupabaseServer,
  hasSupabaseServerEnv,
} from "@/lib/supabase/server";
import {
  buildVersionPayload,
  normalizeDraftInput,
  sanitizeBlogEditorInput,
} from "@/lib/blog-editor";

type RouteProps = {
  params: Promise<{ slug: string }>;
};

export async function GET(
  _request: Request,
  { params }: RouteProps,
) {
  const { slug } = await params;
  const post = await loadPublicBlogPostBySlugServer(slug);

  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  return NextResponse.json({ post });
}

export async function PUT(
  request: Request,
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

    const versions = await loadBlogVersionsForPost(post.id);
    const latestVersion = versions.find((version) => version.id === post.latest_version_id) ?? null;
    const publishedVersion = versions.find((version) => version.id === post.published_version_id) ?? null;

    if (latestVersion?.moderation_status === "pending_review") {
      return NextResponse.json(
        { error: "This post is already under review." },
        { status: 409 },
      );
    }

    const input = normalizeDraftInput(
      sanitizeBlogEditorInput(await request.json()),
    );
    const authorName = await resolveBlogAuthorName(supabase, user);
    const isPublishedPost = Boolean(post.published_version_id);

    if (!isPublishedPost) {
      const nextSlug =
        input.title && input.title !== latestVersion?.title
          ? await buildUniqueBlogSlug(input.title, post.id)
          : post.slug;

      if (latestVersion) {
        const { error: versionError } = await supabase
          .from("blog_post_versions")
          .update({
            ...buildVersionPayload(input, "initial"),
            moderation_status: "draft",
            reviewer_note: null,
            reviewed_at: null,
            submitted_at: null,
          })
          .eq("id", latestVersion.id);

        if (versionError) {
          console.error("Update initial draft error:", versionError);
          return NextResponse.json(
            { error: "Failed to save draft" },
            { status: 500 },
          );
        }
      }

      const { error: postUpdateError } = await supabase
        .from("blog_posts")
        .update({
          slug: nextSlug,
          author_name: authorName,
          updated_at: new Date().toISOString(),
        })
        .eq("id", post.id);

      if (postUpdateError) {
        console.error("Update draft post metadata error:", postUpdateError);
      }
    } else if (!latestVersion || latestVersion.id === post.published_version_id) {
      const { data: insertedVersion, error: insertError } = await supabase
        .from("blog_post_versions")
        .insert({
          post_id: post.id,
          ...buildVersionPayload(input, "revision"),
          moderation_status: "draft",
        })
        .select("id")
        .single();

      if (insertError || !insertedVersion) {
        console.error("Create revision draft error:", insertError);
        return NextResponse.json(
          { error: "Failed to create revision draft" },
          { status: 500 },
        );
      }

      const { error: postUpdateError } = await supabase
        .from("blog_posts")
        .update({
          latest_version_id: insertedVersion.id,
          author_name: authorName,
          updated_at: new Date().toISOString(),
        })
        .eq("id", post.id);

      if (postUpdateError) {
        console.error("Update revision pointer error:", postUpdateError);
      }
    } else {
      const { error: versionError } = await supabase
        .from("blog_post_versions")
        .update({
          ...buildVersionPayload(input, "revision"),
          moderation_status: "draft",
          reviewer_note: null,
          reviewed_at: null,
          submitted_at: null,
        })
        .eq("id", latestVersion.id);

      if (versionError) {
        console.error("Update revision draft error:", versionError);
        return NextResponse.json(
          { error: "Failed to save revision draft" },
          { status: 500 },
        );
      }

      const { error: postUpdateError } = await supabase
        .from("blog_posts")
        .update({
          author_name: authorName,
          updated_at: new Date().toISOString(),
        })
        .eq("id", post.id);

      if (postUpdateError) {
        console.error("Update revision post metadata error:", postUpdateError);
      }
    }

    const updatedPost = await loadAuthorBlogPostForEditServer(user.id, post.id);
    return NextResponse.json({ success: true, post: updatedPost });
  } catch (error) {
    console.error("Blog posts PUT route error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
