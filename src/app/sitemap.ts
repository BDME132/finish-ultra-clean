import { MetadataRoute } from "next";
import { blogPosts } from "@/lib/content/blog-posts";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://finishultra.com";
  const now = new Date();

  const blogRoutes = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.publishedAt),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [
    { url: baseUrl, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/start-here`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/gear`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/gear/kits`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/gear/shoes`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/gear/packs`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/gear/nutrition`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/gear/apparel`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/training`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/training/first-50k`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/training/base-building`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/training/race-week`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/chat`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/newsletter`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    ...blogRoutes,
  ];
}
