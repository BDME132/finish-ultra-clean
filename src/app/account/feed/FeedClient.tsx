"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Calendar, Package, PenSquare, Rss } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { hasSupabaseBrowserEnv } from "@/lib/supabase/client";
import Avatar from "@/components/account/Avatar";
import {
  feedItemHref,
  feedItemLabel,
  type FeedItemType,
  type FeedItemWithAuthor,
} from "@/lib/account/feed";
import { profileDisplayName } from "@/lib/account/profile";

const PAGE_SIZE = 20;

function timeAgo(iso: string): string {
  const seconds = Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 1000));
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function iconFor(type: FeedItemType) {
  switch (type) {
    case "kit":
      return <Package className="w-4 h-4" />;
    case "plan":
      return <Calendar className="w-4 h-4" />;
    case "post":
      return <PenSquare className="w-4 h-4" />;
  }
}

export default function FeedClient() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const isSupabaseConfigured = hasSupabaseBrowserEnv();
  const [items, setItems] = useState<FeedItemWithAuthor[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPage = useCallback(
    async (before?: string) => {
      const url = new URL("/api/feed", window.location.origin);
      url.searchParams.set("limit", `${PAGE_SIZE}`);
      if (before) url.searchParams.set("before", before);
      const res = await fetch(url.toString(), { credentials: "include" });
      if (!res.ok) throw new Error("Failed to load feed");
      const json = await res.json();
      return (json.items ?? []) as FeedItemWithAuthor[];
    },
    [],
  );

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }
    if (authLoading) return;
    if (!user) {
      router.replace("/login");
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const page = await fetchPage();
        if (!cancelled) {
          setItems(page);
          setHasMore(page.length === PAGE_SIZE);
        }
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [authLoading, user, router, isSupabaseConfigured, fetchPage]);

  async function loadMore() {
    if (items.length === 0) return;
    setLoadingMore(true);
    try {
      const last = items[items.length - 1];
      const page = await fetchPage(last.published_at);
      setItems((prev) => [...prev, ...page]);
      setHasMore(page.length === PAGE_SIZE);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load more");
    } finally {
      setLoadingMore(false);
    }
  }

  if (!isSupabaseConfigured) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
        <p className="text-sm text-gray">Add Supabase env vars to use the feed.</p>
      </div>
    );
  }

  if (authLoading || loading || !user) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 p-8 text-center text-sm text-gray">
        Loading feed...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-100 text-red-700 text-sm rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      {items.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-8 text-center text-sm text-gray">
          <Rss className="w-10 h-10 mx-auto mb-3 text-gray-300" />
          Your feed is quiet. Follow runners to see their public training plans, gear kits, and blog posts here.
          <div className="mt-4">
            <Link href="/training/shared-plans" className="text-primary font-medium hover:underline">
              Browse public training plans →
            </Link>
          </div>
        </div>
      ) : (
        <>
          <ul className="space-y-3">
            {items.map((item) => {
              const author = item.author;
              const authorName = author ? profileDisplayName(author) : "A runner";
              const authorHref = author?.username ? `/u/${author.username}` : "#";
              return (
                <li
                  key={`${item.item_type}-${item.item_id}`}
                  className="bg-white rounded-xl border border-gray-100 p-4 flex gap-4"
                >
                  <Link href={authorHref} className="shrink-0">
                    <Avatar profile={author} size="md" />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray">
                      <Link href={authorHref} className="font-semibold text-dark hover:text-primary">
                        {authorName}
                      </Link>{" "}
                      {feedItemLabel(item)}
                      <span className="ml-2 text-xs text-gray">{timeAgo(item.published_at)}</span>
                    </p>
                    <Link
                      href={feedItemHref(item)}
                      className="block mt-2 group"
                    >
                      <div className="flex items-start gap-3">
                        <span className="mt-1 text-primary">{iconFor(item.item_type)}</span>
                        <div className="min-w-0">
                          <p className="font-semibold text-dark group-hover:text-primary truncate">
                            {item.title}
                          </p>
                          {item.subtitle && (
                            <p className="text-sm text-gray line-clamp-2">{item.subtitle}</p>
                          )}
                        </div>
                      </div>
                    </Link>
                  </div>
                </li>
              );
            })}
          </ul>

          {hasMore && (
            <div className="text-center">
              <button
                onClick={loadMore}
                disabled={loadingMore}
                className="px-4 py-2 border border-gray-200 text-sm font-medium text-dark rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                {loadingMore ? "Loading..." : "Load more"}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
