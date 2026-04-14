import { shoes } from "./shoes";
import { packs } from "./packs";
import { apparel } from "./apparel";
import { nutrition } from "./nutrition";
import { accessories } from "./accessories";
import type { Product, ProductCategory } from "./types";

export type { Product, ProductCategory } from "./types";
export type {
  ShoeProduct,
  PackProduct,
  ApparelProduct,
  NutritionProduct,
  AccessoryProduct,
  AffiliateLinks,
  ShoeSpecs,
  ShoeRatings,
  PackSpecs,
  PackRatings,
  ApparelSpecs,
  NutritionSpecs,
} from "./types";

export { makeLinks, generateAffiliateLinks, parsePrice } from "./helpers";
export type { ProductLinks } from "./helpers";

// ─── All Products ───────────────────────────────────────────────────────────

export const ALL_PRODUCTS: Product[] = [
  ...shoes,
  ...packs,
  ...apparel,
  ...nutrition,
  ...accessories,
];

// ─── Lookup Helpers ─────────────────────────────────────────────────────────

const productMap = new Map<string, Product>(
  ALL_PRODUCTS.map((p) => [p.id, p]),
);

export function getProductById(id: string): Product | undefined {
  return productMap.get(id);
}

export function getProductsByCategory(category: ProductCategory): Product[] {
  return ALL_PRODUCTS.filter((p) => p.category === category);
}

export function getProductsBySubcategory(
  category: ProductCategory,
  subcategory: string,
): Product[] {
  return ALL_PRODUCTS.filter(
    (p) => p.category === category && p.subcategory === subcategory,
  );
}

export function searchProducts(query: string): Product[] {
  const q = query.toLowerCase();
  return ALL_PRODUCTS.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.tags.some((t) => t.toLowerCase().includes(q)) ||
      p.description.toLowerCase().includes(q),
  );
}

// ─── Category-specific exports ──────────────────────────────────────────────

export { shoes } from "./shoes";
export { packs } from "./packs";
export { apparel } from "./apparel";
export { nutrition } from "./nutrition";
export { accessories } from "./accessories";
