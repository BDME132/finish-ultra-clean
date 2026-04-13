import { MetadataRoute } from "next";
import { loadPublicBlogPostsServer } from "@/lib/blog-server";

const BASE_URL = "https://www.finishultra.com";

type ChangeFreq =
  | "always"
  | "hourly"
  | "daily"
  | "weekly"
  | "monthly"
  | "yearly"
  | "never";

function entry(
  path: string,
  priority: number,
  changeFrequency: ChangeFreq,
  lastModified?: Date,
) {
  return {
    url: `${BASE_URL}${path}`,
    lastModified: lastModified ?? new Date(),
    changeFrequency,
    priority,
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const blogPosts = await loadPublicBlogPostsServer();
  const blogRoutes = blogPosts.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt ?? post.publishedAt ?? post.createdAt),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [
    entry("/", 1.0, "weekly"),
    entry("/start-here", 0.9, "monthly"),
    entry("/training", 0.9, "monthly"),
    entry("/gear", 0.9, "weekly"),
    entry("/training/plans", 0.8, "monthly"),
    entry("/training/first-50k", 0.8, "monthly"),
    entry("/training/base-building", 0.8, "monthly"),
    entry("/training/race-week", 0.8, "monthly"),
    entry("/training/race-day-checklist", 0.8, "monthly"),
    entry("/training/dashboard", 0.7, "monthly"),
    entry("/gear/shoes", 0.8, "weekly"),
    entry("/gear/packs", 0.8, "weekly"),
    entry("/gear/nutrition", 0.8, "weekly"),
    entry("/gear/apparel", 0.8, "weekly"),
    entry("/gear/kits", 0.8, "weekly"),
    entry("/gear/builder", 0.7, "weekly"),
    entry("/gear/race-day-kit", 0.7, "monthly"),
    entry("/faq", 0.9, "monthly"),
    entry("/blog", 0.8, "weekly"),
    ...blogRoutes,
    entry("/tools/pace-calculator", 0.7, "monthly"),
    entry("/tools/glossary", 0.7, "monthly"),
    entry("/coach", 0.7, "monthly"),
    entry("/pheidi", 0.7, "monthly"),
    entry("/race-hq", 0.7, "monthly"),
    entry("/search", 0.5, "weekly"),
    entry("/newsletter", 0.6, "monthly"),
    entry("/about", 0.7, "monthly"),
    entry("/contact", 0.6, "monthly"),
    entry("/affiliate-disclosure", 0.3, "yearly"),
    entry("/privacy-policy", 0.3, "yearly"),
  ];
}
