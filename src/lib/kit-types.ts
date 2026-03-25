import type { KitSummary } from "@/types/gear";

// ─── Saved Kit Types ────────────────────────────────────────────────────────

export interface SavedKitItem {
  category: string;
  product: string;
  brand: string;
  price: number;
  why: string;
  tier: "standard" | "budget" | "premium" | "elite";
  specs: string[];
  links: Record<string, { url: string; price: number }>;
  purchased: boolean;
  purchaseDate?: string;
  retailerPurchasedFrom?: string;
  actualPricePaid?: number;
  tested: boolean;
  testingNotes: string[];
  rating: number; // 0-5
}

export interface SavedKit {
  kitId: string;
  createdAt: string;
  lastModified: string;
  presetId?: string;

  // Quiz answers that generated this kit
  raceDetails: {
    distance: string;
    terrain: string;
    temp: string;
    night: string;
    experience: string;
    budget: string;
    sweat: string;
    stomach: string;
    feetWidth: string;
    priority: string;
  };

  // Kit display
  kitTitle: string;
  kitSubtitle: string;

  // Cost summary
  totalCost: number;
  budgetCost: number;
  premiumCost: number;

  // All gear items
  items: SavedKitItem[];

  // Checklists
  packingChecklist: string[];
  dropBagEssentials: string[];
  testingTimeline: string[];

  // Purchase tracking
  purchaseProgress: {
    totalItems: number;
    purchased: number;
    tested: number;
    totalSpent: number;
  };

  // Status
  status: "active" | "complete" | "archived";
  notes: string;
}

// ─── localStorage ────────────────────────────────────────────────────────────

export const KIT_STORAGE_KEY = "finishultra_saved_kits";

export function loadSavedKits(): SavedKit[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KIT_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as SavedKit[];
  } catch {
    return [];
  }
}

export function saveKitsToLocal(kits: SavedKit[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(KIT_STORAGE_KEY, JSON.stringify(kits));
}

export function generateKitId(): string {
  return `kit_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export function sortKitsByModified(kits: SavedKit[]): SavedKit[] {
  return [...kits].sort((a, b) => {
    const aTime = new Date(a.lastModified || a.createdAt).getTime();
    const bTime = new Date(b.lastModified || b.createdAt).getTime();
    return bTime - aTime;
  });
}

export function ensureSingleActiveKit(kits: SavedKit[]): SavedKit[] {
  const sorted = sortKitsByModified(kits);
  const firstActive = sorted.find((kit) => kit.status === "active");

  if (!firstActive && sorted.length > 0) {
    const [latest, ...rest] = sorted;
    return [
      { ...latest, status: "active" },
      ...rest,
    ];
  }

  if (!firstActive) return sorted;

  let activeSeen = false;
  return sorted.map((kit) => {
    if (kit.kitId !== firstActive.kitId && kit.status === "active") {
      return { ...kit, status: "archived" };
    }
    if (kit.kitId === firstActive.kitId) {
      if (activeSeen) return { ...kit, status: "archived" };
      activeSeen = true;
      return { ...kit, status: "active" };
    }
    return kit;
  });
}

export function upsertSavedKit(existing: SavedKit[], incoming: SavedKit): SavedKit[] {
  const merged = [incoming, ...existing.filter((kit) => kit.kitId !== incoming.kitId)];
  return ensureSingleActiveKit(
    merged.map((kit) =>
      incoming.status === "active" && kit.kitId !== incoming.kitId && kit.status === "active"
        ? { ...kit, status: "archived" }
        : kit
    )
  );
}

export function removeSavedKit(existing: SavedKit[], kitId: string): SavedKit[] {
  return ensureSingleActiveKit(existing.filter((kit) => kit.kitId !== kitId));
}

export function getActiveKit(kits: SavedKit[]): SavedKit | null {
  return ensureSingleActiveKit(kits).find((kit) => kit.status === "active") ?? null;
}

export function summarizeSavedKit(kit: SavedKit): KitSummary {
  const categories = [...new Set(kit.items.map((item) => item.category))];
  return {
    title: kit.kitTitle,
    subtitle: kit.kitSubtitle,
    totalItems: kit.items.length,
    categories,
    totalCost: kit.totalCost,
  };
}
