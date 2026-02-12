export interface AffiliateProduct {
  id: string;
  name: string;
  brand: string;
  category: "shoes" | "packs" | "nutrition" | "apparel";
  description: string;
  image: string;
  affiliateUrl: string;
  whyWeRecommend: string;
  tags: string[];
}

export interface GearKit {
  id: string;
  name: string;
  slug: string;
  description: string;
  distance: string;
  image: string;
  itemIds: string[];
  totalEstimate: string;
}

export interface TrainingPlan {
  id: string;
  title: string;
  subtitle: string;
  slug: string;
  description: string;
  weeks: number;
  level: "beginner" | "intermediate";
  distance: string;
  image: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  category: string;
  publishedAt: string;
  image: string;
  readTime: string;
}
