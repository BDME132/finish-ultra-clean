"use client";

import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, CheckCircle, Pencil } from "lucide-react";
import type { SavedPlan, SavedWorkoutDay, CompletedWorkout } from "@/lib/training-types";

// ─── Types ──────────────────────────────────────────────────────────────────────

interface CalendarDayData {
  weekNumber: number;
  dayIndex: number;
  workout: SavedWorkoutDay;
  phase: string;
  isRecovery: boolean;
  completed: CompletedWorkout | undefined;
}

interface CalendarTabProps {
  plan: SavedPlan;
  onEditWorkout: (weekNum: number, dayIndex: number) => void;
  onLogWorkout: (weekNum: number, dayIndex: number) => void;
  onMarkComplete: (weekNum: number, dayIndex: number) => void;
}

// ─── Phase colors ───────────────────────────────────────────────────────────────

const PHASE_COLORS: Record<string, { bg: string; text: string; border: string; dot: string }> = {
  Base:    { bg: "bg-blue-50",    text: "text-blue-700",   border: "border-blue-200",   dot: "bg-blue-500"   },
  Cutback: { bg: "bg-green-50",   text: "text-green-700",  border: "border-green-200",  dot: "bg-green-500"  },
  Build:   { bg: "bg-yellow-50",  text: "text-yellow-700", border: "border-yellow-200", dot: "bg-yellow-500" },
  Peak:    { bg: "bg-orange-50",  text: "text-orange-800", border: "border-orange-200", dot: "bg-orange-500" },
  Sharpen: { bg: "bg-purple-50",  text: "text-purple-700", border: "border-purple-200", dot: "bg-purple-500" },
  Taper:   { bg: "bg-teal-50",    text: "text-teal-700",   border: "border-teal-200",   dot: "bg-teal-500"   },
  Race:    { bg: "bg-primary/5",  text: "text-primary",    border: "border-primary/30", dot: "bg-primary"    },
};
const DEFAULT_PHASE = { bg: "bg-gray-50", text: "text-gray-600", border: "border-gray-200", dot: "bg-gray-400" };

const DAY_HEADERS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const DAY_OFFSETS: Record<string, number> = {
  Mon: 0, Tue: 1, Wed: 2, Thu: 3, Fri: 4, Sat: 5, Sun: 6,
};

// Workout intensity accent — a thin left border color to help scan the calendar
function workoutAccent(workout: string): string {
  const w = workout.toLowerCase();
  if (w === "rest") return "border-l-gray-300";
  if (w.includes("recovery") || w === "rest") return "border-l-gray-300";
  if (w.includes("easy")) return "border-l-green-400";
  if (w.includes("tempo")) return "border-l-yellow-500";
  if (w.includes("hill")) return "border-l-orange-500";
  if (w.includes("back-to-back")) return "border-l-red-400";
  if (w.includes("long") || w.includes("race simulation")) return "border-l-red-500";
  return "border-l-gray-300";
}

// ─── Helpers ────────────────────────────────────────────────────────────────────

function dateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function buildWorkoutMap(plan: SavedPlan): Map<string, CalendarDayData> {
  const map = new Map<string, CalendarDayData>();
  const raceDate = new Date(plan.raceDate + "T00:00:00");

  for (const week of plan.weeks) {
    // Compute the reference point for this week
    const weekStart = new Date(raceDate);
    weekStart.setDate(weekStart.getDate() - week.weeksToRace * 7);

    // Find the Monday of the ISO week containing weekStart
    const dow = weekStart.getDay(); // 0=Sun, 1=Mon, ...
    const mondayOffset = dow === 0 ? -6 : 1 - dow;
    const monday = new Date(weekStart);
    monday.setDate(monday.getDate() + mondayOffset);

    for (let i = 0; i < week.days.length; i++) {
      const day = week.days[i];
      const offset = DAY_OFFSETS[day.day] ?? i;
      const dayDate = new Date(monday);
      dayDate.setDate(dayDate.getDate() + offset);
      const key = dateKey(dayDate);

      map.set(key, {
        weekNumber: week.weekNumber,
        dayIndex: i,
        workout: day,
        phase: week.phase,
        isRecovery: week.isRecovery,
        completed: plan.completedWorkouts[`w${week.weekNumber}-d${i}`],
      });
    }
  }
  return map;
}

function getCalendarGrid(year: number, month: number): (Date | null)[][] {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startPad = (firstDay.getDay() + 6) % 7; // Mon=0
  const totalDays = lastDay.getDate();

  const cells: (Date | null)[] = [];
  for (let i = 0; i < startPad; i++) cells.push(null);
  for (let d = 1; d <= totalDays; d++) cells.push(new Date(year, month, d));
  while (cells.length % 7 !== 0) cells.push(null);

  const rows: (Date | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) {
    rows.push(cells.slice(i, i + 7));
  }
  return rows;
}

function formatMonthYear(year: number, month: number): string {
  return new Date(year, month, 1).toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

function formatSelectedDate(key: string): string {
  const d = new Date(key + "T00:00:00");
  return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

// ─── Component ──────────────────────────────────────────────────────────────────

export default function CalendarTab({ plan, onEditWorkout, onLogWorkout, onMarkComplete }: CalendarTabProps) {
  const [viewYear, setViewYear] = useState(() => new Date().getFullYear());
  const [viewMonth, setViewMonth] = useState(() => new Date().getMonth());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const todayKey = dateKey(new Date());

  const workoutMap = useMemo(() => buildWorkoutMap(plan), [plan]);

  const grid = useMemo(() => getCalendarGrid(viewYear, viewMonth), [viewYear, viewMonth]);

  // Phases that actually appear in this plan (for legend)
  const planPhases = useMemo(() => {
    const seen = new Set<string>();
    for (const week of plan.weeks) {
      seen.add(week.phase);
    }
    return Array.from(seen);
  }, [plan]);

  // Plan date range for navigation bounds
  const planRange = useMemo(() => {
    const raceDate = new Date(plan.raceDate + "T00:00:00");
    const firstWeek = plan.weeks[0];
    const start = new Date(raceDate);
    start.setDate(start.getDate() - (firstWeek?.weeksToRace ?? plan.weeksTotal) * 7);
    return { start, end: raceDate };
  }, [plan]);

  const selectedDayData = selectedDate ? workoutMap.get(selectedDate) : null;

  function prevMonth() {
    if (viewMonth === 0) {
      setViewYear(viewYear - 1);
      setViewMonth(11);
    } else {
      setViewMonth(viewMonth - 1);
    }
  }

  function nextMonth() {
    if (viewMonth === 11) {
      setViewYear(viewYear + 1);
      setViewMonth(0);
    } else {
      setViewMonth(viewMonth + 1);
    }
  }

  function goToToday() {
    const now = new Date();
    setViewYear(now.getFullYear());
    setViewMonth(now.getMonth());
    setSelectedDate(todayKey);
  }

  // Check if prev/next buttons should be disabled
  const canGoPrev = viewYear > planRange.start.getFullYear() ||
    (viewYear === planRange.start.getFullYear() && viewMonth > planRange.start.getMonth());
  const canGoNext = viewYear < planRange.end.getFullYear() ||
    (viewYear === planRange.end.getFullYear() && viewMonth < planRange.end.getMonth());

  return (
    <div className="space-y-6">
      {/* Month header with navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={prevMonth}
            disabled={!canGoPrev}
            className="p-1.5 rounded-lg hover:bg-light transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-5 h-5 text-dark" />
          </button>
          <h2 className="font-headline text-xl sm:text-2xl font-bold text-dark min-w-[180px] text-center">
            {formatMonthYear(viewYear, viewMonth)}
          </h2>
          <button
            onClick={nextMonth}
            disabled={!canGoNext}
            className="p-1.5 rounded-lg hover:bg-light transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-5 h-5 text-dark" />
          </button>
        </div>
        <button
          onClick={goToToday}
          className="px-3 py-1.5 text-xs font-semibold text-primary bg-primary/5 hover:bg-primary/10 rounded-lg transition-colors"
        >
          Today
        </button>
      </div>

      {/* Calendar card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Legends */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 px-4 sm:px-5 py-3 border-b border-gray-100 bg-light/50">
          {/* Phase legend */}
          <div className="flex flex-wrap gap-3">
            {planPhases.map((phase) => {
              const colors = PHASE_COLORS[phase] || DEFAULT_PHASE;
              return (
                <div key={phase} className="flex items-center gap-1.5 text-xs text-gray font-medium">
                  <span className={`w-2.5 h-2.5 rounded-full ${colors.dot}`} />
                  {phase}
                </div>
              );
            })}
          </div>
          {/* Intensity legend */}
          <div className="flex flex-wrap gap-3">
            {[
              { label: "Rest", color: "bg-gray-300" },
              { label: "Easy", color: "bg-green-400" },
              { label: "Tempo", color: "bg-yellow-500" },
              { label: "Hard", color: "bg-orange-500" },
              { label: "Long", color: "bg-red-500" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-1.5 text-xs text-gray">
                <span className={`w-3 h-1.5 rounded-sm ${item.color}`} />
                {item.label}
              </div>
            ))}
          </div>
        </div>

        {/* Day-of-week headers */}
        <div className="grid grid-cols-7 text-center border-b border-gray-100">
          {DAY_HEADERS.map((d) => (
            <div key={d} className="text-[10px] sm:text-xs font-semibold text-gray uppercase tracking-wider py-2.5">
              {d}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-px bg-gray-100 p-px">
          {grid.flat().map((cell, idx) => {
          if (!cell) {
            return <div key={`empty-${idx}`} className="min-h-[72px] sm:min-h-[88px] bg-white" />;
          }

          const key = dateKey(cell);
          const data = workoutMap.get(key);
          const isToday = key === todayKey;
          const isSelected = key === selectedDate;
          const colors = data ? (PHASE_COLORS[data.phase] || DEFAULT_PHASE) : null;

          const accent = data ? workoutAccent(data.workout.workout) : "";

          return (
            <button
              key={key}
              onClick={() => setSelectedDate(isSelected ? null : key)}
              className={`min-h-[72px] sm:min-h-[88px] p-1.5 sm:p-2 text-left transition-all relative border-l-[3px] ${
                data ? accent : "border-l-transparent"
              } ${
                isSelected
                  ? "bg-primary/5 ring-2 ring-inset ring-primary"
                  : isToday
                  ? "bg-primary/5 ring-2 ring-inset ring-primary/40"
                  : data
                  ? `${colors!.bg}`
                  : "bg-white hover:bg-light/50"
              }`}
            >
              {/* Day number + completion check */}
              <div className="flex items-center justify-between mb-0.5">
                <span className={`text-xs sm:text-sm font-bold leading-none ${
                  isToday ? "bg-primary text-white w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center" : data ? colors!.text : "text-gray/40"
                }`}>
                  {cell.getDate()}
                </span>
                {data?.completed && (
                  <CheckCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-green-500" />
                )}
              </div>

              {/* Workout info (compact) */}
              {data && (
                <div className="space-y-0.5 mt-0.5">
                  <p className={`text-[10px] sm:text-xs font-medium ${colors!.text} leading-tight line-clamp-1`}>
                    {data.workout.workout}
                  </p>
                  {data.workout.distance !== "\u2014" && data.workout.distance !== "" && (
                    <p className="hidden sm:block text-[10px] text-gray/70 leading-tight">
                      {data.workout.distance}
                    </p>
                  )}
                </div>
              )}
            </button>
          );
        })}
        </div>
      </div>

      {/* Selected day detail panel */}
      {selectedDate && selectedDayData && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className={`px-5 py-3 ${(PHASE_COLORS[selectedDayData.phase] || DEFAULT_PHASE).bg} border-b ${(PHASE_COLORS[selectedDayData.phase] || DEFAULT_PHASE).border}`}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-headline font-bold text-dark">
                  {formatSelectedDate(selectedDate)}
                </h3>
                <p className={`text-xs font-medium ${(PHASE_COLORS[selectedDayData.phase] || DEFAULT_PHASE).text}`}>
                  {selectedDayData.phase} Phase{selectedDayData.isRecovery ? " (Recovery)" : ""}
                </p>
              </div>
              <span className="text-xs text-gray bg-white/80 px-2.5 py-1 rounded-full font-medium">
                Week {selectedDayData.weekNumber}
              </span>
            </div>
          </div>

          <div className="p-5 space-y-4">
            {/* Workout details */}
            <div>
              <h4 className="font-headline text-lg font-bold text-dark">
                {selectedDayData.workout.workout}
                {selectedDayData.workout.distance !== "\u2014" && selectedDayData.workout.distance !== "" && (
                  <span className="text-gray font-normal"> \u2014 {selectedDayData.workout.distance}</span>
                )}
              </h4>
              {selectedDayData.workout.effort && selectedDayData.workout.effort !== "\u2014" && (
                <p className="text-sm text-gray mt-1">Effort: {selectedDayData.workout.effort}</p>
              )}
              {selectedDayData.workout.notes && (
                <p className="text-sm text-gray/80 mt-1 italic">{selectedDayData.workout.notes}</p>
              )}
            </div>

            {/* Completion status */}
            {selectedDayData.completed && (
              <div className="bg-green-50 rounded-xl p-3 border border-green-100">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                  <span className="text-sm font-semibold text-green-800">Completed</span>
                </div>
                <p className="text-xs text-green-600 mt-1">
                  {selectedDayData.completed.actualMiles > 0 && `${selectedDayData.completed.actualMiles} mi \u00b7 `}
                  Feeling: {selectedDayData.completed.feeling}
                  {selectedDayData.completed.notes && ` \u00b7 "${selectedDayData.completed.notes}"`}
                </p>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex flex-wrap gap-2">
              {!selectedDayData.completed && (
                <>
                  <button
                    onClick={() => onMarkComplete(selectedDayData.weekNumber, selectedDayData.dayIndex)}
                    className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary-dark transition-colors"
                  >
                    Mark Complete
                  </button>
                  <button
                    onClick={() => onLogWorkout(selectedDayData.weekNumber, selectedDayData.dayIndex)}
                    className="px-4 py-2 bg-light text-dark text-sm font-medium rounded-xl hover:bg-gray-200 transition-colors border border-gray-200"
                  >
                    Log Details
                  </button>
                </>
              )}
              <button
                onClick={() => onEditWorkout(selectedDayData.weekNumber, selectedDayData.dayIndex)}
                className="px-4 py-2 bg-light text-dark text-sm font-medium rounded-xl hover:bg-gray-200 transition-colors border border-gray-200 flex items-center gap-1.5"
              >
                <Pencil className="w-3.5 h-3.5" />
                Edit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Selected day with no workout data */}
      {selectedDate && !selectedDayData && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-center">
          <p className="text-sm text-gray">
            {formatSelectedDate(selectedDate)} \u2014 No workout scheduled
          </p>
        </div>
      )}
    </div>
  );
}
