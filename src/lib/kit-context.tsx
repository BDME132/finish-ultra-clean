"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import type { SavedKitItem } from "./kit-types";
import type { Product } from "./products/types";

// ─── Context Shape ─────────────────────────────────────────────────────────

interface KitContextValue {
  kitItems: SavedKitItem[];
  addToKit: (product: Product) => void;
  removeFromKit: (productId: string) => void;
  clearKit: () => void;
  isInKit: (productId: string) => boolean;
  itemCount: number;
  totalCost: number;
  isDrawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;
}

const KitContext = createContext<KitContextValue>({
  kitItems: [],
  addToKit: () => {},
  removeFromKit: () => {},
  clearKit: () => {},
  isInKit: () => false,
  itemCount: 0,
  totalCost: 0,
  isDrawerOpen: false,
  setDrawerOpen: () => {},
});

export function useKit() {
  return useContext(KitContext);
}

// ─── localStorage Key ──────────────────────────────────────────────────────

const CUSTOM_KIT_KEY = "finishultra_custom_kit";

function loadCustomKit(): SavedKitItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CUSTOM_KIT_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as SavedKitItem[];
  } catch {
    return [];
  }
}

function saveCustomKit(items: SavedKitItem[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(CUSTOM_KIT_KEY, JSON.stringify(items));
}

// ─── Helpers ───────────────────────────────────────────────────────────────

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/** Convert a Product's affiliateLinks to the SavedKitItem links format. */
function buildLinks(
  product: Product,
): Record<string, { url: string; price: number }> {
  const links: Record<string, { url: string; price: number }> = {};
  const al = product.affiliateLinks;

  if (al.rei) links.rei = { url: al.rei, price: product.price };
  if (al.amazon) links.amazon = { url: al.amazon, price: product.price };
  if (al.runningWarehouse)
    links.rw = { url: al.runningWarehouse, price: product.price };
  if (al.backcountry)
    links.backcountry = { url: al.backcountry, price: product.price };
  if (al.direct) links.direct = { url: al.direct, price: product.price };

  return links;
}

// ─── Provider ──────────────────────────────────────────────────────────────

export function KitProvider({ children }: { children: React.ReactNode }) {
  const [kitItems, setKitItems] = useState<SavedKitItem[]>([]);
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    setKitItems(loadCustomKit());
    setLoaded(true);
  }, []);

  // Persist whenever items change (but only after initial load)
  useEffect(() => {
    if (loaded) {
      saveCustomKit(kitItems);
    }
  }, [kitItems, loaded]);

  const addToKit = useCallback((product: Product) => {
    setKitItems((prev) => {
      // Don't add duplicates
      if (prev.some((item) => item.productId === product.id)) return prev;

      const newItem: SavedKitItem = {
        category: capitalize(product.category),
        product: product.name,
        brand: product.brand,
        price: product.price,
        why: product.whyWeRecommend,
        tier: "standard",
        specs: [],
        links: buildLinks(product),
        productId: product.id,
        purchased: false,
        tested: false,
        testingNotes: [],
        rating: 0,
      };

      return [...prev, newItem];
    });
  }, []);

  const removeFromKit = useCallback((productId: string) => {
    setKitItems((prev) => prev.filter((item) => item.productId !== productId));
  }, []);

  const clearKit = useCallback(() => {
    setKitItems([]);
  }, []);

  const isInKit = useCallback(
    (productId: string) => kitItems.some((item) => item.productId === productId),
    [kitItems],
  );

  const itemCount = kitItems.length;
  const totalCost = kitItems.reduce((sum, item) => sum + item.price, 0);

  return (
    <KitContext.Provider
      value={{
        kitItems,
        addToKit,
        removeFromKit,
        clearKit,
        isInKit,
        itemCount,
        totalCost,
        isDrawerOpen,
        setDrawerOpen,
      }}
    >
      {children}
    </KitContext.Provider>
  );
}
