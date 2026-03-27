import type { PublicKit, PublicKitFilters, PublicShare } from "@/lib/kit-types";

export type PublishKitResult = {
  publicKit: PublicKit;
  publicShare: PublicShare;
};

function buildFilterQuery(filters: PublicKitFilters): string {
  const params = new URLSearchParams();

  if (filters.distance) params.set("distance", filters.distance);
  if (filters.terrain) params.set("terrain", filters.terrain);
  if (filters.budget) params.set("budget", filters.budget);
  if (filters.sort) params.set("sort", filters.sort);

  const query = params.toString();
  return query ? `?${query}` : "";
}

export async function loadPublicKits(filters: PublicKitFilters = {}): Promise<PublicKit[]> {
  try {
    const res = await fetch(`/api/public-kits${buildFilterQuery(filters)}`, {
      credentials: "include",
    });

    if (!res.ok) return [];

    const data = await res.json();
    return data.kits ?? [];
  } catch {
    return [];
  }
}

export async function loadPublicKitBySlug(slug: string): Promise<PublicKit | null> {
  try {
    const res = await fetch(`/api/public-kits/${encodeURIComponent(slug)}`, {
      credentials: "include",
    });

    if (!res.ok) return null;

    const data = await res.json();
    return data.kit ?? null;
  } catch {
    return null;
  }
}

export async function publishKit(kitId: string): Promise<PublishKitResult | null> {
  try {
    const res = await fetch("/api/public-kits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ kitId }),
    });

    if (!res.ok) return null;

    const data = await res.json();
    return {
      publicKit: data.kit,
      publicShare: data.publicShare,
    };
  } catch {
    return null;
  }
}

export async function unpublishKit(kitId: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/public-kits?kitId=${encodeURIComponent(kitId)}`, {
      method: "DELETE",
      credentials: "include",
    });

    return res.ok;
  } catch {
    return false;
  }
}
