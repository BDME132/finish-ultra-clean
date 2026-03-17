"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";
import { loadPlan } from "@/lib/training-sync";
import { getMyKit } from "@/lib/supabase/kits";
import { hasSupabaseBrowserEnv } from "@/lib/supabase/client";
import type { SavedPlan } from "@/lib/training-types";
import type { KitSummary } from "@/types/gear";

function weeksUntil(dateStr: string): number {
  return Math.ceil(
    (new Date(dateStr + "T00:00:00").getTime() - Date.now()) /
      (7 * 24 * 60 * 60 * 1000)
  );
}

function formatDate(dateStr: string): string {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// ─── Skeleton card ──────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 animate-pulse">
      <div className="h-4 bg-gray-100 rounded w-1/3 mb-4" />
      <div className="h-7 bg-gray-100 rounded w-2/3 mb-3" />
      <div className="h-4 bg-gray-100 rounded w-1/2 mb-6" />
      <div className="h-2 bg-gray-100 rounded-full mb-6" />
      <div className="h-10 bg-gray-100 rounded-xl" />
    </div>
  );
}

// ─── Training Plan card ─────────────────────────────────────────────────────

function PlanCard({ plan }: { plan: SavedPlan }) {
  const totalWorkouts = plan.weeks.reduce((sum, w) => sum + w.days.length, 0);
  const completedCount = Object.keys(plan.completedWorkouts).length;
  const progressPct = totalWorkouts > 0 ? Math.round((completedCount / totalWorkouts) * 100) : 0;
  const weeks = weeksUntil(plan.raceDate);
  const isPast = weeks <= 0;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col gap-5">
      <div>
        <p className="text-[11px] font-semibold text-gray uppercase tracking-wider mb-1">Training Plan</p>
        <h2 className="font-headline text-xl font-bold text-dark">{plan.raceName || `${plan.distance} Plan`}</h2>
        <p className="text-sm text-gray mt-1">{capitalize(plan.level)} · {plan.distance} · {plan.weeksTotal} weeks</p>
      </div>

      {/* Race date */}
      <div className="flex items-center gap-2">
        <span className="text-lg">🏁</span>
        <div>
          <p className="text-xs text-gray">Race day</p>
          <p className="text-sm font-semibold text-dark">
            {formatDate(plan.raceDate)}
            {!isPast && <span className="ml-2 text-primary font-medium">({weeks} week{weeks !== 1 ? "s" : ""} away)</span>}
            {isPast && <span className="ml-2 text-gray font-normal">(completed)</span>}
          </p>
        </div>
      </div>

      {/* Workout progress */}
      <div>
        <div className="flex justify-between text-xs text-gray mb-1.5">
          <span>Workouts completed</span>
          <span className="font-semibold text-dark">{completedCount} / {totalWorkouts}</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        {completedCount > 0 && (
          <p className="text-xs text-gray mt-1">{progressPct}% complete</p>
        )}
      </div>

      <Link
        href="/training/dashboard"
        className="mt-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary/90 transition-colors"
      >
        Go to Training Dashboard
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </Link>
    </div>
  );
}

function EmptyPlanCard() {
  return (
    <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-6 flex flex-col items-center justify-center text-center gap-4 min-h-[260px]">
      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-2xl">
        📋
      </div>
      <div>
        <h3 className="font-headline text-lg font-bold text-dark">No training plan yet</h3>
        <p className="text-sm text-gray mt-1 leading-relaxed">
          Build a custom plan for your race distance and fitness level.
        </p>
      </div>
      <Link
        href="/training/plans"
        className="px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary/90 transition-colors"
      >
        Build Your Training Plan
      </Link>
    </div>
  );
}

// ─── Kit card ───────────────────────────────────────────────────────────────

function KitCard({ kitSummary }: { kitSummary: KitSummary }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col gap-5">
      <div>
        <p className="text-[11px] font-semibold text-gray uppercase tracking-wider mb-1">Gear Kit</p>
        <h2 className="font-headline text-xl font-bold text-dark">{kitSummary.title}</h2>
        <p className="text-sm text-gray mt-1">{kitSummary.subtitle}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-light rounded-xl p-3 text-center">
          <p className="text-lg font-bold text-dark">{kitSummary.totalItems}</p>
          <p className="text-[11px] text-gray">Items</p>
        </div>
        <div className="bg-light rounded-xl p-3 text-center">
          <p className="text-lg font-bold text-dark">{kitSummary.categories.length}</p>
          <p className="text-[11px] text-gray">Categories</p>
        </div>
        <div className="bg-light rounded-xl p-3 text-center">
          <p className="text-lg font-bold text-dark">${kitSummary.totalCost.toLocaleString()}</p>
          <p className="text-[11px] text-gray">Est. cost</p>
        </div>
      </div>

      {/* Categories list */}
      <div className="flex flex-wrap gap-1.5">
        {kitSummary.categories.map((cat) => (
          <span
            key={cat}
            className="inline-block bg-primary/5 text-primary text-xs font-medium px-2.5 py-1 rounded-full border border-primary/10"
          >
            {cat}
          </span>
        ))}
      </div>

      <Link
        href="/gear/kits"
        className="mt-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-primary text-primary text-sm font-semibold rounded-xl hover:bg-primary hover:text-white transition-colors"
      >
        View &amp; Rebuild Kit
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </Link>
    </div>
  );
}

function EmptyKitCard() {
  return (
    <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-6 flex flex-col items-center justify-center text-center gap-4 min-h-[260px]">
      <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-2xl">
        🎒
      </div>
      <div>
        <h3 className="font-headline text-lg font-bold text-dark">No gear kit yet</h3>
        <p className="text-sm text-gray mt-1 leading-relaxed">
          Answer 10 questions and get a personalized gear list for your exact race.
        </p>
      </div>
      <Link
        href="/gear/kits"
        className="px-5 py-2.5 border border-primary text-primary text-sm font-semibold rounded-xl hover:bg-primary hover:text-white transition-colors"
      >
        Build Your Kit
      </Link>
    </div>
  );
}

// ─── Main component ─────────────────────────────────────────────────────────

export default function RaceHQClient() {
  const { user, isLoading: authLoading } = useAuth();
  const [plan, setPlan] = useState<SavedPlan | null>(null);
  const [kitSummary, setKitSummary] = useState<KitSummary | null>(null);
  const [loaded, setLoaded] = useState(false);
  const isSupabaseConfigured = hasSupabaseBrowserEnv();

  useEffect(() => {
    if (authLoading) return;
    if (!user) return;

    async function load() {
      const [savedPlan, savedKit] = await Promise.all([
        loadPlan(user!),
        getMyKit(user!.id),
      ]);
      setPlan(savedPlan);
      setKitSummary(savedKit?.kit_summary ?? null);
      setLoaded(true);
    }

    load();
  }, [user, authLoading]);

  const displayName =
    user?.user_metadata?.full_name?.split(" ")[0] ||
    user?.email?.split("@")[0] ||
    "";

  if (!isSupabaseConfigured) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <p className="text-gray text-sm">
          Add Supabase environment variables to enable Race HQ.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Header strip */}
      <div className="bg-dark px-4 sm:px-6 lg:px-8 py-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-headline text-3xl sm:text-4xl font-bold text-white">
            {displayName ? `${displayName}'s Race HQ` : "Race HQ"}
          </h1>
          <p className="text-gray-400 text-sm mt-2">Your training command center</p>
        </div>
      </div>

      {/* Cards */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {!loaded ? (
          <div className="grid md:grid-cols-2 gap-6">
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 gap-6">
              {plan ? <PlanCard plan={plan} /> : <EmptyPlanCard />}
              {kitSummary ? <KitCard kitSummary={kitSummary} /> : <EmptyKitCard />}
            </div>

            {/* Footer links */}
            <div className="mt-8 flex flex-wrap gap-4 text-sm text-gray">
              <Link href="/training/plans" className="hover:text-primary transition-colors">
                Build a training plan
              </Link>
              <span>·</span>
              <Link href="/gear/kits" className="hover:text-primary transition-colors">
                Build a gear kit
              </Link>
              <span>·</span>
              <Link href="/training/dashboard" className="hover:text-primary transition-colors">
                Training dashboard
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
