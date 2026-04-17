import type {
  PublicTrainingPlan,
  PublicTrainingPlanFilters,
  PublicTrainingShare,
  SavedPlan,
  SavedWeek,
} from "@/lib/training-types";

export type PublicTrainingPlanRow = {
  id: string;
  source_plan_id: string;
  slug: string;
  author_display_name: string | null;
  plan_title: string;
  race_name: string | null;
  race_date: string;
  distance: SavedPlan["distance"];
  level: SavedPlan["level"];
  weeks_total: number;
  current_weekly_miles: number;
  weeks: SavedWeek[];
  published_at: string;
  updated_at: string;
};

type PublicTrainingPlanSnapshotInput = {
  savedPlan: SavedPlan;
  authorDisplayName: string;
  slug: string;
  publicId: string;
  sourcePlanId: string;
  publishedAt: string;
  updatedAt: string;
};

export const PUBLIC_TRAINING_PLAN_SELECT = [
  "id",
  "source_plan_id",
  "slug",
  "author_display_name",
  "plan_title",
  "race_name",
  "race_date",
  "distance",
  "level",
  "weeks_total",
  "current_weekly_miles",
  "weeks",
  "published_at",
  "updated_at",
].join(", ");

export const PUBLIC_TRAINING_PLAN_SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "updated", label: "Recently Updated" },
] as const;

export function getPublicTrainingAuthorName(displayName?: string | null): string {
  const trimmed = displayName?.trim();
  return trimmed ? trimmed : "Anonymous Runner";
}

export function slugifyTrainingPlanTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48) || "shared-plan";
}

export function formatTrainingDistanceLabel(distance: string): string {
  return distance;
}

export function formatTrainingLevelLabel(level: string): string {
  return level
    .split("-")
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");
}

export function getPublicTrainingPlanTitle(plan: Pick<SavedPlan, "raceName" | "distance" | "level">): string {
  const trimmedRaceName = plan.raceName.trim();
  if (trimmedRaceName) return trimmedRaceName;
  return `${plan.distance} ${formatTrainingLevelLabel(plan.level)} Plan`;
}

export function toPublicTrainingShare(
  row: Pick<PublicTrainingPlanRow, "slug" | "published_at" | "updated_at">,
): PublicTrainingShare {
  return {
    slug: row.slug,
    publishedAt: row.published_at,
    updatedAt: row.updated_at,
  };
}

export function materializePublicTrainingPlan(row: PublicTrainingPlanRow): PublicTrainingPlan {
  return {
    id: row.id,
    sourcePlanId: row.source_plan_id,
    slug: row.slug,
    authorDisplayName: getPublicTrainingAuthorName(row.author_display_name),
    planTitle: row.plan_title,
    raceName: row.race_name ?? row.plan_title,
    raceDate: row.race_date,
    distance: row.distance,
    level: row.level,
    weeksTotal: row.weeks_total,
    currentWeeklyMiles: row.current_weekly_miles,
    weeks: row.weeks ?? [],
    publishedAt: row.published_at,
    updatedAt: row.updated_at,
  };
}

export function buildPublicTrainingPlanSnapshot(
  input: PublicTrainingPlanSnapshotInput,
): PublicTrainingPlan {
  const { savedPlan, authorDisplayName, slug, publicId, sourcePlanId, publishedAt, updatedAt } = input;
  const planTitle = getPublicTrainingPlanTitle(savedPlan);
  return {
    id: publicId,
    sourcePlanId,
    slug,
    authorDisplayName: getPublicTrainingAuthorName(authorDisplayName),
    planTitle,
    raceName: savedPlan.raceName.trim() || planTitle,
    raceDate: savedPlan.raceDate,
    distance: savedPlan.distance,
    level: savedPlan.level,
    weeksTotal: savedPlan.weeksTotal,
    currentWeeklyMiles: savedPlan.currentWeeklyMiles,
    weeks: savedPlan.weeks,
    publishedAt,
    updatedAt,
  };
}

export function filterPublicTrainingPlans(
  plans: PublicTrainingPlan[],
  filters: PublicTrainingPlanFilters,
): PublicTrainingPlan[] {
  return plans.filter((plan) => {
    if (filters.distance && plan.distance !== filters.distance) return false;
    if (filters.level && plan.level !== filters.level) return false;
    return true;
  });
}

export function sortPublicTrainingPlans(
  plans: PublicTrainingPlan[],
  sort: PublicTrainingPlanFilters["sort"] = "newest",
): PublicTrainingPlan[] {
  const sorted = [...plans];

  if (sort === "updated") {
    return sorted.sort((a, b) => {
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
  }

  return sorted.sort((a, b) => {
    return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
  });
}
