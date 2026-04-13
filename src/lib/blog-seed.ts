import { blogPosts as legacyBlogPosts } from "@/lib/content/blog-posts";
import {
  BlogPostRow,
  BlogPostVersionRow,
  PublicBlogPost,
  calculateReadTime,
  materializePublicBlogPost,
} from "@/lib/blog";

function seedTimestamp(date: string): string {
  return date.includes("T") ? date : `${date}T00:00:00.000Z`;
}

export function getLegacySeedRows(): {
  postRow: BlogPostRow;
  versionRow: BlogPostVersionRow;
}[] {
  return [...legacyBlogPosts]
    .sort((a, b) => {
      return (
        new Date(b.updatedAt ?? b.publishedAt).getTime() -
        new Date(a.updatedAt ?? a.publishedAt).getTime()
      );
    })
    .map((post) => {
      const versionId = `seed-version-${post.slug}`;
      const postId = `seed-post-${post.slug}`;
      const publishedAt = seedTimestamp(post.publishedAt);
      const updatedAt = seedTimestamp(post.updatedAt ?? post.publishedAt);

      return {
        postRow: {
          id: postId,
          slug: post.slug,
          author_user_id: null,
          author_name: "Pheidi (AI)",
          author_type: "ai",
          visibility: "public",
          published_version_id: versionId,
          latest_version_id: versionId,
          published_at: publishedAt,
          created_at: publishedAt,
          updated_at: updatedAt,
        },
        versionRow: {
          id: versionId,
          post_id: postId,
          title: post.title,
          excerpt: post.excerpt,
          body_markdown: post.body,
          category: post.category,
          tags: post.tags,
          cover_image_url: post.image,
          read_time: post.readTime || calculateReadTime(post.body),
          featured: Boolean(post.featured),
          related_slugs: post.relatedSlugs ?? [],
          affiliate_products: post.affiliateProducts ?? [],
          faq: post.faq ?? [],
          submission_kind: "seed",
          moderation_status: "approved",
          reviewer_note: null,
          created_at: publishedAt,
          submitted_at: publishedAt,
          reviewed_at: publishedAt,
        },
      };
    });
}

export function getLegacySeedPublicPosts(): PublicBlogPost[] {
  return getLegacySeedRows().map(({ postRow, versionRow }) =>
    materializePublicBlogPost(postRow, versionRow),
  );
}

export function getLegacySeedPublicPostBySlug(
  slug: string,
): PublicBlogPost | null {
  return (
    getLegacySeedPublicPosts().find((post) => post.slug === slug) ?? null
  );
}
