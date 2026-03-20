// ─── Saved Kit Types ────────────────────────────────────────────────────────

export interface SavedKitItem {
  category: string;
  product: string;
  brand: string;
  price: number;
  why: string;
  tier: "standard" | "budget" | "premium";
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
