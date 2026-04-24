import { getPostBySlug } from "@/lib/content/blog-posts";

export const BLOG_CATEGORIES = [
  "All",
  "Getting Started",
  "Training",
  "Gear",
  "Nutrition",
  "Race Day",
  "Stories",
] as const;

export const BLOG_SOURCE_FILTERS = ["all", "ai", "community"] as const;

export type BlogCategory = (typeof BLOG_CATEGORIES)[number];
export type BlogSourceFilter = (typeof BLOG_SOURCE_FILTERS)[number];
export type BlogAuthorType = "ai" | "member";
export type BlogVisibility = "public" | "archived";
export type BlogModerationStatus =
  | "draft"
  | "pending_review"
  | "approved"
  | "rejected";
export type BlogCommentModerationStatus = "visible" | "hidden" | "deleted";
export type BlogSubmissionKind = "seed" | "initial" | "revision";

export interface BlogAffiliateProduct {
  name: string;
  brand: string;
  price: string;
  url: string;
  why: string;
}

export interface BlogFaqItem {
  question: string;
  answer: string;
}

export interface BlogVersion {
  id: string;
  title: string;
  excerpt: string;
  bodyMarkdown: string;
  category: string;
  tags: string[];
  coverImageUrl: string;
  readTime: string;
  featured: boolean;
  relatedSlugs: string[];
  affiliateProducts: BlogAffiliateProduct[];
  faq: BlogFaqItem[];
  submissionKind: BlogSubmissionKind;
  moderationStatus: BlogModerationStatus;
  reviewerNote: string | null;
  createdAt: string;
  submittedAt: string | null;
  reviewedAt: string | null;
}

export interface BlogPostRecord {
  id: string;
  slug: string;
  authorUserId: string | null;
  authorName: string;
  authorType: BlogAuthorType;
  visibility: BlogVisibility;
  publishedVersionId: string | null;
  latestVersionId: string | null;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PublicBlogPost extends BlogPostRecord {
  title: string;
  excerpt: string;
  bodyMarkdown: string;
  category: string;
  tags: string[];
  coverImageUrl: string;
  readTime: string;
  featured: boolean;
  relatedSlugs: string[];
  affiliateProducts: BlogAffiliateProduct[];
  faq: BlogFaqItem[];
  commentCount: number;
}

export interface AuthorBlogPost extends BlogPostRecord {
  latestVersion: BlogVersion | null;
  publishedVersion: BlogVersion | null;
}

export interface BlogComment {
  id: string;
  postId: string;
  authorUserId: string | null;
  authorName: string;
  body: string;
  moderationStatus: BlogCommentModerationStatus;
  createdAt: string;
  updatedAt: string;
}

export interface AdminBlogComment extends BlogComment {
  postSlug: string;
  postTitle: string;
}

export interface BlogPostRow {
  id: string;
  slug: string;
  author_user_id: string | null;
  author_name: string;
  author_type: BlogAuthorType;
  visibility: BlogVisibility;
  published_version_id: string | null;
  latest_version_id: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface BlogPostVersionRow {
  id: string;
  post_id: string;
  title: string;
  excerpt: string;
  body_markdown: string;
  category: string;
  tags: string[] | null;
  cover_image_url: string | null;
  read_time: string | null;
  featured: boolean | null;
  related_slugs: string[] | null;
  affiliate_products: BlogAffiliateProduct[] | null;
  faq: BlogFaqItem[] | null;
  submission_kind: BlogSubmissionKind;
  moderation_status: BlogModerationStatus;
  reviewer_note: string | null;
  created_at: string;
  submitted_at: string | null;
  reviewed_at: string | null;
}

export interface BlogCommentRow {
  id: string;
  post_id: string;
  author_user_id: string | null;
  author_name: string;
  body: string;
  moderation_status: BlogCommentModerationStatus;
  created_at: string;
  updated_at: string;
}

export interface BlogPostFilters {
  source?: BlogSourceFilter;
  category?: string;
  limit?: number;
}

export interface BlogEditorInput {
  title: string;
  excerpt: string;
  bodyMarkdown: string;
  category: string;
  tags: string[];
  coverImageUrl: string;
}

export function normalizeBlogTags(tags: string[]): string[] {
  return [...new Set(tags.map((tag) => tag.trim()).filter(Boolean))]
    .slice(0, 5)
    .map((tag) => tag.slice(0, 32));
}

export function slugifyBlogTitle(title: string): string {
  return (
    title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 64) || "community-post"
  );
}

export function calculateReadTime(bodyMarkdown: string): string {
  const wordCount = bodyMarkdown.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(wordCount / 220));
  return `${minutes} min read`;
}

export function getBlogSourceLabel(authorType: BlogAuthorType): string {
  return authorType === "ai" ? "AI Guide" : "FinishUltra Team";
}

export function getPublicBlogAuthorName(
  displayName?: string | null,
  fallbackEmail?: string | null,
) {
  const trimmed = displayName?.trim();
  if (trimmed) return trimmed;

  const emailName = fallbackEmail?.split("@")[0]?.trim();
  if (emailName) {
    return emailName.slice(0, 40);
  }

  return "Anonymous Runner";
}

export function materializeBlogVersion(row: BlogPostVersionRow): BlogVersion {
  return {
    id: row.id,
    title: row.title,
    excerpt: row.excerpt,
    bodyMarkdown: row.body_markdown,
    category: row.category,
    tags: row.tags ?? [],
    coverImageUrl: row.cover_image_url ?? "",
    readTime: row.read_time ?? calculateReadTime(row.body_markdown),
    featured: Boolean(row.featured),
    relatedSlugs: row.related_slugs ?? [],
    affiliateProducts: row.affiliate_products ?? [],
    faq: row.faq ?? [],
    submissionKind: row.submission_kind,
    moderationStatus: row.moderation_status,
    reviewerNote: row.reviewer_note,
    createdAt: row.created_at,
    submittedAt: row.submitted_at,
    reviewedAt: row.reviewed_at,
  };
}

export function materializeBlogPostRecord(row: BlogPostRow): BlogPostRecord {
  return {
    id: row.id,
    slug: row.slug,
    authorUserId: row.author_user_id,
    authorName: row.author_name,
    authorType: row.author_type,
    visibility: row.visibility,
    publishedVersionId: row.published_version_id,
    latestVersionId: row.latest_version_id,
    publishedAt: row.published_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/**
 * Prefer the canonical path from blog-posts.ts when Supabase still has legacy
 * `/images/blog/*` URLs — that directory is not part of the shipped `public/` tree.
 */
export function resolveBlogCoverImageUrl(
  slug: string,
  dbCoverImageUrl: string | null | undefined,
): string {
  const legacy = getPostBySlug(slug)?.image?.trim() ?? "";
  const db = (dbCoverImageUrl ?? "").trim();

  if (!db) return legacy;

  if (db.startsWith("/images/blog/")) {
    return legacy || db;
  }

  return db;
}

export function materializePublicBlogPost(
  postRow: BlogPostRow,
  versionRow: BlogPostVersionRow,
  commentCount = 0,
): PublicBlogPost {
  const post = materializeBlogPostRecord(postRow);
  const version = materializeBlogVersion(versionRow);

  return {
    ...post,
    title: version.title,
    excerpt: version.excerpt,
    bodyMarkdown: version.bodyMarkdown,
    category: version.category,
    tags: version.tags,
    coverImageUrl: resolveBlogCoverImageUrl(postRow.slug, version.coverImageUrl),
    readTime: version.readTime,
    featured: version.featured,
    relatedSlugs: version.relatedSlugs,
    affiliateProducts: version.affiliateProducts,
    faq: version.faq,
    commentCount,
  };
}

export function materializeBlogComment(row: BlogCommentRow): BlogComment {
  return {
    id: row.id,
    postId: row.post_id,
    authorUserId: row.author_user_id,
    authorName: row.author_name,
    body: row.body,
    moderationStatus: row.moderation_status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function isValidBlogCategory(value: string): boolean {
  return BLOG_CATEGORIES.includes(value as BlogCategory);
}

export function applyBlogFilters(
  posts: PublicBlogPost[],
  filters: BlogPostFilters = {},
): PublicBlogPost[] {
  const source = filters.source ?? "all";
  const category = filters.category ?? "All";

  let filtered = [...posts];

  if (source === "ai") {
    filtered = filtered.filter((post) => post.authorType === "ai");
  } else if (source === "community") {
    filtered = filtered.filter((post) => post.authorType === "member");
  }

  if (category !== "All") {
    filtered = filtered.filter((post) => post.category === category);
  }

  filtered.sort((a, b) => {
    return new Date(b.publishedAt ?? b.updatedAt).getTime() -
      new Date(a.publishedAt ?? a.updatedAt).getTime();
  });

  if (filters.limit) {
    return filtered.slice(0, filters.limit);
  }

  return filtered;
}

export function getRelatedBlogPosts(
  currentPost: PublicBlogPost,
  posts: PublicBlogPost[],
  limit = 3,
): PublicBlogPost[] {
  if (currentPost.relatedSlugs.length > 0) {
    const related = currentPost.relatedSlugs
      .map((slug) => posts.find((post) => post.slug === slug))
      .filter(Boolean) as PublicBlogPost[];

    if (related.length >= limit) {
      return related.slice(0, limit);
    }
  }

  return posts
    .filter(
      (post) =>
        post.id !== currentPost.id && post.category === currentPost.category,
    )
    .slice(0, limit);
}
