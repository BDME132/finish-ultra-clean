import type { Metadata } from "next";
import { SITE_URL } from "@/lib/schema";

const DEFAULT_OG_PATH = "/og-image.png";
const OG_SIZE = { width: 1200, height: 630 } as const;

/** Canonical URL with `https://www.finishultra.com` origin. */
export function absoluteCanonical(path: string): string {
  if (!path || path === "/") return `${SITE_URL}/`;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${normalized}`;
}

/** Absolute URL for Open Graph / Twitter images. */
export function resolveOgImageUrl(src?: string | null): string {
  if (!src) return `${SITE_URL}${DEFAULT_OG_PATH}`;
  if (src.startsWith("http://") || src.startsWith("https://")) return src;
  const path = src.startsWith("/") ? src : `/${src}`;
  return `${SITE_URL}${path}`;
}

export type PageMetadataInput = {
  title: string;
  description: string;
  path: string;
  /** Path or absolute URL; defaults to site OG image */
  ogImage?: string | null;
  ogType?: "website" | "article";
  ogArticle?: {
    publishedTime?: string;
    modifiedTime?: string;
    authors?: string[];
    tags?: string[];
  };
  /** Merged with defaults (e.g. `{ index: false }` for private pages) */
  robots?: Metadata["robots"];
};

/**
 * Full per-page metadata: canonical, Open Graph, and Twitter Card.
 * Assumes root layout sets `metadataBase` and default icons.
 */
export function pageMetadata(input: PageMetadataInput): Metadata {
  const canonical = absoluteCanonical(input.path);
  const imageUrl = resolveOgImageUrl(input.ogImage ?? undefined);
  const { title, description } = input;

  const ogArticle =
    input.ogType === "article" && input.ogArticle ? input.ogArticle : null;

  const openGraph = {
    type: input.ogType ?? "website",
    locale: "en_US",
    url: canonical,
    siteName: "FinishUltra",
    title,
    description,
    images: [{ url: imageUrl, ...OG_SIZE, alt: title }],
    ...(ogArticle?.publishedTime
      ? { publishedTime: ogArticle.publishedTime }
      : {}),
    ...(ogArticle?.modifiedTime ? { modifiedTime: ogArticle.modifiedTime } : {}),
    ...(ogArticle?.authors?.length ? { authors: ogArticle.authors } : {}),
    ...(ogArticle?.tags?.length ? { tags: ogArticle.tags } : {}),
  } satisfies NonNullable<Metadata["openGraph"]>;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph,
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
    ...(input.robots !== undefined ? { robots: input.robots } : {}),
  };
}
