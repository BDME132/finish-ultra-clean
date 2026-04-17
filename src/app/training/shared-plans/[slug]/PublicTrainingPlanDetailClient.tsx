"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  ChevronDown,
  Clock3,
  Flag,
  UserRound,
} from "lucide-react";
import {
  formatTrainingDistanceLabel,
  formatTrainingLevelLabel,
} from "@/lib/public-training-plans";
import type { PublicTrainingPlan } from "@/lib/training-types";

type PublicTrainingPlanDetailClientProps = {
  plan: PublicTrainingPlan;
};

export default function PublicTrainingPlanDetailClient({ plan }: PublicTrainingPlanDetailClientProps) {
  const [openWeek, setOpenWeek] = useState<number>(plan.weeks[0]?.weekNumber ?? 1);
  const showRaceName = Boolean(plan.raceName && plan.raceName !== plan.planTitle);

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
            href="/training/shared-plans"
            className="inline-flex items-center gap-2 text-sm font-medium text-white/80 hover:text-white mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Shared Plans
          </Link>

          <div className="flex flex-wrap items-center gap-2 mb-5">
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
              {formatTrainingDistanceLabel(plan.distance)}
            </span>
            <span className="rounded-full bg-accent/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-accent">
              {formatTrainingLevelLabel(plan.level)}
            </span>
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
              {plan.weeksTotal} weeks
            </span>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1.3fr,0.8fr]">
            <div>
              <h1 className="font-headline text-4xl sm:text-5xl font-bold text-white mb-4">
                {plan.planTitle}
              </h1>
              <p className="text-lg text-gray-300 max-w-3xl leading-relaxed">
                Public training schedule shared by {plan.authorDisplayName}. Use it to study structure, then build a private version tuned to your own race.
              </p>

              <div className="flex flex-wrap gap-x-6 gap-y-3 mt-6 text-sm text-gray-300">
                <span className="inline-flex items-center gap-2">
                  <UserRound className="w-4 h-4 text-accent" />
                  {plan.authorDisplayName}
                </span>
                <span className="inline-flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-accent" />
                  Race date {new Date(plan.raceDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
                <span className="inline-flex items-center gap-2">
                  <Clock3 className="w-4 h-4 text-accent" />
                  Updated {new Date(plan.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </span>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-300 mb-2">Plan Snapshot</p>
              <div className="space-y-3 text-sm text-white">
                {showRaceName && (
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-gray-300">Race</span>
                    <span>{plan.raceName}</span>
                  </div>
                )}
                <div className="flex items-center justify-between gap-3">
                  <span className="text-gray-300">Starting volume</span>
                  <span>{plan.currentWeeklyMiles} miles/week</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-gray-300">Weeks</span>
                  <span>{plan.weeksTotal}</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-gray-300">Longest planned run</span>
                  <span>{Math.max(...plan.weeks.map((week) => week.longRun), 0)} miles</span>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-3">
                <Link
                  href="/training/plans"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-white hover:bg-orange-600 transition-colors"
                >
                  Build Your Own Plan
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-gray-300">
                  This shared page only includes the scheduled plan. Workout logs, gear prep, nutrition notes, and checklist tracking stay private.
                </div>
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
              <p className="font-headline text-xl font-bold text-dark">{formatTrainingDistanceLabel(plan.distance)}</p>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray mb-2">Level</p>
              <p className="font-headline text-xl font-bold text-dark">{formatTrainingLevelLabel(plan.level)}</p>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray mb-2">Weeks</p>
              <p className="font-headline text-xl font-bold text-dark">{plan.weeksTotal}</p>
            </div>
          </div>

          <div className="space-y-4">
            {plan.weeks.map((week) => {
              const isOpen = openWeek === week.weekNumber;
              return (
                <article key={week.weekNumber} className="rounded-3xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                  <button
                    onClick={() => setOpenWeek(isOpen ? -1 : week.weekNumber)}
                    className="flex w-full items-center justify-between gap-4 p-5 text-left hover:bg-gray-50 transition-colors"
                  >
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
                          Week {week.weekNumber}
                        </span>
                        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-dark">
                          {week.phase}
                        </span>
                        {week.isRecovery && (
                          <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-green-700">
                            Recovery
                          </span>
                        )}
                      </div>
                      <h2 className="font-headline text-2xl font-bold text-dark mb-1">{week.startDate} to {week.endDate}</h2>
                      <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray">
                        <span>{week.totalMiles} total miles</span>
                        <span>{week.longRun} mile long run</span>
                        {week.b2b > 0 && <span>{week.b2b} mile back-to-back</span>}
                      </div>
                    </div>
                    <ChevronDown className={`w-5 h-5 text-gray transition-transform ${isOpen ? "rotate-180" : ""}`} />
                  </button>

                  {isOpen && (
                    <div className="border-t border-gray-100 p-5 space-y-5">
                      <div className="grid gap-3 md:grid-cols-2">
                        {week.days.map((day) => (
                          <div key={`${week.weekNumber}-${day.day}`} className="rounded-2xl border border-gray-200 bg-light p-4">
                            <div className="flex items-start justify-between gap-3 mb-2">
                              <div>
                                <p className="text-xs font-semibold uppercase tracking-wide text-gray mb-1">{day.day}</p>
                                <p className="font-headline font-bold text-dark text-lg">{day.workout}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-semibold text-primary">{day.distance}</p>
                                {day.effort !== "—" && <p className="text-xs text-gray">{day.effort}</p>}
                              </div>
                            </div>
                            {day.notes && (
                              <p className="text-sm text-gray leading-relaxed">{day.notes}</p>
                            )}
                          </div>
                        ))}
                      </div>

                      {week.goals.length > 0 && (
                        <div className="rounded-2xl border border-primary/15 bg-primary/5 p-4">
                          <div className="flex items-center gap-2 mb-3">
                            <Flag className="w-4 h-4 text-primary" />
                            <p className="text-xs font-semibold uppercase tracking-wide text-primary">Weekly goals</p>
                          </div>
                          <div className="space-y-2">
                            {week.goals.map((goal, index) => (
                              <div key={`${week.weekNumber}-goal-${index}`} className="text-sm text-dark">
                                {goal}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
