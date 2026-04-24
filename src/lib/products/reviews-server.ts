import "server-only";

import { getSupabasePublic, hasSupabasePublicEnv } from "@/lib/supabase";
import type { ReviewSchemaInput } from "@/lib/schema";

export interface ProductReviewAggregate {
  ratingValue: number;
  reviewCount: number;
  reviews: ReviewSchemaInput[];
}

const REVIEW_SELECT =
  "id, rating, title, body, created_at, profiles(display_name)";

interface ReviewRow {
  id: string;
  rating: number;
  title: string | null;
  body: string;
  created_at: string;
  profiles: { display_name: string | null } | { display_name: string | null }[] | null;
}

function displayName(row: ReviewRow): string {
  const profiles = row.profiles;
  if (!profiles) return "Anonymous Runner";
  const profile = Array.isArray(profiles) ? profiles[0] : profiles;
  return profile?.display_name ?? "Anonymous Runner";
}

export async function loadProductReviewAggregateServer(
  productId: string,
  { reviewLimit = 5 }: { reviewLimit?: number } = {},
): Promise<ProductReviewAggregate | null> {
  if (!hasSupabasePublicEnv()) return null;

  try {
    const supabase = getSupabasePublic();

    const [{ data: ratingRows, error: ratingErr }, { data: reviewRows, error: reviewErr }] =
      await Promise.all([
        supabase
          .from("product_reviews")
          .select("rating")
          .eq("product_id", productId)
          .eq("status", "published"),
        supabase
          .from("product_reviews")
          .select(REVIEW_SELECT)
          .eq("product_id", productId)
          .eq("status", "published")
          .order("created_at", { ascending: false })
          .limit(reviewLimit),
      ]);

    if (ratingErr || reviewErr) {
      return null;
    }

    const ratings = (ratingRows ?? []) as { rating: number }[];
    if (ratings.length === 0) return null;

    const sum = ratings.reduce((total, r) => total + r.rating, 0);
    const ratingValue = Math.round((sum / ratings.length) * 10) / 10;

    const reviews: ReviewSchemaInput[] = ((reviewRows ?? []) as unknown as ReviewRow[]).map((row) => ({
      ratingValue: row.rating,
      author: displayName(row),
      datePublished: row.created_at.slice(0, 10),
      reviewBody: row.body,
      ...(row.title ? { title: row.title } : {}),
    }));

    return {
      ratingValue,
      reviewCount: ratings.length,
      reviews,
    };
  } catch {
    return null;
  }
}
