import "server-only";

import type { User } from "@supabase/supabase-js";
import {
  AdminBlogComment,
  AuthorBlogPost,
  BlogComment,
  BlogCommentRow,
  BlogPostFilters,
  BlogPostRow,
  BlogPostVersionRow,
  PublicBlogPost,
  applyBlogFilters,
  calculateReadTime,
  getPublicBlogAuthorName,
  materializeBlogComment,
  materializeBlogPostRecord as materializeRecord,
  materializeBlogVersion,
  materializePublicBlogPost,
  slugifyBlogTitle,
} from "@/lib/blog";
import {
  createSupabaseServer,
  hasSupabaseServerEnv,
} from "@/lib/supabase/server";
import {
  getSupabase,
  getSupabasePublic,
  hasSupabasePublicEnv,
  hasSupabaseServiceEnv,
} from "@/lib/supabase";
import {
  getLegacySeedPublicPostBySlug,
  getLegacySeedPublicPosts,
  getLegacySeedRows,
} from "@/lib/blog-seed";

const PUBLIC_POST_SELECT = [
  "id",
  "slug",
  "author_user_id",
  "author_name",
  "author_type",
  "visibility",
  "published_version_id",
  "latest_version_id",
  "published_at",
  "created_at",
  "updated_at",
].join(", ");

const VERSION_SELECT = [
  "id",
  "post_id",
  "title",
  "excerpt",
  "body_markdown",
  "category",
  "tags",
  "cover_image_url",
  "read_time",
  "featured",
  "related_slugs",
  "affiliate_products",
  "faq",
  "submission_kind",
  "moderation_status",
  "reviewer_note",
  "created_at",
  "submitted_at",
  "reviewed_at",
].join(", ");

const COMMENT_SELECT = [
  "id",
  "post_id",
  "author_user_id",
  "author_name",
  "body",
  "moderation_status",
  "created_at",
  "updated_at",
].join(", ");

let seedPromise: Promise<void> | null = null;
let blogSchemaState: "unknown" | "available" | "missing" = "unknown";

function isBlogSchemaMissingError(error: unknown) {
  if (!error || typeof error !== "object") {
    return false;
  }

  const candidate = error as { code?: string; message?: string };
  return (
    candidate.code === "PGRST205" ||
    candidate.code === "42P01" ||
    candidate.message?.includes("blog_posts") === true ||
    candidate.message?.includes("blog_post_versions") === true ||
    candidate.message?.includes("blog_comments") === true
  );
}

function handleBlogError(error: unknown, context: string) {
  if (isBlogSchemaMissingError(error)) {
    blogSchemaState = "missing";
    return;
  }

  console.error(`${context}:`, error);
}

function hasUsableBlogSchema() {
  return blogSchemaState !== "missing";
}

async function fetchVersionsByIds(
  supabase: Awaited<ReturnType<typeof createSupabaseServer>> | ReturnType<typeof getSupabase>,
  versionIds: string[],
) {
  const ids = [...new Set(versionIds.filter(Boolean))];
  if (ids.length === 0) return new Map<string, BlogPostVersionRow>();

  const { data, error } = await supabase
    .from("blog_post_versions")
    .select(VERSION_SELECT)
    .in("id", ids);

  if (error) {
    handleBlogError(error, "fetchVersionsByIds error");
    return new Map<string, BlogPostVersionRow>();
  }

  return new Map(
    ((data ?? []) as unknown as BlogPostVersionRow[]).map((row) => [row.id, row]),
  );
}

function materializeAuthorPost(
  postRow: BlogPostRow,
  latestVersion: BlogPostVersionRow | null,
  publishedVersion: BlogPostVersionRow | null,
): AuthorBlogPost {
  const post = materializeRecord(postRow);
  return {
    ...post,
    latestVersion: latestVersion ? materializeBlogVersion(latestVersion) : null,
    publishedVersion: publishedVersion
      ? materializeBlogVersion(publishedVersion)
      : null,
  };
}

export async function ensureSeedBlogContent() {
  if (!hasSupabaseServiceEnv() || !hasUsableBlogSchema()) {
    return false;
  }

  if (seedPromise) {
    await seedPromise;
    return hasUsableBlogSchema();
  }

  seedPromise = (async () => {
    const supabase = getSupabase();
    const { count, error } = await supabase
      .from("blog_posts")
      .select("id", { count: "exact", head: true });

    if (error) {
      handleBlogError(error, "ensureSeedBlogContent count error");
      return;
    }

    blogSchemaState = "available";

    if ((count ?? 0) > 0) {
      return;
    }

    for (const { postRow, versionRow } of getLegacySeedRows()) {
      const { data: existingPost, error: postLookupError } = await supabase
        .from("blog_posts")
        .select("id")
        .eq("slug", postRow.slug)
        .maybeSingle();

      if (postLookupError) {
        handleBlogError(postLookupError, "ensureSeedBlogContent lookup error");
        continue;
      }

      if (existingPost?.id) {
        continue;
      }

      const { data: insertedPost, error: insertPostError } = await supabase
        .from("blog_posts")
        .insert({
          slug: postRow.slug,
          author_user_id: null,
          author_name: "Pheidi (AI)",
          author_type: "member",
          visibility: "public",
          published_at: postRow.published_at,
          created_at: postRow.created_at,
          updated_at: postRow.updated_at,
        })
        .select("id")
        .single();

      if (insertPostError?.code === "23505") {
        continue;
      }

      if (insertPostError || !insertedPost) {
        console.error("ensureSeedBlogContent insert post error:", insertPostError);
        continue;
      }

      const { data: insertedVersion, error: insertVersionError } = await supabase
        .from("blog_post_versions")
        .insert({
          post_id: insertedPost.id,
          title: versionRow.title,
          excerpt: versionRow.excerpt,
          body_markdown: versionRow.body_markdown,
          category: versionRow.category,
          tags: versionRow.tags ?? [],
          cover_image_url: versionRow.cover_image_url,
          read_time: versionRow.read_time ?? calculateReadTime(versionRow.body_markdown),
          featured: Boolean(versionRow.featured),
          related_slugs: versionRow.related_slugs ?? [],
          affiliate_products: versionRow.affiliate_products ?? [],
          faq: versionRow.faq ?? [],
          submission_kind: "seed",
          moderation_status: "approved",
          created_at: versionRow.created_at,
          submitted_at: versionRow.submitted_at,
          reviewed_at: versionRow.reviewed_at,
        })
        .select("id")
        .single();

      if (insertVersionError || !insertedVersion) {
        console.error(
          "ensureSeedBlogContent insert version error:",
          insertVersionError,
        );
        continue;
      }

      const { error: updatePostError } = await supabase
        .from("blog_posts")
        .update({
          published_version_id: insertedVersion.id,
          latest_version_id: insertedVersion.id,
        })
        .eq("id", insertedPost.id);

      if (updatePostError) {
        console.error("ensureSeedBlogContent update post error:", updatePostError);
      }
    }
  })().finally(() => {
    seedPromise = null;
  });

  await seedPromise;
  return hasUsableBlogSchema();
}

export async function buildUniqueBlogSlug(
  title: string,
  excludePostId?: string,
): Promise<string> {
  const base = slugifyBlogTitle(title);

  if (!hasSupabaseServerEnv()) {
    return base;
  }

  const supabase = await createSupabaseServer();

  for (let attempt = 0; attempt < 12; attempt += 1) {
    const suffix = attempt === 0 ? "" : `-${Math.random().toString(36).slice(2, 6)}`;
    const candidate = `${base}${suffix}`;
    const query = supabase
      .from("blog_posts")
      .select("id")
      .eq("slug", candidate)
      .limit(1);

    const { data } = excludePostId
      ? await query.neq("id", excludePostId).maybeSingle()
      : await query.maybeSingle();

    if (!data) {
      return candidate;
    }
  }

  return `${base}-${Date.now().toString(36)}`;
}

export async function resolveBlogAuthorName(
  supabase: Awaited<ReturnType<typeof createSupabaseServer>>,
  user: User,
) {
  const { data } = await supabase
    .from("profiles")
    .select("display_name")
    .eq("id", user.id)
    .maybeSingle();

  return getPublicBlogAuthorName(data?.display_name, user.email ?? null);
}

export async function loadPublicBlogPostsServer(
  filters: BlogPostFilters = {},
): Promise<PublicBlogPost[]> {
  if (!hasSupabasePublicEnv() || blogSchemaState === "missing") {
    return applyBlogFilters(getLegacySeedPublicPosts(), filters);
  }

  const schemaReady = await ensureSeedBlogContent();
  if (hasSupabaseServiceEnv() && !schemaReady) {
    return applyBlogFilters(getLegacySeedPublicPosts(), filters);
  }

  try {
    const supabase = getSupabasePublic();
    const { data, error } = await supabase
      .from("blog_posts")
      .select(PUBLIC_POST_SELECT)
      .eq("visibility", "public")
      .not("published_version_id", "is", null)
      .order("published_at", { ascending: false })
      .limit(200);

    if (error) {
      handleBlogError(error, "loadPublicBlogPostsServer error");
      return applyBlogFilters(getLegacySeedPublicPosts(), filters);
    }

    const postRows = (data ?? []) as unknown as BlogPostRow[];
    if (postRows.length === 0) {
      return applyBlogFilters(getLegacySeedPublicPosts(), filters);
    }

    const versionMap = await fetchVersionsByIds(
      supabase,
      postRows
        .map((row) => row.published_version_id)
        .filter(Boolean) as string[],
    );

    const posts = postRows
      .map((row) => {
        const versionId = row.published_version_id;
        if (!versionId) return null;
        const versionRow = versionMap.get(versionId);
        if (!versionRow) return null;
        return materializePublicBlogPost(row, versionRow);
      })
      .filter(Boolean) as PublicBlogPost[];

    return applyBlogFilters(posts, filters);
  } catch (error) {
    handleBlogError(error, "loadPublicBlogPostsServer route error");
    return applyBlogFilters(getLegacySeedPublicPosts(), filters);
  }
}

export async function loadPublicBlogPostBySlugServer(
  slug: string,
): Promise<PublicBlogPost | null> {
  if (!hasSupabasePublicEnv() || blogSchemaState === "missing") {
    return getLegacySeedPublicPostBySlug(slug);
  }

  const schemaReady = await ensureSeedBlogContent();
  if (hasSupabaseServiceEnv() && !schemaReady) {
    return getLegacySeedPublicPostBySlug(slug);
  }

  try {
    const supabase = getSupabasePublic();
    const { data, error } = await supabase
      .from("blog_posts")
      .select(PUBLIC_POST_SELECT)
      .eq("slug", slug)
      .eq("visibility", "public")
      .maybeSingle();

    if (error) {
      handleBlogError(error, "loadPublicBlogPostBySlugServer error");
      return getLegacySeedPublicPostBySlug(slug);
    }

    if (!data) {
      return null;
    }

    const postRow = data as unknown as BlogPostRow;
    if (!postRow.published_version_id) {
      return null;
    }

    const versionMap = await fetchVersionsByIds(supabase, [
      postRow.published_version_id,
    ]);
    const versionRow = versionMap.get(postRow.published_version_id);

    if (!versionRow) {
      return null;
    }

    const { count } = await supabase
      .from("blog_comments")
      .select("id", { count: "exact", head: true })
      .eq("post_id", postRow.id)
      .eq("moderation_status", "visible");

    return materializePublicBlogPost(postRow, versionRow, count ?? 0);
  } catch (error) {
    handleBlogError(error, "loadPublicBlogPostBySlugServer route error");
    return getLegacySeedPublicPostBySlug(slug);
  }
}

export async function loadVisibleBlogCommentsServer(
  postId: string,
): Promise<BlogComment[]> {
  if (!hasSupabasePublicEnv() || blogSchemaState === "missing") {
    return [];
  }

  try {
    const supabase = getSupabasePublic();
    const { data, error } = await supabase
      .from("blog_comments")
      .select(COMMENT_SELECT)
      .eq("post_id", postId)
      .eq("moderation_status", "visible")
      .order("created_at", { ascending: true });

    if (error) {
      handleBlogError(error, "loadVisibleBlogCommentsServer error");
      return [];
    }

    return ((data ?? []) as unknown as BlogCommentRow[]).map((row) =>
      materializeBlogComment(row),
    );
  } catch (error) {
    handleBlogError(error, "loadVisibleBlogCommentsServer route error");
    return [];
  }
}

export async function loadAuthorBlogPostsServer(
  userId: string,
): Promise<AuthorBlogPost[]> {
  if (!hasSupabaseServerEnv()) {
    return [];
  }

  try {
    const supabase = await createSupabaseServer();
    const { data, error } = await supabase
      .from("blog_posts")
      .select(PUBLIC_POST_SELECT)
      .eq("author_user_id", userId)
      .order("updated_at", { ascending: false });

    if (error) {
      console.error("loadAuthorBlogPostsServer error:", error);
      return [];
    }

    const postRows = (data ?? []) as unknown as BlogPostRow[];
    const versionIds = postRows.flatMap((post) =>
      [post.latest_version_id, post.published_version_id].filter(Boolean),
    ) as string[];
    const versionMap = await fetchVersionsByIds(supabase, versionIds);

    return postRows.map((postRow) =>
      materializeAuthorPost(
        postRow,
        postRow.latest_version_id
          ? versionMap.get(postRow.latest_version_id) ?? null
          : null,
        postRow.published_version_id
          ? versionMap.get(postRow.published_version_id) ?? null
          : null,
      ),
    );
  } catch (error) {
    console.error("loadAuthorBlogPostsServer route error:", error);
    return [];
  }
}

export async function loadAuthorBlogPostForEditServer(
  userId: string,
  postId: string,
): Promise<AuthorBlogPost | null> {
  const posts = await loadAuthorBlogPostsServer(userId);
  return posts.find((post) => post.id === postId) ?? null;
}

export async function loadAdminBlogPostsServer(): Promise<AuthorBlogPost[]> {
  if (!hasSupabaseServiceEnv()) {
    return [];
  }

  await ensureSeedBlogContent();

  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("blog_posts")
      .select(PUBLIC_POST_SELECT)
      .order("updated_at", { ascending: false })
      .limit(300);

    if (error) {
      handleBlogError(error, "loadAdminBlogPostsServer error");
      return [];
    }

    const postRows = (data ?? []) as unknown as BlogPostRow[];
    const versionMap = await fetchVersionsByIds(
      supabase,
      postRows.flatMap((post) =>
        [post.latest_version_id, post.published_version_id].filter(Boolean),
      ) as string[],
    );

    return postRows.map((postRow) =>
      materializeAuthorPost(
        postRow,
        postRow.latest_version_id
          ? versionMap.get(postRow.latest_version_id) ?? null
          : null,
        postRow.published_version_id
          ? versionMap.get(postRow.published_version_id) ?? null
          : null,
      ),
    );
  } catch (error) {
    handleBlogError(error, "loadAdminBlogPostsServer route error");
    return [];
  }
}

export async function loadAdminBlogCommentsServer(): Promise<AdminBlogComment[]> {
  if (!hasSupabaseServiceEnv()) {
    return [];
  }

  await ensureSeedBlogContent();

  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("blog_comments")
      .select(COMMENT_SELECT)
      .order("created_at", { ascending: false })
      .limit(300);

    if (error) {
      handleBlogError(error, "loadAdminBlogCommentsServer error");
      return [];
    }

    const comments = (data ?? []) as unknown as BlogCommentRow[];
    if (comments.length === 0) {
      return [];
    }

    const postIds = [...new Set(comments.map((comment) => comment.post_id))];
    const { data: postData, error: postError } = await supabase
      .from("blog_posts")
      .select(PUBLIC_POST_SELECT)
      .in("id", postIds);

    if (postError) {
      handleBlogError(postError, "loadAdminBlogCommentsServer post lookup error");
      return [];
    }

    const postRows = (postData ?? []) as unknown as BlogPostRow[];
    const versionMap = await fetchVersionsByIds(
      supabase,
      postRows
        .map((post) => post.published_version_id ?? post.latest_version_id)
        .filter(Boolean) as string[],
    );
    const postMap = new Map(postRows.map((post) => [post.id, post]));

    return comments.map((row) => {
      const comment = materializeBlogComment(row);
      const post = postMap.get(row.post_id);
      const version = post
        ? versionMap.get(post.published_version_id ?? post.latest_version_id ?? "")
        : null;

      return {
        ...comment,
        postSlug: post?.slug ?? "",
        postTitle: version?.title ?? "Unknown Post",
      };
    });
  } catch (error) {
    handleBlogError(error, "loadAdminBlogCommentsServer route error");
    return [];
  }
}

export async function loadBlogPostRowByIdForAuthor(
  userId: string,
  postId: string,
) {
  if (!hasSupabaseServerEnv()) {
    return null;
  }

  const supabase = await createSupabaseServer();
  const { data, error } = await supabase
    .from("blog_posts")
    .select(PUBLIC_POST_SELECT)
    .eq("id", postId)
    .eq("author_user_id", userId)
    .maybeSingle();

  if (error) {
    console.error("loadBlogPostRowByIdForAuthor error:", error);
    return null;
  }

  return (data as unknown as BlogPostRow | null) ?? null;
}

export async function loadBlogVersionsForPost(
  postId: string,
): Promise<BlogPostVersionRow[]> {
  if (!hasSupabaseServerEnv()) {
    return [];
  }

  const supabase = await createSupabaseServer();
  const { data, error } = await supabase
    .from("blog_post_versions")
    .select(VERSION_SELECT)
    .eq("post_id", postId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("loadBlogVersionsForPost error:", error);
    return [];
  }

  return (data ?? []) as unknown as BlogPostVersionRow[];
}

export async function loadAdminBlogPostById(postId: string) {
  if (!hasSupabaseServiceEnv()) {
    return null;
  }

  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("blog_posts")
    .select(PUBLIC_POST_SELECT)
    .eq("id", postId)
    .maybeSingle();

  if (error) {
    console.error("loadAdminBlogPostById error:", error);
    return null;
  }

  return (data as unknown as BlogPostRow | null) ?? null;
}

export async function loadAdminBlogPostVersion(versionId: string) {
  if (!hasSupabaseServiceEnv()) {
    return null;
  }

  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("blog_post_versions")
    .select(VERSION_SELECT)
    .eq("id", versionId)
    .maybeSingle();

  if (error) {
    console.error("loadAdminBlogPostVersion error:", error);
    return null;
  }

  return (data as unknown as BlogPostVersionRow | null) ?? null;
}

export async function loadBlogCommentsForAdminById(commentId: string) {
  if (!hasSupabaseServiceEnv()) {
    return null;
  }

  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("blog_comments")
    .select(COMMENT_SELECT)
    .eq("id", commentId)
    .maybeSingle();

  if (error) {
    console.error("loadBlogCommentsForAdminById error:", error);
    return null;
  }

  return (data as unknown as BlogCommentRow | null) ?? null;
}

export async function loadPublicBlogPostByIdServer(postId: string) {
  if (!hasSupabaseServerEnv()) {
    return null;
  }

  const supabase = await createSupabaseServer();
  const { data, error } = await supabase
    .from("blog_posts")
    .select(PUBLIC_POST_SELECT)
    .eq("id", postId)
    .eq("visibility", "public")
    .maybeSingle();

  if (error) {
    console.error("loadPublicBlogPostByIdServer error:", error);
    return null;
  }

  return (data as unknown as BlogPostRow | null) ?? null;
}
