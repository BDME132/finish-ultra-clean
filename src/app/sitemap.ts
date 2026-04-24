import { MetadataRoute } from "next";
import { loadPublicBlogPostsServer } from "@/lib/blog-server";
import { loadPublicKitsServer } from "@/lib/public-kits-server";
import { loadPublicTrainingPlansServer } from "@/lib/public-training-plans-server";
import { loadPublishedNewsletters } from "@/lib/newsletter-archive";
import { loadPublicProfilesServer } from "@/lib/account/public-profiles-server";
import { ALL_PRODUCTS } from "@/lib/products";

export const revalidate = 3600;

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

function safeDate(value?: string | null): Date {
  if (!value) return new Date();
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [blogPosts, sharedKits, sharedPlans, newsletters, profiles] =
    await Promise.all([
      loadPublicBlogPostsServer(),
      loadPublicKitsServer(),
      loadPublicTrainingPlansServer(),
      loadPublishedNewsletters(),
      loadPublicProfilesServer(),
    ]);

  const blogRoutes = blogPosts.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: safeDate(post.updatedAt ?? post.publishedAt ?? post.createdAt),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const productRoutes = ALL_PRODUCTS.map((product) => ({
    url: `${BASE_URL}/gear/library/${product.id}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const sharedKitRoutes = sharedKits.map((kit) => ({
    url: `${BASE_URL}/gear/race-day-kit/${kit.slug}`,
    lastModified: safeDate(kit.updatedAt ?? kit.publishedAt),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  const sharedPlanRoutes = sharedPlans.map((plan) => ({
    url: `${BASE_URL}/training/shared-plans/${plan.slug}`,
    lastModified: safeDate(plan.updatedAt ?? plan.publishedAt),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  const newsletterRoutes = newsletters
    .filter((issue) => Boolean(issue.slug))
    .map((issue) => ({
      url: `${BASE_URL}/newsletter/${issue.slug}`,
      lastModified: safeDate(issue.published_at),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));

  const profileRoutes = profiles.map((profile) => ({
    url: `${BASE_URL}/u/${profile.username}`,
    lastModified: safeDate(profile.updated_at),
    changeFrequency: "monthly" as const,
    priority: 0.4,
  }));

  return [
    entry("/", 1.0, "weekly"),
    entry("/start-here", 0.9, "monthly"),
    entry("/training", 0.9, "monthly"),
    entry("/gear", 0.9, "weekly"),
    entry("/training/plans", 0.8, "monthly"),
    entry("/training/shared-plans", 0.7, "monthly"),
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
    entry("/gear/library", 0.8, "weekly"),
    entry("/gear/race-day-kit", 0.7, "monthly"),
    ...productRoutes,
    ...sharedKitRoutes,
    ...sharedPlanRoutes,
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
    ...newsletterRoutes,
    ...profileRoutes,
    entry("/about", 0.7, "monthly"),
    entry("/contact", 0.6, "monthly"),
    entry("/affiliate-disclosure", 0.3, "yearly"),
    entry("/privacy-policy", 0.3, "yearly"),
  ];
}
