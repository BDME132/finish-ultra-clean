import type { AffiliateLinks } from "./types";

// Affiliate link builder — extracted from KitBuilder.tsx
// Generates search-based affiliate URLs with tracking tags for each retailer

type RetailerLink = { url: string; price: number };

export type ProductLinks = {
  rei?: RetailerLink;
  amazon?: RetailerLink;
  backcountry?: RetailerLink;
  rw?: RetailerLink;
  direct?: RetailerLink;
};

export function makeLinks(
  searchTerm: string,
  basePrice: number,
  amazonDiscount = 0.97,
  rwDiscount = 0.98,
): ProductLinks {
  const q = encodeURIComponent(searchTerm);
  return {
    rei: {
      url: `https://www.rei.com/search?q=${q}&cm_mmc=aff_AL-_-finishultra-_-1`,
      price: basePrice,
    },
    amazon: {
      url: `https://www.amazon.com/s?k=${q}&tag=finishultra-20`,
      price: Math.round(basePrice * amazonDiscount),
    },
    backcountry: {
      url: `https://www.backcountry.com/search?q=${q}&CMP_ID=finishultra`,
      price: basePrice,
    },
    rw: {
      url: `https://www.runningwarehouse.com/searchresults/?searchTerm=${q}&sourceCode=FFULTRA`,
      price: Math.round(basePrice * rwDiscount),
    },
  };
}

// Convert AffiliateLinks to search-based URLs for products that only have placeholder "#" links
export function generateAffiliateLinks(
  brand: string,
  name: string,
): AffiliateLinks {
  const q = encodeURIComponent(`${brand} ${name}`);
  return {
    rei: `https://www.rei.com/search?q=${q}&cm_mmc=aff_AL-_-finishultra-_-1`,
    amazon: `https://www.amazon.com/s?k=${q}&tag=finishultra-20`,
    runningWarehouse: `https://www.runningwarehouse.com/searchresults/?searchTerm=${q}&sourceCode=FFULTRA`,
  };
}

// Parse price strings like "$160" or "~$155" to numeric
export function parsePrice(priceStr: string): number {
  return parseInt(priceStr.replace(/[^0-9]/g, ""), 10) || 0;
}
