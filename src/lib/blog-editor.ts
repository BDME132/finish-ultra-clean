import {
  BlogEditorInput,
  BlogVersion,
  calculateReadTime,
  isValidBlogCategory,
  normalizeBlogTags,
} from "@/lib/blog";

export const DEFAULT_BLOG_EDITOR_INPUT: BlogEditorInput = {
  title: "",
  excerpt: "",
  bodyMarkdown: "",
  category: "Stories",
  tags: [],
  coverImageUrl: "",
};

function asString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export function sanitizeBlogEditorInput(raw: unknown): BlogEditorInput {
  const input =
    raw && typeof raw === "object"
      ? (raw as Record<string, unknown>)
      : {};

  const tagsValue = Array.isArray(input.tags)
    ? input.tags
    : typeof input.tags === "string"
      ? input.tags.split(",")
      : [];

  const category = asString(input.category);

  return {
    title: asString(input.title),
    excerpt: asString(input.excerpt),
    bodyMarkdown: typeof input.bodyMarkdown === "string"
      ? input.bodyMarkdown.trim()
      : "",
    category:
      category && category !== "All" && isValidBlogCategory(category)
        ? category
        : "Stories",
    tags: normalizeBlogTags(tagsValue.map((tag) => String(tag))),
    coverImageUrl: asString(input.coverImageUrl),
  };
}

export function normalizeDraftInput(input: BlogEditorInput): BlogEditorInput {
  return {
    ...input,
    title: input.title || "Untitled Draft",
  };
}

function buildFallbackExcerpt(bodyMarkdown: string): string {
  const plainText = bodyMarkdown
    .replace(/!\[[^\]]*\]\([^)]+\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[*_#>`~-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!plainText) {
    return "";
  }

  if (plainText.length <= 180) {
    return plainText;
  }

  return `${plainText.slice(0, 177).trim()}...`;
}

export function validateBlogSubmissionInput(input: BlogEditorInput): string | null {
  void input;
  return null;
}

export function versionToEditorInput(version: BlogVersion | null): BlogEditorInput {
  if (!version) {
    return DEFAULT_BLOG_EDITOR_INPUT;
  }

  return {
    title: version.title,
    excerpt: version.excerpt,
    bodyMarkdown: version.bodyMarkdown,
    category: version.category,
    tags: version.tags,
    coverImageUrl: version.coverImageUrl,
  };
}

export function buildVersionPayload(
  input: BlogEditorInput,
  submissionKind: "initial" | "revision" | "seed",
) {
  return {
    title: input.title,
    excerpt: input.excerpt || buildFallbackExcerpt(input.bodyMarkdown),
    body_markdown: input.bodyMarkdown,
    category: input.category,
    tags: input.tags,
    cover_image_url: input.coverImageUrl || null,
    read_time: calculateReadTime(input.bodyMarkdown),
    featured: false,
    related_slugs: [],
    affiliate_products: [],
    faq: [],
    submission_kind: submissionKind,
  };
}
