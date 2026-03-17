"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  SavedPlan,
  CompletedWorkout,
  GearTrackingItem,
  NutritionProduct,
  loadSavedPlan,
  savePlan,
  PLAN_STORAGE_KEY,
} from "@/lib/training-types";

type Tab = "today" | "week" | "progress" | "gear" | "nutrition" | "raceday";

const TAB_LABELS: { id: Tab; label: string; icon: string }[] = [
  { id: "today", label: "Today", icon: "🏠" },
  { id: "week", label: "Week", icon: "📅" },
  { id: "progress", label: "Progress", icon: "📊" },
  { id: "gear", label: "Gear", icon: "🎒" },
  { id: "nutrition", label: "Nutrition", icon: "⚡" },
  { id: "raceday", label: "Race Day", icon: "🏁" },
];

const FEELING_OPTIONS: { value: CompletedWorkout["feeling"]; label: string; emoji: string }[] = [
  { value: "great", label: "Great", emoji: "🔥" },
  { value: "good", label: "Good", emoji: "💪" },
  { value: "average", label: "Average", emoji: "😐" },
  { value: "tired", label: "Tired", emoji: "😮‍💨" },
  { value: "struggling", label: "Struggling", emoji: "😵" },
];

function formatDateFull(d: Date): string {
  return d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
}

export default function DashboardClient() {
  const [plan, setPlan] = useState<SavedPlan | null>(null);
  const [tab, setTab] = useState<Tab>("today");
  const [loaded, setLoaded] = useState(false);

  // Workout logging
  const [logOpen, setLogOpen] = useState(false);
  const [logWeek, setLogWeek] = useState(0);
  const [logDay, setLogDay] = useState(0);
  const [logMiles, setLogMiles] = useState("");
  const [logFeeling, setLogFeeling] = useState<CompletedWorkout["feeling"]>("good");
  const [logNotes, setLogNotes] = useState("");

  // Gear editing
  const [editGearId, setEditGearId] = useState<string | null>(null);
  const [gearNotes, setGearNotes] = useState("");
  const [gearRating, setGearRating] = useState(0);

  // Nutrition editing
  const [editNutritionId, setEditNutritionId] = useState<string | null>(null);
  const [nutritionNotes, setNutritionNotes] = useState("");
  const [nutritionRating, setNutritionRating] = useState(0);
  const [nutritionRaceUse, setNutritionRaceUse] = useState<"yes" | "maybe" | "no" | "">("");

  const isFirstRender = useRef(true);

  useEffect(() => {
    const saved = loadSavedPlan();
    setPlan(saved);
    setLoaded(true);
  }, []);

  // Save to localStorage whenever plan changes (skip first render)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (plan) savePlan(plan);
  }, [plan]);

  if (!loaded) return null;

  if (!plan) {
    return (
      <main className="py-20">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="text-6xl mb-6">📋</div>
          <h1 className="font-headline text-3xl font-bold text-dark mb-4">No Training Plan Saved</h1>
          <p className="text-gray mb-8 leading-relaxed">
            Build a custom training plan first, then save it to unlock your personal dashboard with daily workouts, gear tracking, nutrition testing, and progress analytics.
          </p>
          <Link
            href="/training/plans"
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-colors"
          >
            Build Your Training Plan
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </main>
    );
  }

  // ─── Computed values ──────────────────────────────────────────────────────
  const today = new Date();
  const raceDate = new Date(plan.raceDate);
  const daysUntilRace = Math.max(0, Math.ceil((raceDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
  const weeksUntilRace = Math.ceil(daysUntilRace / 7);

  // Find current week
  const currentWeekIndex = plan.weeks.findIndex((w) => {
    // Parse startDate like "May 27" — need to construct full date
    // The weeks have weeksToRace, so use that
    return w.weeksToRace === weeksUntilRace;
  });
  const currentWeek = currentWeekIndex >= 0 ? plan.weeks[currentWeekIndex] : plan.weeks[0];
  const currentWeekNum = currentWeek?.weekNumber ?? 1;

  // Today's day of week (0=Sun, 1=Mon...)
  const dayOfWeek = today.getDay();
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const todayDayName = dayNames[dayOfWeek];
  const todayWorkout = currentWeek?.days.find((d) => d.day === todayDayName);
  const todayDayIndex = currentWeek?.days.findIndex((d) => d.day === todayDayName) ?? -1;
  const todayKey = `w${currentWeekNum}-d${todayDayIndex}`;
  const todayCompleted = plan.completedWorkouts[todayKey];

  // Week progress
  const weekCompletedCount = currentWeek
    ? currentWeek.days.filter((_, i) => plan.completedWorkouts[`w${currentWeekNum}-d${i}`]).length
    : 0;
  const weekMilesLogged = currentWeek
    ? currentWeek.days.reduce((sum, _, i) => {
        const cw = plan.completedWorkouts[`w${currentWeekNum}-d${i}`];
        return sum + (cw?.actualMiles ?? 0);
      }, 0)
    : 0;

  // Overall progress
  const totalWorkoutsCompleted = Object.keys(plan.completedWorkouts).length;
  const totalMilesLogged = Object.values(plan.completedWorkouts).reduce((s, w) => s + w.actualMiles, 0);
  const longestRun = Math.max(0, ...Object.values(plan.completedWorkouts).map((w) => w.actualMiles));
  const totalPossibleWorkouts = plan.weeks.reduce((s, w) => s + w.days.filter((d) => d.workout !== "Rest").length, 0);

  // Gear readiness
  const gearPurchased = plan.gearItems.filter((g) => g.purchased).length;
  const gearTested = plan.gearItems.filter((g) => g.tested).length;
  const gearReadiness = plan.gearItems.length > 0 ? Math.round(((gearPurchased * 0.6 + gearTested * 0.4) / plan.gearItems.length) * 100) : 0;

  // Nutrition readiness
  const nutritionPurchased = plan.nutritionProducts.filter((n) => n.purchased).length;
  const nutritionTested = plan.nutritionProducts.filter((n) => n.tested).length;
  const nutritionReadiness = plan.nutritionProducts.length > 0 ? Math.round(((nutritionPurchased * 0.4 + nutritionTested * 0.6) / plan.nutritionProducts.length) * 100) : 0;

  // Training readiness
  const trainingReadiness = totalPossibleWorkouts > 0 ? Math.round((totalWorkoutsCompleted / totalPossibleWorkouts) * 100) : 0;

  // Overall readiness
  const overallReadiness = Math.round(trainingReadiness * 0.5 + gearReadiness * 0.25 + nutritionReadiness * 0.25);

  // ─── Handlers ──────────────────────────────────────────────────────────────
  function openWorkoutLog(weekNum: number, dayIndex: number) {
    const week = plan!.weeks.find((w) => w.weekNumber === weekNum);
    const workout = week?.days[dayIndex];
    setLogWeek(weekNum);
    setLogDay(dayIndex);
    setLogMiles(workout?.distance.replace(/[^\d.]/g, "") || "");
    setLogFeeling("good");
    setLogNotes("");
    setLogOpen(true);
  }

  function saveWorkoutLog() {
    if (!plan) return;
    const week = plan.weeks.find((w) => w.weekNumber === logWeek);
    const dayData = week?.days[logDay];
    const key = `w${logWeek}-d${logDay}`;
    const completed: CompletedWorkout = {
      weekNumber: logWeek,
      dayIndex: logDay,
      day: dayData?.day ?? "",
      plannedDistance: dayData?.distance ?? "",
      actualMiles: parseFloat(logMiles) || 0,
      feeling: logFeeling,
      notes: logNotes,
      completedAt: new Date().toISOString(),
    };
    setPlan({ ...plan, completedWorkouts: { ...plan.completedWorkouts, [key]: completed } });
    setLogOpen(false);
  }

  function markDayComplete(weekNum: number, dayIndex: number) {
    if (!plan) return;
    const week = plan.weeks.find((w) => w.weekNumber === weekNum);
    const dayData = week?.days[dayIndex];
    const key = `w${weekNum}-d${dayIndex}`;
    if (plan.completedWorkouts[key]) return; // already done
    const completed: CompletedWorkout = {
      weekNumber: weekNum,
      dayIndex,
      day: dayData?.day ?? "",
      plannedDistance: dayData?.distance ?? "",
      actualMiles: parseFloat(dayData?.distance.replace(/[^\d.]/g, "") || "0") || 0,
      feeling: "good",
      notes: "",
      completedAt: new Date().toISOString(),
    };
    setPlan({ ...plan, completedWorkouts: { ...plan.completedWorkouts, [key]: completed } });
  }

  function toggleGearPurchased(id: string) {
    if (!plan) return;
    setPlan({
      ...plan,
      gearItems: plan.gearItems.map((g) =>
        g.id === id ? { ...g, purchased: !g.purchased, purchaseDate: !g.purchased ? new Date().toISOString().split("T")[0] : undefined } : g
      ),
    });
  }

  function toggleGearTested(id: string) {
    if (!plan) return;
    setPlan({
      ...plan,
      gearItems: plan.gearItems.map((g) => (g.id === id ? { ...g, tested: !g.tested } : g)),
    });
  }

  function saveGearNotes(id: string) {
    if (!plan) return;
    setPlan({
      ...plan,
      gearItems: plan.gearItems.map((g) =>
        g.id === id ? { ...g, testingNotes: gearNotes, rating: gearRating } : g
      ),
    });
    setEditGearId(null);
  }

  function toggleNutritionPurchased(id: string) {
    if (!plan) return;
    setPlan({
      ...plan,
      nutritionProducts: plan.nutritionProducts.map((n) => (n.id === id ? { ...n, purchased: !n.purchased } : n)),
    });
  }

  function saveNutritionTest(id: string) {
    if (!plan) return;
    setPlan({
      ...plan,
      nutritionProducts: plan.nutritionProducts.map((n) =>
        n.id === id ? { ...n, tested: true, testingNotes: nutritionNotes, stomachRating: nutritionRating, wouldUseInRace: nutritionRaceUse } : n
      ),
    });
    setEditNutritionId(null);
  }

  function toggleRaceDayItem(id: string) {
    if (!plan) return;
    setPlan({
      ...plan,
      raceDayChecklist: plan.raceDayChecklist.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      ),
    });
  }

  function deletePlan() {
    if (typeof window !== "undefined") {
      localStorage.removeItem(PLAN_STORAGE_KEY);
    }
    setPlan(null);
  }

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <main className="bg-light min-h-screen">
      {/* Race countdown header */}
      <section className="bg-dark py-6 sm:py-8 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(circle at 20% 50%, #FF6B00 0%, transparent 50%), radial-gradient(circle at 80% 20%, #0066FF 0%, transparent 40%)" }}
        />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-1 flex-wrap">
                <h1 className="font-headline text-xl sm:text-2xl font-bold text-white">Training Dashboard</h1>
                <span className="text-xs font-semibold text-accent bg-accent/20 px-2.5 py-1 rounded-full">
                  {plan.distance} {plan.level}
                </span>
              </div>
              <p className="text-white/60 text-sm">
                {plan.raceName || "Race Day"}: {new Date(plan.raceDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
              </p>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="font-headline text-3xl font-bold text-accent">{daysUntilRace}</div>
                <div className="text-xs text-white/50">days to go</div>
              </div>
              <div className="text-center">
                <div className="font-headline text-3xl font-bold text-white">{weeksUntilRace}</div>
                <div className="text-xs text-white/50">weeks</div>
              </div>
              <div className="text-center">
                <div className="font-headline text-3xl font-bold text-white">{overallReadiness}%</div>
                <div className="text-xs text-white/50">ready</div>
              </div>
            </div>
          </div>
          {/* Readiness bar */}
          <div className="mt-4">
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-accent to-orange-400 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(overallReadiness, 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-white/40 mt-1">
              <span>Training {trainingReadiness}%</span>
              <span>Gear {gearReadiness}%</span>
              <span>Nutrition {nutritionReadiness}%</span>
            </div>
          </div>
        </div>
      </section>

      {/* Tab navigation */}
      <nav className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-1 overflow-x-auto py-2 scrollbar-hide">
            {TAB_LABELS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-1.5 whitespace-nowrap px-3 py-2 rounded-lg text-sm font-medium transition-colors flex-shrink-0 ${
                  tab === t.id ? "bg-primary text-white" : "text-gray hover:text-dark hover:bg-light"
                }`}
              >
                <span>{t.icon}</span>
                <span>{t.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ─── TODAY TAB ──────────────────────────────────────────────── */}
        {tab === "today" && (
          <div className="space-y-6">
            {/* Date header */}
            <div>
              <h2 className="font-headline text-2xl font-bold text-dark">{formatDateFull(today)}</h2>
              <p className="text-sm text-gray">
                Week {currentWeekNum} of {plan.weeksTotal} &middot; {currentWeek?.phase ?? "Training"}
                {currentWeek?.isRecovery && <span className="text-green-600 font-medium"> (Recovery Week)</span>}
              </p>
            </div>

            {/* Today's workout card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-primary to-primary-dark p-5">
                <div className="flex items-center gap-2 text-white/70 text-xs font-medium mb-2">
                  <span>🏃</span>
                  <span>TODAY&apos;S WORKOUT</span>
                </div>
                <h3 className="font-headline text-xl font-bold text-white">
                  {todayWorkout?.workout ?? "Rest Day"}
                  {todayWorkout?.distance && todayWorkout.distance !== "—" && (
                    <span className="text-white/70 font-normal"> — {todayWorkout.distance}</span>
                  )}
                </h3>
                {todayWorkout?.effort && todayWorkout.effort !== "—" && (
                  <p className="text-white/60 text-sm mt-1">Target: {todayWorkout.effort}</p>
                )}
                {todayWorkout?.notes && <p className="text-white/50 text-sm mt-1">{todayWorkout.notes}</p>}
              </div>
              <div className="p-5">
                {todayCompleted ? (
                  <div className="flex items-center gap-3 bg-green-50 rounded-xl p-4 border border-green-100">
                    <span className="text-2xl">✅</span>
                    <div>
                      <p className="font-semibold text-green-800 text-sm">Workout Complete!</p>
                      <p className="text-xs text-green-600">
                        {todayCompleted.actualMiles > 0 && `${todayCompleted.actualMiles} miles · `}
                        Feeling: {todayCompleted.feeling}
                        {todayCompleted.notes && ` · "${todayCompleted.notes}"`}
                      </p>
                    </div>
                  </div>
                ) : todayWorkout?.workout === "Rest" ? (
                  <div className="flex items-center gap-3 bg-blue-50 rounded-xl p-4 border border-blue-100">
                    <span className="text-2xl">😴</span>
                    <div>
                      <p className="font-semibold text-blue-800 text-sm">Rest Day</p>
                      <p className="text-xs text-blue-600">Recover, hydrate, sleep well. You&apos;ve earned it.</p>
                    </div>
                    <button
                      onClick={() => markDayComplete(currentWeekNum, todayDayIndex)}
                      className="ml-auto text-xs font-medium text-blue-600 hover:underline"
                    >
                      Mark done
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => markDayComplete(currentWeekNum, todayDayIndex)}
                      className="px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary-dark transition-colors"
                    >
                      Mark as Complete
                    </button>
                    <button
                      onClick={() => openWorkoutLog(currentWeekNum, todayDayIndex)}
                      className="px-5 py-2.5 bg-light text-dark text-sm font-medium rounded-xl hover:bg-gray-200 transition-colors border border-gray-200"
                    >
                      Log Workout Details
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Week progress */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-headline font-bold text-dark text-sm uppercase tracking-wider">Week {currentWeekNum} Progress</h3>
                <span className="text-xs text-gray">{weekCompletedCount}/{currentWeek?.days.length ?? 7} workouts</span>
              </div>
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden mb-2">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-500"
                  style={{ width: `${currentWeek ? (weekCompletedCount / currentWeek.days.length) * 100 : 0}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray">
                <span>{weekMilesLogged.toFixed(1)} / {currentWeek?.totalMiles ?? 0} miles</span>
                <span>{currentWeek?.phase}</span>
              </div>
            </div>

            {/* Today's tasks */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h3 className="font-headline font-bold text-dark text-sm uppercase tracking-wider mb-4">Today&apos;s Tasks</h3>
              <div className="space-y-3">
                {/* Gear tasks */}
                {plan.gearItems
                  .filter((g) => !g.purchased && g.neededByWeek <= currentWeekNum + 2)
                  .slice(0, 2)
                  .map((g) => (
                    <div key={g.id} className="flex items-center gap-3 text-sm">
                      <span className="text-orange-500">🎒</span>
                      <span className="text-gray">Order: {g.productName}</span>
                      <span className="text-xs text-orange-500 font-medium ml-auto">Need by Week {g.neededByWeek}</span>
                    </div>
                  ))}
                {/* Recovery tasks */}
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-blue-500">💧</span>
                  <span className="text-gray">Drink 80+ oz water today</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-purple-500">😴</span>
                  <span className="text-gray">Sleep 8+ hours tonight</span>
                </div>
                {todayWorkout?.workout !== "Rest" && (
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-green-500">🥛</span>
                    <span className="text-gray">Recovery protein within 30 min of run</span>
                  </div>
                )}
              </div>
            </div>

            {/* Weekly goals */}
            {currentWeek && currentWeek.goals.length > 0 && (
              <div className="bg-primary/5 border border-primary/20 rounded-2xl p-5">
                <h3 className="font-headline font-bold text-dark text-sm uppercase tracking-wider mb-3">Weekly Goals</h3>
                <ul className="space-y-2">
                  {currentWeek.goals.map((g, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray">
                      <span className="text-primary flex-shrink-0 mt-0.5">✓</span>{g}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* ─── WEEK TAB ──────────────────────────────────────────────── */}
        {tab === "week" && currentWeek && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-headline text-2xl font-bold text-dark">
                  Week {currentWeekNum} — {currentWeek.phase}
                  {currentWeek.isRecovery && " (Recovery)"}
                </h2>
                <p className="text-sm text-gray">{currentWeek.startDate} – {currentWeek.endDate} &middot; {currentWeek.totalMiles} miles target</p>
              </div>
            </div>

            {/* Day-by-day cards */}
            <div className="space-y-3">
              {currentWeek.days.map((day, i) => {
                const key = `w${currentWeekNum}-d${i}`;
                const completed = plan.completedWorkouts[key];
                const isToday = day.day === todayDayName;
                return (
                  <div
                    key={i}
                    className={`bg-white rounded-xl border shadow-sm p-4 transition-all ${
                      isToday ? "border-primary/30 ring-1 ring-primary/20" : completed ? "border-green-200 bg-green-50/30" : "border-gray-100"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      {/* Status */}
                      <div className="flex-shrink-0">
                        {completed ? (
                          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-lg">✓</div>
                        ) : isToday ? (
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary text-lg">●</div>
                        ) : (
                          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray text-lg">○</div>
                        )}
                      </div>

                      {/* Workout info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-headline font-bold text-dark text-sm">{day.day}</span>
                          {isToday && <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">TODAY</span>}
                        </div>
                        <p className="text-sm text-dark">{day.workout}</p>
                        {day.distance !== "—" && <p className="text-xs text-gray">{day.distance} &middot; {day.effort}</p>}
                        {completed && completed.notes && <p className="text-xs text-green-600 mt-1">&ldquo;{completed.notes}&rdquo;</p>}
                      </div>

                      {/* Actions */}
                      {!completed && day.workout !== "Rest" && (
                        <div className="flex gap-2 flex-shrink-0">
                          <button
                            onClick={() => markDayComplete(currentWeekNum, i)}
                            className="text-xs font-medium text-primary hover:underline"
                          >
                            Done
                          </button>
                          <button
                            onClick={() => openWorkoutLog(currentWeekNum, i)}
                            className="text-xs font-medium text-gray hover:text-dark"
                          >
                            Log
                          </button>
                        </div>
                      )}
                      {!completed && day.workout === "Rest" && (
                        <button
                          onClick={() => markDayComplete(currentWeekNum, i)}
                          className="text-xs font-medium text-gray hover:text-primary flex-shrink-0"
                        >
                          ✓
                        </button>
                      )}
                      {completed && (
                        <div className="text-right flex-shrink-0">
                          <p className="text-xs font-medium text-green-600">{completed.actualMiles > 0 ? `${completed.actualMiles} mi` : "Done"}</p>
                          <p className="text-[10px] text-gray capitalize">{completed.feeling}</p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ─── PROGRESS TAB ──────────────────────────────────────────── */}
        {tab === "progress" && (
          <div className="space-y-6">
            <h2 className="font-headline text-2xl font-bold text-dark">Training Progress</h2>

            {/* Stats grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: "Workouts Done", value: totalWorkoutsCompleted, sub: `of ${totalPossibleWorkouts}` },
                { label: "Miles Logged", value: totalMilesLogged.toFixed(0), sub: "total" },
                { label: "Longest Run", value: `${longestRun}`, sub: "miles" },
                { label: "Readiness", value: `${overallReadiness}%`, sub: "overall" },
              ].map((s) => (
                <div key={s.label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
                  <div className="font-headline text-2xl font-bold text-dark">{s.value}</div>
                  <div className="text-xs text-gray">{s.sub}</div>
                  <div className="text-[10px] text-gray mt-1 font-medium uppercase tracking-wider">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Readiness breakdown */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h3 className="font-headline font-bold text-dark mb-4">Readiness Breakdown</h3>
              <div className="space-y-4">
                {[
                  { label: "Training", value: trainingReadiness, color: "bg-primary" },
                  { label: "Gear", value: gearReadiness, color: "bg-accent" },
                  { label: "Nutrition", value: nutritionReadiness, color: "bg-green-500" },
                ].map((r) => (
                  <div key={r.label}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-dark">{r.label}</span>
                      <span className="text-gray">{r.value}%</span>
                    </div>
                    <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full ${r.color} rounded-full transition-all duration-500`} style={{ width: `${r.value}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Weekly mileage chart (text-based) */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h3 className="font-headline font-bold text-dark mb-4">Weekly Mileage</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      {["Week", "Phase", "Target", "Actual", "Status"].map((h) => (
                        <th key={h} className="text-left py-2 px-3 font-semibold text-dark text-xs uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {plan.weeks.slice(0, currentWeekNum + 1).map((w) => {
                      const actual = w.days.reduce((s, _, i) => {
                        const cw = plan.completedWorkouts[`w${w.weekNumber}-d${i}`];
                        return s + (cw?.actualMiles ?? 0);
                      }, 0);
                      const isCurrent = w.weekNumber === currentWeekNum;
                      return (
                        <tr key={w.weekNumber} className={`border-b border-gray-50 ${isCurrent ? "bg-primary/5" : ""}`}>
                          <td className="py-2 px-3 font-bold text-dark">{w.weekNumber}</td>
                          <td className="py-2 px-3 text-gray">{w.phase}</td>
                          <td className="py-2 px-3 text-dark">{w.totalMiles}</td>
                          <td className="py-2 px-3 font-medium text-dark">{actual > 0 ? actual.toFixed(1) : "—"}</td>
                          <td className="py-2 px-3">
                            {isCurrent ? (
                              <span className="text-xs text-primary font-medium">In Progress</span>
                            ) : actual >= w.totalMiles * 0.9 ? (
                              <span className="text-xs text-green-600 font-medium">✓ Complete</span>
                            ) : actual > 0 ? (
                              <span className="text-xs text-yellow-600 font-medium">Partial</span>
                            ) : (
                              <span className="text-xs text-gray">—</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Delete plan */}
            <div className="text-center pt-4">
              <button
                onClick={() => { if (confirm("Delete your saved plan? This cannot be undone.")) deletePlan(); }}
                className="text-xs text-gray hover:text-red-500 transition-colors"
              >
                Delete Saved Plan
              </button>
            </div>
          </div>
        )}

        {/* ─── GEAR TAB ──────────────────────────────────────────────── */}
        {tab === "gear" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-headline text-2xl font-bold text-dark">Gear Checklist</h2>
              <span className="text-sm text-gray">{gearPurchased}/{plan.gearItems.length} purchased · {gearTested} tested</span>
            </div>

            {/* Priority groups */}
            {(["critical", "high", "standard"] as const).map((priority) => {
              const items = plan.gearItems.filter((g) => g.priority === priority);
              if (items.length === 0) return null;
              const priorityLabel = priority === "critical" ? "🚨 Critical — Order Now" : priority === "high" ? "⚠️ High Priority" : "🔵 Standard Priority";
              return (
                <div key={priority}>
                  <h3 className="font-headline font-bold text-dark text-sm mb-3">{priorityLabel}</h3>
                  <div className="space-y-3">
                    {items.map((item) => (
                      <div key={item.id} className={`bg-white rounded-xl border shadow-sm p-4 ${item.purchased ? "border-green-200" : "border-gray-100"}`}>
                        <div className="flex items-start gap-3">
                          <button
                            onClick={() => toggleGearPurchased(item.id)}
                            className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
                              item.purchased ? "bg-green-500 border-green-500 text-white" : "border-gray-300 hover:border-primary"
                            }`}
                          >
                            {item.purchased && <span className="text-xs">✓</span>}
                          </button>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className={`font-headline font-bold text-sm ${item.purchased ? "text-green-700 line-through" : "text-dark"}`}>
                                {item.productName}
                              </span>
                              {item.brand && <span className="text-xs text-gray">({item.brand})</span>}
                              <span className="text-xs font-bold text-dark">{item.price}</span>
                            </div>
                            <p className="text-xs text-gray">
                              {item.category} · Need by Week {item.neededByWeek}
                              {item.purchased && item.purchaseDate && ` · Purchased ${item.purchaseDate}`}
                            </p>

                            {/* Testing status */}
                            {item.purchased && (
                              <div className="flex items-center gap-3 mt-2">
                                <button
                                  onClick={() => toggleGearTested(item.id)}
                                  className={`text-xs font-medium px-2.5 py-1 rounded-full transition-colors ${
                                    item.tested ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray hover:bg-primary/10 hover:text-primary"
                                  }`}
                                >
                                  {item.tested ? "✓ Tested" : "Mark Tested"}
                                </button>
                                {item.breakInTarget > 0 && (
                                  <span className="text-xs text-gray">
                                    Break-in: {item.breakInMiles}/{item.breakInTarget} mi
                                  </span>
                                )}
                                <button
                                  onClick={() => { setEditGearId(item.id); setGearNotes(item.testingNotes); setGearRating(item.rating); }}
                                  className="text-xs text-primary hover:underline ml-auto"
                                >
                                  {item.testingNotes ? "Edit Notes" : "Add Notes"}
                                </button>
                              </div>
                            )}

                            {/* Testing notes */}
                            {item.testingNotes && editGearId !== item.id && (
                              <p className="text-xs text-gray mt-1 bg-light rounded-lg px-3 py-2">
                                {item.rating > 0 && <span>{"⭐".repeat(item.rating)} </span>}
                                {item.testingNotes}
                              </p>
                            )}

                            {/* Edit notes form */}
                            {editGearId === item.id && (
                              <div className="mt-2 space-y-2">
                                <div className="flex gap-1">
                                  {[1, 2, 3, 4, 5].map((r) => (
                                    <button
                                      key={r}
                                      onClick={() => setGearRating(r)}
                                      className={`text-lg ${r <= gearRating ? "opacity-100" : "opacity-30"}`}
                                    >
                                      ⭐
                                    </button>
                                  ))}
                                </div>
                                <textarea
                                  value={gearNotes}
                                  onChange={(e) => setGearNotes(e.target.value)}
                                  placeholder="Testing notes..."
                                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-dark focus:outline-none focus:border-primary resize-none"
                                  rows={2}
                                />
                                <div className="flex gap-2">
                                  <button onClick={() => saveGearNotes(item.id)} className="text-xs font-medium text-primary hover:underline">Save</button>
                                  <button onClick={() => setEditGearId(null)} className="text-xs text-gray hover:text-dark">Cancel</button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}

            {/* Budget summary */}
            <div className="bg-light rounded-xl p-4 border border-gray-100">
              <h4 className="font-headline font-bold text-dark text-sm mb-2">Purchase Summary</h4>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="font-headline text-xl font-bold text-dark">{gearPurchased}</div>
                  <div className="text-xs text-gray">Purchased</div>
                </div>
                <div>
                  <div className="font-headline text-xl font-bold text-dark">{gearTested}</div>
                  <div className="text-xs text-gray">Tested</div>
                </div>
                <div>
                  <div className="font-headline text-xl font-bold text-dark">{plan.gearItems.length - gearPurchased}</div>
                  <div className="text-xs text-gray">Remaining</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─── NUTRITION TAB ─────────────────────────────────────────── */}
        {tab === "nutrition" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-headline text-2xl font-bold text-dark">Nutrition & Fueling</h2>
              <span className="text-sm text-gray">{nutritionTested}/{plan.nutritionProducts.length} tested</span>
            </div>

            {/* Products */}
            <div className="space-y-3">
              {plan.nutritionProducts.map((product) => (
                <div key={product.id} className={`bg-white rounded-xl border shadow-sm p-4 ${product.tested ? "border-green-200" : "border-gray-100"}`}>
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => toggleNutritionPurchased(product.id)}
                      className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
                        product.purchased ? "bg-green-500 border-green-500 text-white" : "border-gray-300 hover:border-primary"
                      }`}
                    >
                      {product.purchased && <span className="text-xs">✓</span>}
                    </button>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`font-headline font-bold text-sm ${product.purchased ? "text-dark" : "text-dark"}`}>
                          {product.productName}
                        </span>
                        <span className="text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-full">{product.brand}</span>
                        <span className="text-xs font-bold text-dark">{product.price}</span>
                      </div>
                      <p className="text-xs text-gray capitalize">{product.type}</p>

                      {/* Test status */}
                      {product.purchased && (
                        <div className="flex items-center gap-3 mt-2">
                          {product.tested ? (
                            <span className="text-xs font-medium bg-green-100 text-green-700 px-2.5 py-1 rounded-full">
                              ✓ Tested · {"⭐".repeat(product.stomachRating || 0)}
                              {product.wouldUseInRace === "yes" && " · Race approved"}
                            </span>
                          ) : (
                            <button
                              onClick={() => {
                                setEditNutritionId(product.id);
                                setNutritionNotes(product.testingNotes);
                                setNutritionRating(product.stomachRating);
                                setNutritionRaceUse(product.wouldUseInRace);
                              }}
                              className="text-xs font-medium text-primary hover:underline"
                            >
                              Log Test Results
                            </button>
                          )}
                        </div>
                      )}

                      {/* Test notes */}
                      {product.testingNotes && editNutritionId !== product.id && (
                        <p className="text-xs text-gray mt-1 bg-light rounded-lg px-3 py-2">{product.testingNotes}</p>
                      )}

                      {/* Test logging form */}
                      {editNutritionId === product.id && (
                        <div className="mt-3 bg-light rounded-xl p-4 border border-gray-100 space-y-3">
                          <div>
                            <label className="block text-xs font-medium text-dark mb-1">Stomach Tolerance</label>
                            <div className="flex gap-1">
                              {[1, 2, 3, 4, 5].map((r) => (
                                <button
                                  key={r}
                                  onClick={() => setNutritionRating(r)}
                                  className={`text-lg ${r <= nutritionRating ? "opacity-100" : "opacity-30"}`}
                                >
                                  ⭐
                                </button>
                              ))}
                              <span className="text-xs text-gray ml-2 self-center">
                                {nutritionRating === 1 ? "Nauseous" : nutritionRating === 2 ? "Uncomfortable" : nutritionRating === 3 ? "OK" : nutritionRating === 4 ? "Good" : nutritionRating === 5 ? "Perfect" : "Rate"}
                              </span>
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-dark mb-1">Would you use this in race?</label>
                            <div className="flex gap-2">
                              {([["yes", "Yes"], ["maybe", "Maybe"], ["no", "No"]] as const).map(([val, label]) => (
                                <button
                                  key={val}
                                  onClick={() => setNutritionRaceUse(val)}
                                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                                    nutritionRaceUse === val ? "bg-primary text-white" : "bg-white border border-gray-200 text-dark"
                                  }`}
                                >
                                  {label}
                                </button>
                              ))}
                            </div>
                          </div>
                          <textarea
                            value={nutritionNotes}
                            onChange={(e) => setNutritionNotes(e.target.value)}
                            placeholder="How did it go? Taste, texture, energy..."
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-dark focus:outline-none focus:border-primary resize-none"
                            rows={2}
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={() => saveNutritionTest(product.id)}
                              className="px-4 py-2 bg-primary text-white text-xs font-semibold rounded-lg hover:bg-primary-dark transition-colors"
                            >
                              Save Test
                            </button>
                            <button onClick={() => setEditNutritionId(null)} className="text-xs text-gray hover:text-dark">Cancel</button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Race-approved products */}
            {plan.nutritionProducts.some((n) => n.wouldUseInRace === "yes") && (
              <div className="bg-green-50 border border-green-200 rounded-2xl p-5">
                <h3 className="font-headline font-bold text-green-800 mb-3">Race Day Approved Products</h3>
                <div className="space-y-2">
                  {plan.nutritionProducts.filter((n) => n.wouldUseInRace === "yes").map((n) => (
                    <div key={n.id} className="flex items-center gap-2 text-sm text-green-700">
                      <span>✅</span>
                      <span className="font-medium">{n.brand} {n.productName}</span>
                      <span className="text-xs text-green-600 ml-auto">{"⭐".repeat(n.stomachRating)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ─── RACE DAY TAB ──────────────────────────────────────────── */}
        {tab === "raceday" && (
          <div className="space-y-6">
            <h2 className="font-headline text-2xl font-bold text-dark">Race Day Checklist</h2>
            <p className="text-sm text-gray">
              {plan.raceDayChecklist.filter((i) => i.checked).length}/{plan.raceDayChecklist.length} items checked
            </p>

            {/* Group by category */}
            {Array.from(new Set(plan.raceDayChecklist.map((i) => i.category))).map((category) => {
              const items = plan.raceDayChecklist.filter((i) => i.category === category);
              return (
                <div key={category}>
                  <h3 className="font-headline font-bold text-dark text-sm uppercase tracking-wider mb-3">
                    {category === "Night Before" ? "🌙" : category === "Race Morning" ? "🌅" : "🏁"} {category}
                  </h3>
                  <div className="space-y-2">
                    {items.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => toggleRaceDayItem(item.id)}
                        className={`w-full flex items-center gap-3 bg-white rounded-xl border p-4 text-left transition-all ${
                          item.checked ? "border-green-200 bg-green-50/50" : "border-gray-100 hover:border-primary/30"
                        }`}
                      >
                        <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                          item.checked ? "bg-green-500 border-green-500 text-white" : "border-gray-300"
                        }`}>
                          {item.checked && <span className="text-xs">✓</span>}
                        </div>
                        <span className={`text-sm ${item.checked ? "text-green-700 line-through" : "text-dark"}`}>
                          {item.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}

            {/* Race day motivation */}
            {daysUntilRace <= 7 && (
              <div className="bg-accent/10 border border-accent/20 rounded-2xl p-6 text-center">
                <div className="text-4xl mb-3">🏁</div>
                <h3 className="font-headline text-xl font-bold text-dark mb-2">
                  {daysUntilRace === 0 ? "RACE DAY!" : `${daysUntilRace} Day${daysUntilRace !== 1 ? "s" : ""} to Race Day!`}
                </h3>
                <p className="text-sm text-gray max-w-md mx-auto">
                  {daysUntilRace === 0
                    ? "Trust your training. Control your pace. Enjoy every mile. YOU'VE GOT THIS!"
                    : "You've put in the work. Trust the process and stay focused on your preparation."}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ─── Workout Log Modal ──────────────────────────────────────── */}
      {logOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setLogOpen(false)} />
          <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="font-headline text-xl font-bold text-dark mb-4">Log Workout</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-dark mb-2">Actual Distance (miles)</label>
                <input
                  type="number"
                  step="0.1"
                  value={logMiles}
                  onChange={(e) => setLogMiles(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 text-dark focus:outline-none focus:border-primary"
                  placeholder="e.g. 4.2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark mb-2">How did you feel?</label>
                <div className="grid grid-cols-5 gap-2">
                  {FEELING_OPTIONS.map((f) => (
                    <button
                      key={f.value}
                      onClick={() => setLogFeeling(f.value)}
                      className={`flex flex-col items-center gap-1 px-2 py-3 rounded-xl text-xs font-medium transition-all ${
                        logFeeling === f.value ? "bg-primary text-white" : "bg-light text-gray hover:bg-gray-200"
                      }`}
                    >
                      <span className="text-lg">{f.emoji}</span>
                      <span>{f.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-dark mb-2">Notes (optional)</label>
                <textarea
                  value={logNotes}
                  onChange={(e) => setLogNotes(e.target.value)}
                  placeholder="How was the run? Any issues?"
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 text-dark focus:outline-none focus:border-primary resize-none"
                  rows={3}
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={saveWorkoutLog}
                  className="flex-1 px-5 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-colors"
                >
                  Save Workout
                </button>
                <button
                  onClick={() => setLogOpen(false)}
                  className="px-5 py-3 bg-light text-dark font-medium rounded-xl hover:bg-gray-200 transition-colors border border-gray-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
