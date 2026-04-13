import { NextResponse } from "next/server";
import {
  loadAuthorBlogPostForEditServer,
  loadBlogPostRowByIdForAuthor,
  loadBlogVersionsForPost,
} from "@/lib/blog-server";
import {
  createSupabaseServer,
  hasSupabaseServerEnv,
} from "@/lib/supabase/server";
import {
  validateBlogSubmissionInput,
  versionToEditorInput,
} from "@/lib/blog-editor";

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

    const versions = await loadBlogVersionsForPost(post.id);
    const latestVersion = versions.find((version) => version.id === post.latest_version_id) ?? null;

    if (!latestVersion) {
      return NextResponse.json(
        { error: "Draft version not found" },
        { status: 404 },
      );
    }

    if (latestVersion.moderation_status === "pending_review") {
      return NextResponse.json(
        { error: "This post is already under review." },
        { status: 409 },
      );
    }

    if (post.published_version_id && latestVersion.id === post.published_version_id) {
      return NextResponse.json(
        { error: "Save your changes before submitting a revision." },
        { status: 409 },
      );
    }

    const validationError = validateBlogSubmissionInput(
      versionToEditorInput({
        id: latestVersion.id,
        title: latestVersion.title,
        excerpt: latestVersion.excerpt,
        bodyMarkdown: latestVersion.body_markdown,
        category: latestVersion.category,
        tags: latestVersion.tags ?? [],
        coverImageUrl: latestVersion.cover_image_url ?? "",
        readTime: latestVersion.read_time ?? "",
        featured: Boolean(latestVersion.featured),
        relatedSlugs: latestVersion.related_slugs ?? [],
        affiliateProducts: latestVersion.affiliate_products ?? [],
        faq: latestVersion.faq ?? [],
        submissionKind: latestVersion.submission_kind,
        moderationStatus: latestVersion.moderation_status,
        reviewerNote: latestVersion.reviewer_note,
        createdAt: latestVersion.created_at,
        submittedAt: latestVersion.submitted_at,
        reviewedAt: latestVersion.reviewed_at,
      }),
    );

    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const now = new Date().toISOString();
    const { error: versionError } = await supabase
      .from("blog_post_versions")
      .update({
        moderation_status: "pending_review",
        reviewer_note: null,
        reviewed_at: null,
        submitted_at: now,
      })
      .eq("id", latestVersion.id);

    if (versionError) {
      console.error("Submit blog post error:", versionError);
      return NextResponse.json(
        { error: "Failed to submit post for review" },
        { status: 500 },
      );
    }

    const { error: postError } = await supabase
      .from("blog_posts")
      .update({ updated_at: now })
      .eq("id", post.id);

    if (postError) {
      console.error("Submit blog post timestamp error:", postError);
    }

    const updatedPost = await loadAuthorBlogPostForEditServer(user.id, post.id);
    return NextResponse.json({ success: true, post: updatedPost });
  } catch (error) {
    console.error("Blog submit route error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
