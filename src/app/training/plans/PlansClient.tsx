"use client";

import { useState, useRef, useMemo } from "react";
import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";
import WizardStepper from "@/components/training/WizardStepper";
import DistanceCard from "@/components/training/DistanceCard";
import PlanTabs, { type PlanTab } from "@/components/training/PlanTabs";

// ─── Types ────────────────────────────────────────────────────────────────────
type Distance = "50K" | "50M" | "100K" | "100M";
type Level = "foundation" | "beginner" | "intermediate" | "advanced" | "competitive";

interface PlanDay {
  day: string;
  workout: string;
  distance: string;
  effort: string;
  notes: string;
}

interface SampleWeek {
  label: string;
  context: string;
  days: PlanDay[];
}

interface LongRunRow {
  week: number;
  longRun: string;
  b2b: string;
  total: string;
  phase: string;
}

interface PlanDetail {
  duration: number;
  prerequisites: string[];
  weeklyRange: string;
  peakMileage: string;
  runsPerWeek: string;
  keyWorkouts: string[];
  highlights: string[];
  sampleWeeks: SampleWeek[];
  longRunProgression: LongRunRow[];
}

type AllPlans = Record<Distance, Record<Level, PlanDetail>>;

// ─── Plan Data ────────────────────────────────────────────────────────────────
const PLANS: AllPlans = {
  "50K": {
    foundation: {
      duration: 20,
      prerequisites: ["Can run 3 miles continuously", "Running 10–15 miles/week for 3+ months", "Completed at least a 5K or 10K"],
      weeklyRange: "15–35 miles",
      peakMileage: "30–35 miles",
      runsPerWeek: "3–4",
      keyWorkouts: ["Easy conversational runs (Zone 1–2)", "Weekly long run with walk breaks allowed", "Optional short mid-week run", "Strength/mobility work 2×/week"],
      highlights: ["Run/walk strategy built in from day one", "Progressive long run to 20 miles", "Cutback week every 3rd week", "20-week ramp for safe adaptation"],
      sampleWeeks: [
        {
          label: "Week 1 — Getting Started",
          context: "Easy entry. Run/walk is fine. Build the habit.",
          days: [
            { day: "Mon", workout: "Rest", distance: "—", effort: "—", notes: "Full rest or gentle walk" },
            { day: "Tue", workout: "Easy run/walk", distance: "2 miles", effort: "Zone 1–2", notes: "Run 3 min / walk 1 min repeats" },
            { day: "Wed", workout: "Strength & mobility", distance: "—", effort: "—", notes: "20 min bodyweight circuit" },
            { day: "Thu", workout: "Easy run", distance: "2.5 miles", effort: "Zone 2", notes: "All conversational" },
            { day: "Fri", workout: "Rest", distance: "—", effort: "—", notes: "" },
            { day: "Sat", workout: "Long run/walk", distance: "5 miles", effort: "Zone 1–2", notes: "Walk the hills, run the flats" },
            { day: "Sun", workout: "Rest or walk", distance: "—", effort: "Zone 1", notes: "30 min walk if you feel good" },
          ],
        },
        {
          label: "Week 10 — Building Confidence",
          context: "Mileage growing. Finding your rhythm.",
          days: [
            { day: "Mon", workout: "Rest", distance: "—", effort: "—", notes: "" },
            { day: "Tue", workout: "Easy run", distance: "4 miles", effort: "Zone 2", notes: "" },
            { day: "Wed", workout: "Strength & mobility", distance: "—", effort: "—", notes: "Core and hip circuit" },
            { day: "Thu", workout: "Easy run", distance: "4 miles", effort: "Zone 2", notes: "" },
            { day: "Fri", workout: "Rest", distance: "—", effort: "—", notes: "" },
            { day: "Sat", workout: "Long run", distance: "12 miles", effort: "Zone 2", notes: "Walk breaks every 3 miles OK" },
            { day: "Sun", workout: "Rest or walk", distance: "—", effort: "Zone 1", notes: "" },
          ],
        },
        {
          label: "Week 17 — Peak Week",
          context: "Biggest effort. You've come a long way.",
          days: [
            { day: "Mon", workout: "Rest", distance: "—", effort: "—", notes: "" },
            { day: "Tue", workout: "Easy run", distance: "5 miles", effort: "Zone 2", notes: "" },
            { day: "Wed", workout: "Easy run + strength", distance: "4 miles", effort: "Zone 2", notes: "Light strength after" },
            { day: "Thu", workout: "Easy run", distance: "4 miles", effort: "Zone 2", notes: "" },
            { day: "Fri", workout: "Rest", distance: "—", effort: "—", notes: "Prep for big weekend" },
            { day: "Sat", workout: "Long run", distance: "20 miles", effort: "Zone 2", notes: "Practice race nutrition. Walk breaks as needed." },
            { day: "Sun", workout: "Rest", distance: "—", effort: "—", notes: "Recovery is training" },
          ],
        },
      ],
      longRunProgression: [
        { week: 1, longRun: "5 mi", b2b: "—", total: "5 mi", phase: "Base" },
        { week: 4, longRun: "8 mi", b2b: "—", total: "8 mi", phase: "Base" },
        { week: 7, longRun: "10 mi", b2b: "—", total: "10 mi", phase: "Base" },
        { week: 10, longRun: "12 mi", b2b: "—", total: "12 mi", phase: "Build" },
        { week: 13, longRun: "16 mi", b2b: "—", total: "16 mi", phase: "Build" },
        { week: 17, longRun: "20 mi", b2b: "—", total: "20 mi", phase: "Peak" },
        { week: 19, longRun: "10 mi", b2b: "—", total: "10 mi", phase: "Taper" },
        { week: 20, longRun: "50K Race!", b2b: "—", total: "31 mi", phase: "Race" },
      ],
    },
    beginner: {
      duration: 16,
      prerequisites: ["Marathon finish or equivalent fitness", "Comfortable running 25–30 miles/week", "6+ months of consistent running"],
      weeklyRange: "25–50 miles",
      peakMileage: "45–50 miles",
      runsPerWeek: "4–5",
      keyWorkouts: ["Easy aerobic runs (Zone 2)", "Weekly long run", "Back-to-back weekend runs (start week 3)", "Hill repeats 1×/week (start week 5)", "Optional: 1 tempo run/week in build phase"],
      highlights: ["Progressive long run to 22 miles", "Cutback week every 4th week", "Nutrition practice built into every long run", "Full gear test in weeks 10–14"],
      sampleWeeks: [
        {
          label: "Week 1 — Base Building",
          context: "Establishing rhythm. All runs easy and conversational.",
          days: [
            { day: "Mon", workout: "Rest or 30-min walk", distance: "—", effort: "Zone 1", notes: "Active recovery" },
            { day: "Tue", workout: "Easy run", distance: "4 miles", effort: "Zone 2", notes: "Conversational pace throughout" },
            { day: "Wed", workout: "Easy run + strength", distance: "5 miles", effort: "Zone 2", notes: "20-min core/hip work after run" },
            { day: "Thu", workout: "Easy run", distance: "4 miles", effort: "Zone 2", notes: "Keep it flat" },
            { day: "Fri", workout: "Rest", distance: "—", effort: "—", notes: "Sleep and fuel" },
            { day: "Sat", workout: "Long run", distance: "10 miles", effort: "Zone 2", notes: "Time on feet — no pace goals" },
            { day: "Sun", workout: "Recovery run or rest", distance: "3 miles", effort: "Zone 1", notes: "Very easy. How do your legs feel?" },
          ],
        },
        {
          label: "Week 8 — Build Phase",
          context: "Mileage climbing. First real back-to-back. Start testing nutrition.",
          days: [
            { day: "Mon", workout: "Rest", distance: "—", effort: "—", notes: "Recover from weekend" },
            { day: "Tue", workout: "Easy run", distance: "6 miles", effort: "Zone 2", notes: "Shakeout from weekend" },
            { day: "Wed", workout: "Tempo run", distance: "6 miles (3 at tempo)", effort: "Zone 3–4", notes: "Warm up 1.5 mi, 3 mi tempo, cool down 1.5 mi" },
            { day: "Thu", workout: "Easy run + strength", distance: "5 miles", effort: "Zone 2", notes: "Hip strengthening routine" },
            { day: "Fri", workout: "Rest", distance: "—", effort: "—", notes: "Prep gear for big weekend" },
            { day: "Sat", workout: "Long run", distance: "17 miles", effort: "Zone 2", notes: "Practice gel every 45 min" },
            { day: "Sun", workout: "Back-to-back run", distance: "8 miles", effort: "Zone 1–2", notes: "Run on tired legs — this is the point" },
          ],
        },
        {
          label: "Week 13 — Peak Week",
          context: "Highest volume week. Simulate race conditions as closely as possible.",
          days: [
            { day: "Mon", workout: "Rest", distance: "—", effort: "—", notes: "You earned it" },
            { day: "Tue", workout: "Easy run", distance: "7 miles", effort: "Zone 2", notes: "" },
            { day: "Wed", workout: "Tempo run", distance: "7 miles (4 at tempo)", effort: "Zone 3–4", notes: "" },
            { day: "Thu", workout: "Easy run + hill repeats", distance: "6 miles", effort: "Zone 2–3", notes: "6 × 200m hill repeats" },
            { day: "Fri", workout: "Rest", distance: "—", effort: "—", notes: "Load up carbs" },
            { day: "Sat", workout: "Race simulation long run", distance: "22 miles", effort: "Zone 2", notes: "Full vest, race nutrition, race kit" },
            { day: "Sun", workout: "Back-to-back run", distance: "10 miles", effort: "Zone 1", notes: "Very easy. Note what hurts." },
          ],
        },
      ],
      longRunProgression: [
        { week: 1, longRun: "10 mi", b2b: "—", total: "10 mi", phase: "Base" },
        { week: 3, longRun: "13 mi", b2b: "6 mi", total: "19 mi", phase: "Base" },
        { week: 5, longRun: "15 mi", b2b: "7 mi", total: "22 mi", phase: "Build" },
        { week: 8, longRun: "17 mi", b2b: "8 mi", total: "25 mi", phase: "Build" },
        { week: 10, longRun: "20 mi", b2b: "8 mi", total: "28 mi", phase: "Build" },
        { week: 13, longRun: "22 mi", b2b: "10 mi", total: "32 mi", phase: "Peak" },
        { week: 15, longRun: "12 mi", b2b: "—", total: "12 mi", phase: "Taper" },
        { week: 16, longRun: "50K Race!", b2b: "—", total: "31 mi", phase: "Race" },
      ],
    },
    intermediate: {
      duration: 16,
      prerequisites: ["50K finish or strong marathon history", "Comfortable at 35–45 miles/week", "12+ months of structured running"],
      weeklyRange: "35–60 miles",
      peakMileage: "55–60 miles",
      runsPerWeek: "5–6",
      keyWorkouts: ["Zone 2 base runs", "Weekly tempo run (Zone 3)", "Long run with progression finish", "Back-to-back weekends (weekly from week 2)", "Hill repeats 2×/week in build phase"],
      highlights: ["Peak long run 26 miles with progression", "Race simulation at week 12", "Competitive 50K pacing strategy", "Strength + hill integration"],
      sampleWeeks: [
        {
          label: "Week 1 — Base Phase",
          context: "Higher starting volume. Easy pace discipline critical.",
          days: [
            { day: "Mon", workout: "Easy run", distance: "5 miles", effort: "Zone 2", notes: "Shakeout" },
            { day: "Tue", workout: "Easy run + strength", distance: "7 miles", effort: "Zone 2", notes: "Hip and core circuit after" },
            { day: "Wed", workout: "Tempo run", distance: "7 miles (4 at tempo)", effort: "Zone 3", notes: "" },
            { day: "Thu", workout: "Easy run", distance: "6 miles", effort: "Zone 2", notes: "" },
            { day: "Fri", workout: "Rest", distance: "—", effort: "—", notes: "" },
            { day: "Sat", workout: "Long run", distance: "14 miles", effort: "Zone 2", notes: "Last 3 miles at marathon effort" },
            { day: "Sun", workout: "Back-to-back run", distance: "7 miles", effort: "Zone 1–2", notes: "" },
          ],
        },
        {
          label: "Week 8 — Build Phase",
          context: "Intensity and volume both climbing. Cutback next week.",
          days: [
            { day: "Mon", workout: "Rest", distance: "—", effort: "—", notes: "" },
            { day: "Tue", workout: "Easy run", distance: "7 miles", effort: "Zone 2", notes: "" },
            { day: "Wed", workout: "Hill repeats + tempo", distance: "8 miles", effort: "Zone 3–4", notes: "6 × 400m hills, 2 mi tempo" },
            { day: "Thu", workout: "Easy run + strength", distance: "6 miles", effort: "Zone 2", notes: "" },
            { day: "Fri", workout: "Rest", distance: "—", effort: "—", notes: "" },
            { day: "Sat", workout: "Long run", distance: "22 miles", effort: "Zone 2", notes: "Last 5 miles at race effort" },
            { day: "Sun", workout: "Back-to-back run", distance: "10 miles", effort: "Zone 1–2", notes: "Easy. Note fatigue patterns." },
          ],
        },
        {
          label: "Week 13 — Peak Week",
          context: "Maximum training load. Full race rehearsal.",
          days: [
            { day: "Mon", workout: "Rest", distance: "—", effort: "—", notes: "" },
            { day: "Tue", workout: "Easy + strides", distance: "7 miles", effort: "Zone 2", notes: "6 × 100m strides" },
            { day: "Wed", workout: "Tempo run", distance: "9 miles (6 at tempo)", effort: "Zone 3–4", notes: "" },
            { day: "Thu", workout: "Easy run + hill repeats", distance: "7 miles", effort: "Zone 2–3", notes: "8 × 200m hills" },
            { day: "Fri", workout: "Rest", distance: "—", effort: "—", notes: "" },
            { day: "Sat", workout: "Race simulation", distance: "26 miles", effort: "Zone 2–3", notes: "Full race setup. Exact nutrition. Exact gear." },
            { day: "Sun", workout: "Back-to-back", distance: "12 miles", effort: "Zone 1", notes: "" },
          ],
        },
      ],
      longRunProgression: [
        { week: 1, longRun: "14 mi", b2b: "7 mi", total: "21 mi", phase: "Base" },
        { week: 3, longRun: "16 mi", b2b: "8 mi", total: "24 mi", phase: "Base" },
        { week: 5, longRun: "18 mi", b2b: "9 mi", total: "27 mi", phase: "Build" },
        { week: 8, longRun: "22 mi", b2b: "10 mi", total: "32 mi", phase: "Build" },
        { week: 10, longRun: "24 mi", b2b: "10 mi", total: "34 mi", phase: "Build" },
        { week: 13, longRun: "26 mi", b2b: "12 mi", total: "38 mi", phase: "Peak" },
        { week: 15, longRun: "14 mi", b2b: "—", total: "14 mi", phase: "Taper" },
        { week: 16, longRun: "50K Race!", b2b: "—", total: "31 mi", phase: "Race" },
      ],
    },
    advanced: {
      duration: 16,
      prerequisites: ["Multiple 50K finishes or sub-4:00 marathon", "50+ miles/week consistently", "18+ months of structured training"],
      weeklyRange: "50–75 miles",
      peakMileage: "70–75 miles",
      runsPerWeek: "6",
      keyWorkouts: ["Daily Zone 2 doubles optional", "Tempo runs with negative split", "Long runs with race-pace finish (10+ miles)", "Weekly hill repeats", "Interval sessions 1×/week in build phase"],
      highlights: ["Peak long run 28 miles with 10 at race pace", "Sub-5:00 or competitive 50K pacing", "Double-day training weeks", "3 full race simulations"],
      sampleWeeks: [
        {
          label: "Week 1 — Base Phase",
          context: "High volume from day one. Discipline on easy pace matters.",
          days: [
            { day: "Mon", workout: "Easy recovery", distance: "6 miles", effort: "Zone 1", notes: "" },
            { day: "Tue", workout: "Easy run + strength", distance: "9 miles", effort: "Zone 2", notes: "Full hip/core circuit after" },
            { day: "Wed", workout: "Tempo run", distance: "9 miles (6 at tempo)", effort: "Zone 3", notes: "" },
            { day: "Thu", workout: "Easy run", distance: "8 miles", effort: "Zone 2", notes: "" },
            { day: "Fri", workout: "Easy run", distance: "5 miles", effort: "Zone 2", notes: "" },
            { day: "Sat", workout: "Long run", distance: "18 miles", effort: "Zone 2", notes: "Last 4 miles at marathon effort" },
            { day: "Sun", workout: "Back-to-back run", distance: "10 miles", effort: "Zone 1–2", notes: "" },
          ],
        },
        {
          label: "Week 8 — Build Phase",
          context: "Peak intensity week before cutback. Push controlled.",
          days: [
            { day: "Mon", workout: "Rest", distance: "—", effort: "—", notes: "" },
            { day: "Tue", workout: "Interval session", distance: "10 miles", effort: "Zone 4", notes: "6 × 1000m @ 10K pace" },
            { day: "Wed", workout: "Easy run + strength", distance: "8 miles", effort: "Zone 2", notes: "" },
            { day: "Thu", workout: "Tempo + hills", distance: "10 miles", effort: "Zone 3–4", notes: "4 mi tempo, 4 × 800m hills" },
            { day: "Fri", workout: "Rest", distance: "—", effort: "—", notes: "" },
            { day: "Sat", workout: "Long run", distance: "24 miles", effort: "Zone 2–3", notes: "Last 8 miles at race pace" },
            { day: "Sun", workout: "Back-to-back run", distance: "12 miles", effort: "Zone 1", notes: "" },
          ],
        },
        {
          label: "Week 13 — Peak Week",
          context: "Last big push before taper.",
          days: [
            { day: "Mon", workout: "Rest", distance: "—", effort: "—", notes: "" },
            { day: "Tue", workout: "Intervals", distance: "10 miles", effort: "Zone 4–5", notes: "8 × 800m @ 5K effort" },
            { day: "Wed", workout: "Easy run", distance: "8 miles", effort: "Zone 2", notes: "" },
            { day: "Thu", workout: "Tempo run", distance: "10 miles (7 at tempo)", effort: "Zone 3–4", notes: "" },
            { day: "Fri", workout: "Rest", distance: "—", effort: "—", notes: "" },
            { day: "Sat", workout: "Race simulation", distance: "28 miles", effort: "Race effort", notes: "Full setup. Last 10 at goal race pace." },
            { day: "Sun", workout: "Back-to-back", distance: "14 miles", effort: "Zone 1", notes: "" },
          ],
        },
      ],
      longRunProgression: [
        { week: 1, longRun: "18 mi", b2b: "10 mi", total: "28 mi", phase: "Base" },
        { week: 3, longRun: "20 mi", b2b: "10 mi", total: "30 mi", phase: "Base" },
        { week: 5, longRun: "22 mi", b2b: "12 mi", total: "34 mi", phase: "Build" },
        { week: 8, longRun: "24 mi", b2b: "12 mi", total: "36 mi", phase: "Build" },
        { week: 10, longRun: "26 mi", b2b: "12 mi", total: "38 mi", phase: "Build" },
        { week: 13, longRun: "28 mi", b2b: "14 mi", total: "42 mi", phase: "Peak" },
        { week: 15, longRun: "16 mi", b2b: "—", total: "16 mi", phase: "Taper" },
        { week: 16, longRun: "50K Race!", b2b: "—", total: "31 mi", phase: "Race" },
      ],
    },
    competitive: {
      duration: 16,
      prerequisites: ["Multiple 50K finishes with competitive results", "55+ miles/week consistently", "Sub-5:00 50K or equivalent race pacing"],
      weeklyRange: "55–80 miles",
      peakMileage: "75–80 miles",
      runsPerWeek: "6–7",
      keyWorkouts: ["VO2 max intervals 2×/week", "Tempo runs with negative splits", "Long runs with extended race-pace segments", "Hill power repeats", "Double-day training in build phase"],
      highlights: ["Peak long run 30 miles with 12+ at race pace", "Sub-5:00 or podium 50K pacing strategy", "4 double-day training weeks", "3 full race simulations with splits analysis"],
      sampleWeeks: [
        {
          label: "Week 1 — Base Phase",
          context: "High volume, controlled intensity. Build the engine.",
          days: [
            { day: "Mon", workout: "Easy recovery", distance: "7 miles", effort: "Zone 1", notes: "" },
            { day: "Tue", workout: "AM intervals + PM easy", distance: "8 mi + 4 mi", effort: "Zone 4–5 / Zone 1", notes: "6 × 1000m @ 5K pace" },
            { day: "Wed", workout: "Easy run + strength", distance: "9 miles", effort: "Zone 2", notes: "Full strength circuit" },
            { day: "Thu", workout: "Tempo run", distance: "10 miles (7 at tempo)", effort: "Zone 3–4", notes: "Negative split the tempo" },
            { day: "Fri", workout: "Easy run", distance: "6 miles", effort: "Zone 2", notes: "" },
            { day: "Sat", workout: "Long run", distance: "20 miles", effort: "Zone 2–3", notes: "Last 6 at marathon effort" },
            { day: "Sun", workout: "Back-to-back", distance: "12 miles", effort: "Zone 1–2", notes: "" },
          ],
        },
        {
          label: "Week 8 — Build Phase",
          context: "Race-specific intensity. Every workout has purpose.",
          days: [
            { day: "Mon", workout: "Easy recovery", distance: "6 miles", effort: "Zone 1", notes: "" },
            { day: "Tue", workout: "VO2 max intervals", distance: "10 miles", effort: "Zone 5", notes: "8 × 800m @ 3K effort" },
            { day: "Wed", workout: "Easy run + strength", distance: "9 miles", effort: "Zone 2", notes: "" },
            { day: "Thu", workout: "Tempo + hills", distance: "11 miles", effort: "Zone 3–4", notes: "5 mi tempo, 4 × 600m hills" },
            { day: "Fri", workout: "Rest", distance: "—", effort: "—", notes: "" },
            { day: "Sat", workout: "Long run", distance: "26 miles", effort: "Zone 2–3", notes: "Last 10 at goal 50K pace" },
            { day: "Sun", workout: "Back-to-back", distance: "14 miles", effort: "Zone 1", notes: "" },
          ],
        },
        {
          label: "Week 13 — Peak Week",
          context: "Maximum load. Full race simulation with splits.",
          days: [
            { day: "Mon", workout: "Rest", distance: "—", effort: "—", notes: "" },
            { day: "Tue", workout: "VO2 max intervals", distance: "10 miles", effort: "Zone 5", notes: "10 × 600m @ mile effort" },
            { day: "Wed", workout: "Easy run", distance: "8 miles", effort: "Zone 2", notes: "" },
            { day: "Thu", workout: "Race-pace tempo", distance: "12 miles (8 at race pace)", effort: "Zone 3", notes: "Practice race nutrition" },
            { day: "Fri", workout: "Rest", distance: "—", effort: "—", notes: "" },
            { day: "Sat", workout: "Race simulation", distance: "30 miles", effort: "Race effort", notes: "Full setup. Track splits. Last 12 at goal pace." },
            { day: "Sun", workout: "Back-to-back", distance: "14 miles", effort: "Zone 1", notes: "" },
          ],
        },
      ],
      longRunProgression: [
        { week: 1, longRun: "20 mi", b2b: "12 mi", total: "32 mi", phase: "Base" },
        { week: 3, longRun: "22 mi", b2b: "12 mi", total: "34 mi", phase: "Base" },
        { week: 5, longRun: "24 mi", b2b: "14 mi", total: "38 mi", phase: "Build" },
        { week: 8, longRun: "26 mi", b2b: "14 mi", total: "40 mi", phase: "Build" },
        { week: 10, longRun: "28 mi", b2b: "14 mi", total: "42 mi", phase: "Build" },
        { week: 13, longRun: "30 mi", b2b: "14 mi", total: "44 mi", phase: "Peak" },
        { week: 15, longRun: "16 mi", b2b: "—", total: "16 mi", phase: "Taper" },
        { week: 16, longRun: "50K Race!", b2b: "—", total: "31 mi", phase: "Race" },
      ],
    },
  },
  "50M": {
    foundation: {
      duration: 24,
      prerequisites: ["Completed a 50K or marathon", "Running 15–25 miles/week for 3+ months", "Comfortable running 10+ miles"],
      weeklyRange: "20–40 miles",
      peakMileage: "35–40 miles",
      runsPerWeek: "3–4",
      keyWorkouts: ["Easy conversational runs", "Weekly long run building gradually", "Walk breaks on long runs encouraged", "Strength/mobility 2×/week"],
      highlights: ["Run/walk strategy for the full 50 miles", "Progressive long run to 24 miles", "Cutback every 3rd week", "24-week gradual buildup"],
      sampleWeeks: [
        {
          label: "Week 1 — Starting Out",
          context: "24 weeks ahead. Patience is the plan.",
          days: [
            { day: "Mon", workout: "Rest", distance: "—", effort: "—", notes: "" },
            { day: "Tue", workout: "Easy run", distance: "3 miles", effort: "Zone 2", notes: "" },
            { day: "Wed", workout: "Strength & mobility", distance: "—", effort: "—", notes: "Core and hip work" },
            { day: "Thu", workout: "Easy run", distance: "3 miles", effort: "Zone 2", notes: "" },
            { day: "Fri", workout: "Rest", distance: "—", effort: "—", notes: "" },
            { day: "Sat", workout: "Long run/walk", distance: "7 miles", effort: "Zone 1–2", notes: "Walk the hills" },
            { day: "Sun", workout: "Rest or walk", distance: "—", effort: "Zone 1", notes: "" },
          ],
        },
        {
          label: "Week 12 — Building Phase",
          context: "Long runs growing. Finding your rhythm.",
          days: [
            { day: "Mon", workout: "Rest", distance: "—", effort: "—", notes: "" },
            { day: "Tue", workout: "Easy run", distance: "5 miles", effort: "Zone 2", notes: "" },
            { day: "Wed", workout: "Strength & mobility", distance: "—", effort: "—", notes: "" },
            { day: "Thu", workout: "Easy run", distance: "5 miles", effort: "Zone 2", notes: "" },
            { day: "Fri", workout: "Rest", distance: "—", effort: "—", notes: "" },
            { day: "Sat", workout: "Long run", distance: "16 miles", effort: "Zone 2", notes: "Practice eating every 30 min" },
            { day: "Sun", workout: "Easy walk/run", distance: "3 miles", effort: "Zone 1", notes: "" },
          ],
        },
        {
          label: "Week 20 — Peak Week",
          context: "Biggest long run. You're ready for this.",
          days: [
            { day: "Mon", workout: "Rest", distance: "—", effort: "—", notes: "" },
            { day: "Tue", workout: "Easy run", distance: "5 miles", effort: "Zone 2", notes: "" },
            { day: "Wed", workout: "Easy run + strength", distance: "4 miles", effort: "Zone 2", notes: "" },
            { day: "Thu", workout: "Easy run", distance: "4 miles", effort: "Zone 2", notes: "" },
            { day: "Fri", workout: "Rest", distance: "—", effort: "—", notes: "" },
            { day: "Sat", workout: "Long run", distance: "24 miles", effort: "Zone 2", notes: "Full nutrition practice. Walk breaks OK." },
            { day: "Sun", workout: "Rest", distance: "—", effort: "—", notes: "" },
          ],
        },
      ],
      longRunProgression: [
        { week: 1, longRun: "7 mi", b2b: "—", total: "7 mi", phase: "Base" },
        { week: 5, longRun: "10 mi", b2b: "—", total: "10 mi", phase: "Base" },
        { week: 9, longRun: "14 mi", b2b: "—", total: "14 mi", phase: "Build" },
        { week: 12, longRun: "16 mi", b2b: "—", total: "16 mi", phase: "Build" },
        { week: 16, longRun: "20 mi", b2b: "—", total: "20 mi", phase: "Build" },
        { week: 20, longRun: "24 mi", b2b: "—", total: "24 mi", phase: "Peak" },
        { week: 22, longRun: "12 mi", b2b: "—", total: "12 mi", phase: "Taper" },
        { week: 24, longRun: "50M Race!", b2b: "—", total: "50 mi", phase: "Race" },
      ],
    },
    beginner: {
      duration: 20,
      prerequisites: ["50K finish", "Comfortable at 30–40 miles/week", "12+ months of running experience"],
      weeklyRange: "30–55 miles",
      peakMileage: "50–55 miles",
      runsPerWeek: "5",
      keyWorkouts: ["Zone 2 base runs", "Weekly long run", "Back-to-back weekends", "Hill repeats 1×/week from week 6", "Optional tempo run in build phase"],
      highlights: ["Progressive long run to 30 miles", "Cutback every 4th week", "Night running practice in weeks 14–18", "Aid station simulation in peak phase"],
      sampleWeeks: [
        {
          label: "Week 1 — Base Building",
          context: "20-week journey begins. Easy, consistent, patient.",
          days: [
            { day: "Mon", workout: "Rest or walk", distance: "—", effort: "Zone 1", notes: "Active recovery" },
            { day: "Tue", workout: "Easy run", distance: "5 miles", effort: "Zone 2", notes: "" },
            { day: "Wed", workout: "Easy run + strength", distance: "6 miles", effort: "Zone 2", notes: "Core and hip circuit" },
            { day: "Thu", workout: "Easy run", distance: "5 miles", effort: "Zone 2", notes: "" },
            { day: "Fri", workout: "Rest", distance: "—", effort: "—", notes: "" },
            { day: "Sat", workout: "Long run", distance: "12 miles", effort: "Zone 2", notes: "Time on feet" },
            { day: "Sun", workout: "Back-to-back", distance: "5 miles", effort: "Zone 1", notes: "Easy" },
          ],
        },
        {
          label: "Week 10 — Build Phase",
          context: "Mileage ramping. Back-to-backs getting serious.",
          days: [
            { day: "Mon", workout: "Rest", distance: "—", effort: "—", notes: "" },
            { day: "Tue", workout: "Easy run", distance: "7 miles", effort: "Zone 2", notes: "" },
            { day: "Wed", workout: "Tempo run", distance: "7 miles (4 at tempo)", effort: "Zone 3", notes: "" },
            { day: "Thu", workout: "Easy run + strength", distance: "6 miles", effort: "Zone 2", notes: "" },
            { day: "Fri", workout: "Rest", distance: "—", effort: "—", notes: "" },
            { day: "Sat", workout: "Long run", distance: "22 miles", effort: "Zone 2", notes: "Practice eating every 30 min" },
            { day: "Sun", workout: "Back-to-back", distance: "10 miles", effort: "Zone 1–2", notes: "" },
          ],
        },
        {
          label: "Week 16 — Peak Week",
          context: "Biggest weekend. Full race simulation.",
          days: [
            { day: "Mon", workout: "Rest", distance: "—", effort: "—", notes: "" },
            { day: "Tue", workout: "Easy run", distance: "7 miles", effort: "Zone 2", notes: "" },
            { day: "Wed", workout: "Tempo run", distance: "8 miles (5 at tempo)", effort: "Zone 3", notes: "" },
            { day: "Thu", workout: "Easy run", distance: "6 miles", effort: "Zone 2", notes: "" },
            { day: "Fri", workout: "Rest", distance: "—", effort: "—", notes: "" },
            { day: "Sat", workout: "Race simulation", distance: "30 miles", effort: "Zone 2", notes: "Full vest, full nutrition, night section if possible" },
            { day: "Sun", workout: "Back-to-back", distance: "12 miles", effort: "Zone 1", notes: "" },
          ],
        },
      ],
      longRunProgression: [
        { week: 1, longRun: "12 mi", b2b: "5 mi", total: "17 mi", phase: "Base" },
        { week: 5, longRun: "16 mi", b2b: "7 mi", total: "23 mi", phase: "Base" },
        { week: 8, longRun: "20 mi", b2b: "8 mi", total: "28 mi", phase: "Build" },
        { week: 10, longRun: "22 mi", b2b: "10 mi", total: "32 mi", phase: "Build" },
        { week: 13, longRun: "26 mi", b2b: "10 mi", total: "36 mi", phase: "Build" },
        { week: 16, longRun: "30 mi", b2b: "12 mi", total: "42 mi", phase: "Peak" },
        { week: 18, longRun: "16 mi", b2b: "—", total: "16 mi", phase: "Taper" },
        { week: 20, longRun: "50M Race!", b2b: "—", total: "50 mi", phase: "Race" },
      ],
    },
    intermediate: {
      duration: 20,
      prerequisites: ["50M finish or competitive 50K history", "45–55 miles/week consistently", "18+ months of structured training"],
      weeklyRange: "45–70 miles",
      peakMileage: "65–70 miles",
      runsPerWeek: "5–6",
      keyWorkouts: ["Daily Zone 2 foundation", "Tempo runs with long race-pace segments", "30+ mile long runs", "Back-to-back totaling 40+ miles", "Hill repeats and altitude-specific work"],
      highlights: ["Peak long run 35 miles", "Competitive 50M pacing and nutrition strategy", "Double-day training weeks", "2+ full race simulations"],
      sampleWeeks: [
        {
          label: "Week 1 — Base Phase",
          context: "Solid aerobic foundation. No shortcuts.",
          days: [
            { day: "Mon", workout: "Easy run", distance: "6 miles", effort: "Zone 2", notes: "" },
            { day: "Tue", workout: "Easy run + strength", distance: "8 miles", effort: "Zone 2", notes: "" },
            { day: "Wed", workout: "Tempo run", distance: "8 miles (5 at tempo)", effort: "Zone 3", notes: "" },
            { day: "Thu", workout: "Easy run", distance: "7 miles", effort: "Zone 2", notes: "" },
            { day: "Fri", workout: "Rest", distance: "—", effort: "—", notes: "" },
            { day: "Sat", workout: "Long run", distance: "16 miles", effort: "Zone 2", notes: "" },
            { day: "Sun", workout: "Back-to-back", distance: "8 miles", effort: "Zone 1–2", notes: "" },
          ],
        },
        {
          label: "Week 12 — Build Phase",
          context: "High volume, controlled intensity.",
          days: [
            { day: "Mon", workout: "Rest", distance: "—", effort: "—", notes: "" },
            { day: "Tue", workout: "Easy run", distance: "8 miles", effort: "Zone 2", notes: "" },
            { day: "Wed", workout: "Hill repeats + tempo", distance: "10 miles", effort: "Zone 3–4", notes: "6 × 600m hills, 3 mi tempo" },
            { day: "Thu", workout: "Easy run + strength", distance: "7 miles", effort: "Zone 2", notes: "" },
            { day: "Fri", workout: "Rest", distance: "—", effort: "—", notes: "" },
            { day: "Sat", workout: "Long run", distance: "30 miles", effort: "Zone 2", notes: "Race pace last 8 miles" },
            { day: "Sun", workout: "Back-to-back", distance: "14 miles", effort: "Zone 1", notes: "" },
          ],
        },
        {
          label: "Week 16 — Peak Week",
          context: "Maximum load. Everything simulated.",
          days: [
            { day: "Mon", workout: "Rest", distance: "—", effort: "—", notes: "" },
            { day: "Tue", workout: "Easy + strides", distance: "8 miles", effort: "Zone 2", notes: "" },
            { day: "Wed", workout: "Tempo run", distance: "10 miles (7 at tempo)", effort: "Zone 3–4", notes: "" },
            { day: "Thu", workout: "Easy run", distance: "7 miles", effort: "Zone 2", notes: "" },
            { day: "Fri", workout: "Rest", distance: "—", effort: "—", notes: "" },
            { day: "Sat", workout: "Race simulation", distance: "35 miles", effort: "Race effort", notes: "Full setup. Night section. Crew." },
            { day: "Sun", workout: "Back-to-back", distance: "14 miles", effort: "Zone 1", notes: "" },
          ],
        },
      ],
      longRunProgression: [
        { week: 1, longRun: "16 mi", b2b: "8 mi", total: "24 mi", phase: "Base" },
        { week: 5, longRun: "20 mi", b2b: "10 mi", total: "30 mi", phase: "Base" },
        { week: 8, longRun: "24 mi", b2b: "12 mi", total: "36 mi", phase: "Build" },
        { week: 12, longRun: "30 mi", b2b: "14 mi", total: "44 mi", phase: "Build" },
        { week: 16, longRun: "35 mi", b2b: "14 mi", total: "49 mi", phase: "Peak" },
        { week: 18, longRun: "18 mi", b2b: "—", total: "18 mi", phase: "Taper" },
        { week: 20, longRun: "50M Race!", b2b: "—", total: "50 mi", phase: "Race" },
      ],
    },
    advanced: {
      duration: 20,
      prerequisites: ["Multiple 50M finishes or competitive 100K", "55+ miles/week", "2+ years of structured ultra training"],
      weeklyRange: "60–85 miles",
      peakMileage: "80–85 miles",
      runsPerWeek: "6–7",
      keyWorkouts: ["Double-day training weeks", "VO2 max intervals", "Tempo runs with progressive race-pace finishes", "35+ mile long runs", "Back-to-back 45+ total miles"],
      highlights: ["Peak long run 38 miles", "Sub-10 or competitive pacing", "4 double-day training weeks", "3 full race simulations with crew"],
      sampleWeeks: [
        {
          label: "Week 1 — Base Phase",
          context: "High baseline. Control intensity.",
          days: [
            { day: "Mon", workout: "Easy recovery", distance: "7 miles", effort: "Zone 1", notes: "" },
            { day: "Tue", workout: "Easy run + strength", distance: "10 miles", effort: "Zone 2", notes: "" },
            { day: "Wed", workout: "Tempo run", distance: "10 miles (7 at tempo)", effort: "Zone 3", notes: "" },
            { day: "Thu", workout: "Easy run", distance: "8 miles", effort: "Zone 2", notes: "" },
            { day: "Fri", workout: "Easy run", distance: "5 miles", effort: "Zone 2", notes: "" },
            { day: "Sat", workout: "Long run", distance: "20 miles", effort: "Zone 2", notes: "Technical terrain" },
            { day: "Sun", workout: "Back-to-back", distance: "12 miles", effort: "Zone 1–2", notes: "" },
          ],
        },
        {
          label: "Week 14 — Peak Phase",
          context: "Maximum training load.",
          days: [
            { day: "Mon", workout: "Rest", distance: "—", effort: "—", notes: "" },
            { day: "Tue", workout: "VO2 max intervals", distance: "11 miles", effort: "Zone 5", notes: "8 × 800m @ 5K effort" },
            { day: "Wed", workout: "AM easy + PM easy", distance: "8 mi + 5 mi", effort: "Zone 1–2", notes: "Two-a-day" },
            { day: "Thu", workout: "Tempo + hills", distance: "11 miles", effort: "Zone 3–4", notes: "" },
            { day: "Fri", workout: "Rest", distance: "—", effort: "—", notes: "" },
            { day: "Sat", workout: "Race simulation", distance: "38 miles", effort: "Race effort", notes: "Full crew. Night section. Exact nutrition." },
            { day: "Sun", workout: "Back-to-back", distance: "16 miles", effort: "Zone 1", notes: "" },
          ],
        },
        {
          label: "Week 18 — Taper",
          context: "Trust the training. Recover.",
          days: [
            { day: "Mon", workout: "Rest", distance: "—", effort: "—", notes: "" },
            { day: "Tue", workout: "Easy + strides", distance: "7 miles", effort: "Zone 2", notes: "" },
            { day: "Wed", workout: "Sharpener", distance: "7 miles (3 × mile)", effort: "Zone 3", notes: "" },
            { day: "Thu", workout: "Easy run", distance: "5 miles", effort: "Zone 2", notes: "" },
            { day: "Fri", workout: "Rest", distance: "—", effort: "—", notes: "" },
            { day: "Sat", workout: "Easy long run", distance: "14 miles", effort: "Zone 2", notes: "" },
            { day: "Sun", workout: "Easy run", distance: "5 miles", effort: "Zone 1", notes: "" },
          ],
        },
      ],
      longRunProgression: [
        { week: 1, longRun: "20 mi", b2b: "12 mi", total: "32 mi", phase: "Base" },
        { week: 5, longRun: "24 mi", b2b: "12 mi", total: "36 mi", phase: "Base" },
        { week: 8, longRun: "28 mi", b2b: "14 mi", total: "42 mi", phase: "Build" },
        { week: 12, longRun: "34 mi", b2b: "16 mi", total: "50 mi", phase: "Build" },
        { week: 14, longRun: "38 mi", b2b: "16 mi", total: "54 mi", phase: "Peak" },
        { week: 18, longRun: "14 mi", b2b: "—", total: "14 mi", phase: "Taper" },
        { week: 20, longRun: "50M Race!", b2b: "—", total: "50 mi", phase: "Race" },
      ],
    },
    competitive: {
      duration: 20,
      prerequisites: ["Multiple 50M finishes or competitive 100K", "60+ miles/week consistently", "Sub-10:00 50M or equivalent pacing"],
      weeklyRange: "65–95 miles",
      peakMileage: "90–95 miles",
      runsPerWeek: "6–7",
      keyWorkouts: ["VO2 max intervals 2×/week", "Race-pace long run finishes (12+ miles)", "Back-to-back totaling 50+ miles", "Hill power repeats", "Double-day training in build/peak phases"],
      highlights: ["Peak long run 40 miles with race-pace sections", "Sub-10 or podium 50M strategy", "5 double-day training weeks", "4 full race simulations"],
      sampleWeeks: [
        {
          label: "Week 1 — Base Phase",
          context: "High baseline. Control and discipline.",
          days: [
            { day: "Mon", workout: "Easy recovery", distance: "7 miles", effort: "Zone 1", notes: "" },
            { day: "Tue", workout: "Intervals", distance: "10 miles", effort: "Zone 4–5", notes: "8 × 1000m @ 5K pace" },
            { day: "Wed", workout: "Easy run + strength", distance: "10 miles", effort: "Zone 2", notes: "" },
            { day: "Thu", workout: "Tempo run", distance: "10 miles (7 at tempo)", effort: "Zone 3–4", notes: "" },
            { day: "Fri", workout: "Easy run", distance: "6 miles", effort: "Zone 2", notes: "" },
            { day: "Sat", workout: "Long run", distance: "22 miles", effort: "Zone 2", notes: "Last 6 at marathon effort" },
            { day: "Sun", workout: "Back-to-back", distance: "12 miles", effort: "Zone 1–2", notes: "" },
          ],
        },
        {
          label: "Week 12 — Build Phase",
          context: "Volume and intensity peak together. Stay disciplined.",
          days: [
            { day: "Mon", workout: "Easy recovery", distance: "7 miles", effort: "Zone 1", notes: "" },
            { day: "Tue", workout: "VO2 max intervals", distance: "11 miles", effort: "Zone 5", notes: "8 × 800m @ 3K effort" },
            { day: "Wed", workout: "AM easy + PM easy", distance: "8 mi + 5 mi", effort: "Zone 1–2", notes: "Two-a-day" },
            { day: "Thu", workout: "Tempo + hills", distance: "12 miles", effort: "Zone 3–4", notes: "5 mi tempo, 4 × 800m hills" },
            { day: "Fri", workout: "Rest", distance: "—", effort: "—", notes: "" },
            { day: "Sat", workout: "Race simulation", distance: "36 miles", effort: "Zone 2–3", notes: "Last 12 at goal pace. Full nutrition." },
            { day: "Sun", workout: "Back-to-back", distance: "16 miles", effort: "Zone 1", notes: "" },
          ],
        },
        {
          label: "Week 16 — Peak Week",
          context: "Maximum load. Full simulation.",
          days: [
            { day: "Mon", workout: "Rest", distance: "—", effort: "—", notes: "" },
            { day: "Tue", workout: "VO2 max intervals", distance: "11 miles", effort: "Zone 5", notes: "10 × 600m" },
            { day: "Wed", workout: "Easy run", distance: "9 miles", effort: "Zone 2", notes: "" },
            { day: "Thu", workout: "Race-pace tempo", distance: "12 miles (9 at race pace)", effort: "Zone 3", notes: "" },
            { day: "Fri", workout: "Rest", distance: "—", effort: "—", notes: "" },
            { day: "Sat", workout: "Full simulation", distance: "40 miles", effort: "Race effort", notes: "Full crew. Night section. Track every split." },
            { day: "Sun", workout: "Back-to-back", distance: "16 miles", effort: "Zone 1", notes: "" },
          ],
        },
      ],
      longRunProgression: [
        { week: 1, longRun: "22 mi", b2b: "12 mi", total: "34 mi", phase: "Base" },
        { week: 5, longRun: "26 mi", b2b: "14 mi", total: "40 mi", phase: "Base" },
        { week: 8, longRun: "30 mi", b2b: "14 mi", total: "44 mi", phase: "Build" },
        { week: 12, longRun: "36 mi", b2b: "16 mi", total: "52 mi", phase: "Build" },
        { week: 16, longRun: "40 mi", b2b: "16 mi", total: "56 mi", phase: "Peak" },
        { week: 18, longRun: "18 mi", b2b: "—", total: "18 mi", phase: "Taper" },
        { week: 20, longRun: "50M Race!", b2b: "—", total: "50 mi", phase: "Race" },
      ],
    },
  },
  "100K": {
    foundation: {
      duration: 28,
      prerequisites: ["Completed a 50K", "Running 20–30 miles/week for 3+ months", "Comfortable with runs of 12+ miles"],
      weeklyRange: "20–45 miles",
      peakMileage: "40–45 miles",
      runsPerWeek: "3–4",
      keyWorkouts: ["Easy conversational runs", "Weekly long run building to 26 miles", "Walk breaks on long runs encouraged", "Strength/mobility 2×/week"],
      highlights: ["Run/walk strategy for 62 miles", "Progressive long run to 26 miles", "Cutback every 3rd week", "Night running introduction from week 18"],
      sampleWeeks: [
        {
          label: "Week 1 — Foundation",
          context: "28 weeks. Slow and steady wins this one.",
          days: [
            { day: "Mon", workout: "Rest", distance: "—", effort: "—", notes: "" },
            { day: "Tue", workout: "Easy run", distance: "4 miles", effort: "Zone 2", notes: "" },
            { day: "Wed", workout: "Strength & mobility", distance: "—", effort: "—", notes: "" },
            { day: "Thu", workout: "Easy run", distance: "3 miles", effort: "Zone 2", notes: "" },
            { day: "Fri", workout: "Rest", distance: "—", effort: "—", notes: "" },
            { day: "Sat", workout: "Long run/walk", distance: "8 miles", effort: "Zone 1–2", notes: "Walk the hills" },
            { day: "Sun", workout: "Rest or walk", distance: "—", effort: "Zone 1", notes: "" },
          ],
        },
        {
          label: "Week 14 — Build Phase",
          context: "Getting comfortable with longer efforts.",
          days: [
            { day: "Mon", workout: "Rest", distance: "—", effort: "—", notes: "" },
            { day: "Tue", workout: "Easy run", distance: "5 miles", effort: "Zone 2", notes: "" },
            { day: "Wed", workout: "Easy run + strength", distance: "4 miles", effort: "Zone 2", notes: "" },
            { day: "Thu", workout: "Easy run", distance: "5 miles", effort: "Zone 2", notes: "" },
            { day: "Fri", workout: "Rest", distance: "—", effort: "—", notes: "" },
            { day: "Sat", workout: "Long run", distance: "18 miles", effort: "Zone 2", notes: "Practice nutrition" },
            { day: "Sun", workout: "Easy walk", distance: "—", effort: "Zone 1", notes: "" },
          ],
        },
        {
          label: "Week 23 — Peak Week",
          context: "Biggest long run. Full rehearsal.",
          days: [
            { day: "Mon", workout: "Rest", distance: "—", effort: "—", notes: "" },
            { day: "Tue", workout: "Easy run", distance: "6 miles", effort: "Zone 2", notes: "" },
            { day: "Wed", workout: "Easy run + strength", distance: "4 miles", effort: "Zone 2", notes: "" },
            { day: "Thu", workout: "Easy run", distance: "5 miles", effort: "Zone 2", notes: "" },
            { day: "Fri", workout: "Rest", distance: "—", effort: "—", notes: "" },
            { day: "Sat", workout: "Long run", distance: "26 miles", effort: "Zone 2", notes: "Full race nutrition. Night section if possible." },
            { day: "Sun", workout: "Rest", distance: "—", effort: "—", notes: "" },
          ],
        },
      ],
      longRunProgression: [
        { week: 1, longRun: "8 mi", b2b: "—", total: "8 mi", phase: "Base" },
        { week: 5, longRun: "12 mi", b2b: "—", total: "12 mi", phase: "Base" },
        { week: 9, longRun: "14 mi", b2b: "—", total: "14 mi", phase: "Base" },
        { week: 14, longRun: "18 mi", b2b: "—", total: "18 mi", phase: "Build" },
        { week: 18, longRun: "22 mi", b2b: "—", total: "22 mi", phase: "Build" },
        { week: 23, longRun: "26 mi", b2b: "—", total: "26 mi", phase: "Peak" },
        { week: 26, longRun: "14 mi", b2b: "—", total: "14 mi", phase: "Taper" },
        { week: 28, longRun: "100K Race!", b2b: "—", total: "62 mi", phase: "Race" },
      ],
    },
    beginner: {
      duration: 24,
      prerequisites: ["50M finish or strong 50K finish", "Comfortable at 35–45 miles/week", "18+ months of consistent running"],
      weeklyRange: "35–60 miles",
      peakMileage: "55–60 miles",
      runsPerWeek: "5",
      keyWorkouts: ["Zone 2 base runs", "Weekly long run building to 30+ miles", "Back-to-back weekends", "Hill repeats 1×/week from week 8", "Night running practice from week 16"],
      highlights: ["Progressive long run to 32 miles", "Night run simulation", "Full 100K nutrition protocol testing", "Back-to-back totaling 44 miles"],
      sampleWeeks: [
        {
          label: "Week 1 — Base Building",
          context: "24-week plan. Patient foundation building.",
          days: [
            { day: "Mon", workout: "Rest or walk", distance: "—", effort: "Zone 1", notes: "Active recovery" },
            { day: "Tue", workout: "Easy run", distance: "5 miles", effort: "Zone 2", notes: "" },
            { day: "Wed", workout: "Easy run + strength", distance: "6 miles", effort: "Zone 2", notes: "Core and hip circuit" },
            { day: "Thu", workout: "Easy run", distance: "5 miles", effort: "Zone 2", notes: "" },
            { day: "Fri", workout: "Rest", distance: "—", effort: "—", notes: "" },
            { day: "Sat", workout: "Long run", distance: "13 miles", effort: "Zone 2", notes: "Time on feet" },
            { day: "Sun", workout: "Back-to-back", distance: "5 miles", effort: "Zone 1", notes: "" },
          ],
        },
        {
          label: "Week 14 — Build Phase",
          context: "Long runs getting serious. Night sections start.",
          days: [
            { day: "Mon", workout: "Rest", distance: "—", effort: "—", notes: "" },
            { day: "Tue", workout: "Easy run", distance: "7 miles", effort: "Zone 2", notes: "" },
            { day: "Wed", workout: "Tempo run", distance: "8 miles (5 at tempo)", effort: "Zone 3", notes: "" },
            { day: "Thu", workout: "Easy run + strength", distance: "6 miles", effort: "Zone 2", notes: "" },
            { day: "Fri", workout: "Rest", distance: "—", effort: "—", notes: "" },
            { day: "Sat", workout: "Long run", distance: "26 miles", effort: "Zone 2", notes: "Last 6 miles in dark with headlamp" },
            { day: "Sun", workout: "Back-to-back", distance: "12 miles", effort: "Zone 1–2", notes: "" },
          ],
        },
        {
          label: "Week 20 — Peak Week",
          context: "Biggest weekend. Full 100K dress rehearsal.",
          days: [
            { day: "Mon", workout: "Rest", distance: "—", effort: "—", notes: "" },
            { day: "Tue", workout: "Easy run", distance: "7 miles", effort: "Zone 2", notes: "" },
            { day: "Wed", workout: "Tempo run", distance: "8 miles (5 at tempo)", effort: "Zone 3", notes: "" },
            { day: "Thu", workout: "Easy run", distance: "6 miles", effort: "Zone 2", notes: "" },
            { day: "Fri", workout: "Rest", distance: "—", effort: "—", notes: "" },
            { day: "Sat", workout: "Race simulation", distance: "32 miles", effort: "Zone 2", notes: "Full vest, race nutrition, night section" },
            { day: "Sun", workout: "Back-to-back", distance: "12 miles", effort: "Zone 1", notes: "" },
          ],
        },
      ],
      longRunProgression: [
        { week: 1, longRun: "13 mi", b2b: "5 mi", total: "18 mi", phase: "Base" },
        { week: 5, longRun: "16 mi", b2b: "7 mi", total: "23 mi", phase: "Base" },
        { week: 10, longRun: "22 mi", b2b: "10 mi", total: "32 mi", phase: "Build" },
        { week: 14, longRun: "26 mi", b2b: "12 mi", total: "38 mi", phase: "Build" },
        { week: 18, longRun: "30 mi", b2b: "12 mi", total: "42 mi", phase: "Peak" },
        { week: 20, longRun: "32 mi", b2b: "12 mi", total: "44 mi", phase: "Peak" },
        { week: 22, longRun: "16 mi", b2b: "—", total: "16 mi", phase: "Taper" },
        { week: 24, longRun: "100K Race!", b2b: "—", total: "62 mi", phase: "Race" },
      ],
    },
    intermediate: {
      duration: 24,
      prerequisites: ["100K finish or competitive 50M", "50+ miles/week consistently", "2+ years of ultra training"],
      weeklyRange: "50–75 miles",
      peakMileage: "70–75 miles",
      runsPerWeek: "5–6",
      keyWorkouts: ["Zone 2 + tempo combination runs", "Long runs to 35 miles with race-pace finishes", "Back-to-back totaling 48 miles", "Hill repeats 2×/week in build phase", "Night running protocol"],
      highlights: ["Peak long run 35 miles", "Competitive 100K pacing", "Double-day training weeks", "3 full race simulations"],
      sampleWeeks: [
        {
          label: "Week 1 — Base Phase",
          context: "24 weeks. Strong aerobic base first.",
          days: [
            { day: "Mon", workout: "Easy run", distance: "6 miles", effort: "Zone 2", notes: "" },
            { day: "Tue", workout: "Easy run + strength", distance: "8 miles", effort: "Zone 2", notes: "" },
            { day: "Wed", workout: "Tempo run", distance: "9 miles (6 at tempo)", effort: "Zone 3", notes: "" },
            { day: "Thu", workout: "Easy run", distance: "7 miles", effort: "Zone 2", notes: "" },
            { day: "Fri", workout: "Rest", distance: "—", effort: "—", notes: "" },
            { day: "Sat", workout: "Long run", distance: "16 miles", effort: "Zone 2", notes: "" },
            { day: "Sun", workout: "Back-to-back", distance: "8 miles", effort: "Zone 1–2", notes: "" },
          ],
        },
        {
          label: "Week 14 — Build Phase",
          context: "Volume climbing. Night running introduced.",
          days: [
            { day: "Mon", workout: "Rest", distance: "—", effort: "—", notes: "" },
            { day: "Tue", workout: "Easy run", distance: "8 miles", effort: "Zone 2", notes: "" },
            { day: "Wed", workout: "Hill repeats + tempo", distance: "10 miles", effort: "Zone 3–4", notes: "" },
            { day: "Thu", workout: "Easy run + strength", distance: "7 miles", effort: "Zone 2", notes: "" },
            { day: "Fri", workout: "Rest", distance: "—", effort: "—", notes: "" },
            { day: "Sat", workout: "Long run", distance: "30 miles", effort: "Zone 2", notes: "Night section miles 24–30" },
            { day: "Sun", workout: "Back-to-back", distance: "14 miles", effort: "Zone 1", notes: "" },
          ],
        },
        {
          label: "Week 20 — Peak Week",
          context: "Last big push. Full simulation.",
          days: [
            { day: "Mon", workout: "Rest", distance: "—", effort: "—", notes: "" },
            { day: "Tue", workout: "Easy + strides", distance: "8 miles", effort: "Zone 2", notes: "" },
            { day: "Wed", workout: "Tempo run", distance: "10 miles (7 at tempo)", effort: "Zone 3–4", notes: "" },
            { day: "Thu", workout: "Easy run", distance: "7 miles", effort: "Zone 2", notes: "" },
            { day: "Fri", workout: "Rest", distance: "—", effort: "—", notes: "" },
            { day: "Sat", workout: "Race simulation", distance: "35 miles", effort: "Race effort", notes: "Full crew, night section, exact nutrition" },
            { day: "Sun", workout: "Back-to-back", distance: "14 miles", effort: "Zone 1", notes: "" },
          ],
        },
      ],
      longRunProgression: [
        { week: 1, longRun: "16 mi", b2b: "8 mi", total: "24 mi", phase: "Base" },
        { week: 5, longRun: "20 mi", b2b: "10 mi", total: "30 mi", phase: "Base" },
        { week: 10, longRun: "26 mi", b2b: "12 mi", total: "38 mi", phase: "Build" },
        { week: 14, longRun: "30 mi", b2b: "14 mi", total: "44 mi", phase: "Build" },
        { week: 18, longRun: "34 mi", b2b: "14 mi", total: "48 mi", phase: "Peak" },
        { week: 20, longRun: "35 mi", b2b: "14 mi", total: "49 mi", phase: "Peak" },
        { week: 22, longRun: "18 mi", b2b: "—", total: "18 mi", phase: "Taper" },
        { week: 24, longRun: "100K Race!", b2b: "—", total: "62 mi", phase: "Race" },
      ],
    },
    advanced: {
      duration: 24,
      prerequisites: ["Multiple 100K finishes or strong 100M background", "60+ miles/week", "3+ years of ultra training"],
      weeklyRange: "65–90 miles",
      peakMileage: "85–90 miles",
      runsPerWeek: "6–7",
      keyWorkouts: ["Double-day training", "VO2 max intervals", "Long runs to 38 miles with progressive pace", "Back-to-back 50+ total miles", "Altitude/heat protocol"],
      highlights: ["Peak long run 38 miles", "Sub-12 or competitive 100K strategy", "5 double-day weeks", "3 full race simulations with crew"],
      sampleWeeks: [
        {
          label: "Week 1 — Base Phase",
          context: "High volume start. Discipline over ego.",
          days: [
            { day: "Mon", workout: "Easy recovery", distance: "7 miles", effort: "Zone 1", notes: "" },
            { day: "Tue", workout: "Easy run + strength", distance: "10 miles", effort: "Zone 2", notes: "" },
            { day: "Wed", workout: "Tempo run", distance: "10 miles (7 at tempo)", effort: "Zone 3", notes: "" },
            { day: "Thu", workout: "Easy run", distance: "8 miles", effort: "Zone 2", notes: "" },
            { day: "Fri", workout: "Easy run", distance: "5 miles", effort: "Zone 2", notes: "" },
            { day: "Sat", workout: "Long run", distance: "20 miles", effort: "Zone 2", notes: "Max elevation" },
            { day: "Sun", workout: "Back-to-back", distance: "12 miles", effort: "Zone 1–2", notes: "" },
          ],
        },
        {
          label: "Week 16 — Peak Phase",
          context: "Maximum training load. Full simulation.",
          days: [
            { day: "Mon", workout: "Rest", distance: "—", effort: "—", notes: "" },
            { day: "Tue", workout: "VO2 max intervals", distance: "12 miles", effort: "Zone 5", notes: "8 × 800m" },
            { day: "Wed", workout: "AM easy + PM easy", distance: "8 mi + 5 mi", effort: "Zone 1–2", notes: "Two-a-day" },
            { day: "Thu", workout: "Tempo + hills", distance: "11 miles", effort: "Zone 3–4", notes: "" },
            { day: "Fri", workout: "Rest", distance: "—", effort: "—", notes: "" },
            { day: "Sat", workout: "Race simulation", distance: "38 miles", effort: "Race effort", notes: "Full crew, night section, everything" },
            { day: "Sun", workout: "Back-to-back", distance: "16 miles", effort: "Zone 1", notes: "" },
          ],
        },
        {
          label: "Week 22 — Taper",
          context: "The work is done. Recover and sharpen.",
          days: [
            { day: "Mon", workout: "Rest", distance: "—", effort: "—", notes: "" },
            { day: "Tue", workout: "Easy + strides", distance: "7 miles", effort: "Zone 2", notes: "" },
            { day: "Wed", workout: "Sharpener", distance: "7 miles (3 × mile)", effort: "Zone 3", notes: "" },
            { day: "Thu", workout: "Easy run", distance: "5 miles", effort: "Zone 2", notes: "" },
            { day: "Fri", workout: "Rest", distance: "—", effort: "—", notes: "" },
            { day: "Sat", workout: "Easy long run", distance: "14 miles", effort: "Zone 2", notes: "" },
            { day: "Sun", workout: "Easy run", distance: "5 miles", effort: "Zone 1", notes: "" },
          ],
        },
      ],
      longRunProgression: [
        { week: 1, longRun: "20 mi", b2b: "12 mi", total: "32 mi", phase: "Base" },
        { week: 5, longRun: "24 mi", b2b: "12 mi", total: "36 mi", phase: "Base" },
        { week: 10, longRun: "30 mi", b2b: "14 mi", total: "44 mi", phase: "Build" },
        { week: 14, longRun: "34 mi", b2b: "16 mi", total: "50 mi", phase: "Build" },
        { week: 16, longRun: "38 mi", b2b: "16 mi", total: "54 mi", phase: "Peak" },
        { week: 20, longRun: "26 mi", b2b: "12 mi", total: "38 mi", phase: "Sharpen" },
        { week: 22, longRun: "14 mi", b2b: "—", total: "14 mi", phase: "Taper" },
        { week: 24, longRun: "100K Race!", b2b: "—", total: "62 mi", phase: "Race" },
      ],
    },
    competitive: {
      duration: 24,
      prerequisites: ["Multiple 100K finishes or competitive 100M background", "65+ miles/week consistently", "Sub-12:00 100K or equivalent"],
      weeklyRange: "70–100 miles",
      peakMileage: "95–100 miles",
      runsPerWeek: "6–7",
      keyWorkouts: ["VO2 max intervals 2×/week", "Long runs to 40 miles with extended race-pace sections", "Back-to-back totaling 55+ miles", "Double-day training weeks", "Night and altitude protocols"],
      highlights: ["Peak long run 40 miles", "Sub-12 or podium 100K strategy", "6 double-day training weeks", "4 full race simulations"],
      sampleWeeks: [
        {
          label: "Week 1 — Base Phase",
          context: "High baseline. Aerobic engine first.",
          days: [
            { day: "Mon", workout: "Easy recovery", distance: "8 miles", effort: "Zone 1", notes: "" },
            { day: "Tue", workout: "Intervals", distance: "11 miles", effort: "Zone 4–5", notes: "8 × 1000m" },
            { day: "Wed", workout: "Easy run + strength", distance: "10 miles", effort: "Zone 2", notes: "" },
            { day: "Thu", workout: "Tempo run", distance: "10 miles (7 at tempo)", effort: "Zone 3–4", notes: "" },
            { day: "Fri", workout: "Easy run", distance: "6 miles", effort: "Zone 2", notes: "" },
            { day: "Sat", workout: "Long run", distance: "22 miles", effort: "Zone 2", notes: "" },
            { day: "Sun", workout: "Back-to-back", distance: "14 miles", effort: "Zone 1–2", notes: "" },
          ],
        },
        {
          label: "Week 14 — Build Phase",
          context: "Volume and intensity both high.",
          days: [
            { day: "Mon", workout: "Easy recovery", distance: "7 miles", effort: "Zone 1", notes: "" },
            { day: "Tue", workout: "VO2 max intervals", distance: "12 miles", effort: "Zone 5", notes: "10 × 800m" },
            { day: "Wed", workout: "AM easy + PM easy", distance: "8 mi + 5 mi", effort: "Zone 1–2", notes: "Two-a-day" },
            { day: "Thu", workout: "Tempo + hills", distance: "12 miles", effort: "Zone 3–4", notes: "" },
            { day: "Fri", workout: "Rest", distance: "—", effort: "—", notes: "" },
            { day: "Sat", workout: "Race simulation", distance: "38 miles", effort: "Race effort", notes: "Night section. Full crew." },
            { day: "Sun", workout: "Back-to-back", distance: "18 miles", effort: "Zone 1", notes: "" },
          ],
        },
        {
          label: "Week 20 — Peak Week",
          context: "Maximum load. Everything rehearsed.",
          days: [
            { day: "Mon", workout: "Rest", distance: "—", effort: "—", notes: "" },
            { day: "Tue", workout: "VO2 max intervals", distance: "12 miles", effort: "Zone 5", notes: "8 × 1000m" },
            { day: "Wed", workout: "Easy run", distance: "9 miles", effort: "Zone 2", notes: "" },
            { day: "Thu", workout: "Race-pace tempo", distance: "12 miles (9 at race pace)", effort: "Zone 3", notes: "" },
            { day: "Fri", workout: "Rest", distance: "—", effort: "—", notes: "" },
            { day: "Sat", workout: "Full simulation", distance: "40 miles", effort: "Race effort", notes: "Full crew. Pacers. Night. Track everything." },
            { day: "Sun", workout: "Back-to-back", distance: "18 miles", effort: "Zone 1", notes: "" },
          ],
        },
      ],
      longRunProgression: [
        { week: 1, longRun: "22 mi", b2b: "14 mi", total: "36 mi", phase: "Base" },
        { week: 5, longRun: "26 mi", b2b: "14 mi", total: "40 mi", phase: "Base" },
        { week: 10, longRun: "32 mi", b2b: "16 mi", total: "48 mi", phase: "Build" },
        { week: 14, longRun: "38 mi", b2b: "18 mi", total: "56 mi", phase: "Build" },
        { week: 18, longRun: "40 mi", b2b: "18 mi", total: "58 mi", phase: "Peak" },
        { week: 20, longRun: "30 mi", b2b: "14 mi", total: "44 mi", phase: "Sharpen" },
        { week: 22, longRun: "16 mi", b2b: "—", total: "16 mi", phase: "Taper" },
        { week: 24, longRun: "100K Race!", b2b: "—", total: "62 mi", phase: "Race" },
      ],
    },
  },
  "100M": {
    foundation: {
      duration: 32,
      prerequisites: ["Completed a 50M or 100K", "Running 20–30 miles/week for 6+ months", "Comfortable with runs of 14+ miles"],
      weeklyRange: "25–50 miles",
      peakMileage: "45–50 miles",
      runsPerWeek: "3–4",
      keyWorkouts: ["Easy conversational runs", "Weekly long run building to 28 miles", "Walk breaks encouraged on all long runs", "Night running practice from week 20", "Strength/mobility 2×/week"],
      highlights: ["Run/walk strategy for 100 miles", "Progressive long run to 28 miles", "Cutback every 3rd week", "32-week gradual buildup"],
      sampleWeeks: [
        {
          label: "Week 1 — Starting the Journey",
          context: "32 weeks. The longest build, for the longest day.",
          days: [
            { day: "Mon", workout: "Rest", distance: "—", effort: "—", notes: "" },
            { day: "Tue", workout: "Easy run", distance: "4 miles", effort: "Zone 2", notes: "" },
            { day: "Wed", workout: "Strength & mobility", distance: "—", effort: "—", notes: "" },
            { day: "Thu", workout: "Easy run", distance: "4 miles", effort: "Zone 2", notes: "" },
            { day: "Fri", workout: "Rest", distance: "—", effort: "—", notes: "" },
            { day: "Sat", workout: "Long run/walk", distance: "8 miles", effort: "Zone 1–2", notes: "" },
            { day: "Sun", workout: "Rest or walk", distance: "—", effort: "Zone 1", notes: "" },
          ],
        },
        {
          label: "Week 18 — Build Phase",
          context: "Long runs getting real. Stay patient.",
          days: [
            { day: "Mon", workout: "Rest", distance: "—", effort: "—", notes: "" },
            { day: "Tue", workout: "Easy run", distance: "5 miles", effort: "Zone 2", notes: "" },
            { day: "Wed", workout: "Easy run + strength", distance: "4 miles", effort: "Zone 2", notes: "" },
            { day: "Thu", workout: "Easy run", distance: "5 miles", effort: "Zone 2", notes: "" },
            { day: "Fri", workout: "Rest", distance: "—", effort: "—", notes: "" },
            { day: "Sat", workout: "Long run", distance: "20 miles", effort: "Zone 2", notes: "Practice night running last hour" },
            { day: "Sun", workout: "Easy walk", distance: "—", effort: "Zone 1", notes: "" },
          ],
        },
        {
          label: "Week 26 — Peak Week",
          context: "Biggest effort. Full simulation.",
          days: [
            { day: "Mon", workout: "Rest", distance: "—", effort: "—", notes: "" },
            { day: "Tue", workout: "Easy run", distance: "6 miles", effort: "Zone 2", notes: "" },
            { day: "Wed", workout: "Easy run + strength", distance: "4 miles", effort: "Zone 2", notes: "" },
            { day: "Thu", workout: "Easy run", distance: "5 miles", effort: "Zone 2", notes: "" },
            { day: "Fri", workout: "Rest", distance: "—", effort: "—", notes: "Prep gear and nutrition" },
            { day: "Sat", workout: "Race simulation", distance: "28 miles", effort: "Zone 2", notes: "Full crew, nutrition, night section" },
            { day: "Sun", workout: "Rest", distance: "—", effort: "—", notes: "" },
          ],
        },
      ],
      longRunProgression: [
        { week: 1, longRun: "8 mi", b2b: "—", total: "8 mi", phase: "Base" },
        { week: 6, longRun: "12 mi", b2b: "—", total: "12 mi", phase: "Base" },
        { week: 10, longRun: "16 mi", b2b: "—", total: "16 mi", phase: "Build" },
        { week: 14, longRun: "18 mi", b2b: "—", total: "18 mi", phase: "Build" },
        { week: 18, longRun: "20 mi", b2b: "—", total: "20 mi", phase: "Build" },
        { week: 22, longRun: "24 mi", b2b: "—", total: "24 mi", phase: "Build" },
        { week: 26, longRun: "28 mi", b2b: "—", total: "28 mi", phase: "Peak" },
        { week: 29, longRun: "14 mi", b2b: "—", total: "14 mi", phase: "Taper" },
        { week: 32, longRun: "100M Race!", b2b: "—", total: "100 mi", phase: "Race" },
      ],
    },
    beginner: {
      duration: 28,
      prerequisites: ["100K finish or strong 50M finish", "Comfortable at 40–50 miles/week", "2+ years of ultra running"],
      weeklyRange: "40–65 miles",
      peakMileage: "60–65 miles",
      runsPerWeek: "5",
      keyWorkouts: ["Zone 2 base runs", "Progressive long runs to 35 miles", "Back-to-back weekends totaling 40+ miles", "Hill repeats from week 10", "Night running from week 18", "Aid station simulations"],
      highlights: ["Peak long run 35 miles", "3 night running sessions", "Full 100M crew and pacer protocol practice", "Back-to-back totaling 48 miles"],
      sampleWeeks: [
        {
          label: "Week 1 — Base Building",
          context: "28-week plan. Build slow, finish strong.",
          days: [
            { day: "Mon", workout: "Rest or walk", distance: "—", effort: "Zone 1", notes: "Active recovery" },
            { day: "Tue", workout: "Easy run", distance: "5 miles", effort: "Zone 2", notes: "" },
            { day: "Wed", workout: "Easy run + strength", distance: "7 miles", effort: "Zone 2", notes: "Core and hip circuit" },
            { day: "Thu", workout: "Easy run", distance: "5 miles", effort: "Zone 2", notes: "" },
            { day: "Fri", workout: "Rest", distance: "—", effort: "—", notes: "" },
            { day: "Sat", workout: "Long run", distance: "14 miles", effort: "Zone 2", notes: "Time on feet" },
            { day: "Sun", workout: "Back-to-back", distance: "6 miles", effort: "Zone 1", notes: "" },
          ],
        },
        {
          label: "Week 16 — Build Phase",
          context: "Long runs getting serious. Night sections start.",
          days: [
            { day: "Mon", workout: "Rest", distance: "—", effort: "—", notes: "" },
            { day: "Tue", workout: "Easy run", distance: "7 miles", effort: "Zone 2", notes: "" },
            { day: "Wed", workout: "Tempo run", distance: "8 miles (5 at tempo)", effort: "Zone 3", notes: "" },
            { day: "Thu", workout: "Easy run + strength", distance: "6 miles", effort: "Zone 2", notes: "" },
            { day: "Fri", workout: "Rest", distance: "—", effort: "—", notes: "" },
            { day: "Sat", workout: "Long run", distance: "28 miles", effort: "Zone 2", notes: "Practice night running last 8 miles" },
            { day: "Sun", workout: "Back-to-back", distance: "12 miles", effort: "Zone 1–2", notes: "" },
          ],
        },
        {
          label: "Week 22 — Peak Week",
          context: "Biggest weekend ever. Full simulation.",
          days: [
            { day: "Mon", workout: "Rest", distance: "—", effort: "—", notes: "" },
            { day: "Tue", workout: "Easy run", distance: "7 miles", effort: "Zone 2", notes: "" },
            { day: "Wed", workout: "Tempo run", distance: "8 miles (5 at tempo)", effort: "Zone 3", notes: "" },
            { day: "Thu", workout: "Easy run", distance: "6 miles", effort: "Zone 2", notes: "" },
            { day: "Fri", workout: "Rest", distance: "—", effort: "—", notes: "" },
            { day: "Sat", workout: "Race simulation", distance: "35 miles", effort: "Zone 2", notes: "Full crew, full nutrition, night section" },
            { day: "Sun", workout: "Back-to-back", distance: "13 miles", effort: "Zone 1", notes: "" },
          ],
        },
      ],
      longRunProgression: [
        { week: 1, longRun: "14 mi", b2b: "6 mi", total: "20 mi", phase: "Base" },
        { week: 6, longRun: "18 mi", b2b: "8 mi", total: "26 mi", phase: "Base" },
        { week: 10, longRun: "22 mi", b2b: "10 mi", total: "32 mi", phase: "Build" },
        { week: 14, longRun: "26 mi", b2b: "12 mi", total: "38 mi", phase: "Build" },
        { week: 18, longRun: "30 mi", b2b: "12 mi", total: "42 mi", phase: "Build" },
        { week: 22, longRun: "35 mi", b2b: "13 mi", total: "48 mi", phase: "Peak" },
        { week: 25, longRun: "18 mi", b2b: "—", total: "18 mi", phase: "Taper" },
        { week: 28, longRun: "100M Race!", b2b: "—", total: "100 mi", phase: "Race" },
      ],
    },
    intermediate: {
      duration: 32,
      prerequisites: ["100M finish or competitive 100K", "55+ miles/week consistently", "3+ years of structured ultra training"],
      weeklyRange: "55–80 miles",
      peakMileage: "75–80 miles",
      runsPerWeek: "5–6",
      keyWorkouts: ["Zone 2 + tempo combo runs", "Long runs to 36 miles with race-pace finishes", "Back-to-back totaling 50 miles", "Hill repeats 2×/week in build phase", "Night and crew protocol"],
      highlights: ["Peak long run 36 miles", "Competitive 100M pacing (sub-24 or podium strategy)", "Double-day training weeks", "4 full race simulations with crew"],
      sampleWeeks: [
        {
          label: "Week 1 — Base Phase",
          context: "32-week plan. Aerobic engine first.",
          days: [
            { day: "Mon", workout: "Easy run", distance: "6 miles", effort: "Zone 2", notes: "" },
            { day: "Tue", workout: "Easy run + strength", distance: "9 miles", effort: "Zone 2", notes: "" },
            { day: "Wed", workout: "Tempo run", distance: "9 miles (6 at tempo)", effort: "Zone 3", notes: "" },
            { day: "Thu", workout: "Easy run", distance: "7 miles", effort: "Zone 2", notes: "" },
            { day: "Fri", workout: "Rest", distance: "—", effort: "—", notes: "" },
            { day: "Sat", workout: "Long run", distance: "18 miles", effort: "Zone 2", notes: "" },
            { day: "Sun", workout: "Back-to-back", distance: "10 miles", effort: "Zone 1–2", notes: "" },
          ],
        },
        {
          label: "Week 20 — Build Phase",
          context: "Peak volume building. Night and crew simulations.",
          days: [
            { day: "Mon", workout: "Rest", distance: "—", effort: "—", notes: "" },
            { day: "Tue", workout: "Easy run", distance: "8 miles", effort: "Zone 2", notes: "" },
            { day: "Wed", workout: "Hill repeats + tempo", distance: "10 miles", effort: "Zone 3–4", notes: "" },
            { day: "Thu", workout: "Easy run + strength", distance: "7 miles", effort: "Zone 2", notes: "" },
            { day: "Fri", workout: "Rest", distance: "—", effort: "—", notes: "" },
            { day: "Sat", workout: "Long run", distance: "32 miles", effort: "Zone 2", notes: "Night section, crew practice, full nutrition" },
            { day: "Sun", workout: "Back-to-back", distance: "14 miles", effort: "Zone 1", notes: "" },
          ],
        },
        {
          label: "Week 26 — Peak Week",
          context: "Maximum load week. Everything rehearsed.",
          days: [
            { day: "Mon", workout: "Rest", distance: "—", effort: "—", notes: "" },
            { day: "Tue", workout: "Easy + strides", distance: "8 miles", effort: "Zone 2", notes: "" },
            { day: "Wed", workout: "Tempo run", distance: "10 miles (7 at tempo)", effort: "Zone 3–4", notes: "" },
            { day: "Thu", workout: "Easy run", distance: "7 miles", effort: "Zone 2", notes: "" },
            { day: "Fri", workout: "Rest", distance: "—", effort: "—", notes: "" },
            { day: "Sat", workout: "Race simulation", distance: "36 miles", effort: "Race effort", notes: "Full crew, pacers, night section, exact nutrition" },
            { day: "Sun", workout: "Back-to-back", distance: "14 miles", effort: "Zone 1", notes: "" },
          ],
        },
      ],
      longRunProgression: [
        { week: 1, longRun: "18 mi", b2b: "10 mi", total: "28 mi", phase: "Base" },
        { week: 6, longRun: "12 mi", b2b: "—", total: "12 mi", phase: "Cutback" },
        { week: 10, longRun: "26 mi", b2b: "12 mi", total: "38 mi", phase: "Build" },
        { week: 14, longRun: "30 mi", b2b: "14 mi", total: "44 mi", phase: "Build" },
        { week: 20, longRun: "32 mi", b2b: "14 mi", total: "46 mi", phase: "Build" },
        { week: 26, longRun: "36 mi", b2b: "14 mi", total: "50 mi", phase: "Peak" },
        { week: 29, longRun: "18 mi", b2b: "—", total: "18 mi", phase: "Taper" },
        { week: 32, longRun: "100M Race!", b2b: "—", total: "100 mi", phase: "Race" },
      ],
    },
    advanced: {
      duration: 36,
      prerequisites: ["Multiple 100M finishes or 100K + strong 50M results", "65+ miles/week", "Extensive double-day and night running background"],
      weeklyRange: "75–110 miles",
      peakMileage: "105–110 miles",
      runsPerWeek: "6–7",
      keyWorkouts: ["Double-day weeks × 6", "VO2 max intervals", "Back-to-back 50+ total miles", "5+ race simulations", "Altitude and heat protocol if applicable"],
      highlights: ["Peak long run 40+ miles", "6 double-day training weeks", "Competitive 100M pacing strategy for sub-24-hour or top-quarter finishes", "Full A-race taper protocol"],
      sampleWeeks: [
        {
          label: "Week 1 — Base Phase",
          context: "36-week plan. Start conservative, build methodically.",
          days: [
            { day: "Mon", workout: "Easy recovery", distance: "8 miles", effort: "Zone 1", notes: "" },
            { day: "Tue", workout: "Easy run + strength", distance: "10 miles", effort: "Zone 2", notes: "" },
            { day: "Wed", workout: "Tempo run", distance: "11 miles (7 at tempo)", effort: "Zone 3–4", notes: "" },
            { day: "Thu", workout: "Easy run", distance: "8 miles", effort: "Zone 2", notes: "" },
            { day: "Fri", workout: "Easy run", distance: "6 miles", effort: "Zone 2", notes: "" },
            { day: "Sat", workout: "Long run", distance: "24 miles", effort: "Zone 2", notes: "Max elevation, technical terrain" },
            { day: "Sun", workout: "Back-to-back", distance: "14 miles", effort: "Zone 1–2", notes: "" },
          ],
        },
        {
          label: "Week 22 — Peak Phase",
          context: "Maximum training load. Full simulation run.",
          days: [
            { day: "Mon", workout: "Rest", distance: "—", effort: "—", notes: "" },
            { day: "Tue", workout: "VO2 max intervals", distance: "12 miles", effort: "Zone 5", notes: "8 × 800m @ 5K effort" },
            { day: "Wed", workout: "AM easy + PM easy", distance: "10 mi + 6 mi", effort: "Zone 1–2", notes: "Two-a-day" },
            { day: "Thu", workout: "Tempo + long hills", distance: "12 miles", effort: "Zone 3–4", notes: "4 × 1-mile hill repeats" },
            { day: "Fri", workout: "Rest", distance: "—", effort: "—", notes: "" },
            { day: "Sat", workout: "Full 100M simulation", distance: "40 miles", effort: "Race effort", notes: "Full crew, pacers from mile 30, aid stations, night section" },
            { day: "Sun", workout: "Back-to-back", distance: "18 miles", effort: "Zone 1", notes: "" },
          ],
        },
        {
          label: "Week 34 — Taper",
          context: "Two weeks out. The work is done.",
          days: [
            { day: "Mon", workout: "Rest", distance: "—", effort: "—", notes: "" },
            { day: "Tue", workout: "Easy + strides", distance: "8 miles", effort: "Zone 2", notes: "" },
            { day: "Wed", workout: "Sharpener workout", distance: "8 miles (3 × mile)", effort: "Zone 3", notes: "" },
            { day: "Thu", workout: "Easy run", distance: "6 miles", effort: "Zone 2", notes: "" },
            { day: "Fri", workout: "Rest", distance: "—", effort: "—", notes: "" },
            { day: "Sat", workout: "Easy long run", distance: "18 miles", effort: "Zone 2", notes: "" },
            { day: "Sun", workout: "Easy run", distance: "8 miles", effort: "Zone 1", notes: "" },
          ],
        },
      ],
      longRunProgression: [
        { week: 1, longRun: "24 mi", b2b: "14 mi", total: "38 mi", phase: "Base" },
        { week: 6, longRun: "16 mi", b2b: "—", total: "16 mi", phase: "Cutback" },
        { week: 11, longRun: "30 mi", b2b: "16 mi", total: "46 mi", phase: "Build" },
        { week: 16, longRun: "36 mi", b2b: "18 mi", total: "54 mi", phase: "Build" },
        { week: 20, longRun: "40 mi", b2b: "18 mi", total: "58 mi", phase: "Peak" },
        { week: 26, longRun: "30 mi", b2b: "15 mi", total: "45 mi", phase: "Sharpen" },
        { week: 31, longRun: "18 mi", b2b: "—", total: "18 mi", phase: "Taper" },
        { week: 36, longRun: "100M Race!", b2b: "—", total: "100 mi", phase: "Race" },
      ],
    },
    competitive: {
      duration: 36,
      prerequisites: ["Multiple 100M finishes or top-quarter 100K results", "70+ miles/week consistently", "Sub-24 100M or equivalent competitive pacing"],
      weeklyRange: "80–120 miles",
      peakMileage: "115–120 miles",
      runsPerWeek: "6–7",
      keyWorkouts: ["VO2 max intervals", "Race-pace long runs (15+ miles at goal pace)", "Back-to-back 55+ total miles", "6+ double-day training weeks", "Night running and altitude/heat protocols"],
      highlights: ["Peak long run 45 miles", "Sub-24 or top-10 100M strategy", "8 double-day training weeks", "5 full race simulations with crew and pacers"],
      sampleWeeks: [
        {
          label: "Week 1 — Base Phase",
          context: "36-week plan. Build the machine.",
          days: [
            { day: "Mon", workout: "Easy recovery", distance: "8 miles", effort: "Zone 1", notes: "" },
            { day: "Tue", workout: "Intervals", distance: "12 miles", effort: "Zone 4–5", notes: "8 × 1000m" },
            { day: "Wed", workout: "AM easy + PM strength", distance: "10 mi + strength", effort: "Zone 2", notes: "" },
            { day: "Thu", workout: "Tempo run", distance: "12 miles (8 at tempo)", effort: "Zone 3–4", notes: "" },
            { day: "Fri", workout: "Easy run", distance: "7 miles", effort: "Zone 2", notes: "" },
            { day: "Sat", workout: "Long run", distance: "26 miles", effort: "Zone 2", notes: "Technical terrain" },
            { day: "Sun", workout: "Back-to-back", distance: "16 miles", effort: "Zone 1–2", notes: "" },
          ],
        },
        {
          label: "Week 22 — Peak Phase",
          context: "Maximum load. Full race simulation.",
          days: [
            { day: "Mon", workout: "Rest", distance: "—", effort: "—", notes: "" },
            { day: "Tue", workout: "VO2 max intervals", distance: "12 miles", effort: "Zone 5", notes: "10 × 800m" },
            { day: "Wed", workout: "AM easy + PM easy", distance: "10 mi + 6 mi", effort: "Zone 1–2", notes: "Two-a-day" },
            { day: "Thu", workout: "Tempo + long hills", distance: "14 miles", effort: "Zone 3–4", notes: "4 × 1-mile hills" },
            { day: "Fri", workout: "Rest", distance: "—", effort: "—", notes: "" },
            { day: "Sat", workout: "Full simulation", distance: "45 miles", effort: "Race effort", notes: "Full crew, pacers, night, aid stations" },
            { day: "Sun", workout: "Back-to-back", distance: "18 miles", effort: "Zone 1", notes: "" },
          ],
        },
        {
          label: "Week 34 — Taper",
          context: "The work is done. Recover and sharpen.",
          days: [
            { day: "Mon", workout: "Rest", distance: "—", effort: "—", notes: "" },
            { day: "Tue", workout: "Easy + strides", distance: "8 miles", effort: "Zone 2", notes: "" },
            { day: "Wed", workout: "Sharpener", distance: "8 miles (3 × mile)", effort: "Zone 3", notes: "" },
            { day: "Thu", workout: "Easy run", distance: "6 miles", effort: "Zone 2", notes: "" },
            { day: "Fri", workout: "Rest", distance: "—", effort: "—", notes: "" },
            { day: "Sat", workout: "Easy long run", distance: "18 miles", effort: "Zone 2", notes: "" },
            { day: "Sun", workout: "Easy run", distance: "8 miles", effort: "Zone 1", notes: "" },
          ],
        },
      ],
      longRunProgression: [
        { week: 1, longRun: "26 mi", b2b: "16 mi", total: "42 mi", phase: "Base" },
        { week: 6, longRun: "18 mi", b2b: "—", total: "18 mi", phase: "Cutback" },
        { week: 11, longRun: "34 mi", b2b: "18 mi", total: "52 mi", phase: "Build" },
        { week: 16, longRun: "40 mi", b2b: "18 mi", total: "58 mi", phase: "Build" },
        { week: 22, longRun: "45 mi", b2b: "18 mi", total: "63 mi", phase: "Peak" },
        { week: 28, longRun: "32 mi", b2b: "16 mi", total: "48 mi", phase: "Sharpen" },
        { week: 33, longRun: "18 mi", b2b: "—", total: "18 mi", phase: "Taper" },
        { week: 36, longRun: "100M Race!", b2b: "—", total: "100 mi", phase: "Race" },
      ],
    },
  },
};

// ─── Static Content ───────────────────────────────────────────────────────────
const TRAINING_ZONES = [
  { zone: "Zone 1", name: "Recovery", hr: "50–60% max HR", pace: "Very easy — slow jog or brisk walk", color: "bg-blue-100 text-blue-800", border: "border-blue-200", desc: "Active recovery only. Use on easy days and back-to-back runs." },
  { zone: "Zone 2", name: "Aerobic Base", hr: "60–70% max HR", pace: "Conversational — you can speak in sentences", color: "bg-green-100 text-green-800", border: "border-green-200", desc: "80% of your training volume lives here. Build the engine." },
  { zone: "Zone 3", name: "Tempo", hr: "70–80% max HR", pace: "Comfortably hard — can speak a few words", color: "bg-yellow-100 text-yellow-800", border: "border-yellow-200", desc: "Marathon and long-race effort. Use for tempo runs and sustained climbs." },
  { zone: "Zone 4", name: "Threshold", hr: "80–90% max HR", pace: "Hard — one-word answers only", color: "bg-orange-100 text-orange-800", border: "border-orange-200", desc: "Raises lactate threshold. Use for interval work and hill repeats." },
  { zone: "Zone 5", name: "VO2 Max", hr: "90–100% max HR", pace: "Very hard — can't speak", color: "bg-red-100 text-red-800", border: "border-red-200", desc: "Short bursts only. Advanced plans use this sparingly." },
];

const NUTRITION_TIPS = [
  { title: "Daily Caloric Needs", body: "Add 100 calories per mile run to your baseline TDEE. For a 60-mile training week, that's roughly 600 extra calories per day above your normal intake." },
  { title: "Pre-Run Fueling", body: "For runs under 60 minutes: run fasted or eat light (banana, toast). For long runs: 400–600 calories 90–120 minutes before start. Practice this in training." },
  { title: "During-Run Nutrition", body: "Start eating at 45 minutes regardless of hunger. Target 200–300 calories per hour. Mix liquid and solid calories. Alternate sweet and salty to avoid flavor fatigue." },
  { title: "Post-Run Recovery Window", body: "4:1 carb-to-protein ratio within 30 minutes of finishing. Chocolate milk is genuinely one of the best recovery drinks. Don't skip this window — it determines tomorrow's run." },
  { title: "Race Nutrition Practice", body: "Every run over 90 minutes should use your exact race nutrition. By race day, eating while running should feel automatic, not experimental." },
];

const STRENGTH_EXERCISES = [
  { name: "Single-Leg Romanian Deadlift", sets: "3 × 10 each side", purpose: "Hamstring and glute strength, balance" },
  { name: "Bulgarian Split Squat", sets: "3 × 10 each side", purpose: "Quad and glute strength, unilateral stability" },
  { name: "Copenhagen Plank", sets: "3 × 20 sec each side", purpose: "Hip adductor strength — prevents IT band issues" },
  { name: "Dead Bug", sets: "3 × 10 each side", purpose: "Deep core stability and lumbar control" },
  { name: "Calf Raise (single-leg)", sets: "3 × 15 each side", purpose: "Calf and Achilles tendon resilience" },
  { name: "Glute Bridge / Hip Thrust", sets: "3 × 15", purpose: "Posterior chain activation and glute strength" },
];

const INJURY_WARNINGS = [
  { signal: "Pain that worsens during a run", action: "Stop immediately. Walk home. Rest 2–3 days." },
  { signal: "Localized tendon pain (Achilles, patellar)", action: "Reduce mileage 50%. See a physio if not resolved in 5 days." },
  { signal: "Consistent hip or knee pain after every run", action: "Take 3–5 days off completely. Revisit training load." },
  { signal: "Unusual fatigue that doesn't resolve with rest", action: "May indicate overtraining syndrome. Rest a full week and reassess." },
  { signal: "Pain that changes your gait", action: "Stop training. Running through form-altering pain creates secondary injuries." },
];

const GEAR_TESTING_TIMELINE = [
  { weeks: "Weeks 1–4", task: "Test primary trail shoes on 3–5 runs of various lengths. Note hot spots." },
  { weeks: "Weeks 5–8", task: "Introduce hydration vest on all runs over 10 miles. Adjust fit under load." },
  { weeks: "Weeks 9–12", task: "Test your complete race nutrition strategy on every long run. No variations." },
  { weeks: "Weeks 13–16", task: "Run at least one long run in your full race kit — vest loaded, race kit on, race nutrition." },
  { weeks: "Weeks 17+", task: "No new gear. All decisions finalized. Race simulation only in tested equipment." },
];

const AFFILIATE_RESOURCES = [
  { name: "TrainingPeaks Premium", desc: "Structured training with power analysis, TSS tracking, and coach integration.", price: "$19.99/mo", url: "#" },
  { name: "Strava Summit", desc: "Segment tracking, fitness trends, and a massive ultra runner community.", price: "$7.99/mo", url: "#" },
  { name: "Training for the Uphill Athlete", desc: "The definitive guide to mountain and ultra running physiology and training.", price: "~$35", url: "#" },
  { name: "Garmin Forerunner 955 Solar", desc: "49-hour GPS, training load, recovery advisor — everything you need for 100M training.", price: "~$499", url: "#" },
  { name: "Polar H10 Heart Rate Monitor", desc: "Most accurate chest strap HR monitor for training zone precision.", price: "~$90", url: "#" },
  { name: "Stryd Running Power Meter", desc: "Foot pod that provides running power for zone training that's terrain-independent.", price: "~$219", url: "#" },
];

// ─── Distance Descriptions ───────────────────────────────────────────────────
const DISTANCE_INFO: Record<Distance, { tagline: string; typicalRunner: string; durationRange: string; week1Miles: string; week1KeyWorkout: string; popular?: boolean }> = {
  "50K": { tagline: "The gateway ultra. 31 miles of proving you can.", typicalRunner: "Most first-timers start here", durationRange: "16 weeks", week1Miles: "~26 mi", week1KeyWorkout: "10 mi long run", popular: true },
  "50M": { tagline: "The real deal. 50 miles through the unknown.", typicalRunner: "For runners who've done a 50K and want more", durationRange: "20 weeks", week1Miles: "~33 mi", week1KeyWorkout: "12 mi long run" },
  "100K": { tagline: "62 miles. Where mental strength matters most.", typicalRunner: "Experienced ultra runners ready to go long", durationRange: "24 weeks", week1Miles: "~34 mi", week1KeyWorkout: "13 mi long run" },
  "100M": { tagline: "The ultimate test. 100 miles, one finish line.", typicalRunner: "For those who've conquered shorter ultras", durationRange: "28–36 weeks", week1Miles: "~37 mi", week1KeyWorkout: "14 mi long run" },
};

// ─── Runner Profile Types ────────────────────────────────────────────────────
type PriorRace = "none" | "half" | "marathon" | "50k" | "50m+";
type Goal = "finish" | "time";
type Terrain = "trail" | "road" | "mixed";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const phaseColor: Record<string, string> = {
  Base: "bg-blue-100 text-blue-700",
  Cutback: "bg-green-100 text-green-700",
  Build: "bg-yellow-100 text-yellow-700",
  Peak: "bg-orange-100 text-orange-800",
  Sharpen: "bg-purple-100 text-purple-700",
  Taper: "bg-teal-100 text-teal-700",
  Race: "bg-primary/10 text-primary font-bold",
};

const effortColor = (effort: string) => {
  if (effort.includes("Zone 5")) return "text-red-600";
  if (effort.includes("Zone 4")) return "text-orange-600";
  if (effort.includes("Zone 3")) return "text-yellow-700";
  if (effort.includes("Zone 2")) return "text-green-700";
  return "text-gray";
};

// ─── Component ────────────────────────────────────────────────────────────────
// ─── Full Schedule Generator ─────────────────────────────────────────────────
function generateFullSchedule(distance: Distance, level: Level): PlanDay[][] {
  const plan = PLANS[distance][level];
  const dur = plan.duration;
  const prog = plan.longRunProgression;
  const runsPerWeek = parseInt(plan.runsPerWeek) || 4;

  // Parse weekly range min/max
  const rangeMatch = plan.weeklyRange.match(/(\d+)\D+(\d+)/);
  const weeklyMin = rangeMatch ? parseInt(rangeMatch[1]) : 20;
  const weeklyMax = rangeMatch ? parseInt(rangeMatch[2]) : 50;

  // Interpolate long run distance for a given week from progression checkpoints
  const interpolateLongRun = (week: number): number => {
    // Filter out the race week from interpolation
    const checkpoints = prog.filter((p) => !p.longRun.includes("Race"));
    if (checkpoints.length === 0) return 10;

    // Before first checkpoint
    if (week <= checkpoints[0].week) {
      const m = parseFloat(checkpoints[0].longRun);
      return isNaN(m) ? 10 : m;
    }
    // After last checkpoint
    if (week >= checkpoints[checkpoints.length - 1].week) {
      const m = parseFloat(checkpoints[checkpoints.length - 1].longRun);
      return isNaN(m) ? 10 : m;
    }
    // Find bracketing checkpoints and interpolate
    for (let i = 0; i < checkpoints.length - 1; i++) {
      if (week >= checkpoints[i].week && week <= checkpoints[i + 1].week) {
        const w1 = checkpoints[i].week;
        const w2 = checkpoints[i + 1].week;
        const m1 = parseFloat(checkpoints[i].longRun) || 10;
        const m2 = parseFloat(checkpoints[i + 1].longRun) || 10;
        const t = (week - w1) / (w2 - w1);
        return Math.round(m1 + (m2 - m1) * t);
      }
    }
    return 10;
  };

  // Get phase for a given week
  const getPhase = (week: number): string => {
    const pct = week / dur;
    if (week === dur) return "Race";
    if (pct <= 0.3) return "Base";
    if (pct <= 0.6) return "Build";
    if (pct <= 0.85) return "Peak";
    return "Taper";
  };

  const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const weeks: PlanDay[][] = [];

  for (let w = 1; w <= dur; w++) {
    const phase = getPhase(w);
    const pct = w / dur;
    const isRaceWeek = w === dur;
    const isCutback = !isRaceWeek && w % 4 === 0;

    // Calculate target weekly mileage
    let targetMileage: number;
    if (isRaceWeek) {
      targetMileage = Math.round(weeklyMin * 0.4);
    } else if (phase === "Taper") {
      targetMileage = Math.round(weeklyMin * 0.7 + (weeklyMax - weeklyMin) * 0.2);
    } else {
      const buildProgress = Math.min(pct / 0.85, 1);
      targetMileage = Math.round(weeklyMin + (weeklyMax - weeklyMin) * buildProgress);
    }
    if (isCutback) targetMileage = Math.round(targetMileage * 0.7);

    const longRunDist = isRaceWeek ? 0 : interpolateLongRun(w);
    if (isCutback) {
      // Cutback: reduce long run
    }

    // Determine if there's a B2B run
    const hasB2B = runsPerWeek >= 5 && !isRaceWeek && phase !== "Taper" && level !== "foundation";
    const b2bDist = hasB2B ? Math.round(longRunDist * 0.45) : 0;

    // Remaining mileage for midweek
    const remainMiles = Math.max(0, targetMileage - longRunDist - b2bDist);
    const midweekRuns = Math.max(1, runsPerWeek - (isRaceWeek ? 0 : 1) - (hasB2B ? 1 : 0));

    // Quality session placement
    const hasQuality = phase !== "Base" || w > Math.round(dur * 0.15);
    const qualityDist = hasQuality ? Math.round(remainMiles / midweekRuns * 1.2) : 0;
    const easyDist = midweekRuns > 1 ? Math.round((remainMiles - qualityDist) / Math.max(1, midweekRuns - 1)) : remainMiles;

    // Build each day
    const days: PlanDay[] = DAYS.map((dayName, di) => {
      // RACE WEEK
      if (isRaceWeek) {
        if (dayName === "Sat") return { day: dayName, workout: `${distance} Race!`, distance: distance === "50K" ? "31 mi" : distance === "50M" ? "50 mi" : distance === "100K" ? "62 mi" : "100 mi", effort: "Race effort", notes: "You've got this." };
        if (dayName === "Mon") return { day: dayName, workout: "Rest", distance: "—", effort: "—", notes: "" };
        if (dayName === "Fri") return { day: dayName, workout: "Rest", distance: "—", effort: "—", notes: "Sleep and prep" };
        if (dayName === "Tue") return { day: dayName, workout: "Easy + strides", distance: `${Math.max(3, Math.round(easyDist * 0.7))} miles`, effort: "Zone 2", notes: "4 × 100m strides" };
        if (dayName === "Wed") return { day: dayName, workout: "Shakeout", distance: `${Math.max(2, Math.round(easyDist * 0.5))} miles`, effort: "Zone 1–2", notes: "Very easy" };
        if (dayName === "Thu") return { day: dayName, workout: "Rest or walk", distance: "—", effort: "Zone 1", notes: "Stay loose" };
        return { day: dayName, workout: "Rest", distance: "—", effort: "—", notes: "" };
      }

      // Mon: Rest
      if (di === 0) {
        if (runsPerWeek >= 6 && phase !== "Taper" && level === "competitive") {
          return { day: dayName, workout: "Easy recovery", distance: `${Math.max(4, Math.round(easyDist * 0.7))} miles`, effort: "Zone 1", notes: "" };
        }
        return { day: dayName, workout: "Rest", distance: "—", effort: "—", notes: phase === "Taper" ? "Recovery is training" : "" };
      }

      // Sat: Long run
      if (di === 5) {
        const lr = isCutback ? Math.round(longRunDist * 0.7) : longRunDist;
        let notes = "";
        let effort = "Zone 2";
        if (phase === "Peak" && !isCutback) { notes = "Full race nutrition practice"; effort = "Zone 2"; }
        if (phase === "Build" && !isCutback && w > dur * 0.4) { notes = "Practice gel every 45 min"; }
        if (level === "competitive" && phase !== "Base" && phase !== "Taper" && !isCutback) {
          const rpMiles = Math.round(lr * 0.3);
          notes = `Last ${rpMiles} miles at race pace`;
          effort = "Zone 2–3";
        }
        const workout = phase === "Peak" && !isCutback && w === Math.round(dur * 0.75) ? "Race simulation" : "Long run";
        return { day: dayName, workout, distance: `${lr} miles`, effort, notes };
      }

      // Sun: B2B or rest
      if (di === 6) {
        if (hasB2B) {
          const bd = isCutback ? Math.round(b2bDist * 0.7) : b2bDist;
          return { day: dayName, workout: "Back-to-back", distance: `${bd} miles`, effort: "Zone 1–2", notes: isCutback ? "Easy" : "Run on tired legs" };
        }
        if (level === "foundation") return { day: dayName, workout: "Rest or walk", distance: "—", effort: "Zone 1", notes: "" };
        return { day: dayName, workout: "Recovery run or rest", distance: runsPerWeek >= 4 ? `${Math.max(3, Math.round(easyDist * 0.5))} miles` : "—", effort: "Zone 1", notes: "" };
      }

      // Fri: usually rest
      if (di === 4) {
        if (runsPerWeek >= 6 && level !== "foundation") {
          return { day: dayName, workout: "Easy run", distance: `${Math.max(3, Math.round(easyDist * 0.7))} miles`, effort: "Zone 2", notes: "" };
        }
        return { day: dayName, workout: "Rest", distance: "—", effort: "—", notes: "" };
      }

      // Wed: Quality session (tempo/hills/intervals)
      if (di === 2 && hasQuality && !isCutback) {
        if (phase === "Peak" && (level === "advanced" || level === "competitive")) {
          const tempMiles = Math.round(qualityDist * 0.6);
          return { day: dayName, workout: "VO2 max intervals", distance: `${qualityDist} miles`, effort: "Zone 4–5", notes: `${Math.min(10, Math.round(tempMiles / 0.5))} × 800m` };
        }
        if (phase === "Build" || phase === "Peak") {
          const tempMiles = Math.round(qualityDist * 0.5);
          return { day: dayName, workout: "Tempo run", distance: `${qualityDist} miles (${tempMiles} at tempo)`, effort: "Zone 3–4", notes: "" };
        }
        return { day: dayName, workout: "Easy run + strides", distance: `${qualityDist || easyDist} miles`, effort: "Zone 2", notes: "6 × 100m strides" };
      }

      // Thu: Secondary quality or easy + strength
      if (di === 3) {
        if (phase === "Build" && hasQuality && !isCutback && (level === "intermediate" || level === "advanced" || level === "competitive")) {
          return { day: dayName, workout: "Hill repeats", distance: `${easyDist} miles`, effort: "Zone 3", notes: `${Math.min(8, Math.max(4, Math.round(w / 3)))} × 200m hills` };
        }
        return { day: dayName, workout: "Easy run + strength", distance: `${easyDist} miles`, effort: "Zone 2", notes: "Core and hip work after" };
      }

      // Tue: Easy run
      return { day: dayName, workout: "Easy run", distance: `${easyDist} miles`, effort: "Zone 2", notes: "" };
    });

    weeks.push(days);
  }

  return weeks;
}

export default function PlansClient() {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [activeDistance, setActiveDistance] = useState<Distance>("50K");
  const [activeLevel, setActiveLevel] = useState<Level>("beginner");
  const [activeWeek, setActiveWeek] = useState(0);
  const [planTab, setPlanTab] = useState<PlanTab>("schedule");

  // Calculator state
  const [longestRun, setLongestRun] = useState("");
  const [targetHours, setTargetHours] = useState("");
  const [targetMins, setTargetMins] = useState("");

  // Runner profile form (Step 2)
  const [raceDate, setRaceDate] = useState("");
  const [weeklyMileage, setWeeklyMileage] = useState("");
  const [daysPerWeek, setDaysPerWeek] = useState("");
  const [priorRace, setPriorRace] = useState<PriorRace | "">("");
  const [goal, setGoal] = useState<Goal | "">("");
  const [terrain, setTerrain] = useState<Terrain | "">("");

  const wizardRef = useRef<HTMLDivElement>(null);

  const distances: Distance[] = ["50K", "50M", "100K", "100M"];
  const levelLabel: Record<Level, string> = { foundation: "Foundation", beginner: "Beginner", intermediate: "Intermediate", advanced: "Advanced", competitive: "Competitive" };

  // Smart recommendation engine — combines all profile inputs
  const getRecommendation = (): { level: Level; reason: string } | null => {
    const miles = parseFloat(longestRun);
    const weekly = parseFloat(weeklyMileage);
    if (!miles || isNaN(miles)) return null;

    // Score-based system: higher score = higher level
    let score = 0;

    // Longest run (primary signal)
    if (miles >= 30) score += 4;
    else if (miles >= 26) score += 3;
    else if (miles >= 20) score += 2;
    else if (miles >= 14) score += 1;
    else if (miles >= 8) score += 0;
    else score -= 2;

    // Weekly mileage
    if (weekly && !isNaN(weekly)) {
      if (weekly >= 60) score += 3;
      else if (weekly >= 50) score += 2;
      else if (weekly >= 35) score += 1;
      else if (weekly >= 20) score += 0;
      else score -= 1;
    }

    // Prior race experience
    if (priorRace === "50m+") score += 4;
    else if (priorRace === "50k") score += 2;
    else if (priorRace === "marathon") score += 1;
    else if (priorRace === "half") score += 0;
    else if (priorRace === "none") score -= 1;

    // Days per week available
    if (daysPerWeek === "6+") score += 2;
    else if (daysPerWeek === "5") score += 1;
    else if (daysPerWeek === "3") score -= 1;

    // Goal
    if (goal === "time") score += 2;

    // Map score to level (5 tiers)
    let recLevel: Level;
    let reason: string;

    if (score <= 0) {
      recLevel = "foundation";
      reason = "We've designed a gentle, gradual plan that builds your base with walk breaks and extra recovery time.";
    } else if (score <= 3) {
      recLevel = "beginner";
      reason = "Your running base is solid for a Beginner plan. You'll build volume progressively without overreaching.";
    } else if (score <= 6) {
      recLevel = "intermediate";
      reason = "Your experience and weekly mileage support Intermediate training with structured workouts and higher volume.";
    } else if (score <= 10) {
      recLevel = "advanced";
      reason = "Your background supports Advanced training with race-specific intensity, doubles, and competitive pacing.";
    } else {
      recLevel = "competitive";
      reason = "Your high mileage, race experience, and time goals qualify you for our most demanding plan with VO2 max work and race-pace segments.";
    }

    return { level: recLevel, reason };
  };

  const recommendation = getRecommendation();

  // Auto-set level from recommendation
  const effectiveLevel = recommendation ? recommendation.level : activeLevel;
  const plan2 = PLANS[activeDistance][effectiveLevel];

  // Full schedule (memoized)
  const fullSchedule = useMemo(() => generateFullSchedule(activeDistance, effectiveLevel), [activeDistance, effectiveLevel]);

  // Phase label for current active week
  const getWeekPhase = (weekIdx: number): string => {
    const dur = plan2.duration;
    const w = weekIdx + 1;
    const pct = w / dur;
    if (w === dur) return "Race Week";
    if (pct <= 0.3) return "Base Phase";
    if (pct <= 0.6) return "Build Phase";
    if (pct <= 0.85) return "Peak Phase";
    return "Taper";
  };

  // Weekly mileage total for display
  const getWeekMileage = (weekDays: PlanDay[]): string => {
    let total = 0;
    for (const d of weekDays) {
      const m = parseFloat(d.distance);
      if (!isNaN(m)) total += m;
    }
    return total > 0 ? `${total} miles` : "—";
  };

  // User's display name
  const userName = user?.user_metadata?.full_name?.split(" ")[0] || null;

  // Weeks until race (for Step 3 countdown)
  const weeksUntilRace = raceDate
    ? Math.max(0, Math.ceil((new Date(raceDate).getTime() - Date.now()) / (7 * 24 * 60 * 60 * 1000)))
    : null;

  // Pacing calculator
  const pacingResult = () => {
    const distanceMiles: Record<Distance, number> = { "50K": 31, "50M": 50, "100K": 62, "100M": 100 };
    const totalMins = (parseFloat(targetHours) || 0) * 60 + (parseFloat(targetMins) || 0);
    if (!totalMins) return null;
    const racePaceMin = totalMins / distanceMiles[activeDistance];
    const fmt = (mins: number) => `${Math.floor(mins)}:${String(Math.round((mins % 1) * 60)).padStart(2, "0")} /mi`;
    return {
      racePace: fmt(racePaceMin),
      easyPace: fmt(racePaceMin + 1.5),
      tempoPace: fmt(racePaceMin - 0.25),
      longRunPace: fmt(racePaceMin + 1.0),
      intervalPace: fmt(racePaceMin - 0.75),
    };
  };

  const pacing = pacingResult();

  const goToStep = (step: number) => {
    setCurrentStep(step);
    if (step < 3) setActiveWeek(0);
    setTimeout(() => wizardRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
  };

  const toggleSection = (s: string, current: string | null, setter: (v: string | null) => void) =>
    setter(current === s ? null : s);

  // Accordion state for resources tab
  const [openSection, setOpenSection] = useState<string | null>(null);

  return (
    <main style={{ scrollBehavior: "smooth" }}>

      {/* ── Compact Header ──────────────────────────────────────────────── */}
      <section className="bg-dark py-10 sm:py-14 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 20% 50%, #0066FF 0%, transparent 50%), radial-gradient(circle at 80% 20%, #0066FF 0%, transparent 40%)" }} />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="font-headline text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2">
            Build Your Training Plan
          </h1>
          <p className="text-gray text-sm sm:text-base">Choose your distance, assess your readiness, get your plan.</p>
        </div>
      </section>

      {/* ── Wizard ──────────────────────────────────────────────────────── */}
      <div ref={wizardRef} className="bg-light border-b border-gray-100">
        <div className="max-w-4xl mx-auto">
          <WizardStepper currentStep={currentStep} onStepClick={goToStep} />
        </div>
      </div>

      {/* ── Step 1: Choose Distance ─────────────────────────────────────── */}
      {currentStep === 1 && (
        <section className="py-14 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="font-headline text-2xl sm:text-3xl font-bold text-dark mb-2">What distance are you training for?</h2>
              <p className="text-gray text-sm">Pick the race distance that matches your goal.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
              {distances.map((d) => (
                <DistanceCard
                  key={d}
                  distance={d}
                  tagline={DISTANCE_INFO[d].tagline}
                  typicalRunner={DISTANCE_INFO[d].typicalRunner}
                  durationRange={DISTANCE_INFO[d].durationRange}
                  week1Miles={DISTANCE_INFO[d].week1Miles}
                  week1KeyWorkout={DISTANCE_INFO[d].week1KeyWorkout}
                  popular={DISTANCE_INFO[d].popular}
                  selected={activeDistance === d}
                  onClick={() => setActiveDistance(d)}
                />
              ))}
            </div>

            <div className="text-center">
              <button
                onClick={() => goToStep(2)}
                className="px-8 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-colors"
              >
                Continue
              </button>
              <p className="text-xs text-gray mt-3">
                Not sure which distance? Most first-time ultra runners start with a 50K.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* ── Step 2: Assess Your Level ──────────────────────────────────── */}
      {currentStep === 2 && (
        <section className="py-14 bg-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="font-headline text-2xl sm:text-3xl font-bold text-dark mb-2">Tell us about yourself</h2>
              <p className="text-gray text-sm">We&apos;ll recommend the right plan level for your {activeDistance}.</p>
            </div>

            {/* Runner profile form */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-8">
              <h3 className="font-headline text-lg font-bold text-dark mb-5">Your running profile</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Longest run */}
                <div>
                  <label className="block text-sm font-medium text-dark mb-2">Longest run in last 4 weeks (miles)</label>
                  <input
                    type="number"
                    value={longestRun}
                    onChange={(e) => setLongestRun(e.target.value)}
                    placeholder="e.g. 16"
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 text-dark focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>

                {/* Current weekly mileage */}
                <div>
                  <label className="block text-sm font-medium text-dark mb-2">Current weekly mileage</label>
                  <input
                    type="number"
                    value={weeklyMileage}
                    onChange={(e) => setWeeklyMileage(e.target.value)}
                    placeholder="e.g. 30"
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 text-dark focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>

                {/* Days per week */}
                <div>
                  <label className="block text-sm font-medium text-dark mb-2">Days/week available to train</label>
                  <div className="flex gap-2">
                    {(["3", "4", "5", "6+"] as const).map((d) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setDaysPerWeek(d)}
                        className={`flex-1 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                          daysPerWeek === d
                            ? "bg-primary text-white"
                            : "border border-gray-200 text-dark hover:border-primary/40"
                        }`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Prior race experience */}
                <div>
                  <label className="block text-sm font-medium text-dark mb-2">Longest prior race</label>
                  <select
                    value={priorRace}
                    onChange={(e) => setPriorRace(e.target.value as PriorRace)}
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 text-dark focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-white"
                  >
                    <option value="">Select...</option>
                    <option value="none">No races yet</option>
                    <option value="half">5K to Half Marathon</option>
                    <option value="marathon">Marathon</option>
                    <option value="50k">50K</option>
                    <option value="50m+">50 Miles or longer</option>
                  </select>
                </div>

                {/* Race date */}
                <div>
                  <label className="block text-sm font-medium text-dark mb-2">Race date (optional)</label>
                  <input
                    type="date"
                    value={raceDate}
                    onChange={(e) => setRaceDate(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 text-dark focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>

                {/* Terrain */}
                <div>
                  <label className="block text-sm font-medium text-dark mb-2">Terrain access</label>
                  <div className="flex gap-2">
                    {([["trail", "Trail"], ["road", "Road"], ["mixed", "Mixed"]] as const).map(([val, label]) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setTerrain(val)}
                        className={`flex-1 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                          terrain === val
                            ? "bg-primary text-white"
                            : "border border-gray-200 text-dark hover:border-primary/40"
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Primary goal - full width */}
              <div className="mt-5">
                <label className="block text-sm font-medium text-dark mb-2">Primary goal</label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setGoal("finish")}
                    className={`flex-1 px-4 py-3 rounded-lg text-sm font-medium transition-all text-left ${
                      goal === "finish"
                        ? "bg-primary text-white"
                        : "border border-gray-200 text-dark hover:border-primary/40"
                    }`}
                  >
                    <div className="font-semibold">Just finish</div>
                    <div className={`text-xs mt-0.5 ${goal === "finish" ? "text-white/70" : "text-gray"}`}>Cross the finish line healthy and smiling</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setGoal("time")}
                    className={`flex-1 px-4 py-3 rounded-lg text-sm font-medium transition-all text-left ${
                      goal === "time"
                        ? "bg-primary text-white"
                        : "border border-gray-200 text-dark hover:border-primary/40"
                    }`}
                  >
                    <div className="font-semibold">Beat a time goal</div>
                    <div className={`text-xs mt-0.5 ${goal === "time" ? "text-white/70" : "text-gray"}`}>Train with specific pacing and performance targets</div>
                  </button>
                </div>

                {/* Time goal input — revealed when "Beat a time goal" is selected */}
                {goal === "time" && (
                  <div className="mt-4 bg-light rounded-xl p-4 border border-gray-100">
                    <label className="block text-sm font-medium text-dark mb-3">What&apos;s your target finish time for {activeDistance}?</label>
                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <div className="relative">
                          <input
                            type="number"
                            min="0"
                            value={targetHours}
                            onChange={(e) => setTargetHours(e.target.value)}
                            placeholder="0"
                            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-dark text-center text-lg font-bold focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray font-medium">hours</span>
                        </div>
                      </div>
                      <span className="text-xl font-bold text-gray">:</span>
                      <div className="flex-1">
                        <div className="relative">
                          <input
                            type="number"
                            min="0"
                            max="59"
                            value={targetMins}
                            onChange={(e) => setTargetMins(e.target.value)}
                            placeholder="00"
                            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-dark text-center text-lg font-bold focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray font-medium">min</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-gray mt-2">
                      {activeDistance === "50K" && "Average 50K finish: 6\u20138 hours"}
                      {activeDistance === "50M" && "Average 50M finish: 10\u201314 hours"}
                      {activeDistance === "100K" && "Average 100K finish: 14\u201320 hours"}
                      {activeDistance === "100M" && "Average 100M finish: 24\u201330 hours"}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Recommendation banner */}
            {recommendation && (
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-5 mb-8">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-headline font-bold text-dark mb-1">
                      Your personalized plan is ready
                    </div>
                    <p className="text-sm text-gray leading-relaxed">
                      {recommendation.reason}
                    </p>
                    <div className="flex flex-wrap gap-3 mt-3 text-xs text-gray">
                      <span className="bg-white border border-gray-200 px-2.5 py-1 rounded-full">{plan2.duration} weeks</span>
                      <span className="bg-white border border-gray-200 px-2.5 py-1 rounded-full">{plan2.weeklyRange}</span>
                      <span className="bg-white border border-gray-200 px-2.5 py-1 rounded-full">{plan2.runsPerWeek} runs/week</span>
                      <span className="bg-white border border-gray-200 px-2.5 py-1 rounded-full font-medium text-dark">Peak: {plan2.peakMileage}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-center gap-4">
              <button
                onClick={() => goToStep(1)}
                className="px-6 py-3 border border-gray-200 text-dark rounded-xl font-medium hover:bg-light transition-colors"
              >
                Back
              </button>
              <button
                onClick={() => goToStep(3)}
                disabled={!recommendation}
                className={`px-8 py-3 font-semibold rounded-xl transition-colors ${
                  recommendation
                    ? "bg-primary text-white hover:bg-primary-dark"
                    : "bg-gray-200 text-gray cursor-not-allowed"
                }`}
              >
                See Your Plan
              </button>
            </div>
            {!recommendation && (
              <p className="text-xs text-gray text-center mt-3">
                Fill in your longest run to unlock your personalized plan.
              </p>
            )}
          </div>
        </section>
      )}

      {/* ── Step 3: Your Plan ──────────────────────────────────────────── */}
      {currentStep === 3 && (
        <section className="py-14 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

            {/* Navigation links */}
            <div className="flex justify-between items-center mb-6">
              <button onClick={() => goToStep(2)} className="text-sm text-primary hover:underline font-medium">
                &#8592; Edit Profile
              </button>
              <button onClick={() => goToStep(1)} className="text-sm text-gray hover:text-dark font-medium">
                Start Over
              </button>
            </div>

            {/* Plan overview card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-10">
              <div className="bg-gradient-to-r from-primary to-primary-dark p-6 sm:p-8">
                <div className="flex flex-wrap gap-3 mb-3">
                  <span className="bg-white/20 text-white text-sm font-semibold px-3 py-1 rounded-full">{activeDistance}</span>
                  <span className="bg-white/20 text-white text-sm px-3 py-1 rounded-full">{plan2.duration} Weeks</span>
                  {weeksUntilRace !== null && (
                    <span className="bg-accent/90 text-white text-sm font-semibold px-3 py-1 rounded-full">
                      {weeksUntilRace} weeks to race day
                    </span>
                  )}
                </div>
                <h3 className="font-headline text-2xl sm:text-3xl font-bold text-white mb-1">
                  {userName ? `${userName}\u2019s` : "Your"} {activeDistance} Training Plan
                </h3>
                <div className="flex items-center gap-3">
                  <p className="text-white/80 text-sm">
                    {plan2.runsPerWeek} runs/week · {plan2.weeklyRange} · Peak: {plan2.peakMileage}
                    {terrain && terrain !== "mixed" && <> · {terrain === "trail" ? "Trail-focused" : "Road-focused"}</>}
                  </p>
                  <span className="text-white/50 text-xs bg-white/10 px-2 py-0.5 rounded-full">{levelLabel[effectiveLevel]}</span>
                </div>
              </div>

              <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <h4 className="font-headline font-bold text-dark mb-3 text-sm uppercase tracking-wider">Prerequisites</h4>
                  <ul className="space-y-2">
                    {plan2.prerequisites.map((p, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray">
                        <span className="text-green-500 mt-0.5 flex-shrink-0">&#10003;</span>{p}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-headline font-bold text-dark mb-3 text-sm uppercase tracking-wider">Key Workouts</h4>
                  <ul className="space-y-2">
                    {plan2.keyWorkouts.map((w, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray">
                        <span className="text-primary mt-0.5 flex-shrink-0">&rarr;</span>{w}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-headline font-bold text-dark mb-3 text-sm uppercase tracking-wider">Plan Highlights</h4>
                  <ul className="space-y-2">
                    {plan2.highlights.map((h, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray">
                        <span className="text-accent mt-0.5 flex-shrink-0">&#9733;</span>{h}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Tab bar */}
            <PlanTabs activeTab={planTab} onTabChange={setPlanTab} />

            {/* ── Schedule Tab ─────────────────────────────────────────── */}
            {planTab === "schedule" && (
              <div>
                {/* Training phases */}
                <div className="mb-10">
                  <h3 className="font-headline text-xl font-bold text-dark mb-4">Training Phases</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[
                      { phase: "Base Building", weeks: `Weeks 1\u2013${Math.round(plan2.duration * 0.3)}`, desc: "Aerobic development. All easy running.", color: "bg-blue-50 border-blue-200 text-blue-800" },
                      { phase: "Build Phase", weeks: `Weeks ${Math.round(plan2.duration * 0.3) + 1}\u2013${Math.round(plan2.duration * 0.6)}`, desc: "Increasing mileage and introducing intensity.", color: "bg-yellow-50 border-yellow-200 text-yellow-800" },
                      { phase: "Peak Phase", weeks: `Weeks ${Math.round(plan2.duration * 0.6) + 1}\u2013${Math.round(plan2.duration * 0.85)}`, desc: "Highest volume. Race simulations.", color: "bg-orange-50 border-orange-200 text-orange-800" },
                      { phase: "Taper", weeks: `Final ${plan2.duration - Math.round(plan2.duration * 0.85)} weeks`, desc: "Volume drops. Intensity maintained. Rest.", color: "bg-green-50 border-green-200 text-green-800" },
                    ].map((p) => (
                      <div key={p.phase} className={`rounded-xl border p-4 ${p.color}`}>
                        <div className="font-headline font-bold text-sm mb-1">{p.phase}</div>
                        <div className="text-xs font-semibold mb-2 opacity-80">{p.weeks}</div>
                        <div className="text-xs leading-relaxed opacity-90">{p.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Full weekly schedule */}
                <div>
                  {/* Week navigator */}
                  <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                    <h3 className="font-headline text-xl font-bold text-dark">Weekly Schedule</h3>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setActiveWeek(Math.max(0, activeWeek - 1))}
                        disabled={activeWeek === 0}
                        className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
                          activeWeek === 0 ? "bg-gray-100 text-gray cursor-not-allowed" : "bg-white border border-gray-200 text-dark hover:border-primary/40"
                        }`}
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                      </button>
                      <select
                        value={activeWeek}
                        onChange={(e) => setActiveWeek(parseInt(e.target.value))}
                        className="border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium text-dark bg-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                      >
                        {fullSchedule.map((_, i) => (
                          <option key={i} value={i}>Week {i + 1} of {plan2.duration}</option>
                        ))}
                      </select>
                      <button
                        onClick={() => setActiveWeek(Math.min(fullSchedule.length - 1, activeWeek + 1))}
                        disabled={activeWeek === fullSchedule.length - 1}
                        className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
                          activeWeek === fullSchedule.length - 1 ? "bg-gray-100 text-gray cursor-not-allowed" : "bg-white border border-gray-200 text-dark hover:border-primary/40"
                        }`}
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                      </button>
                    </div>
                  </div>

                  {fullSchedule[activeWeek] && (
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                      <div className="p-5 border-b border-gray-100 bg-light flex items-center justify-between flex-wrap gap-2">
                        <div>
                          <div className="font-headline font-bold text-dark">Week {activeWeek + 1}</div>
                          <div className="text-sm text-gray mt-0.5">Total: {getWeekMileage(fullSchedule[activeWeek])}</div>
                        </div>
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                          phaseColor[getWeekPhase(activeWeek).replace(" Phase", "").replace(" Week", "")] || "bg-gray-100 text-gray-700"
                        }`}>
                          {getWeekPhase(activeWeek)}
                        </span>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-gray-100 bg-light/50">
                              {["Day", "Workout", "Distance", "Effort", "Notes"].map((h) => (
                                <th key={h} className="text-left py-3 px-4 font-headline font-semibold text-dark text-xs uppercase tracking-wider">{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {fullSchedule[activeWeek].map((d, i) => {
                              const isLongRun = d.workout.includes("Long run") || d.workout.includes("Race simulation") || d.workout.includes("Race!");
                              return (
                                <tr key={i} className={`border-b border-gray-50 hover:bg-light/40 ${isLongRun ? "bg-primary/[0.03]" : ""}`}>
                                  <td className="py-3 px-4 font-bold text-dark">{d.day}</td>
                                  <td className="py-3 px-4 text-dark">{d.workout}</td>
                                  <td className="py-3 px-4 font-medium text-dark">{d.distance}</td>
                                  <td className={`py-3 px-4 text-xs font-medium ${effortColor(d.effort)}`}>{d.effort}</td>
                                  <td className="py-3 px-4 text-gray">{d.notes}</td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── Progression Tab ──────────────────────────────────────── */}
            {planTab === "progression" && (
              <div>
                <h3 className="font-headline text-xl font-bold text-dark mb-4">Long Run Progression</h3>
                <div className="overflow-x-auto rounded-2xl border border-gray-100 shadow-sm">
                  <table className="w-full text-sm bg-white">
                    <thead>
                      <tr className="border-b-2 border-gray-100 bg-light">
                        {["Week", "Long Run (Sat)", "Back-to-Back (Sun)", "Total Weekend", "Phase"].map((h) => (
                          <th key={h} className="text-left py-3 px-4 font-headline font-semibold text-dark text-xs uppercase tracking-wider">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {plan2.longRunProgression.map((row, i) => (
                        <tr key={i} className="border-b border-gray-50 hover:bg-light/40">
                          <td className="py-3 px-4 font-bold text-dark">{row.week}</td>
                          <td className="py-3 px-4 font-medium text-dark">{row.longRun}</td>
                          <td className="py-3 px-4 text-gray">{row.b2b}</td>
                          <td className="py-3 px-4 font-medium text-dark">{row.total}</td>
                          <td className="py-3 px-4">
                            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${phaseColor[row.phase] || "bg-gray-100 text-gray-700"}`}>{row.phase}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ── Zones Tab ────────────────────────────────────────────── */}
            {planTab === "zones" && (
              <div>
                <div className="text-center mb-8">
                  <h3 className="font-headline text-xl font-bold text-dark mb-2">Training Zones Guide</h3>
                  <p className="text-gray text-sm max-w-xl mx-auto">Ultra running is 80% Zone 2. Knowing your zones makes every workout intentional.</p>
                </div>
                <div className="space-y-3">
                  {TRAINING_ZONES.map((z) => (
                    <div key={z.zone} className={`flex flex-wrap gap-4 items-start rounded-xl border p-5 ${z.border}`}>
                      <div className="flex-shrink-0">
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${z.color}`}>{z.zone}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap gap-4 mb-1">
                          <span className="font-headline font-bold text-dark">{z.name}</span>
                          <span className="text-sm text-gray">{z.hr}</span>
                          <span className="text-sm font-medium text-dark">{z.pace}</span>
                        </div>
                        <p className="text-sm text-gray">{z.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 bg-primary/5 border border-primary/20 rounded-xl p-5">
                  <p className="text-sm text-dark"><span className="font-semibold text-primary">Calculate your zones: </span>Find your max HR with a hard 3-minute all-out effort (or use 220 minus age as an estimate). Multiply by the HR percentages above. For threshold-based zones, run a 30-minute time trial and use 95% of that pace as your threshold.</p>
                </div>
              </div>
            )}

            {/* ── Pacing Tab ───────────────────────────────────────────── */}
            {planTab === "pacing" && (
              <div className="max-w-lg mx-auto">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <h3 className="font-headline text-xl font-bold text-dark mb-1">Training Pace Calculator</h3>
                  <p className="text-sm text-gray mb-5">Enter a target finish time for {activeDistance} to get training paces.</p>
                  <div className="flex gap-3 mb-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-dark mb-2">Hours</label>
                      <input type="number" value={targetHours} onChange={(e) => setTargetHours(e.target.value)}
                        placeholder="e.g. 6" className="w-full border border-gray-200 rounded-lg px-4 py-3 text-dark focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-dark mb-2">Minutes</label>
                      <input type="number" value={targetMins} onChange={(e) => setTargetMins(e.target.value)}
                        placeholder="e.g. 30" className="w-full border border-gray-200 rounded-lg px-4 py-3 text-dark focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
                    </div>
                  </div>
                  {pacing && (
                    <div className="space-y-2">
                      {[
                        { label: "Race Pace", value: pacing.racePace, color: "text-dark" },
                        { label: "Long Run Pace (Zone 2)", value: pacing.longRunPace, color: "text-green-700" },
                        { label: "Easy Run Pace (Zone 1–2)", value: pacing.easyPace, color: "text-green-600" },
                        { label: "Tempo Pace (Zone 3)", value: pacing.tempoPace, color: "text-yellow-700" },
                        { label: "Interval Pace (Zone 4)", value: pacing.intervalPace, color: "text-orange-700" },
                      ].map((p) => (
                        <div key={p.label} className="flex items-center justify-between bg-light rounded-lg px-4 py-2.5">
                          <span className="text-sm text-gray">{p.label}</span>
                          <span className={`text-sm font-bold ${p.color}`}>{p.value}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── Resources Tab ────────────────────────────────────────── */}
            {planTab === "resources" && (
              <div>
                {/* Accordion sections */}
                <div className="space-y-4 mb-14">
                  {/* Nutrition */}
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <button onClick={() => toggleSection("nutrition", openSection, setOpenSection)} className="w-full flex items-center justify-between p-6 text-left hover:bg-light/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">&#9889;</span>
                        <h3 className="font-headline text-xl font-bold text-dark">Nutrition & Fueling Strategy</h3>
                      </div>
                      <span className="text-gray text-xl">{openSection === "nutrition" ? "\u2212" : "+"}</span>
                    </button>
                    {openSection === "nutrition" && (
                      <div className="px-6 pb-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
                        {NUTRITION_TIPS.map((t) => (
                          <div key={t.title} className="bg-light rounded-xl p-4">
                            <h4 className="font-headline font-bold text-dark mb-2 text-sm">{t.title}</h4>
                            <p className="text-sm text-gray leading-relaxed">{t.body}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Strength */}
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <button onClick={() => toggleSection("strength", openSection, setOpenSection)} className="w-full flex items-center justify-between p-6 text-left hover:bg-light/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">&#128170;</span>
                        <h3 className="font-headline text-xl font-bold text-dark">Strength & Cross Training</h3>
                      </div>
                      <span className="text-gray text-xl">{openSection === "strength" ? "\u2212" : "+"}</span>
                    </button>
                    {openSection === "strength" && (
                      <div className="px-6 pb-6">
                        <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mb-5 text-sm text-dark">
                          <span className="font-semibold text-primary">Scheduling tip: </span>Do strength work after easy runs, never before long runs or quality workouts. Tuesday and Thursday work well for most plans.
                        </div>
                        <div className="overflow-x-auto rounded-xl border border-gray-100">
                          <table className="w-full text-sm">
                            <thead className="bg-light">
                              <tr>
                                {["Exercise", "Sets \u00d7 Reps", "Purpose"].map((h) => (
                                  <th key={h} className="text-left py-3 px-4 font-headline font-semibold text-dark text-xs uppercase tracking-wider">{h}</th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {STRENGTH_EXERCISES.map((e, i) => (
                                <tr key={i} className="border-t border-gray-50 hover:bg-light/40">
                                  <td className="py-3 px-4 font-medium text-dark">{e.name}</td>
                                  <td className="py-3 px-4 text-gray">{e.sets}</td>
                                  <td className="py-3 px-4 text-gray">{e.purpose}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        <p className="text-sm text-gray mt-4">Cross-training options: cycling, swimming, hiking (with poles), elliptical. All work Zone 1&ndash;2 cardio without run-specific impact stress. Use on rest days or as a second workout.</p>
                      </div>
                    )}
                  </div>

                  {/* Injury Prevention */}
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <button onClick={() => toggleSection("injury", openSection, setOpenSection)} className="w-full flex items-center justify-between p-6 text-left hover:bg-light/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">&#129657;</span>
                        <h3 className="font-headline text-xl font-bold text-dark">Injury Prevention & Warning Signs</h3>
                      </div>
                      <span className="text-gray text-xl">{openSection === "injury" ? "\u2212" : "+"}</span>
                    </button>
                    {openSection === "injury" && (
                      <div className="px-6 pb-6 space-y-3">
                        {INJURY_WARNINGS.map((w, i) => (
                          <div key={i} className="flex gap-4 p-4 bg-red-50 border border-red-100 rounded-xl">
                            <span className="text-red-500 text-lg flex-shrink-0 mt-0.5">&#9888;</span>
                            <div>
                              <div className="font-semibold text-dark text-sm mb-1">{w.signal}</div>
                              <div className="text-sm text-gray">{w.action}</div>
                            </div>
                          </div>
                        ))}
                        <p className="text-sm text-gray pt-2">Most ultra training injuries are caused by doing too much too soon. Trust the cutback weeks. Missing one long run costs you nothing. Running through pain costs you weeks.</p>
                      </div>
                    )}
                  </div>

                  {/* Gear Testing */}
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <button onClick={() => toggleSection("gear", openSection, setOpenSection)} className="w-full flex items-center justify-between p-6 text-left hover:bg-light/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">&#127890;</span>
                        <h3 className="font-headline text-xl font-bold text-dark">Gear Testing Schedule</h3>
                      </div>
                      <span className="text-gray text-xl">{openSection === "gear" ? "\u2212" : "+"}</span>
                    </button>
                    {openSection === "gear" && (
                      <div className="px-6 pb-6 space-y-3">
                        {GEAR_TESTING_TIMELINE.map((g, i) => (
                          <div key={i} className="flex gap-4 p-4 bg-light rounded-xl border border-gray-100">
                            <div className="flex-shrink-0 w-20 text-xs font-bold text-primary">{g.weeks}</div>
                            <div className="text-sm text-gray">{g.task}</div>
                          </div>
                        ))}
                        <div className="mt-2">
                          <Link href="/gear/race-day-kit" className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline">
                            View the complete Race Day Kit guide &rarr;
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Training Resources */}
                <div>
                  <h3 className="font-headline text-xl font-bold text-dark mb-4">Training Resources</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {AFFILIATE_RESOURCES.map((r) => (
                      <a key={r.name} href={r.url} target="_blank" rel="noopener noreferrer sponsored"
                        className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md hover:border-primary/20 transition-all group">
                        <div className="flex items-start justify-between mb-3">
                          <h4 className="font-headline font-bold text-dark group-hover:text-primary transition-colors">{r.name}</h4>
                          <span className="text-sm font-bold text-dark ml-2 flex-shrink-0">{r.price}</span>
                        </div>
                        <p className="text-sm text-gray leading-relaxed">{r.desc}</p>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── CTA ──────────────────────────────────────────────────── */}
            <div className="mt-14 bg-dark rounded-2xl py-12 px-6 text-center">
              <h2 className="font-headline text-2xl sm:text-3xl font-bold text-white mb-4">Ready to Start Training?</h2>
              <p className="text-gray mb-8 max-w-xl mx-auto text-sm">Pick your distance, commit to the plan, and trust the process. Consistency beats intensity every time.</p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/gear/race-day-kit" className="inline-flex items-center gap-2 px-7 py-3.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-colors">
                  Build Your Race Kit
                </Link>
                <Link href="/training/first-50k" className="inline-flex items-center gap-2 px-7 py-3.5 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition-colors border border-white/20">
                  First 50K Plan
                </Link>
              </div>
            </div>

            {/* Affiliate disclosure */}
            <div className="mt-8">
              <p className="text-xs text-gray text-center leading-relaxed">
                <span className="font-semibold">Affiliate Disclosure:</span> Some links in the resources section are affiliate links. We may earn a small commission at no extra cost to you. We only recommend tools and resources we would genuinely use.
              </p>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
