"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, CalendarDays, Filter, Globe2, ListTree, Users } from "lucide-react";
import { loadPublicTrainingPlans } from "@/lib/public-training-plan-sync";
import {
  formatTrainingDistanceLabel,
  formatTrainingLevelLabel,
  PUBLIC_TRAINING_PLAN_SORT_OPTIONS,
} from "@/lib/public-training-plans";
import type { PublicTrainingPlan, PublicTrainingPlanFilters } from "@/lib/training-types";

const DISTANCE_OPTIONS = [
  { value: "", label: "All distances" },
  { value: "50K", label: "50K" },
  { value: "50M", label: "50 Miles" },
  { value: "100K", label: "100K" },
  { value: "100M", label: "100 Miles" },
];

const LEVEL_OPTIONS = [
  { value: "", label: "All levels" },
  { value: "foundation", label: "Foundation" },
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
  { value: "competitive", label: "Competitive" },
];

type SharedPlansHubClientProps = {
  initialPlans: PublicTrainingPlan[];
};

export default function SharedPlansHubClient({ initialPlans }: SharedPlansHubClientProps) {
  const [filters, setFilters] = useState<PublicTrainingPlanFilters>({ sort: "newest" });
  const [plans, setPlans] = useState<PublicTrainingPlan[]>(initialPlans);
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
      const nextPlans = await loadPublicTrainingPlans(filters);
      if (cancelled) return;

      setPlans(nextPlans);
      setIsLoading(false);
    }

    run().catch(() => {
      if (cancelled) return;
      setLoadError("Couldn’t load shared plans right now.");
      setIsLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [filters]);

  function updateFilter<Key extends keyof PublicTrainingPlanFilters>(
    key: Key,
    value: PublicTrainingPlanFilters[Key],
  ) {
    setFilters((prev) => ({
      ...prev,
      [key]: value || undefined,
    }));
  }

  function resetFilters() {
    setFilters({ sort: "newest" });
    setPlans(initialPlans);
    setLoadError(null);
  }

  return (
    <>
      <section className="bg-dark py-20 sm:py-24 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle at 15% 20%, rgba(255,107,0,0.5) 0%, transparent 34%), radial-gradient(circle at 82% 18%, rgba(37,99,235,0.38) 0%, transparent 28%), radial-gradient(circle at 70% 80%, rgba(255,255,255,0.12) 0%, transparent 24%)",
          }}
        />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white mb-6">
              <Globe2 className="w-4 h-4 text-accent" />
              Shared Plans
            </div>
            <h1 className="font-headline text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-5">
              Study How Other Runners
              <br />
              <span className="text-accent">Structure Their Build</span>
            </h1>
            <p className="text-lg text-gray-300 max-w-2xl leading-relaxed">
              Browse public training schedules built inside FinishUltra. Compare distance, level, and week-to-week structure, then build your own version.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 mt-10">
            {[
              {
                icon: <Users className="w-5 h-5 text-accent" />,
                title: "Real Runner Schedules",
                body: "These are plans people actually saved and chose to share, not generic templates.",
              },
              {
                icon: <CalendarDays className="w-5 h-5 text-accent" />,
                title: "Compare Weekly Shape",
                body: "See how runners sequence long runs, recovery weeks, and build phases.",
              },
              {
                icon: <ListTree className="w-5 h-5 text-accent" />,
                title: "Use It For Inspiration",
                body: "Borrow structure, then build a private plan that fits your own race timeline.",
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
                <p className="text-sm font-semibold text-dark">Filter the shared plan feed</p>
              </div>
              <button
                onClick={resetFilters}
                className="text-sm font-medium text-primary hover:underline"
              >
                Reset filters
              </button>
            </div>
            <div className="grid gap-3 md:grid-cols-3">
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
                <span className="block text-xs font-semibold uppercase tracking-wide text-gray mb-2">Level</span>
                <select
                  value={filters.level ?? ""}
                  onChange={(event) => updateFilter("level", event.target.value || undefined)}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-dark focus:outline-none focus:border-primary"
                >
                  {LEVEL_OPTIONS.map((option) => (
                    <option key={option.label} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </label>

              <label className="text-sm">
                <span className="block text-xs font-semibold uppercase tracking-wide text-gray mb-2">Sort</span>
                <select
                  value={filters.sort ?? "newest"}
                  onChange={(event) => updateFilter("sort", event.target.value as PublicTrainingPlanFilters["sort"])}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-dark focus:outline-none focus:border-primary"
                >
                  {PUBLIC_TRAINING_PLAN_SORT_OPTIONS.map((option) => (
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
                {isLoading ? "Refreshing shared plans..." : `${plans.length} shared plan${plans.length === 1 ? "" : "s"} found`}
              </h2>
            </div>
            <Link
              href="/training/plans"
              className="inline-flex items-center gap-2 rounded-xl border border-primary/20 bg-primary/5 px-4 py-2.5 text-sm font-semibold text-primary hover:bg-primary/10 transition-colors"
            >
              Build Your Own Plan
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loadError && (
            <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
              {loadError}
            </div>
          )}

          {plans.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-gray-300 bg-light px-6 py-12 text-center">
              <p className="font-headline text-2xl font-bold text-dark mb-3">No shared plans match those filters yet.</p>
              <p className="text-sm text-gray max-w-xl mx-auto mb-6">
                Try a broader filter set, or build your own plan and publish it to seed the community feed.
              </p>
              <Link
                href="/training/plans"
                className="inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-white hover:bg-orange-600 transition-colors"
              >
                Build a Custom Plan
              </Link>
            </div>
          ) : (
            <div className="grid gap-6 lg:grid-cols-2">
              {plans.map((plan) => (
                <article key={plan.id} className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
                      {formatTrainingDistanceLabel(plan.distance)}
                    </span>
                    <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-accent">
                      {formatTrainingLevelLabel(plan.level)}
                    </span>
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-dark">
                      {plan.weeksTotal} weeks
                    </span>
                  </div>

                  <div className="mb-3">
                    <h3 className="font-headline text-2xl font-bold text-dark mb-1">{plan.planTitle}</h3>
                    <p className="text-sm text-gray leading-relaxed">
                      Race date {new Date(plan.raceDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })} · Starts from {plan.currentWeeklyMiles} weekly miles
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray mb-5">
                    <span>By {plan.authorDisplayName}</span>
                    <span>{plan.weeks.length} scheduled weeks</span>
                    <span>Updated {new Date(plan.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                  </div>

                  <div className="rounded-2xl border border-gray-100 bg-light p-4 mb-5">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray mb-3">First week snapshot</p>
                    <div className="space-y-2">
                      {plan.weeks[0]?.days.slice(0, 3).map((day) => (
                        <div key={`${plan.slug}-${day.day}`} className="flex items-center justify-between gap-3 text-sm">
                          <span className="font-medium text-dark">{day.day}</span>
                          <span className="text-gray text-right">{day.workout}{day.distance !== "—" ? ` · ${day.distance}` : ""}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <Link
                      href={`/training/shared-plans/${plan.slug}`}
                      className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
                    >
                      View Shared Plan
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                    <Link
                      href="/training/plans"
                      className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-dark hover:bg-gray-50 transition-colors"
                    >
                      Build Your Own Plan
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
