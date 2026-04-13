"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, ArrowRight, Calendar, Clock3, Globe2, Package, UserRound } from "lucide-react";
import {
  formatBudgetLabel,
  formatDistanceLabel,
  formatTerrainLabel,
} from "@/lib/public-kits";
import type { PublicKit } from "@/lib/kit-types";

type PublicKitDetailClientProps = {
  kit: PublicKit;
};

type DetailTab = "gear" | "packing" | "dropbag" | "timeline";

const DETAIL_TABS: { id: DetailTab; label: string }[] = [
  { id: "gear", label: "Gear List" },
  { id: "packing", label: "Packing" },
  { id: "dropbag", label: "Drop Bags" },
  { id: "timeline", label: "Testing Plan" },
];

export default function PublicKitDetailClient({ kit }: PublicKitDetailClientProps) {
  const [activeTab, setActiveTab] = useState<DetailTab>("gear");

  const groupedItems = kit.items.reduce<Record<string, PublicKit["items"]>>((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {});

  return (
    <>
      <section className="bg-dark py-16 sm:py-20 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle at 15% 20%, rgba(255,107,0,0.55) 0%, transparent 34%), radial-gradient(circle at 80% 20%, rgba(37,99,235,0.4) 0%, transparent 28%)",
          }}
        />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Link
            href="/gear/race-day-kit"
            className="inline-flex items-center gap-2 text-sm font-medium text-white/80 hover:text-white mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Shared Kits
          </Link>

          <div className="flex flex-wrap items-center gap-2 mb-5">
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
              {formatDistanceLabel(kit.raceDetails.distance)}
            </span>
            <span className="rounded-full bg-accent/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-accent">
              {formatBudgetLabel(kit.raceDetails.budget)}
            </span>
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
              {formatTerrainLabel(kit.raceDetails.terrain)}
            </span>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1.3fr,0.8fr]">
            <div>
              <h1 className="font-headline text-4xl sm:text-5xl font-bold text-white mb-4">
                {kit.kitTitle}
              </h1>
              <p className="text-lg text-gray-300 max-w-3xl leading-relaxed">
                {kit.kitSubtitle}
              </p>

              <div className="flex flex-wrap gap-x-6 gap-y-3 mt-6 text-sm text-gray-300">
                <span className="inline-flex items-center gap-2">
                  <UserRound className="w-4 h-4 text-accent" />
                  {kit.authorDisplayName}
                </span>
                <span className="inline-flex items-center gap-2">
                  <Package className="w-4 h-4 text-accent" />
                  {kit.items.length} items
                </span>
                <span className="inline-flex items-center gap-2">
                  <Clock3 className="w-4 h-4 text-accent" />
                  Updated {new Date(kit.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </span>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-300 mb-2">Race Snapshot</p>
              <div className="space-y-3 text-sm text-white">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-gray-300">Estimated total</span>
                  <span className="font-bold text-accent text-xl">${kit.totalCost.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-gray-300">Night sections</span>
                  <span>{kit.raceDetails.night === "yes" ? "Yes" : "No"}</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-gray-300">Temperature</span>
                  <span className="capitalize">{kit.raceDetails.temp}</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-gray-300">Priority</span>
                  <span className="capitalize">{kit.raceDetails.priority}</span>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-3">
                <Link
                  href={`/gear/kits?publicKit=${encodeURIComponent(kit.slug)}`}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-white hover:bg-orange-600 transition-colors"
                >
                  Load in Builder
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/gear/kits"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
                >
                  Build From Scratch
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-4 sm:grid-cols-3 mb-8">
            <div className="rounded-2xl border border-gray-200 bg-white p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray mb-2">Distance</p>
              <p className="font-headline text-xl font-bold text-dark">{formatDistanceLabel(kit.raceDetails.distance)}</p>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray mb-2">Terrain</p>
              <p className="font-headline text-xl font-bold text-dark">{formatTerrainLabel(kit.raceDetails.terrain)}</p>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray mb-2">Budget</p>
              <p className="font-headline text-xl font-bold text-dark">{formatBudgetLabel(kit.raceDetails.budget)}</p>
            </div>
          </div>

          <div className="rounded-3xl border border-gray-200 bg-white p-4 sm:p-6 shadow-sm">
            <div className="flex gap-1 bg-light rounded-xl p-1 mb-6">
              {DETAIL_TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 rounded-lg px-3 py-2 text-xs font-semibold transition-colors ${
                    activeTab === tab.id ? "bg-white text-dark shadow-sm" : "text-gray hover:text-dark"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {activeTab === "gear" && (
              <div className="space-y-6">
                {Object.entries(groupedItems).map(([category, items]) => (
                  <div key={category}>
                    <h2 className="font-headline text-xl font-bold text-dark mb-3">{category}</h2>
                    <div className="space-y-3">
                      {items.map((item) => (
                        <div key={`${category}-${item.product}`} className="rounded-2xl border border-gray-200 bg-light p-4">
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <div>
                              <p className="font-headline font-bold text-dark text-base">{item.brand} {item.product}</p>
                              <p className="text-xs text-gray">{item.category}</p>
                            </div>
                            <span className="text-sm font-bold text-primary">${item.price}</span>
                          </div>
                          <p className="text-sm text-gray leading-relaxed mb-3">{item.why}</p>
                          <div className="flex flex-wrap gap-2">
                            {item.specs.map((spec) => (
                              <span
                                key={`${item.product}-${spec}`}
                                className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-dark"
                              >
                                {spec}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "packing" && (
              <div className="space-y-3">
                {kit.packingChecklist.map((item) => (
                  <div key={item} className="flex items-start gap-3 rounded-2xl border border-gray-200 bg-light px-4 py-3">
                    <Calendar className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-dark">{item}</span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "dropbag" && (
              <div className="space-y-3">
                {kit.dropBagEssentials.map((item) => (
                  <div key={item} className="flex items-start gap-3 rounded-2xl border border-gray-200 bg-light px-4 py-3">
                    <Globe2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-dark">{item}</span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "timeline" && (
              <div className="space-y-3">
                {kit.testingTimeline.map((item, index) => (
                  <div key={`${item}-${index}`} className="flex items-start gap-3 rounded-2xl border border-gray-200 bg-light px-4 py-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-white shrink-0 mt-0.5">
                      {index + 1}
                    </div>
                    <span className="text-sm text-dark">{item}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
