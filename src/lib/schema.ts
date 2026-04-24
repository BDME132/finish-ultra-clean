import type { PublicBlogPost } from "@/lib/blog";
import type { Product } from "@/lib/products/types";
import type { GlossaryTerm } from "@/types/content";

/** Canonical site origin — all structured-data URLs must use this. */
export const SITE_URL = "https://www.finishultra.com";

export const ORGANIZATION_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

const ORG_DESCRIPTION =
  "The all-purpose resource for beginner ultra runners. Free training plans, honest gear advice, and Pheidi — your AI ultra running coach.";

/** Human-readable labels for URL path segments (breadcrumbs). */
const SEGMENT_LABELS: Record<string, string> = {
  gear: "Gear",
  training: "Training",
  blog: "Blog",
  tools: "Tools",
  about: "About",
  contact: "Contact",
  search: "Search",
  newsletter: "Newsletter",
  "start-here": "Start Here",
  shoes: "Shoes",
  packs: "Packs & Vests",
  nutrition: "Nutrition",
  apparel: "Apparel",
  kits: "Gear Kits",
  builder: "Gear Builder",
  "race-day-kit": "Shared Kits",
  "first-50k": "Your First 50K",
  "base-building": "Base Building",
  "race-week": "Race Week",
  "race-day-checklist": "Race Day Checklist",
  plans: "Training Plans",
  "shared-plans": "Shared Plans",
  dashboard: "Training Dashboard",
  "pace-calculator": "Pace Calculator",
  glossary: "Glossary",
  pheidi: "Pheidi",
  coach: "AI Coach",
  "privacy-policy": "Privacy Policy",
  "affiliate-disclosure": "Affiliate Disclosure",
  login: "Login",
  account: "Account",
  admin: "Admin",
  "race-hq": "Race HQ",
};

export function slugifyForAnchor(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function gearProductAnchorId(
  categoryId: string,
  brand: string,
  productName: string
): string {
  return `${categoryId}-${slugifyForAnchor(`${brand}-${productName}`)}`;
}

export function absoluteUrl(path: string): string {
  if (!path.startsWith("/")) return `${SITE_URL}/${path}`;
  return `${SITE_URL}${path}`;
}

function segmentLabel(segment: string): string {
  return (
    SEGMENT_LABELS[segment] ??
    segment
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ")
  );
}

export function organizationJsonLd() {
  return {
    "@type": "Organization",
    "@id": ORGANIZATION_ID,
    name: "FinishUltra",
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: `${SITE_URL}/logo.png`,
    },
    description: ORG_DESCRIPTION,
    email: "finishultra@finishultra.com",
    sameAs: ["https://instagram.com/finishultra"],
  };
}

export function websiteWithSearchActionJsonLd() {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: SITE_URL,
    name: "FinishUltra",
    description: ORG_DESCRIPTION,
    publisher: { "@id": ORGANIZATION_ID },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

/**
 * BreadcrumbList for a pathname (leading slash, no query).
 * Omits a trailing segment that equals a blog slug when titleOverride is passed (blog post title).
 */
export function breadcrumbListFromPath(
  pathname: string,
  lastItemTitleOverride?: string
) {
  const path = pathname.split("?")[0] || "/";
  const segments = path.split("/").filter(Boolean);

  const items: { name: string; item: string }[] = [
    { name: "Home", item: SITE_URL },
  ];

  let acc = "";
  for (let i = 0; i < segments.length; i++) {
    acc += `/${segments[i]}`;
    const isLast = i === segments.length - 1;
    const name =
      isLast && lastItemTitleOverride
        ? lastItemTitleOverride
        : segmentLabel(segments[i]);
    items.push({
      name,
      item: `${SITE_URL}${acc}`,
    });
  }

  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: it.name,
      item: it.item,
    })),
  };
}

/** JSON-LD document for a standalone BreadcrumbList script tag. */
export function breadcrumbJsonLdDocument(
  pathname: string,
  lastItemTitleOverride?: string
) {
  return {
    "@context": "https://schema.org",
    ...breadcrumbListFromPath(pathname, lastItemTitleOverride),
  };
}

/** Blog posts supply their own breadcrumb so the last crumb uses the real headline, not the slug. */
export function isBlogArticlePathname(normalizedPath: string): boolean {
  const parts = normalizedPath.split("/").filter(Boolean);
  return parts.length === 2 && parts[0] === "blog";
}

/**
 * Static JSON-LD emitted from the root layout on every page. Breadcrumbs now
 * live on the individual pages that need them (blog slug page already does).
 * Keeping this pathname-free lets the layout be statically prerendered, which
 * in turn lets pages opt into ISR via `revalidate`.
 */
export function rootLayoutJsonLdGraph() {
  return {
    "@context": "https://schema.org",
    "@graph": [organizationJsonLd(), websiteWithSearchActionJsonLd()],
  };
}

function isoDateOnly(d: string): string {
  return d.length >= 10 ? d.slice(0, 10) : d;
}

function estimateWordCount(body: string): number {
  return body.trim().split(/\s+/).filter(Boolean).length;
}

export function blogPostingJsonLd(post: PublicBlogPost) {
  const url = absoluteUrl(`/blog/${post.slug}`);
  const imagePath = post.coverImageUrl || "/og-image.png";
  const imageUrl = imagePath.startsWith("http")
    ? imagePath
    : absoluteUrl(imagePath);

  const modified = isoDateOnly(post.updatedAt ?? post.publishedAt);
  const published = isoDateOnly(post.publishedAt ?? post.createdAt);

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: published,
    dateModified: modified,
    author: {
      "@type": "Person",
      name: post.authorName,
      url: post.authorType === "ai" ? absoluteUrl("/pheidi") : absoluteUrl("/account"),
    },
    publisher: {
      "@type": "Organization",
      name: "FinishUltra",
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/logo.png`,
      },
    },
    image: imageUrl,
    url,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    articleSection: post.category,
    keywords: post.tags.join(", "),
    wordCount: estimateWordCount(post.bodyMarkdown),
  };
}

export function faqPageJsonLd(
  items: { question: string; answer: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.answer,
      },
    })),
  };
}

export type HowToStepInput = {
  name: string;
  text: string;
  url?: string;
};

export function howToJsonLd(input: {
  name: string;
  description: string;
  steps: HowToStepInput[];
  totalTime?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: input.name,
    description: input.description,
    ...(input.totalTime ? { totalTime: input.totalTime } : {}),
    step: input.steps.map((s) => ({
      "@type": "HowToStep",
      name: s.name,
      text: s.text,
      ...(s.url ? { url: s.url } : {}),
    })),
  };
}

export type ItemListEntry = {
  name: string;
  url: string;
  description?: string;
  product?: ProductSchemaInput;
};

export function itemListJsonLd(input: {
  name: string;
  description?: string;
  items: ItemListEntry[];
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: input.name,
    ...(input.description ? { description: input.description } : {}),
    numberOfItems: input.items.length,
    url: input.url,
    itemListElement: input.items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      ...(it.product
        ? { item: productJsonLdNode(it.product, it.url) }
        : {
            name: it.name,
            item: it.url,
            ...(it.description ? { description: it.description } : {}),
          }),
    })),
  };
}

// ─── Product / Review / AggregateRating ───────────────────────────────────

export type ProductSchemaInput = {
  id: string;
  name: string;
  brand: string;
  description: string;
  category?: string;
  image?: string;
  url?: string;
  aggregateRating?: {
    ratingValue: number;
    reviewCount: number;
    bestRating?: number;
    worstRating?: number;
  };
  reviews?: ReviewSchemaInput[];
};

export type ReviewSchemaInput = {
  ratingValue: number;
  author: string;
  datePublished: string;
  reviewBody: string;
  title?: string;
  bestRating?: number;
  worstRating?: number;
};

function resolveProductImage(image?: string): string {
  if (!image) return `${SITE_URL}/og-image.png`;
  return image.startsWith("http") ? image : absoluteUrl(image);
}

function reviewJsonLdNode(review: ReviewSchemaInput) {
  return {
    "@type": "Review",
    reviewRating: {
      "@type": "Rating",
      ratingValue: review.ratingValue,
      bestRating: review.bestRating ?? 5,
      worstRating: review.worstRating ?? 1,
    },
    author: { "@type": "Person", name: review.author },
    datePublished: review.datePublished,
    reviewBody: review.reviewBody,
    ...(review.title ? { name: review.title } : {}),
  };
}

function productJsonLdNode(input: ProductSchemaInput, fallbackUrl?: string) {
  const url = input.url ?? fallbackUrl ?? absoluteUrl(`/gear/library/${input.id}`);
  return {
    "@type": "Product",
    name: input.name,
    sku: input.id,
    description: input.description,
    brand: { "@type": "Brand", name: input.brand },
    image: resolveProductImage(input.image),
    url,
    ...(input.category ? { category: input.category } : {}),
    ...(input.aggregateRating && input.aggregateRating.reviewCount > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: input.aggregateRating.ratingValue,
            reviewCount: input.aggregateRating.reviewCount,
            bestRating: input.aggregateRating.bestRating ?? 5,
            worstRating: input.aggregateRating.worstRating ?? 1,
          },
        }
      : {}),
    ...(input.reviews && input.reviews.length > 0
      ? { review: input.reviews.map(reviewJsonLdNode) }
      : {}),
  };
}

/**
 * Full-document Product JSON-LD for a product detail page. Offer is intentionally
 * omitted because we use affiliate links and cannot guarantee authoritative
 * price/availability; emitting a stub would trigger Search Console warnings.
 */
export function productJsonLd(input: ProductSchemaInput) {
  return {
    "@context": "https://schema.org",
    ...productJsonLdNode(input),
  };
}

export function productFromLibrary(
  product: Product,
  extras: {
    aggregateRating?: ProductSchemaInput["aggregateRating"];
    reviews?: ReviewSchemaInput[];
  } = {},
): ProductSchemaInput {
  return {
    id: product.id,
    name: `${product.brand} ${product.name}`,
    brand: product.brand,
    description: product.description,
    category: product.category,
    image: product.image,
    url: absoluteUrl(`/gear/library/${product.id}`),
    aggregateRating: extras.aggregateRating,
    reviews: extras.reviews,
  };
}

export function webApplicationJsonLd(input: {
  name: string;
  description: string;
  url: string;
  applicationCategory?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: input.name,
    description: input.description,
    url: input.url,
    applicationCategory: input.applicationCategory ?? "UtilityApplication",
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };
}

export function definedTermSetJsonLd(
  name: string,
  description: string,
  pageUrl: string,
  terms: GlossaryTerm[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    name,
    description,
    url: pageUrl,
    hasDefinedTerm: terms.map((t) => ({
      "@type": "DefinedTerm",
      name: t.term,
      description: t.shortDefinition,
      url: `${pageUrl}#${t.slug}`,
      inDefinedTermSet: pageUrl,
    })),
  };
}

export function aboutPageJsonLd() {
  const url = absoluteUrl("/about");
  return {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "@id": `${url}#aboutpage`,
    url,
    name: "About FinishUltra",
    description:
      "FinishUltra is built by beginners for beginners — free ultra training plans, gear guides, and Pheidi, your AI running coach.",
    mainEntity: { "@id": ORGANIZATION_ID },
    publisher: { "@id": ORGANIZATION_ID },
  };
}
