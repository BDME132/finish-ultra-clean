"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, ExternalLink, ChevronRight, Plus, Check } from "lucide-react";
import type { Product, ProductCategory } from "@/lib/products/types";
import { useKit } from "@/lib/kit-context";

// ─── Category Config ────────────────────────────────────────────────────────

type CategoryTab = { key: ProductCategory | "all"; label: string };

const CATEGORY_TABS: CategoryTab[] = [
  { key: "all", label: "All" },
  { key: "shoes", label: "Shoes" },
  { key: "packs", label: "Packs & Vests" },
  { key: "apparel", label: "Apparel" },
  { key: "nutrition", label: "Nutrition" },
  { key: "lighting", label: "Lighting" },
  { key: "accessories", label: "Accessories" },
  { key: "safety", label: "Safety" },
  { key: "recovery", label: "Recovery" },
  { key: "footcare", label: "Foot Care" },
];

const CATEGORY_COLORS: Record<ProductCategory, string> = {
  shoes: "bg-blue-100 text-blue-800",
  packs: "bg-purple-100 text-purple-800",
  apparel: "bg-green-100 text-green-800",
  nutrition: "bg-orange-100 text-orange-800",
  lighting: "bg-yellow-100 text-yellow-800",
  accessories: "bg-gray-200 text-gray-800",
  safety: "bg-red-100 text-red-800",
  recovery: "bg-teal-100 text-teal-800",
  footcare: "bg-pink-100 text-pink-800",
};

// ─── Sort Options ───────────────────────────────────────────────────────────

type SortKey = "name-asc" | "price-asc" | "price-desc" | "brand-asc";

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "name-asc", label: "Name A-Z" },
  { key: "price-asc", label: "Price: Low to High" },
  { key: "price-desc", label: "Price: High to Low" },
  { key: "brand-asc", label: "Brand A-Z" },
];

function sortProducts(products: Product[], key: SortKey): Product[] {
  const sorted = [...products];
  switch (key) {
    case "name-asc":
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case "price-asc":
      return sorted.sort((a, b) => a.price - b.price);
    case "price-desc":
      return sorted.sort((a, b) => b.price - a.price);
    case "brand-asc":
      return sorted.sort((a, b) => a.brand.localeCompare(b.brand));
    default:
      return sorted;
  }
}

// ─── Search ─────────────────────────────────────────────────────────────────

function matchesSearch(product: Product, query: string): boolean {
  const q = query.toLowerCase();
  return (
    product.name.toLowerCase().includes(q) ||
    product.brand.toLowerCase().includes(q) ||
    product.tags.some((t) => t.toLowerCase().includes(q)) ||
    product.description.toLowerCase().includes(q)
  );
}

// ─── Component ──────────────────────────────────────────────────────────────

export default function LibraryClient({ products }: { products: Product[] }) {
  const [activeCategory, setActiveCategory] = useState<ProductCategory | "all">("all");
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("name-asc");
  const { addToKit, removeFromKit, isInKit } = useKit();

  // Counts per category (before search filter, so tabs always show totals)
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: products.length };
    for (const p of products) {
      counts[p.category] = (counts[p.category] ?? 0) + 1;
    }
    return counts;
  }, [products]);

  // Filtered + sorted list
  const filtered = useMemo(() => {
    let list = products;
    if (activeCategory !== "all") {
      list = list.filter((p) => p.category === activeCategory);
    }
    if (search.trim()) {
      list = list.filter((p) => matchesSearch(p, search.trim()));
    }
    return sortProducts(list, sortKey);
  }, [products, activeCategory, search, sortKey]);

  const categoryLabel = (key: ProductCategory): string =>
    CATEGORY_TABS.find((t) => t.key === key)?.label ?? key;

  return (
    <div className="space-y-8">
      {/* ── Category Tabs ──────────────────────────────────────────────── */}
      <div className="overflow-x-auto -mx-4 px-4 scrollbar-hide">
        <div className="flex gap-2 pb-2 min-w-max">
          {CATEGORY_TABS.map((tab) => {
            const count = categoryCounts[tab.key] ?? 0;
            const isActive = activeCategory === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveCategory(tab.key)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  isActive
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-gray hover:bg-gray-200"
                }`}
              >
                {tab.label}
                <span
                  className={`text-xs ${
                    isActive ? "text-white/80" : "text-gray/60"
                  }`}
                >
                  ({count})
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Search + Sort Row ──────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray" />
          <input
            type="text"
            placeholder="Search by name, brand, or keyword..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 bg-white text-dark text-sm placeholder:text-gray/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
          />
        </div>

        <select
          value={sortKey}
          onChange={(e) => setSortKey(e.target.value as SortKey)}
          className="px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-dark text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.key} value={opt.key}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* ── Product Count ──────────────────────────────────────────────── */}
      <p className="text-sm text-gray">
        Showing <span className="font-semibold text-dark">{filtered.length}</span> of{" "}
        <span className="font-semibold text-dark">{products.length}</span> products
      </p>

      {/* ── Product Grid ───────────────────────────────────────────────── */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              categoryLabel={categoryLabel(product.category)}
              inKit={isInKit(product.id)}
              onAddToKit={() => addToKit(product)}
              onRemoveFromKit={() => removeFromKit(product.id)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-gray text-lg">
            No products found. Try a different search or category.
          </p>
        </div>
      )}
    </div>
  );
}

// ─── Product Card ───────────────────────────────────────────────────────────

function ProductCard({
  product,
  categoryLabel,
  inKit,
  onAddToKit,
  onRemoveFromKit,
}: {
  product: Product;
  categoryLabel: string;
  inKit: boolean;
  onAddToKit: () => void;
  onRemoveFromKit: () => void;
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-primary/20 transition-all flex flex-col">
      <div className="p-6 flex-1 flex flex-col">
        {/* Top row: brand + beginner badge */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray">
            {product.brand}
          </span>
          {product.beginnerPick && (
            <span className="text-xs font-bold text-white bg-accent px-2 py-0.5 rounded-full">
              Beginner Pick
            </span>
          )}
        </div>

        {/* Name */}
        <h3 className="font-headline text-lg font-bold text-dark mb-1">
          {product.name}
        </h3>

        {/* Price + category */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-accent font-semibold">{product.priceDisplay}</span>
          <span
            className={`text-xs font-medium px-2 py-0.5 rounded-full ${
              CATEGORY_COLORS[product.category]
            }`}
          >
            {categoryLabel}
          </span>
        </div>

        {/* Description (2-line clamp) */}
        <p className="text-sm text-gray leading-relaxed line-clamp-2 mb-4 flex-1">
          {product.description}
        </p>

        {/* Affiliate links */}
        <div className="flex flex-wrap gap-2 mb-3">
          {product.affiliateLinks.amazon && (
            <a
              href={product.affiliateLinks.amazon}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="inline-flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-lg bg-primary text-white hover:bg-primary-dark transition-colors"
            >
              Buy on Amazon <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>

        {/* Add to Kit / In Kit toggle */}
        <button
          onClick={inKit ? onRemoveFromKit : onAddToKit}
          className={`mb-3 w-full flex items-center justify-center gap-2 text-sm font-semibold py-2 rounded-lg transition-colors ${
            inKit
              ? "bg-green-50 text-green-700 border border-green-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
              : "bg-primary/10 text-primary border border-primary/20 hover:bg-primary hover:text-white"
          }`}
        >
          {inKit ? (
            <>
              <Check className="w-4 h-4" /> In Kit
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" /> Add to Kit
            </>
          )}
        </button>

        {/* View Details link */}
        <Link
          href={`/gear/library/${product.id}`}
          className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:text-primary-dark transition-colors"
        >
          View Details <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
