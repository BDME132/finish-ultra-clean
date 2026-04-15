import type { AffiliateLinks } from "./types";

// Convert AffiliateLinks to search-based Amazon URL for products that only have placeholder "#" links
export function generateAffiliateLinks(
  brand: string,
  name: string,
): AffiliateLinks {
  const q = encodeURIComponent(`${brand} ${name}`);
  return {
    amazon: `https://www.amazon.com/s?k=${q}&tag=finishultra-20`,
  };
}

// Parse price strings like "$160" or "~$155" to numeric
export function parsePrice(priceStr: string): number {
  return parseInt(priceStr.replace(/[^0-9]/g, ""), 10) || 0;
}
