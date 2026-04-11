import type { BlogPost } from "@/types/content";
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
  "race-day-kit": "Race Day Kit",
  "first-50k": "Your First 50K",
  "base-building": "Base Building",
  "race-week": "Race Week",
  "race-day-checklist": "Race Day Checklist",
  plans: "Training Plans",
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
    email: "hello@finishultra.com",
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

export function rootLayoutJsonLdGraph(pathname: string) {
  const normalized =
    pathname === "" ? "/" : pathname.startsWith("/") ? pathname : `/${pathname}`;

  const graph: Record<string, unknown>[] = [organizationJsonLd()];

  if (normalized === "/") {
    graph.push(websiteWithSearchActionJsonLd());
  } else if (!isBlogArticlePathname(normalized)) {
    graph.push(breadcrumbListFromPath(normalized));
  }

  return {
    "@context": "https://schema.org",
    "@graph": graph,
  };
}

function isoDateOnly(d: string): string {
  return d.length >= 10 ? d.slice(0, 10) : d;
}

function estimateWordCount(body: string): number {
  return body.trim().split(/\s+/).filter(Boolean).length;
}

export function blogPostingJsonLd(post: BlogPost) {
  const url = absoluteUrl(`/blog/${post.slug}`);
  const imageUrl = post.image.startsWith("http")
    ? post.image
    : absoluteUrl(post.image);

  const modified = isoDateOnly(post.updatedAt ?? post.publishedAt);
  const published = isoDateOnly(post.publishedAt);

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: published,
    dateModified: modified,
    author: {
      "@type": "Person",
      name: "FinishUltra Team",
      url: absoluteUrl("/about"),
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
    wordCount: estimateWordCount(post.body),
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

export type ItemListEntry = { name: string; url: string; description?: string };

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
      name: it.name,
      item: it.url,
      ...(it.description ? { description: it.description } : {}),
    })),
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
