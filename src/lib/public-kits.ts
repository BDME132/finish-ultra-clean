import type {
  PublicKit,
  PublicKitFilters,
  PublicKitItem,
  PublicShare,
  SavedKit,
  SavedKitItem,
} from "@/lib/kit-types";

export type PublicKitRow = {
  id: string;
  source_kit_id: string;
  slug: string;
  author_display_name: string | null;
  kit_title: string;
  kit_subtitle: string;
  race_details: SavedKit["raceDetails"];
  items: PublicKitItem[];
  packing_checklist: string[];
  drop_bag_essentials: string[];
  testing_timeline: string[];
  total_cost: number | string | null;
  preset_id: string | null;
  published_at: string;
  updated_at: string;
};

type PublicKitSnapshotInput = {
  savedKit: SavedKit;
  authorDisplayName: string;
  slug: string;
  publicId: string;
  publishedAt: string;
  updatedAt: string;
};

export const PUBLIC_KIT_SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "updated", label: "Recently Updated" },
  { value: "lowest-cost", label: "Lowest Cost" },
  { value: "highest-cost", label: "Highest Cost" },
] as const;

export function getPublicAuthorName(displayName?: string | null): string {
  const trimmed = displayName?.trim();
  return trimmed ? trimmed : "Anonymous Runner";
}

export function slugifyKitTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48) || "shared-kit";
}

export function sanitizePublicKitItems(items: SavedKitItem[]): PublicKitItem[] {
  return items.map(({ category, product, brand, price, why, tier, specs, links }) => ({
    category,
    product,
    brand,
    price,
    why,
    tier,
    specs,
    links,
  }));
}

export function toPublicShare(row: Pick<PublicKitRow, "slug" | "published_at" | "updated_at">): PublicShare {
  return {
    slug: row.slug,
    publishedAt: row.published_at,
    updatedAt: row.updated_at,
  };
}

export function materializePublicKit(row: PublicKitRow): PublicKit {
  return {
    id: row.id,
    sourceKitId: row.source_kit_id,
    slug: row.slug,
    authorDisplayName: getPublicAuthorName(row.author_display_name),
    kitTitle: row.kit_title,
    kitSubtitle: row.kit_subtitle,
    raceDetails: row.race_details,
    items: row.items ?? [],
    packingChecklist: row.packing_checklist ?? [],
    dropBagEssentials: row.drop_bag_essentials ?? [],
    testingTimeline: row.testing_timeline ?? [],
    totalCost: Number(row.total_cost ?? 0),
    presetId: row.preset_id ?? undefined,
    publishedAt: row.published_at,
    updatedAt: row.updated_at,
  };
}

export function buildPublicKitSnapshot(input: PublicKitSnapshotInput): PublicKit {
  const { savedKit, authorDisplayName, slug, publicId, publishedAt, updatedAt } = input;
  return {
    id: publicId,
    sourceKitId: savedKit.kitId,
    slug,
    authorDisplayName: getPublicAuthorName(authorDisplayName),
    kitTitle: savedKit.kitTitle,
    kitSubtitle: savedKit.kitSubtitle,
    raceDetails: savedKit.raceDetails,
    items: sanitizePublicKitItems(savedKit.items),
    packingChecklist: savedKit.packingChecklist,
    dropBagEssentials: savedKit.dropBagEssentials,
    testingTimeline: savedKit.testingTimeline,
    totalCost: savedKit.totalCost,
    presetId: savedKit.presetId,
    publishedAt,
    updatedAt,
  };
}

export function filterPublicKits(kits: PublicKit[], filters: PublicKitFilters): PublicKit[] {
  return kits.filter((kit) => {
    if (filters.distance && kit.raceDetails.distance !== filters.distance) return false;
    if (filters.terrain && kit.raceDetails.terrain !== filters.terrain) return false;
    if (filters.budget && kit.raceDetails.budget !== filters.budget) return false;
    return true;
  });
}

export function sortPublicKits(kits: PublicKit[], sort: PublicKitFilters["sort"] = "newest"): PublicKit[] {
  const sorted = [...kits];

  if (sort === "lowest-cost") {
    return sorted.sort((a, b) => a.totalCost - b.totalCost);
  }

  if (sort === "highest-cost") {
    return sorted.sort((a, b) => b.totalCost - a.totalCost);
  }

  if (sort === "updated") {
    return sorted.sort((a, b) => {
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
  }

  return sorted.sort((a, b) => {
    return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
  });
}

export function formatDistanceLabel(distance: string): string {
  if (distance === "50k") return "50K";
  if (distance === "50m") return "50 Miles";
  if (distance === "100k") return "100K";
  if (distance === "100m") return "100 Miles";
  return distance;
}

export function formatTerrainLabel(terrain: string): string {
  if (terrain === "mountain") return "Mountain";
  if (terrain === "desert") return "Desert";
  if (terrain === "forest") return "Forest";
  if (terrain === "road") return "Road / Mixed";
  return terrain;
}

export function formatBudgetLabel(budget: string): string {
  if (budget === "budget") return "Budget";
  if (budget === "standard") return "Balanced";
  if (budget === "premium") return "Performance";
  if (budget === "elite") return "Elite";
  return budget;
}
