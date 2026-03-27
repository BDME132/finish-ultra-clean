"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  Home, Calendar, BarChart2, Package, Zap, Flag, Flame, Dumbbell,
  Minus, Wind, AlertCircle, ClipboardList, CheckCircle, BedDouble,
  Droplets, AlertTriangle, Circle, Moon, Sunrise, Medal, Star, PersonStanding,
  Pencil, CalendarDays, ChevronLeft, ChevronRight,
} from "lucide-react";
import Link from "next/link";
import {
  SavedPlan,
  CompletedWorkout,
  GearTrackingItem,
  NutritionProduct,
  DailyTask,
  PostRaceReport,
  RaceDayChecklistItem,
  RunnerProfile,
  loadSavedPlan,
  savePlan,
  generateDailyTasks,
  PLAN_STORAGE_KEY,
} from "@/lib/training-types";
import { useAuth } from "@/components/AuthProvider";
import { loadPlan, persistPlan, deletePlanData } from "@/lib/training-sync";
import { loadKits, deleteKit as deleteKitSync, updateKit as updateKitSync } from "@/lib/kit-sync";
import type { SavedKit } from "@/lib/kit-types";
import { calculateFuelingStrategy, FuelingStrategy, generateDynamicPlan, getTimelineAssessment } from "@/lib/plan-generator";
import CalendarTab from "./CalendarTab";

type Tab = "today" | "week" | "calendar" | "progress" | "gear" | "nutrition" | "raceday";

const TAB_LABELS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: "today", label: "Today", icon: <Home className="w-4 h-4" /> },
  { id: "week", label: "Week", icon: <Calendar className="w-4 h-4" /> },
  { id: "calendar", label: "Calendar", icon: <CalendarDays className="w-4 h-4" /> },
  { id: "progress", label: "Progress", icon: <BarChart2 className="w-4 h-4" /> },
  { id: "gear", label: "Gear", icon: <Package className="w-4 h-4" /> },
  { id: "nutrition", label: "Nutrition", icon: <Zap className="w-4 h-4" /> },
  { id: "raceday", label: "Race Day", icon: <Flag className="w-4 h-4" /> },
];

const FEELING_OPTIONS: { value: CompletedWorkout["feeling"]; label: string; emoji: React.ReactNode }[] = [
  { value: "great", label: "Great", emoji: <Flame className="w-5 h-5 text-orange-500" /> },
  { value: "good", label: "Good", emoji: <Dumbbell className="w-5 h-5 text-blue-500" /> },
  { value: "average", label: "Average", emoji: <Minus className="w-5 h-5 text-gray-400" /> },
  { value: "tired", label: "Tired", emoji: <Wind className="w-5 h-5 text-gray-500" /> },
  { value: "struggling", label: "Struggling", emoji: <AlertCircle className="w-5 h-5 text-red-500" /> },
];

function formatDateFull(d: Date): string {
  return d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
}

function todayDateStr(): string {
  return new Date().toISOString().split("T")[0];
}

export default function DashboardClient() {
  const { user } = useAuth();
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

  // Workout editing
  const [editWorkoutOpen, setEditWorkoutOpen] = useState(false);
  const [editWeek, setEditWeek] = useState(0);
  const [editDayIndex, setEditDayIndex] = useState(0);
  const [editWorkoutType, setEditWorkoutType] = useState("");
  const [editDistance, setEditDistance] = useState("");
  const [editEffort, setEditEffort] = useState("");
  const [editNotes, setEditNotes] = useState("");

  // Post-race report state
  const [postRaceForm, setPostRaceForm] = useState<PostRaceReport>({});

  // Week navigation
  const [viewWeekNum, setViewWeekNum] = useState<number | null>(null);

  // Plan settings
  const [settingsRaceName, setSettingsRaceName] = useState("");
  const [settingsRaceDate, setSettingsRaceDate] = useState("");
  const [raceDateConfirmOpen, setRaceDateConfirmOpen] = useState(false);
  const [pendingRaceDate, setPendingRaceDate] = useState("");

  // Nutrition fueling form
  const [fuelingWeight, setFuelingWeight] = useState("");
  const [fuelingSweatRate, setFuelingSweatRate] = useState<"light" | "moderate" | "heavy">("moderate");
  const [fuelingSensitivity, setFuelingSensitivity] = useState<"iron" | "average" | "sensitive">("average");

  // Saved kits
  const [savedKits, setSavedKits] = useState<SavedKit[]>([]);
  const [expandedKitId, setExpandedKitId] = useState<string | null>(null);
  const [kitPurchaseModal, setKitPurchaseModal] = useState<{ kitId: string; itemIndex: number } | null>(null);
  const [kitPurchaseRetailer, setKitPurchaseRetailer] = useState("");
  const [kitPurchasePrice, setKitPurchasePrice] = useState("");
  const [kitPurchaseDate, setKitPurchaseDate] = useState(() => new Date().toISOString().split("T")[0]);

  const isFirstRender = useRef(true);
  const persistTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounced persist to Supabase
  const debouncedPersist = useCallback(
    (updatedPlan: SavedPlan) => {
      if (persistTimerRef.current) clearTimeout(persistTimerRef.current);
      persistTimerRef.current = setTimeout(() => {
        persistPlan(updatedPlan, user);
      }, 800);
    },
    [user],
  );

  // Load plan from Supabase/localStorage
  useEffect(() => {
    let cancelled = false;
    async function load() {
      const saved = await loadPlan(user);
      if (!cancelled) {
        setPlan(saved);
        if (saved) {
          setSettingsRaceName(saved.raceName || "");
          setSettingsRaceDate(saved.raceDate);
        }
        if (saved?.runnerProfile) {
          setFuelingWeight(String(saved.runnerProfile.weightLbs ?? ""));
          setFuelingSweatRate(saved.runnerProfile.sweatRate ?? "moderate");
          setFuelingSensitivity(saved.runnerProfile.stomachSensitivity ?? "average");
        }
        if (saved?.postRaceReport) {
          setPostRaceForm(saved.postRaceReport);
        }
        setLoaded(true);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [user]);

  // Persist whenever plan changes (skip first render)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (plan) debouncedPersist(plan);
  }, [plan, debouncedPersist]);

  // Cleanup debounce timer
  useEffect(() => {
    return () => {
      if (persistTimerRef.current) clearTimeout(persistTimerRef.current);
    };
  }, []);

  // Load saved kits
  useEffect(() => {
    async function loadUserKits() {
      const kits = await loadKits(user);
      setSavedKits(kits);
    }
    loadUserKits();
  }, [user]);

  if (!loaded) return null;

  if (!plan) {
    return (
      <main className="py-20">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="flex justify-center mb-6"><ClipboardList className="w-16 h-16 text-gray" /></div>
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
  const daysUntilRace = Math.ceil((raceDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  const daysUntilRaceClamped = Math.max(0, daysUntilRace);
  const weeksUntilRace = Math.ceil(daysUntilRaceClamped / 7);
  const raceIsPast = daysUntilRace <= 0;

  // Find current week
  const currentWeekIndex = plan.weeks.findIndex((w) => {
    return w.weeksToRace === weeksUntilRace;
  });
  const currentWeek = currentWeekIndex >= 0 ? plan.weeks[currentWeekIndex] : plan.weeks[0];
  const currentWeekNum = currentWeek?.weekNumber ?? 1;

  // Display week for Week tab navigation (defaults to current week)
  const displayWeekNum = viewWeekNum ?? currentWeekNum;
  const displayWeek = plan.weeks.find((w) => w.weekNumber === displayWeekNum) ?? currentWeek;

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

  // ─── Daily tasks ────────────────────────────────────────────────────────
  const dateStr = todayDateStr();
  const dailyTasks: DailyTask[] = (() => {
    const existing = plan.dailyTasks ?? [];
    // If tasks exist for today, use them; otherwise generate fresh
    if (existing.length > 0 && existing[0]?.date === dateStr) {
      return existing;
    }
    return generateDailyTasks(plan, today, todayWorkout, currentWeekNum);
  })();

  // Sync generated tasks into plan if they changed
  if (
    !plan.dailyTasks ||
    plan.dailyTasks.length === 0 ||
    (plan.dailyTasks[0] && plan.dailyTasks[0].date !== dateStr)
  ) {
    // Use a microtask to avoid setting state during render
    queueMicrotask(() => {
      setPlan((prev) => {
        if (!prev) return prev;
        if (prev.dailyTasks && prev.dailyTasks.length > 0 && prev.dailyTasks[0]?.date === dateStr) return prev;
        return { ...prev, dailyTasks: generateDailyTasks(prev, today, todayWorkout, currentWeekNum) };
      });
    });
  }

  function toggleDailyTask(taskId: string) {
    if (!plan) return;
    const updated = (plan.dailyTasks ?? []).map((t) =>
      t.id === taskId ? { ...t, checked: !t.checked } : t,
    );
    setPlan({ ...plan, dailyTasks: updated });
  }

  // ─── Enhanced progress analytics ───────────────────────────────────────
  // Feeling distribution
  const feelingDistribution: Record<string, number> = {};
  Object.values(plan.completedWorkouts).forEach((w) => {
    feelingDistribution[w.feeling] = (feelingDistribution[w.feeling] || 0) + 1;
  });

  // Weekly mileage data for bar chart
  const weeklyMileageData = plan.weeks.slice(0, currentWeekNum + 1).map((w) => {
    const actual = w.days.reduce((s, _, i) => {
      const cw = plan.completedWorkouts[`w${w.weekNumber}-d${i}`];
      return s + (cw?.actualMiles ?? 0);
    }, 0);
    return { weekNum: w.weekNumber, target: w.totalMiles, actual, phase: w.phase, isCurrent: w.weekNumber === currentWeekNum };
  });
  const maxMileage = Math.max(1, ...weeklyMileageData.map((w) => Math.max(w.target, w.actual)));

  // Consistency streak
  const consistencyStreak = (() => {
    let streak = 0;
    // Walk backwards through weeks and days
    for (let wi = currentWeekNum; wi >= 1; wi--) {
      const week = plan.weeks.find((w) => w.weekNumber === wi);
      if (!week) break;
      const workoutDays = week.days
        .map((d, i) => ({ d, i }))
        .filter(({ d }) => d.workout !== "Rest");
      let weekAllDone = true;
      for (const { i } of workoutDays) {
        if (!plan.completedWorkouts[`w${wi}-d${i}`]) {
          weekAllDone = false;
          break;
        }
      }
      if (weekAllDone && workoutDays.length > 0) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  })();

  // Upcoming milestones
  const upcomingMilestones: { label: string; weeksAway: number }[] = [];
  const totalMilesTarget = plan.weeks.reduce((s, w) => s + w.totalMiles, 0);
  const milesPercent = totalMilesTarget > 0 ? (totalMilesLogged / totalMilesTarget) * 100 : 0;
  if (milesPercent < 25) upcomingMilestones.push({ label: "25% of total miles", weeksAway: Math.ceil((totalMilesTarget * 0.25 - totalMilesLogged) / (currentWeek?.totalMiles || 30)) });
  if (milesPercent < 50) upcomingMilestones.push({ label: "50% of total miles", weeksAway: Math.ceil((totalMilesTarget * 0.5 - totalMilesLogged) / (currentWeek?.totalMiles || 30)) });
  if (milesPercent < 75) upcomingMilestones.push({ label: "75% of total miles", weeksAway: Math.ceil((totalMilesTarget * 0.75 - totalMilesLogged) / (currentWeek?.totalMiles || 30)) });
  if (longestRun < 20) upcomingMilestones.push({ label: "First 20-mile run", weeksAway: 0 });
  if (totalWorkoutsCompleted < 50) upcomingMilestones.push({ label: "50 workouts completed", weeksAway: 0 });
  if (totalWorkoutsCompleted < 100) upcomingMilestones.push({ label: "100 workouts completed", weeksAway: 0 });

  // ─── Fueling strategy ──────────────────────────────────────────────────
  const fuelingStrategy: FuelingStrategy | null = (() => {
    const w = parseFloat(fuelingWeight);
    if (!w || w < 80 || w > 400) return null;
    const dist = plan.distance as "50K" | "50M" | "100K" | "100M";
    if (!["50K", "50M", "100K", "100M"].includes(dist)) return null;
    return calculateFuelingStrategy(dist, w, fuelingSweatRate, fuelingSensitivity);
  })();

  function saveFuelingProfile() {
    if (!plan) return;
    const profile: RunnerProfile = {
      weightLbs: parseFloat(fuelingWeight) || undefined,
      sweatRate: fuelingSweatRate,
      stomachSensitivity: fuelingSensitivity,
      caffeineUser: plan.runnerProfile?.caffeineUser,
    };
    setPlan({ ...plan, runnerProfile: profile });
  }

  // ─── Race countdown checklist helpers ──────────────────────────────────
  function toggleCountdownItem(listKey: keyof NonNullable<SavedPlan["raceCountdown"]>, id: string) {
    if (!plan || !plan.raceCountdown) return;
    const list = plan.raceCountdown[listKey] as RaceDayChecklistItem[];
    const updated = list.map((item) =>
      item.id === id ? { ...item, checked: !item.checked } : item,
    );
    setPlan({
      ...plan,
      raceCountdown: { ...plan.raceCountdown, [listKey]: updated },
    });
  }

  function renderCountdownChecklist(
    title: string,
    icon: React.ReactNode,
    items: RaceDayChecklistItem[],
    listKey: keyof NonNullable<SavedPlan["raceCountdown"]>,
  ) {
    return (
      <div key={listKey}>
        <h3 className="font-headline font-bold text-dark text-sm uppercase tracking-wider mb-3">
          <span className="flex items-center gap-2">{icon} {title}</span>
        </h3>
        <div className="space-y-2">
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => toggleCountdownItem(listKey, item.id)}
              className={`w-full flex items-center gap-3 bg-white rounded-xl border p-4 text-left transition-all ${
                item.checked ? "border-green-200 bg-green-50/50" : "border-gray-100 hover:border-primary/30"
              }`}
            >
              <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                item.checked ? "bg-green-500 border-green-500 text-white" : "border-gray-300"
              }`}>
                {item.checked && <CheckCircle className="w-3 h-3" />}
              </div>
              <span className={`text-sm ${item.checked ? "text-green-700 line-through" : "text-dark"}`}>
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // ─── Post-race report ──────────────────────────────────────────────────
  function savePostRaceReport() {
    if (!plan) return;
    const report: PostRaceReport = { ...postRaceForm, completedAt: new Date().toISOString() };
    setPlan({ ...plan, postRaceReport: report });
  }

  // ─── Plan settings ─────────────────────────────────────────────────────────
  function openPlanSettings() {
    setSettingsRaceName(plan!.raceName || "");
    setSettingsRaceDate(plan!.raceDate);
  }

  function saveRaceName(name: string) {
    if (!plan) return;
    setPlan({ ...plan, raceName: name });
  }

  function requestRaceDateChange(newDate: string) {
    if (!plan || newDate === plan.raceDate) return;
    setPendingRaceDate(newDate);
    setRaceDateConfirmOpen(true);
  }

  function confirmRaceDateChange() {
    if (!plan || !pendingRaceDate) return;
    const today = new Date();
    const raceDate = new Date(pendingRaceDate + "T00:00:00");
    const weeksUntil = Math.round((raceDate.getTime() - today.getTime()) / (7 * 24 * 60 * 60 * 1000));
    const totalWeeks = Math.max(1, weeksUntil);
    const assessment = getTimelineAssessment(totalWeeks, plan.distance as Parameters<typeof getTimelineAssessment>[1]);
    const newWeeks = generateDynamicPlan(totalWeeks, plan.distance as Parameters<typeof generateDynamicPlan>[1], plan.level as Parameters<typeof generateDynamicPlan>[2], plan.currentWeeklyMiles, pendingRaceDate, assessment);
    setPlan({ ...plan, raceDate: pendingRaceDate, weeks: newWeeks, weeksTotal: totalWeeks });
    setSettingsRaceDate(pendingRaceDate);
    setRaceDateConfirmOpen(false);
    setPendingRaceDate("");
  }

  // ─── Workout editing ───────────────────────────────────────────────────────
  function openEditWorkout(weekNum: number, dayIndex: number) {
    const week = plan!.weeks.find((w) => w.weekNumber === weekNum);
    const workout = week?.days[dayIndex];
    if (!workout) return;
    setEditWeek(weekNum);
    setEditDayIndex(dayIndex);
    setEditWorkoutType(workout.workout);
    setEditDistance(workout.distance);
    setEditEffort(workout.effort);
    setEditNotes(workout.notes);
    setEditWorkoutOpen(true);
  }

  function saveEditWorkout() {
    if (!plan) return;
    const updatedWeeks = plan.weeks.map((w) => {
      if (w.weekNumber !== editWeek) return w;
      return {
        ...w,
        days: w.days.map((d, i) => {
          if (i !== editDayIndex) return d;
          return { ...d, workout: editWorkoutType, distance: editDistance, effort: editEffort, notes: editNotes };
        }),
      };
    });
    setPlan({ ...plan, weeks: updatedWeeks });
    setEditWorkoutOpen(false);
  }

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
    deletePlanData(user);
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
          <Link href="/race-hq" className="inline-flex items-center gap-1 text-white/50 hover:text-white/80 text-xs mb-3 transition-colors">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Race HQ
          </Link>
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
                <div className="font-headline text-3xl font-bold text-accent">{daysUntilRaceClamped}</div>
                <div className="text-xs text-white/50">{raceIsPast ? "days ago" : "days to go"}</div>
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
                onClick={() => { setTab(t.id); if (t.id === "week") setViewWeekNum(null); }}
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
                  <PersonStanding className="w-4 h-4" />
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
                    <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
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
                    <BedDouble className="w-6 h-6 text-blue-500 flex-shrink-0" />
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
                    <button
                      onClick={() => openEditWorkout(currentWeekNum, todayDayIndex)}
                      className="px-5 py-2.5 bg-light text-dark text-sm font-medium rounded-xl hover:bg-gray-200 transition-colors border border-gray-200 flex items-center gap-1.5"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                      Edit
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

            {/* Interactive Daily Tasks */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-headline font-bold text-dark text-sm uppercase tracking-wider">Today&apos;s Tasks</h3>
                <span className="text-xs text-gray">
                  {dailyTasks.filter((t) => t.checked).length}/{dailyTasks.length} done
                </span>
              </div>
              <div className="space-y-2">
                {dailyTasks.map((task) => {
                  const catIcon =
                    task.category === "training" ? <PersonStanding className="w-4 h-4" /> :
                    task.category === "recovery" ? <Droplets className="w-4 h-4" /> :
                    task.category === "gear" ? <Package className="w-4 h-4" /> :
                    task.category === "nutrition" ? <Zap className="w-4 h-4" /> : <Circle className="w-4 h-4" />;
                  const catColor =
                    task.category === "training" ? "text-primary" :
                    task.category === "recovery" ? "text-blue-500" :
                    task.category === "gear" ? "text-orange-500" :
                    "text-green-500";
                  return (
                    <button
                      key={task.id}
                      onClick={() => toggleDailyTask(task.id)}
                      className={`w-full flex items-center gap-3 rounded-xl border p-3 text-left transition-all ${
                        task.checked ? "border-green-200 bg-green-50/50" : "border-gray-100 hover:border-primary/30 bg-white"
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                        task.checked ? "bg-green-500 border-green-500 text-white" : "border-gray-300"
                      }`}>
                        {task.checked && <CheckCircle className="w-3 h-3" />}
                      </div>
                      <span className={`${catColor} flex-shrink-0`}>{catIcon}</span>
                      <span className={`text-sm ${task.checked ? "text-green-700 line-through" : "text-dark"}`}>
                        {task.label}
                      </span>
                      <span className="text-[10px] text-gray ml-auto capitalize">{task.category}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Weekly goals */}
            {currentWeek && currentWeek.goals.length > 0 && (
              <div className="bg-primary/5 border border-primary/20 rounded-2xl p-5">
                <h3 className="font-headline font-bold text-dark text-sm uppercase tracking-wider mb-3">Weekly Goals</h3>
                <ul className="space-y-2">
                  {currentWeek.goals.map((g, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray">
                      <span className="text-primary flex-shrink-0 mt-0.5">→</span>{g}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* ─── WEEK TAB ──────────────────────────────────────────────── */}
        {tab === "week" && displayWeek && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewWeekNum(Math.max(1, displayWeekNum - 1))}
                  disabled={displayWeekNum <= 1}
                  className="p-1.5 rounded-lg hover:bg-light transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-5 h-5 text-dark" />
                </button>
                <div>
                  <h2 className="font-headline text-2xl font-bold text-dark">
                    Week {displayWeekNum} — {displayWeek.phase}
                    {displayWeek.isRecovery && " (Recovery)"}
                  </h2>
                  <p className="text-sm text-gray">{displayWeek.startDate} – {displayWeek.endDate} &middot; {displayWeek.totalMiles} miles target</p>
                </div>
                <button
                  onClick={() => setViewWeekNum(Math.min(plan.weeksTotal, displayWeekNum + 1))}
                  disabled={displayWeekNum >= plan.weeksTotal}
                  className="p-1.5 rounded-lg hover:bg-light transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-5 h-5 text-dark" />
                </button>
              </div>
              {displayWeekNum !== currentWeekNum && (
                <button
                  onClick={() => setViewWeekNum(null)}
                  className="px-3 py-1.5 text-xs font-semibold text-primary bg-primary/5 hover:bg-primary/10 rounded-lg transition-colors"
                >
                  Current Week
                </button>
              )}
            </div>

            {/* Day-by-day cards */}
            <div className="space-y-3">
              {displayWeek.days.map((day, i) => {
                const key = `w${displayWeekNum}-d${i}`;
                const completed = plan.completedWorkouts[key];
                const isToday = displayWeekNum === currentWeekNum && day.day === todayDayName;
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
                          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600"><CheckCircle className="w-5 h-5" /></div>
                        ) : isToday ? (
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary"><Circle className="w-5 h-5 fill-current" /></div>
                        ) : (
                          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray"><Circle className="w-5 h-5" /></div>
                        )}
                      </div>

                      {/* Workout info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-headline font-bold text-dark text-sm">{day.day}</span>
                          {isToday && <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">TODAY</span>}
                        </div>
                        <p className="text-sm text-dark">{day.workout}</p>
                        {day.distance !== "\u2014" && <p className="text-xs text-gray">{day.distance} &middot; {day.effort}</p>}
                        {day.notes && <p className="text-xs text-gray/70 mt-0.5 italic">{day.notes}</p>}
                        {completed && completed.notes && <p className="text-xs text-green-600 mt-1">&ldquo;{completed.notes}&rdquo;</p>}
                      </div>

                      {/* Actions */}
                      {!completed && day.workout !== "Rest" && (
                        <div className="flex gap-2 flex-shrink-0">
                          <button
                            onClick={() => openEditWorkout(displayWeekNum, i)}
                            className="text-xs font-medium text-gray hover:text-primary"
                            title="Edit workout"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => markDayComplete(displayWeekNum, i)}
                            className="text-xs font-medium text-primary hover:underline"
                          >
                            Done
                          </button>
                          <button
                            onClick={() => openWorkoutLog(displayWeekNum, i)}
                            className="text-xs font-medium text-gray hover:text-dark"
                          >
                            Log
                          </button>
                        </div>
                      )}
                      {!completed && day.workout === "Rest" && (
                        <div className="flex gap-2 flex-shrink-0">
                          <button
                            onClick={() => openEditWorkout(displayWeekNum, i)}
                            className="text-xs font-medium text-gray hover:text-primary"
                            title="Edit workout"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => markDayComplete(displayWeekNum, i)}
                            className="text-xs font-medium text-gray hover:text-primary"
                          >
                            Mark done
                          </button>
                        </div>
                      )}
                      {completed && (
                        <div className="text-right flex-shrink-0 flex items-center gap-2">
                          <button
                            onClick={() => openEditWorkout(displayWeekNum, i)}
                            className="text-gray hover:text-primary"
                            title="Edit planned workout"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <div>
                            <p className="text-xs font-medium text-green-600">{completed.actualMiles > 0 ? `${completed.actualMiles} mi` : "Done"}</p>
                            <p className="text-[10px] text-gray capitalize">{completed.feeling}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ─── CALENDAR TAB ─────────────────────────────────────────── */}
        {tab === "calendar" && (
          <CalendarTab
            plan={plan}
            onEditWorkout={openEditWorkout}
            onLogWorkout={openWorkoutLog}
            onMarkComplete={markDayComplete}
          />
        )}

        {/* ─── PROGRESS TAB ──────────────────────────────────────────── */}
        {tab === "progress" && (
          <div className="space-y-6">
            <h2 className="font-headline text-2xl font-bold text-dark">Training Progress</h2>

            {/* Plan Settings */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h3 className="font-headline text-base font-bold text-dark mb-4">Plan Settings</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray mb-1.5">Race Name</label>
                  <input
                    type="text"
                    value={settingsRaceName || plan.raceName || ""}
                    onChange={(e) => setSettingsRaceName(e.target.value)}
                    onBlur={(e) => saveRaceName(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-dark focus:outline-none focus:border-primary"
                    placeholder="e.g. Mt. Wilson 50K"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray mb-1.5">Race Date</label>
                  <input
                    type="date"
                    value={settingsRaceDate || plan.raceDate}
                    onChange={(e) => setSettingsRaceDate(e.target.value)}
                    onBlur={(e) => requestRaceDateChange(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-dark focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray mb-1.5">Distance</label>
                  <p className="text-sm text-dark/60 py-2">{plan.distance} <span className="text-xs text-gray">(locked)</span></p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray mb-1.5">Level</label>
                  <p className="text-sm text-dark/60 py-2 capitalize">{plan.level} <span className="text-xs text-gray">(locked)</span></p>
                </div>
              </div>
            </div>

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

            {/* Consistency streak */}
            {consistencyStreak > 0 && (
              <div className="bg-accent/10 border border-accent/20 rounded-2xl p-5 flex items-center gap-4">
                <Flame className="w-10 h-10 text-orange-500 flex-shrink-0" />
                <div>
                  <div className="font-headline text-2xl font-bold text-dark">{consistencyStreak} Week Streak</div>
                  <p className="text-sm text-gray">
                    You&apos;ve completed all workouts for {consistencyStreak} consecutive week{consistencyStreak !== 1 ? "s" : ""}!
                  </p>
                </div>
              </div>
            )}

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

            {/* Weekly mileage bar chart */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h3 className="font-headline font-bold text-dark mb-4">Weekly Mileage</h3>
              <div className="space-y-2">
                {weeklyMileageData.map((w) => (
                  <div key={w.weekNum} className={`flex items-center gap-3 ${w.isCurrent ? "bg-primary/5 rounded-lg p-2 -mx-2" : ""}`}>
                    <div className="w-12 text-xs font-bold text-dark flex-shrink-0">W{w.weekNum}</div>
                    <div className="flex-1 relative">
                      {/* Target bar (background) */}
                      <div className="h-6 bg-gray-100 rounded-md relative overflow-hidden">
                        <div
                          className="absolute inset-y-0 left-0 bg-gray-200 rounded-md"
                          style={{ width: `${(w.target / maxMileage) * 100}%` }}
                        />
                        {/* Actual bar (foreground) */}
                        <div
                          className={`absolute inset-y-0 left-0 rounded-md transition-all duration-300 ${
                            w.actual >= w.target * 0.9 ? "bg-green-500" : w.actual > 0 ? "bg-primary" : ""
                          }`}
                          style={{ width: `${(w.actual / maxMileage) * 100}%` }}
                        />
                        <div className="absolute inset-0 flex items-center px-2">
                          <span className="text-[10px] font-medium text-dark/70 relative z-10">
                            {w.actual > 0 ? `${w.actual.toFixed(0)}/${w.target}mi` : `${w.target}mi target`}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="w-16 text-right">
                      <span className="text-[10px] text-gray">{w.phase}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Feeling distribution */}
            {Object.keys(feelingDistribution).length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <h3 className="font-headline font-bold text-dark mb-4">How You&apos;ve Been Feeling</h3>
                <div className="grid grid-cols-5 gap-3">
                  {FEELING_OPTIONS.map((f) => {
                    const count = feelingDistribution[f.value] || 0;
                    const total = Object.values(feelingDistribution).reduce((s, v) => s + v, 0);
                    const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                    return (
                      <div key={f.value} className="text-center">
                        <div className="text-2xl mb-1">{f.emoji}</div>
                        <div className="font-headline text-lg font-bold text-dark">{count}</div>
                        <div className="text-[10px] text-gray">{pct}%</div>
                        <div className="text-[10px] text-gray font-medium">{f.label}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Upcoming milestones */}
            {upcomingMilestones.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <h3 className="font-headline font-bold text-dark mb-4">Upcoming Milestones</h3>
                <div className="space-y-3">
                  {upcomingMilestones.slice(0, 5).map((m, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center text-accent text-sm flex-shrink-0">
                        <Flag className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-dark">{m.label}</p>
                        {m.weeksAway > 0 && (
                          <p className="text-[10px] text-gray">~{m.weeksAway} week{m.weeksAway !== 1 ? "s" : ""} away</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Weekly mileage table (original) */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h3 className="font-headline font-bold text-dark mb-4">Weekly Mileage Table</h3>
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
                              <span className="text-xs text-green-600 font-medium">Complete</span>
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
            <div className="flex items-center justify-center gap-6 pt-4">
              <Link href="/training/plans" className="text-xs text-gray hover:text-primary transition-colors">
                Build a New Plan
              </Link>
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
            {/* ─── SAVED CUSTOM KITS ─────────────────────────────────── */}
            {savedKits.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-headline text-2xl font-bold text-dark">Your Saved Kits</h2>
                  <Link href="/gear/kits" className="text-sm text-primary hover:underline font-medium">+ Build New Kit</Link>
                </div>

                {savedKits.map((savedKit) => {
                  const isExpanded = expandedKitId === savedKit.kitId;
                  const purchasedItems = savedKit.items.filter((i) => i.purchased);
                  const kitProgressPct = savedKit.items.length > 0
                    ? Math.round((purchasedItems.length / savedKit.items.length) * 100)
                    : 0;
                  const totalSpent = purchasedItems.reduce((s, i) => s + (i.actualPricePaid ?? i.price), 0);

                  return (
                    <div key={savedKit.kitId} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                      {/* Kit card header */}
                      <button
                        onClick={() => setExpandedKitId(isExpanded ? null : savedKit.kitId)}
                        className="w-full p-5 text-left hover:bg-gray-50/50 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-lg">🎒</span>
                              <h3 className="font-headline font-bold text-dark text-base truncate">{savedKit.kitTitle}</h3>
                            </div>
                            <p className="text-xs text-gray">{savedKit.items.length} items · ${savedKit.totalCost.toLocaleString()} total</p>
                          </div>
                          <div className="flex flex-col items-end gap-1 shrink-0">
                            <span className="text-xs font-semibold text-dark">{purchasedItems.length}/{savedKit.items.length} purchased</span>
                            <div className="w-24 bg-gray-200 rounded-full h-1.5">
                              <div className="bg-green-500 h-1.5 rounded-full transition-all" style={{ width: `${kitProgressPct}%` }} />
                            </div>
                          </div>
                        </div>
                        {purchasedItems.length > 0 && (
                          <div className="flex justify-between text-xs text-gray mt-2">
                            <span className="text-green-700 font-medium">${totalSpent.toLocaleString()} spent</span>
                            <span>${(savedKit.totalCost - totalSpent).toLocaleString()} remaining</span>
                          </div>
                        )}
                      </button>

                      {/* Expanded kit details */}
                      {isExpanded && (
                        <div className="border-t border-gray-100 p-5 space-y-4">
                          {/* Kit items */}
                          {savedKit.items.map((item, itemIndex) => (
                            <div
                              key={`${item.category}-${item.product}`}
                              className={`rounded-xl border p-4 ${item.purchased ? "border-green-200 bg-green-50/50" : "border-gray-200"}`}
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div className="flex-1 min-w-0">
                                  <p className={`font-headline font-bold text-sm ${item.purchased ? "text-green-700" : "text-dark"}`}>
                                    {item.brand} {item.product}
                                  </p>
                                  <p className="text-xs text-gray">{item.category} · ${item.price}</p>
                                  {item.purchased && item.purchaseDate && (
                                    <p className="text-xs text-green-600 mt-0.5">
                                      Purchased {item.purchaseDate}{item.retailerPurchasedFrom ? ` at ${item.retailerPurchasedFrom}` : ""}
                                    </p>
                                  )}
                                </div>
                                {!item.purchased ? (
                                  <button
                                    onClick={() => {
                                      setKitPurchaseModal({ kitId: savedKit.kitId, itemIndex });
                                      setKitPurchasePrice(String(item.price));
                                      setKitPurchaseRetailer("");
                                      setKitPurchaseDate(new Date().toISOString().split("T")[0]);
                                    }}
                                    className="text-xs font-medium text-primary hover:underline shrink-0"
                                  >
                                    Mark Purchased
                                  </button>
                                ) : (
                                  <span className="text-green-600 text-sm shrink-0">&#10003;</span>
                                )}
                              </div>

                              {/* Purchase modal */}
                              {kitPurchaseModal?.kitId === savedKit.kitId && kitPurchaseModal?.itemIndex === itemIndex && (
                                <div className="mt-3 border-t border-gray-200 pt-3 space-y-3">
                                  <p className="text-xs font-semibold text-dark">Log Purchase</p>
                                  <div className="grid grid-cols-2 gap-3">
                                    <div>
                                      <label className="block text-xs text-gray mb-1">Retailer</label>
                                      <select
                                        value={kitPurchaseRetailer}
                                        onChange={(e) => setKitPurchaseRetailer(e.target.value)}
                                        className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-xs text-dark focus:outline-none focus:border-primary"
                                      >
                                        <option value="">Select...</option>
                                        <option value="REI">REI</option>
                                        <option value="Amazon">Amazon</option>
                                        <option value="Backcountry">Backcountry</option>
                                        <option value="Running Warehouse">Running Warehouse</option>
                                        <option value="Other">Other</option>
                                      </select>
                                    </div>
                                    <div>
                                      <label className="block text-xs text-gray mb-1">Price Paid</label>
                                      <input
                                        type="number"
                                        value={kitPurchasePrice}
                                        onChange={(e) => setKitPurchasePrice(e.target.value)}
                                        className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-xs text-dark focus:outline-none focus:border-primary"
                                      />
                                    </div>
                                  </div>
                                  <div>
                                    <label className="block text-xs text-gray mb-1">Purchase Date</label>
                                    <input
                                      type="date"
                                      value={kitPurchaseDate}
                                      onChange={(e) => setKitPurchaseDate(e.target.value)}
                                      className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-xs text-dark focus:outline-none focus:border-primary"
                                    />
                                  </div>
                                  <div className="flex gap-2">
                                    <button
                                      onClick={async () => {
                                        const updatedKits = savedKits.map((k) => {
                                          if (k.kitId !== savedKit.kitId) return k;
                                          const updatedItems = [...k.items];
                                          updatedItems[itemIndex] = {
                                            ...updatedItems[itemIndex],
                                            purchased: true,
                                            purchaseDate: kitPurchaseDate,
                                            retailerPurchasedFrom: kitPurchaseRetailer,
                                            actualPricePaid: parseFloat(kitPurchasePrice) || updatedItems[itemIndex].price,
                                          };
                                          const purchasedItems = updatedItems.filter((i) => i.purchased);
                                          return {
                                            ...k,
                                            items: updatedItems,
                                            lastModified: new Date().toISOString(),
                                            purchaseProgress: {
                                              totalItems: updatedItems.length,
                                              purchased: purchasedItems.length,
                                              tested: updatedItems.filter((i) => i.tested).length,
                                              totalSpent: purchasedItems.reduce((s, i) => s + (i.actualPricePaid ?? i.price), 0),
                                            },
                                          };
                                        });
                                        setSavedKits(updatedKits);
                                        const updatedKit = updatedKits.find((k) => k.kitId === savedKit.kitId);
                                        if (updatedKit) await updateKitSync(updatedKit, user);
                                        setKitPurchaseModal(null);
                                      }}
                                      className="text-xs font-medium px-3 py-1.5 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                      Save Purchase
                                    </button>
                                    <button
                                      onClick={() => setKitPurchaseModal(null)}
                                      className="text-xs text-gray hover:text-dark"
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}

                          {/* Kit actions */}
                          <div className="flex gap-3 pt-2">
                            <Link href="/gear/kits" className="text-xs text-primary hover:underline font-medium">Edit Kit</Link>
                            <button
                              onClick={async () => {
                                if (confirm("Delete this kit? This cannot be undone.")) {
                                  await deleteKitSync(savedKit.kitId, user);
                                  setSavedKits((prev) => prev.filter((k) => k.kitId !== savedKit.kitId));
                                }
                              }}
                              className="text-xs text-red-500 hover:underline font-medium"
                            >
                              Delete Kit
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Build kit CTA if no saved kits */}
            {savedKits.length === 0 && (
              <div className="bg-accent/5 border border-accent/20 rounded-xl p-5 text-center">
                <p className="text-lg mb-2">🎒</p>
                <p className="font-headline font-bold text-dark text-sm mb-1">Build a Custom Gear Kit</p>
                <p className="text-xs text-gray mb-3">Answer 10 questions and get a personalized gear list with purchase links and tracking.</p>
                <Link href="/gear/kits" className="inline-flex items-center gap-1 px-4 py-2 bg-accent hover:bg-orange-600 text-white text-xs font-semibold rounded-lg transition-colors">
                  Build Your Kit
                </Link>
              </div>
            )}

            <div className="flex items-center justify-between">
              <h2 className="font-headline text-2xl font-bold text-dark">Gear Checklist</h2>
              <span className="text-sm text-gray">{gearPurchased}/{plan.gearItems.length} purchased · {gearTested} tested</span>
            </div>

            {/* Priority groups */}
            {(["critical", "high", "standard"] as const).map((priority) => {
              const items = plan.gearItems.filter((g) => g.priority === priority);
              if (items.length === 0) return null;
              const priorityLabel = priority === "critical" ? "Critical — Order Now" : priority === "high" ? "High Priority" : "Standard Priority";
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
                            {item.purchased && <CheckCircle className="w-3 h-3" />}
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
                                  {item.tested ? "Tested" : "Mark Tested"}
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
                                {item.rating > 0 && <span>{"★".repeat(item.rating)} </span>}
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
                                      className={`${r <= gearRating ? "opacity-100" : "opacity-30"}`}
                                    >
                                      <Star className="w-5 h-5 text-yellow-400" />
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

            {/* Fueling Strategy Section */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-green-600 to-green-700 p-5">
                <h3 className="font-headline text-lg font-bold text-white">Race Day Fueling Strategy</h3>
                <p className="text-white/60 text-sm mt-1">Calculate your personalized nutrition targets</p>
              </div>
              <div className="p-5 space-y-4">
                {/* Input form */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-dark mb-1">Body Weight (lbs)</label>
                    <input
                      type="number"
                      value={fuelingWeight}
                      onChange={(e) => setFuelingWeight(e.target.value)}
                      placeholder="e.g. 160"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-dark focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-dark mb-1">Sweat Rate</label>
                    <select
                      value={fuelingSweatRate}
                      onChange={(e) => setFuelingSweatRate(e.target.value as "light" | "moderate" | "heavy")}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-dark focus:outline-none focus:border-primary"
                    >
                      <option value="light">Light sweater</option>
                      <option value="moderate">Moderate sweater</option>
                      <option value="heavy">Heavy sweater</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-dark mb-1">Stomach Sensitivity</label>
                    <select
                      value={fuelingSensitivity}
                      onChange={(e) => setFuelingSensitivity(e.target.value as "iron" | "average" | "sensitive")}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-dark focus:outline-none focus:border-primary"
                    >
                      <option value="iron">Iron stomach</option>
                      <option value="average">Average</option>
                      <option value="sensitive">Sensitive</option>
                    </select>
                  </div>
                </div>
                <button
                  onClick={saveFuelingProfile}
                  className="px-4 py-2 bg-green-600 text-white text-xs font-semibold rounded-lg hover:bg-green-700 transition-colors"
                >
                  Save Profile & Calculate
                </button>

                {/* Fueling results */}
                {fuelingStrategy && (
                  <div className="space-y-4 pt-4 border-t border-gray-100">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="bg-green-50 rounded-xl p-3 text-center">
                        <div className="font-headline text-xl font-bold text-green-800">{fuelingStrategy.hourlyCalories}</div>
                        <div className="text-[10px] text-green-600 font-medium">cal/hour</div>
                      </div>
                      <div className="bg-blue-50 rounded-xl p-3 text-center">
                        <div className="font-headline text-xl font-bold text-blue-800">{fuelingStrategy.hourlyFluids}oz</div>
                        <div className="text-[10px] text-blue-600 font-medium">fluid/hour</div>
                      </div>
                      <div className="bg-orange-50 rounded-xl p-3 text-center">
                        <div className="font-headline text-xl font-bold text-orange-800">{fuelingStrategy.hourlySodium}mg</div>
                        <div className="text-[10px] text-orange-600 font-medium">sodium/hour</div>
                      </div>
                      <div className="bg-purple-50 rounded-xl p-3 text-center">
                        <div className="font-headline text-xl font-bold text-purple-800">{fuelingStrategy.hourlyCarbs}g</div>
                        <div className="text-[10px] text-purple-600 font-medium">carbs/hour</div>
                      </div>
                    </div>

                    {/* Total race needs */}
                    <div className="bg-light rounded-xl p-4">
                      <h4 className="font-headline font-bold text-dark text-sm mb-2">
                        Total Race Needs (~{fuelingStrategy.estimatedHours} hours)
                      </h4>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
                        <div><span className="text-gray">Calories:</span> <span className="font-bold text-dark">{fuelingStrategy.totalCalories.toLocaleString()}</span></div>
                        <div><span className="text-gray">Fluids:</span> <span className="font-bold text-dark">{fuelingStrategy.totalFluids}oz</span></div>
                        <div><span className="text-gray">Sodium:</span> <span className="font-bold text-dark">{fuelingStrategy.totalSodium.toLocaleString()}mg</span></div>
                        <div><span className="text-gray">Carbs:</span> <span className="font-bold text-dark">{fuelingStrategy.totalCarbs}g</span></div>
                      </div>
                    </div>

                    {/* Hourly schedule */}
                    <div>
                      <h4 className="font-headline font-bold text-dark text-sm mb-2">Hourly Fueling Schedule</h4>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-gray-100">
                              <th className="text-left py-2 px-2 text-xs font-semibold text-dark">Hour</th>
                              <th className="text-left py-2 px-2 text-xs font-semibold text-dark">Miles</th>
                              <th className="text-left py-2 px-2 text-xs font-semibold text-dark">Cal</th>
                              <th className="text-left py-2 px-2 text-xs font-semibold text-dark">Fluids</th>
                              <th className="text-left py-2 px-2 text-xs font-semibold text-dark">Notes</th>
                            </tr>
                          </thead>
                          <tbody>
                            {fuelingStrategy.hourlySchedule.map((row) => (
                              <tr key={row.hour} className="border-b border-gray-50">
                                <td className="py-2 px-2 font-bold text-dark">{row.hour}</td>
                                <td className="py-2 px-2 text-gray">{row.miles}</td>
                                <td className="py-2 px-2 text-dark">{row.calories}</td>
                                <td className="py-2 px-2 text-dark">{row.fluids}</td>
                                <td className="py-2 px-2 text-gray text-xs">{row.notes}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Drop bag suggestions */}
                    {fuelingStrategy.dropBags.length > 0 && (
                      <div>
                        <h4 className="font-headline font-bold text-dark text-sm mb-2">Drop Bag Suggestions</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {fuelingStrategy.dropBags.map((bag, i) => (
                            <div key={i} className="bg-light rounded-xl p-4 border border-gray-100">
                              <h5 className="font-headline font-bold text-dark text-sm mb-2 flex items-center gap-1.5"><Package className="w-4 h-4 text-primary" /> {bag.location}</h5>
                              <ul className="space-y-1">
                                {bag.items.map((item, j) => (
                                  <li key={j} className="text-xs text-gray flex items-start gap-1.5">
                                    <span className="text-primary flex-shrink-0">·</span>{item}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
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
                      {product.purchased && <CheckCircle className="w-3 h-3" />}
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
                              Tested · {"★".repeat(product.stomachRating || 0)}
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
                                  className={`${r <= nutritionRating ? "opacity-100" : "opacity-30"}`}
                                >
                                  <Star className="w-5 h-5 text-yellow-400" />
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
                      <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                      <span className="font-medium">{n.brand} {n.productName}</span>
                      <span className="text-xs text-green-600 ml-auto">{"★".repeat(n.stomachRating)}</span>
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
            <h2 className="font-headline text-2xl font-bold text-dark">
              {raceIsPast ? "Post-Race Report" : "Race Day Countdown"}
            </h2>

            {/* Post-Race Report (race date has passed) */}
            {raceIsPast && (
              <div className="space-y-6">
                {plan.postRaceReport?.completedAt ? (
                  /* Show saved report */
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
                    <div className="flex items-center gap-3">
                      <Medal className="w-8 h-8 text-accent flex-shrink-0" />
                      <div>
                        <h3 className="font-headline text-xl font-bold text-dark">
                          {plan.postRaceReport.dnf ? "DNF" : `Finished: ${plan.postRaceReport.finishTime || "N/A"}`}
                        </h3>
                        {plan.postRaceReport.placing && (
                          <p className="text-sm text-gray">Overall: {plan.postRaceReport.placing}{plan.postRaceReport.ageGroupPlacing ? ` · AG: ${plan.postRaceReport.ageGroupPlacing}` : ""}</p>
                        )}
                      </div>
                    </div>
                    {plan.postRaceReport.overallFeeling && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-dark">Overall feeling:</span>
                        <span className="text-sm text-gray capitalize">{plan.postRaceReport.overallFeeling}</span>
                      </div>
                    )}
                    {plan.postRaceReport.wentWell && (
                      <div>
                        <h4 className="text-sm font-bold text-green-700 mb-1">What went well</h4>
                        <p className="text-sm text-gray">{plan.postRaceReport.wentWell}</p>
                      </div>
                    )}
                    {plan.postRaceReport.improvements && (
                      <div>
                        <h4 className="text-sm font-bold text-orange-700 mb-1">What could improve</h4>
                        <p className="text-sm text-gray">{plan.postRaceReport.improvements}</p>
                      </div>
                    )}
                    {plan.postRaceReport.wouldChange && (
                      <div>
                        <h4 className="text-sm font-bold text-blue-700 mb-1">What I would change</h4>
                        <p className="text-sm text-gray">{plan.postRaceReport.wouldChange}</p>
                      </div>
                    )}
                    {plan.postRaceReport.nutritionNotes && (
                      <div>
                        <h4 className="text-sm font-bold text-purple-700 mb-1">Nutrition notes</h4>
                        <p className="text-sm text-gray">{plan.postRaceReport.nutritionNotes}</p>
                      </div>
                    )}
                    {plan.postRaceReport.gearNotes && (
                      <div>
                        <h4 className="text-sm font-bold text-dark mb-1">Gear notes</h4>
                        <p className="text-sm text-gray">{plan.postRaceReport.gearNotes}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  /* Post-race report form */
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
                    <p className="text-sm text-gray">Congratulations on completing (or attempting) your race! Record your results and reflections.</p>
                    <div className="flex items-center gap-3">
                      <label className="flex items-center gap-2 text-sm text-dark">
                        <input
                          type="checkbox"
                          checked={postRaceForm.dnf ?? false}
                          onChange={(e) => setPostRaceForm({ ...postRaceForm, dnf: e.target.checked })}
                          className="rounded border-gray-300"
                        />
                        DNF (Did Not Finish)
                      </label>
                    </div>
                    {!postRaceForm.dnf && (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-dark mb-1">Finish Time</label>
                          <input
                            type="text"
                            value={postRaceForm.finishTime ?? ""}
                            onChange={(e) => setPostRaceForm({ ...postRaceForm, finishTime: e.target.value })}
                            placeholder="e.g. 12:34:56"
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-dark focus:outline-none focus:border-primary"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-dark mb-1">Overall Placing</label>
                          <input
                            type="text"
                            value={postRaceForm.placing ?? ""}
                            onChange={(e) => setPostRaceForm({ ...postRaceForm, placing: e.target.value })}
                            placeholder="e.g. 42/200"
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-dark focus:outline-none focus:border-primary"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-dark mb-1">Age Group Placing</label>
                          <input
                            type="text"
                            value={postRaceForm.ageGroupPlacing ?? ""}
                            onChange={(e) => setPostRaceForm({ ...postRaceForm, ageGroupPlacing: e.target.value })}
                            placeholder="e.g. 5/30"
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-dark focus:outline-none focus:border-primary"
                          />
                        </div>
                      </div>
                    )}
                    <div>
                      <label className="block text-xs font-medium text-dark mb-1">Overall Feeling</label>
                      <div className="flex gap-2">
                        {(["amazing", "good", "tough", "brutal"] as const).map((f) => (
                          <button
                            key={f}
                            onClick={() => setPostRaceForm({ ...postRaceForm, overallFeeling: f })}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${
                              postRaceForm.overallFeeling === f ? "bg-primary text-white" : "bg-light border border-gray-200 text-dark"
                            }`}
                          >
                            {f}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-dark mb-1">What went well?</label>
                      <textarea
                        value={postRaceForm.wentWell ?? ""}
                        onChange={(e) => setPostRaceForm({ ...postRaceForm, wentWell: e.target.value })}
                        placeholder="Pacing, nutrition, gear, mental game..."
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-dark focus:outline-none focus:border-primary resize-none"
                        rows={2}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-dark mb-1">What could improve?</label>
                      <textarea
                        value={postRaceForm.improvements ?? ""}
                        onChange={(e) => setPostRaceForm({ ...postRaceForm, improvements: e.target.value })}
                        placeholder="Areas that need work for next time..."
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-dark focus:outline-none focus:border-primary resize-none"
                        rows={2}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-dark mb-1">What would you change?</label>
                      <textarea
                        value={postRaceForm.wouldChange ?? ""}
                        onChange={(e) => setPostRaceForm({ ...postRaceForm, wouldChange: e.target.value })}
                        placeholder="Training, race strategy, gear choices..."
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-dark focus:outline-none focus:border-primary resize-none"
                        rows={2}
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-dark mb-1">Nutrition Notes</label>
                        <textarea
                          value={postRaceForm.nutritionNotes ?? ""}
                          onChange={(e) => setPostRaceForm({ ...postRaceForm, nutritionNotes: e.target.value })}
                          placeholder="What worked, what didn't..."
                          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-dark focus:outline-none focus:border-primary resize-none"
                          rows={2}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-dark mb-1">Gear Notes</label>
                        <textarea
                          value={postRaceForm.gearNotes ?? ""}
                          onChange={(e) => setPostRaceForm({ ...postRaceForm, gearNotes: e.target.value })}
                          placeholder="Any issues, things that worked great..."
                          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-dark focus:outline-none focus:border-primary resize-none"
                          rows={2}
                        />
                      </div>
                    </div>
                    <button
                      onClick={savePostRaceReport}
                      className="px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-colors"
                    >
                      Save Race Report
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Pre-race: Phase-appropriate checklists */}
            {!raceIsPast && (
              <>
                <p className="text-sm text-gray">
                  {daysUntilRace} day{daysUntilRace !== 1 ? "s" : ""} until race day
                </p>

                {/* Race Day (0-1 days) - combined Night Before + Race Morning + Start Line */}
                {daysUntilRace <= 1 && plan.raceCountdown && (
                  <div className="space-y-6">
                    {renderCountdownChecklist("Night Before", <Moon className="w-4 h-4" />, plan.raceCountdown.nightBefore, "nightBefore")}
                    {renderCountdownChecklist("Race Morning", <Sunrise className="w-4 h-4" />, plan.raceCountdown.raceMorning, "raceMorning")}
                    {renderCountdownChecklist("Start Line", <Flag className="w-4 h-4" />, plan.raceCountdown.startLine, "startLine")}
                  </div>
                )}

                {/* Race Week (1-7 days) */}
                {daysUntilRace > 1 && daysUntilRace <= 7 && plan.raceCountdown && (
                  <div className="space-y-6">
                    {renderCountdownChecklist("Race Week", <Calendar className="w-4 h-4" />, plan.raceCountdown.raceWeek, "raceWeek")}
                  </div>
                )}

                {/* 2 Weeks Out (7-14 days) */}
                {daysUntilRace > 7 && daysUntilRace <= 14 && plan.raceCountdown && (
                  <div className="space-y-6">
                    {renderCountdownChecklist("2 Weeks Out", <ClipboardList className="w-4 h-4" />, plan.raceCountdown.twoWeeksOut, "twoWeeksOut")}
                  </div>
                )}

                {/* 4 Weeks Out (14-28 days) */}
                {daysUntilRace > 14 && daysUntilRace <= 28 && plan.raceCountdown && (
                  <div className="space-y-6">
                    {renderCountdownChecklist("4 Weeks Out", <Package className="w-4 h-4" />, plan.raceCountdown.fourWeeksOut, "fourWeeksOut")}
                  </div>
                )}

                {/* 28+ days - show original race day checklist */}
                {daysUntilRace > 28 && (
                  <>
                    <p className="text-sm text-gray">
                      {plan.raceDayChecklist.filter((i) => i.checked).length}/{plan.raceDayChecklist.length} items checked
                    </p>
                    {Array.from(new Set(plan.raceDayChecklist.map((i) => i.category))).map((category) => {
                      const items = plan.raceDayChecklist.filter((i) => i.category === category);
                      return (
                        <div key={category}>
                          <h3 className="font-headline font-bold text-dark text-sm uppercase tracking-wider mb-3">
                            {category === "Night Before" ? <Moon className="w-4 h-4" /> : category === "Race Morning" ? <Sunrise className="w-4 h-4" /> : <Flag className="w-4 h-4" />} {category}
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
                                  {item.checked && <CheckCircle className="w-3 h-3" />}
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
                  </>
                )}

                {/* Race day motivation */}
                {daysUntilRace <= 7 && (
                  <div className="bg-accent/10 border border-accent/20 rounded-2xl p-6 text-center">
                    <div className="flex justify-center mb-3"><Flag className="w-10 h-10 text-accent" /></div>
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
              </>
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

      {/* ─── Race Date Confirm Modal ─────────────────────────────────── */}
      {raceDateConfirmOpen && pendingRaceDate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => { setRaceDateConfirmOpen(false); setSettingsRaceDate(plan?.raceDate || ""); }} />
          <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <h3 className="font-headline text-xl font-bold text-dark mb-2">Update Race Date?</h3>
            <p className="text-sm text-gray mb-4">
              Changing your race date from{" "}
              <span className="font-semibold text-dark">
                {plan ? new Date(plan.raceDate + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : ""}
              </span>{" "}
              to{" "}
              <span className="font-semibold text-dark">
                {new Date(pendingRaceDate + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </span>{" "}
              will regenerate your training schedule.
            </p>
            <ul className="text-sm text-gray space-y-1 mb-6 list-none">
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0" />Your completed workout logs will be preserved</li>
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0" />Gear and nutrition tracking stays the same</li>
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-yellow-500 flex-shrink-0" />The weekly schedule will be rebuilt to fit the new timeline</li>
            </ul>
            <div className="flex gap-3">
              <button
                onClick={confirmRaceDateChange}
                className="flex-1 px-5 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-colors"
              >
                Update Schedule
              </button>
              <button
                onClick={() => { setRaceDateConfirmOpen(false); setSettingsRaceDate(plan?.raceDate || ""); }}
                className="px-5 py-3 bg-light text-dark font-medium rounded-xl hover:bg-gray-200 transition-colors border border-gray-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Edit Workout Modal ──────────────────────────────────────── */}
      {editWorkoutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setEditWorkoutOpen(false)} />
          <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="font-headline text-xl font-bold text-dark mb-4">Edit Workout</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-dark mb-2">Workout Type</label>
                <input
                  type="text"
                  value={editWorkoutType}
                  onChange={(e) => setEditWorkoutType(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 text-dark focus:outline-none focus:border-primary"
                  placeholder="e.g. Easy run, Long run, Tempo run"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark mb-2">Distance</label>
                <input
                  type="text"
                  value={editDistance}
                  onChange={(e) => setEditDistance(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 text-dark focus:outline-none focus:border-primary"
                  placeholder="e.g. 8 miles, 5K"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark mb-2">Effort</label>
                <input
                  type="text"
                  value={editEffort}
                  onChange={(e) => setEditEffort(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 text-dark focus:outline-none focus:border-primary"
                  placeholder="e.g. Zone 2, Zone 3, Race pace"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark mb-2">Notes</label>
                <textarea
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  placeholder="Workout instructions or personal notes..."
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 text-dark focus:outline-none focus:border-primary resize-none"
                  rows={3}
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={saveEditWorkout}
                  className="flex-1 px-5 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-colors"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setEditWorkoutOpen(false)}
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
