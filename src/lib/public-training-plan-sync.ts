import type {
  PublicTrainingPlan,
  PublicTrainingPlanFilters,
  PublicTrainingShare,
} from "@/lib/training-types";

export type PublishTrainingPlanResult = {
  publicPlan: PublicTrainingPlan;
  publicShare: PublicTrainingShare;
};

function buildFilterQuery(filters: PublicTrainingPlanFilters): string {
  const params = new URLSearchParams();

  if (filters.distance) params.set("distance", filters.distance);
  if (filters.level) params.set("level", filters.level);
  if (filters.sort) params.set("sort", filters.sort);

  const query = params.toString();
  return query ? `?${query}` : "";
}

export async function loadPublicTrainingPlans(
  filters: PublicTrainingPlanFilters = {},
): Promise<PublicTrainingPlan[]> {
  try {
    const res = await fetch(`/api/public-training-plans${buildFilterQuery(filters)}`, {
      credentials: "include",
    });

    if (!res.ok) return [];

    const data = await res.json();
    return data.plans ?? [];
  } catch {
    return [];
  }
}

export async function loadPublicTrainingPlanBySlug(slug: string): Promise<PublicTrainingPlan | null> {
  try {
    const res = await fetch(`/api/public-training-plans/${encodeURIComponent(slug)}`, {
      credentials: "include",
    });

    if (!res.ok) return null;

    const data = await res.json();
    return data.plan ?? null;
  } catch {
    return null;
  }
}

export async function publishTrainingPlan(): Promise<PublishTrainingPlanResult | null> {
  try {
    const res = await fetch("/api/public-training-plans", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    if (!res.ok) return null;

    const data = await res.json();
    return {
      publicPlan: data.plan,
      publicShare: data.publicShare,
    };
  } catch {
    return null;
  }
}

export async function unpublishTrainingPlan(): Promise<boolean> {
  try {
    const res = await fetch("/api/public-training-plans", {
      method: "DELETE",
      credentials: "include",
    });

    return res.ok;
  } catch {
    return false;
  }
}
