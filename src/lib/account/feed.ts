// ─── Feed types ──────────────────────────────────────────────────────────────

import type { FollowProfile } from "./follows";

export type FeedItemType = "kit" | "plan" | "post";

export interface FeedItem {
  item_type: FeedItemType;
  item_id: string;
  author_user_id: string;
  title: string;
  subtitle: string | null;
  slug: string;
  published_at: string;
  updated_at: string;
}

export interface FeedItemWithAuthor extends FeedItem {
  author: FollowProfile | null;
}

export const FEED_PAGE_SIZE = 20;

export function feedItemHref(item: FeedItem): string {
  switch (item.item_type) {
    case "kit":
      return `/gear/kits/${item.slug}`;
    case "plan":
      return `/training/shared-plans/${item.slug}`;
    case "post":
      return `/blog/${item.slug}`;
  }
}

export function feedItemLabel(item: FeedItem): string {
  switch (item.item_type) {
    case "kit":
      return "published a gear kit";
    case "plan":
      return "shared a training plan";
    case "post":
      return "published a blog post";
  }
}
