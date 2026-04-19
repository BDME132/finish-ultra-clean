"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Package, ExternalLink, Trash2 } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { hasSupabaseBrowserEnv } from "@/lib/supabase/client";
import { loadKits, deleteKit } from "@/lib/kit-sync";
import { publishKit, unpublishKit } from "@/lib/public-kit-sync";
import type { SavedKit } from "@/lib/kit-types";

function formatDate(iso: string | undefined): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function formatPrice(value: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
}

export default function KitsClient() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const isSupabaseConfigured = hasSupabaseBrowserEnv();
  const [kits, setKits] = useState<SavedKit[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

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
        const data = await loadKits(user);
        if (!cancelled) setKits(data);
      } catch {
        if (!cancelled) setError("Failed to load kits");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [authLoading, user, router, isSupabaseConfigured]);

  async function handlePublishToggle(kit: SavedKit) {
    setBusyId(kit.kitId);
    setError(null);
    try {
      if (kit.publicShare) {
        const ok = await unpublishKit(kit.kitId);
        if (!ok) throw new Error("Failed to unpublish kit");
        setKits((prev) =>
          prev.map((k) => (k.kitId === kit.kitId ? { ...k, publicShare: null } : k)),
        );
      } else {
        const result = await publishKit(kit.kitId);
        if (!result) throw new Error("Failed to publish kit");
        setKits((prev) =>
          prev.map((k) => (k.kitId === kit.kitId ? { ...k, publicShare: result.publicShare } : k)),
        );
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete(kit: SavedKit) {
    if (!user) return;
    if (!confirm(`Delete kit "${kit.kitTitle}"? This cannot be undone.`)) return;
    setBusyId(kit.kitId);
    try {
      await deleteKit(kit.kitId, user);
      setKits((prev) => prev.filter((k) => k.kitId !== kit.kitId));
    } catch {
      setError("Failed to delete kit");
    } finally {
      setBusyId(null);
    }
  }

  if (!isSupabaseConfigured) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
        <p className="text-sm text-gray">Add Supabase env vars to manage kits.</p>
      </div>
    );
  }

  if (authLoading || loading || !user) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 p-8 text-center text-sm text-gray">
        Loading kits...
      </div>
    );
  }

  const active = kits.filter((k) => k.status === "active");
  const archived = kits.filter((k) => k.status !== "active");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray">
          {kits.length} saved kit{kits.length === 1 ? "" : "s"}
        </p>
        <Link
          href="/gear/kits"
          className="text-sm font-medium text-primary hover:underline"
        >
          Build a new kit →
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-700 text-sm rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      <Section title="Active">
        {active.length === 0 ? (
          <EmptyState message="No active kit. Start one in Gear → Kits." />
        ) : (
          <ul className="space-y-3">
            {active.map((kit) => (
              <KitRow
                key={kit.kitId}
                kit={kit}
                busy={busyId === kit.kitId}
                onPublishToggle={() => handlePublishToggle(kit)}
                onDelete={() => handleDelete(kit)}
              />
            ))}
          </ul>
        )}
      </Section>

      {archived.length > 0 && (
        <Section title="Archived & complete">
          <ul className="space-y-3">
            {archived.map((kit) => (
              <KitRow
                key={kit.kitId}
                kit={kit}
                busy={busyId === kit.kitId}
                onPublishToggle={() => handlePublishToggle(kit)}
                onDelete={() => handleDelete(kit)}
              />
            ))}
          </ul>
        </Section>
      )}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6">
      <h2 className="text-sm font-medium text-gray uppercase tracking-wider mb-4">{title}</h2>
      {children}
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="text-center py-8 text-sm text-gray">
      <Package className="w-10 h-10 mx-auto mb-3 text-gray-300" />
      {message}
    </div>
  );
}

function KitRow({
  kit,
  busy,
  onPublishToggle,
  onDelete,
}: {
  kit: SavedKit;
  busy: boolean;
  onPublishToggle: () => void;
  onDelete: () => void;
}) {
  return (
    <li className="border border-gray-100 rounded-lg p-4 flex flex-col sm:flex-row gap-4">
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2 flex-wrap">
          <p className="font-semibold text-dark">{kit.kitTitle}</p>
          <span className="text-xs text-gray">{kit.kitSubtitle}</span>
        </div>
        <p className="text-sm text-gray mt-1">
          {kit.raceDetails.distance} · {kit.items.length} items · {formatPrice(kit.totalCost)}
        </p>
        <p className="text-xs text-gray mt-1">
          Updated {formatDate(kit.lastModified || kit.createdAt)}
          {kit.publicShare && (
            <>
              {" · "}
              <Link
                href={`/gear/race-day-kit/${kit.publicShare.slug}`}
                className="text-primary hover:underline inline-flex items-center gap-1"
              >
                Public
                <ExternalLink className="w-3 h-3" />
              </Link>
            </>
          )}
        </p>
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        <Link
          href={`/gear/kits?kitId=${encodeURIComponent(kit.kitId)}`}
          className="px-3 py-1.5 border border-gray-200 text-xs font-medium text-dark rounded-lg hover:bg-gray-50"
        >
          Open
        </Link>
        <button
          onClick={onPublishToggle}
          disabled={busy}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors disabled:opacity-50 ${
            kit.publicShare
              ? "border border-gray-200 text-dark hover:bg-gray-50"
              : "bg-primary text-white hover:bg-primary/90"
          }`}
        >
          {busy ? "..." : kit.publicShare ? "Unpublish" : "Publish"}
        </button>
        <button
          onClick={onDelete}
          disabled={busy}
          className="p-1.5 text-gray hover:text-red-600"
          title="Delete kit"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </li>
  );
}
