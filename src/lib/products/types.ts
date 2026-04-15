// ─── Product Categories ─────────────────────────────────────────────────────

export type ProductCategory =
  | "shoes"
  | "packs"
  | "apparel"
  | "nutrition"
  | "lighting"
  | "safety"
  | "recovery"
  | "accessories"
  | "footcare";

// ─── Shared Types ───────────────────────────────────────────────────────────

export interface AffiliateLinks {
  amazon?: string;
}

// ─── Product Base ───────────────────────────────────────────────────────────

export interface ProductBase {
  id: string;
  name: string;
  brand: string;
  category: ProductCategory;
  subcategory?: string;
  price: number;
  priceDisplay: string;
  description: string;
  whyWeRecommend: string;
  image?: string;
  affiliateLinks: AffiliateLinks;
  tags: string[];
  beginnerPick?: boolean;
}

// ─── Shoe Product ───────────────────────────────────────────────────────────

export interface ShoeSpecs {
  weight: string;
  drop: string;
  stack: string;
  lug?: string;
  midsole?: string;
  outsole?: string;
  rockPlate?: boolean;
  widths?: string;
}

export interface ShoeRatings {
  cushioning: number;
  traction: number;
  durability: number;
  breathability: number;
  groundFeel: number;
}

export interface ShoeProduct extends ProductBase {
  category: "shoes";
  specs: ShoeSpecs;
  ratings?: ShoeRatings;
  finderTags: {
    terrain: string[];
    priority: string[];
    distance: string[];
  };
  bestFor?: string[];
  pros?: string[];
  cons?: string[];
  review?: { quote: string; race: string; runner: string };
}

// ─── Pack Product ───────────────────────────────────────────────────────────

export interface PackSpecs {
  weight: string;
  capacity: string;
  genderFit: string;
  sizes?: string;
  frontPockets?: string;
  backStorage?: string;
  hydrationSystem?: string;
  poleCarry?: boolean;
  whistle?: boolean;
  bladderCompatible?: boolean;
  includedFlasks?: string;
}

export interface PackRatings {
  comfort: number;
  bounce: number;
  breathability: number;
  loadDistribution: number;
  easeOfAccess: number;
  durability: number;
}

export interface PackProduct extends ProductBase {
  category: "packs";
  specs: PackSpecs;
  ratings?: PackRatings;
  finderTags: {
    distance: string[];
    build: string[];
    capacity: string[];
    hydration: string[];
    priority: string[];
  };
  bestFor?: string[];
  distances?: string[];
  pros?: string[];
  cons?: string[];
  review?: { quote: string; race: string; runner: string };
}

// ─── Apparel Product ────────────────────────────────────────────────────────

export interface ApparelSpecs {
  fabric?: string;
  upf?: string;
  fit?: string;
  weight?: string;
  inseam?: string;
}

export interface ApparelProduct extends ProductBase {
  category: "apparel";
  specs: ApparelSpecs;
  role?: string;
  conditions?: string[];
}

// ─── Nutrition Product ──────────────────────────────────────────────────────

export interface NutritionSpecs {
  calories?: string;
  carbs?: string;
  sodium?: string;
  servings?: string;
  caffeine?: string;
}

export interface NutritionProduct extends ProductBase {
  category: "nutrition";
  specs: NutritionSpecs;
  nutritionType?: string;
  stomachFriendly?: boolean;
}

// ─── Accessory Product (catch-all) ──────────────────────────────────────────

export interface AccessoryProduct extends ProductBase {
  category: "lighting" | "safety" | "recovery" | "accessories" | "footcare";
  specs: Record<string, string>;
}

// ─── Union Type ─────────────────────────────────────────────────────────────

export type Product =
  | ShoeProduct
  | PackProduct
  | ApparelProduct
  | NutritionProduct
  | AccessoryProduct;
