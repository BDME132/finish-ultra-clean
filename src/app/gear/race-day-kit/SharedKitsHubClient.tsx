"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Compass, Filter, Globe2, Sparkles, Users } from "lucide-react";
import { loadPublicKits } from "@/lib/public-kit-sync";
import {
  formatBudgetLabel,
  formatDistanceLabel,
  formatTerrainLabel,
  PUBLIC_KIT_SORT_OPTIONS,
} from "@/lib/public-kits";
import type { PublicKit, PublicKitFilters } from "@/lib/kit-types";

const DISTANCE_OPTIONS = [
  { value: "", label: "All distances" },
  { value: "50k", label: "50K" },
  { value: "50m", label: "50 Miles" },
  { value: "100k", label: "100K" },
  { value: "100m", label: "100 Miles" },
];

const TERRAIN_OPTIONS = [
  { value: "", label: "All terrain" },
  { value: "mountain", label: "Mountain" },
  { value: "desert", label: "Desert" },
  { value: "forest", label: "Forest" },
  { value: "road", label: "Road / Mixed" },
];

const BUDGET_OPTIONS = [
  { value: "", label: "All budgets" },
  { value: "budget", label: "Budget" },
  { value: "standard", label: "Balanced" },
  { value: "premium", label: "Performance" },
  { value: "elite", label: "Elite" },
];

type SharedKitsHubClientProps = {
  initialKits: PublicKit[];
};

export default function SharedKitsHubClient({ initialKits }: SharedKitsHubClientProps) {
  const [filters, setFilters] = useState<PublicKitFilters>({ sort: "newest" });
  const [kits, setKits] = useState<PublicKit[]>(initialKits);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const initialRender = useRef(true);

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
      return;
    }

    let cancelled = false;
    setIsLoading(true);
    setLoadError(null);

    async function run() {
      const nextKits = await loadPublicKits(filters);
      if (cancelled) return;

      setKits(nextKits);
      setIsLoading(false);

      if (nextKits.length === 0) {
        setLoadError(null);
      }
    }

    run().catch(() => {
      if (cancelled) return;
      setLoadError("Couldn’t load shared kits right now.");
      setIsLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [filters]);

  function updateFilter<Key extends keyof PublicKitFilters>(key: Key, value: PublicKitFilters[Key]) {
    setFilters((prev) => ({
      ...prev,
      [key]: value || undefined,
    }));
  }

  function resetFilters() {
    setFilters({ sort: "newest" });
    setKits(initialKits);
    setLoadError(null);
  }

  return (
    <>
      <section className="bg-dark py-20 sm:py-24 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle at 15% 20%, rgba(255,107,0,0.55) 0%, transparent 34%), radial-gradient(circle at 80% 10%, rgba(37,99,235,0.45) 0%, transparent 28%), radial-gradient(circle at 80% 80%, rgba(255,255,255,0.12) 0%, transparent 24%)",
          }}
        />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white mb-6">
              <Globe2 className="w-4 h-4 text-accent" />
              Shared Kits
            </div>
            <h1 className="font-headline text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-5">
              See What Other Runners
              <br />
              <span className="text-accent">Are Actually Carrying</span>
            </h1>
            <p className="text-lg text-gray-300 max-w-2xl leading-relaxed">
              Browse public kits built by the FinishUltra community. Study how other runners solve distance, terrain, weather, and budget, then load any setup into your own builder.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 mt-10">
            {[
              {
                icon: <Users className="w-5 h-5 text-accent" />,
                title: "Real Runner Setups",
                body: "These are user-built kits, not static editorial checklists.",
              },
              {
                icon: <Compass className="w-5 h-5 text-accent" />,
                title: "Find Similar Conditions",
                body: "Filter by distance, terrain, and budget to study relevant ideas.",
              },
              {
                icon: <Sparkles className="w-5 h-5 text-accent" />,
                title: "Load Into Your Builder",
                body: "Use any public kit as a starting point, then adapt it to your own race.",
              },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-3">
                  {item.icon}
                  <p className="text-sm font-semibold text-white">{item.title}</p>
                </div>
                <p className="text-sm text-gray-300 leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="-mt-10 pb-6 relative z-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-gray-200 bg-white shadow-xl p-5 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-primary" />
                <p className="text-sm font-semibold text-dark">Filter the shared kit feed</p>
              </div>
              <button
                onClick={resetFilters}
                className="text-sm font-medium text-primary hover:underline"
              >
                Reset filters
              </button>
            </div>
            <div className="grid gap-3 md:grid-cols-4">
              <label className="text-sm">
                <span className="block text-xs font-semibold uppercase tracking-wide text-gray mb-2">Distance</span>
                <select
                  value={filters.distance ?? ""}
                  onChange={(event) => updateFilter("distance", event.target.value || undefined)}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-dark focus:outline-none focus:border-primary"
                >
                  {DISTANCE_OPTIONS.map((option) => (
                    <option key={option.label} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </label>

              <label className="text-sm">
                <span className="block text-xs font-semibold uppercase tracking-wide text-gray mb-2">Terrain</span>
                <select
                  value={filters.terrain ?? ""}
                  onChange={(event) => updateFilter("terrain", event.target.value || undefined)}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-dark focus:outline-none focus:border-primary"
                >
                  {TERRAIN_OPTIONS.map((option) => (
                    <option key={option.label} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </label>

              <label className="text-sm">
                <span className="block text-xs font-semibold uppercase tracking-wide text-gray mb-2">Budget</span>
                <select
                  value={filters.budget ?? ""}
                  onChange={(event) => updateFilter("budget", event.target.value || undefined)}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-dark focus:outline-none focus:border-primary"
                >
                  {BUDGET_OPTIONS.map((option) => (
                    <option key={option.label} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </label>

              <label className="text-sm">
                <span className="block text-xs font-semibold uppercase tracking-wide text-gray mb-2">Sort</span>
                <select
                  value={filters.sort ?? "newest"}
                  onChange={(event) => updateFilter("sort", event.target.value as PublicKitFilters["sort"])}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-dark focus:outline-none focus:border-primary"
                >
                  {PUBLIC_KIT_SORT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </label>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-16 sm:pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-3 mb-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-primary mb-2">Community Feed</p>
              <h2 className="font-headline text-2xl sm:text-3xl font-bold text-dark">
                {isLoading ? "Refreshing shared kits..." : `${kits.length} shared kit${kits.length === 1 ? "" : "s"} found`}
              </h2>
            </div>
            <Link
              href="/gear/kits"
              className="inline-flex items-center gap-2 rounded-xl border border-primary/20 bg-primary/5 px-4 py-2.5 text-sm font-semibold text-primary hover:bg-primary/10 transition-colors"
            >
              Build Your Own Kit
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loadError && (
            <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
              {loadError}
            </div>
          )}

          {kits.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-gray-300 bg-light px-6 py-12 text-center">
              <p className="font-headline text-2xl font-bold text-dark mb-3">No shared kits match those filters yet.</p>
              <p className="text-sm text-gray max-w-xl mx-auto mb-6">
                Try a broader filter set, or build your own kit and publish it to seed the community feed.
              </p>
              <Link
                href="/gear/kits"
                className="inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-white hover:bg-orange-600 transition-colors"
              >
                Build a Custom Kit
              </Link>
            </div>
          ) : (
            <div className="grid gap-6 lg:grid-cols-2">
              {kits.map((kit) => (
                <article key={kit.id} className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
                      {formatDistanceLabel(kit.raceDetails.distance)}
                    </span>
                    <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-accent">
                      {formatBudgetLabel(kit.raceDetails.budget)}
                    </span>
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-dark">
                      {formatTerrainLabel(kit.raceDetails.terrain)}
                    </span>
                  </div>

                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <h3 className="font-headline text-2xl font-bold text-dark mb-1">{kit.kitTitle}</h3>
                      <p className="text-sm text-gray leading-relaxed">{kit.kitSubtitle}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs uppercase tracking-wide text-gray">Estimated Cost</p>
                      <p className="text-xl font-bold text-primary">${kit.totalCost.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray mb-5">
                    <span>By {kit.authorDisplayName}</span>
                    <span>{kit.items.length} items</span>
                    <span>Updated {new Date(kit.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                  </div>

                  <div className="rounded-2xl border border-gray-100 bg-light p-4 mb-5">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray mb-3">What stands out</p>
                    <div className="flex flex-wrap gap-2">
                      {kit.items.slice(0, 4).map((item) => (
                        <span
                          key={`${kit.slug}-${item.category}-${item.product}`}
                          className="rounded-full bg-white px-3 py-1.5 text-xs font-medium text-dark border border-gray-200"
                        >
                          {item.category}: {item.brand} {item.product}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <Link
                      href={`/gear/race-day-kit/${kit.slug}`}
                      className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
                    >
                      View Shared Kit
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                    <Link
                      href={`/gear/kits?publicKit=${encodeURIComponent(kit.slug)}`}
                      className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-dark hover:bg-gray-50 transition-colors"
                    >
                      Load in Builder
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
