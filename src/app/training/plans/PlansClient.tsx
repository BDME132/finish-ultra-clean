"use client";

import { useState } from "react";
import Link from "next/link";

// ─── Types ────────────────────────────────────────────────────────────────────
type Distance = "50K" | "50M" | "100K" | "100M";
type Level = "beginner" | "intermediate" | "advanced";

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
        { week: 4, longRun: "8 mi", b2b: "—", total: "8 mi", phase: "Cutback" },
        { week: 6, longRun: "16 mi", b2b: "8 mi", total: "24 mi", phase: "Build" },
        { week: 8, longRun: "17 mi", b2b: "8 mi", total: "25 mi", phase: "Build" },
        { week: 9, longRun: "18 mi", b2b: "10 mi", total: "28 mi", phase: "Peak" },
        { week: 11, longRun: "22 mi", b2b: "10 mi", total: "32 mi", phase: "Peak" },
        { week: 13, longRun: "18 mi", b2b: "8 mi", total: "26 mi", phase: "Sharpen" },
        { week: 14, longRun: "14 mi", b2b: "—", total: "14 mi", phase: "Taper" },
        { week: 15, longRun: "10 mi", b2b: "—", total: "10 mi", phase: "Taper" },
        { week: 16, longRun: "50K Race!", b2b: "—", total: "31 mi", phase: "Race" },
      ],
    },
    intermediate: {
      duration: 18,
      prerequisites: ["1–2 ultra finishes or 3+ marathons", "Running 40+ miles/week consistently", "Comfortable with back-to-back long runs"],
      weeklyRange: "40–65 miles",
      peakMileage: "60–65 miles",
      runsPerWeek: "5–6",
      keyWorkouts: ["Zone 2 easy runs", "Weekly tempo run (3–5 miles at threshold)", "Interval sessions (800m–mile repeats)", "Hill repeats 1–2×/week", "Back-to-back long runs", "Race simulation runs × 2"],
      highlights: ["Long run progression to 26 miles", "Speed work integrated from week 4", "Vertical gain requirements increase each phase", "2 full race simulations in peak phase"],
      sampleWeeks: [
        {
          label: "Week 1 — Base Building",
          context: "Higher starting volume than beginner. Focus on aerobic base.",
          days: [
            { day: "Mon", workout: "Rest or yoga", distance: "—", effort: "Zone 1", notes: "" },
            { day: "Tue", workout: "Easy run", distance: "6 miles", effort: "Zone 2", notes: "" },
            { day: "Wed", workout: "Easy run + strength", distance: "7 miles", effort: "Zone 2", notes: "Full lower body strength routine" },
            { day: "Thu", workout: "Easy run", distance: "5 miles", effort: "Zone 2", notes: "" },
            { day: "Fri", workout: "Easy run", distance: "4 miles", effort: "Zone 1–2", notes: "Recovery pace" },
            { day: "Sat", workout: "Long run", distance: "14 miles", effort: "Zone 2", notes: "Trail if possible" },
            { day: "Sun", workout: "Back-to-back", distance: "6 miles", effort: "Zone 1", notes: "Easy + hike if trails available" },
          ],
        },
        {
          label: "Week 10 — Build Phase",
          context: "Intensity and volume at their highest combined point.",
          days: [
            { day: "Mon", workout: "Rest", distance: "—", effort: "—", notes: "" },
            { day: "Tue", workout: "Interval workout", distance: "8 miles (5 × 1K)", effort: "Zone 4–5", notes: "Warm up 2 mi, 5 × 1K @ 5K effort, 400m jog recovery" },
            { day: "Wed", workout: "Easy run + strength", distance: "7 miles", effort: "Zone 2", notes: "" },
            { day: "Thu", workout: "Tempo run", distance: "8 miles (5 at tempo)", effort: "Zone 3–4", notes: "" },
            { day: "Fri", workout: "Easy run", distance: "5 miles", effort: "Zone 2", notes: "" },
            { day: "Sat", workout: "Long run", distance: "22 miles", effort: "Zone 2", notes: "Include 2,000+ ft elevation" },
            { day: "Sun", workout: "Back-to-back", distance: "12 miles", effort: "Zone 1–2", notes: "Technical trail preferred" },
          ],
        },
        {
          label: "Week 16 — Taper",
          context: "Trust the training. Feel fresh. Stay sharp.",
          days: [
            { day: "Mon", workout: "Rest", distance: "—", effort: "—", notes: "" },
            { day: "Tue", workout: "Easy run with strides", distance: "5 miles", effort: "Zone 2 + strides", notes: "4 × 20-sec strides" },
            { day: "Wed", workout: "Easy run", distance: "4 miles", effort: "Zone 2", notes: "" },
            { day: "Thu", workout: "Short tempo", distance: "4 miles (2 at tempo)", effort: "Zone 3", notes: "Keep legs sharp" },
            { day: "Fri", workout: "Rest", distance: "—", effort: "—", notes: "" },
            { day: "Sat", workout: "Easy long run", distance: "12 miles", effort: "Zone 2", notes: "Last long run — enjoy it" },
            { day: "Sun", workout: "Recovery run", distance: "5 miles", effort: "Zone 1", notes: "" },
          ],
        },
      ],
      longRunProgression: [
        { week: 1, longRun: "14 mi", b2b: "6 mi", total: "20 mi", phase: "Base" },
        { week: 4, longRun: "10 mi", b2b: "—", total: "10 mi", phase: "Cutback" },
        { week: 6, longRun: "18 mi", b2b: "9 mi", total: "27 mi", phase: "Build" },
        { week: 8, longRun: "10 mi", b2b: "—", total: "10 mi", phase: "Cutback" },
        { week: 10, longRun: "22 mi", b2b: "12 mi", total: "34 mi", phase: "Peak" },
        { week: 12, longRun: "26 mi", b2b: "13 mi", total: "39 mi", phase: "Peak" },
        { week: 14, longRun: "20 mi", b2b: "10 mi", total: "30 mi", phase: "Sharpen" },
        { week: 16, longRun: "12 mi", b2b: "—", total: "12 mi", phase: "Taper" },
        { week: 17, longRun: "8 mi", b2b: "—", total: "8 mi", phase: "Taper" },
        { week: 18, longRun: "50K Race!", b2b: "—", total: "31 mi", phase: "Race" },
      ],
    },
    advanced: {
      duration: 20,
      prerequisites: ["3+ ultra finishes including at least one 50K", "Running 55+ miles/week comfortably", "Experience with back-to-back long runs", "Consistent strength training background"],
      weeklyRange: "55–80 miles",
      peakMileage: "75–80 miles",
      runsPerWeek: "6–7",
      keyWorkouts: ["Double-day training (2 runs in one day) × 1/week in peak", "VO2 max intervals (mile repeats, Yasso 800s)", "Tempo runs 8–10 miles", "Long hill repeats (800m–1 mile)", "Back-to-back 25+ total weekend miles", "2–3 full race simulations"],
      highlights: ["Peak long run of 28+ miles", "Race simulation runs in race kit and terrain", "Double-day workouts to simulate cumulative fatigue", "Optional: pace work targeting top 25% finish time"],
      sampleWeeks: [
        {
          label: "Week 1 — Base Phase",
          context: "High-volume aerobic foundation. Two-a-days begin in week 6.",
          days: [
            { day: "Mon", workout: "Recovery run", distance: "5 miles", effort: "Zone 1", notes: "" },
            { day: "Tue", workout: "Easy run + strength", distance: "8 miles", effort: "Zone 2", notes: "Full strength session" },
            { day: "Wed", workout: "Tempo run", distance: "10 miles (6 at tempo)", effort: "Zone 3–4", notes: "" },
            { day: "Thu", workout: "Easy run", distance: "7 miles", effort: "Zone 2", notes: "" },
            { day: "Fri", workout: "Easy run or rest", distance: "5 miles", effort: "Zone 2", notes: "" },
            { day: "Sat", workout: "Long run", distance: "18 miles", effort: "Zone 2", notes: "Trail with 2,500+ ft elevation" },
            { day: "Sun", workout: "Back-to-back", distance: "10 miles", effort: "Zone 1–2", notes: "" },
          ],
        },
        {
          label: "Week 12 — Peak Phase",
          context: "Highest stress week. Race simulation Saturday.",
          days: [
            { day: "Mon", workout: "Rest", distance: "—", effort: "—", notes: "" },
            { day: "Tue", workout: "Mile repeats", distance: "10 miles (5 × mile)", effort: "Zone 4–5", notes: "2-min jog recovery between" },
            { day: "Wed", workout: "Easy double", distance: "6 mi AM / 4 mi PM", effort: "Zone 1–2", notes: "Two-a-day to simulate fatigue" },
            { day: "Thu", workout: "Long hill repeats + strength", distance: "8 miles", effort: "Zone 3", notes: "4 × 800m hill repeats" },
            { day: "Fri", workout: "Rest", distance: "—", effort: "—", notes: "Prep full race kit" },
            { day: "Sat", workout: "Race simulation", distance: "28 miles", effort: "Zone 2 / race effort", notes: "Full kit, race nutrition, race terrain" },
            { day: "Sun", workout: "Back-to-back", distance: "12 miles", effort: "Zone 1", notes: "Hike is fine if legs are trashed" },
          ],
        },
        {
          label: "Week 18 — Taper",
          context: "Feel fast. Stay sharp. Resist urge to add more.",
          days: [
            { day: "Mon", workout: "Rest", distance: "—", effort: "—", notes: "" },
            { day: "Tue", workout: "Easy run + strides", distance: "6 miles", effort: "Zone 2 + strides", notes: "6 × 20-sec strides" },
            { day: "Wed", workout: "Sharpener workout", distance: "6 miles (3 × mile @ tempo)", effort: "Zone 3–4", notes: "" },
            { day: "Thu", workout: "Easy run", distance: "5 miles", effort: "Zone 2", notes: "" },
            { day: "Fri", workout: "Rest", distance: "—", effort: "—", notes: "" },
            { day: "Sat", workout: "Easy long run", distance: "14 miles", effort: "Zone 2", notes: "" },
            { day: "Sun", workout: "Easy run", distance: "6 miles", effort: "Zone 1", notes: "" },
          ],
        },
      ],
      longRunProgression: [
        { week: 1, longRun: "18 mi", b2b: "10 mi", total: "28 mi", phase: "Base" },
        { week: 4, longRun: "12 mi", b2b: "—", total: "12 mi", phase: "Cutback" },
        { week: 7, longRun: "22 mi", b2b: "12 mi", total: "34 mi", phase: "Build" },
        { week: 10, longRun: "25 mi", b2b: "13 mi", total: "38 mi", phase: "Build" },
        { week: 12, longRun: "28 mi", b2b: "14 mi", total: "42 mi", phase: "Peak" },
        { week: 14, longRun: "22 mi", b2b: "11 mi", total: "33 mi", phase: "Sharpen" },
        { week: 16, longRun: "18 mi", b2b: "—", total: "18 mi", phase: "Taper" },
        { week: 18, longRun: "14 mi", b2b: "—", total: "14 mi", phase: "Taper" },
        { week: 20, longRun: "50K Race!", b2b: "—", total: "31 mi", phase: "Race" },
      ],
    },
  },

  "50M": {
    beginner: {
      duration: 20,
      prerequisites: ["50K finish within the past 18 months", "Running 35+ miles/week", "Comfortable with 20-mile long runs"],
      weeklyRange: "35–60 miles",
      peakMileage: "55–60 miles",
      runsPerWeek: "5",
      keyWorkouts: ["Long runs progressing to 30 miles", "Back-to-back weekends (30+ total)", "Hill training 1×/week", "Easy tempo runs 1×/week in build phase"],
      highlights: ["First 30-mile training run in peak phase", "Mandatory gear testing over 5-week window", "Night running practice (2 sessions)", "Focus on time-on-feet over pace"],
      sampleWeeks: [
        {
          label: "Week 1 — Base Building",
          context: "Building from your 50K base. All runs easy.",
          days: [
            { day: "Mon", workout: "Rest", distance: "—", effort: "—", notes: "" },
            { day: "Tue", workout: "Easy run", distance: "6 miles", effort: "Zone 2", notes: "" },
            { day: "Wed", workout: "Easy run + strength", distance: "7 miles", effort: "Zone 2", notes: "" },
            { day: "Thu", workout: "Easy run", distance: "6 miles", effort: "Zone 2", notes: "" },
            { day: "Fri", workout: "Rest or easy hike", distance: "—", effort: "Zone 1", notes: "" },
            { day: "Sat", workout: "Long run", distance: "16 miles", effort: "Zone 2", notes: "Trail with elevation" },
            { day: "Sun", workout: "Back-to-back", distance: "8 miles", effort: "Zone 1", notes: "" },
          ],
        },
        {
          label: "Week 11 — Build Phase",
          context: "Volume peaks. Night run practice begins.",
          days: [
            { day: "Mon", workout: "Rest", distance: "—", effort: "—", notes: "" },
            { day: "Tue", workout: "Tempo run", distance: "8 miles (5 at tempo)", effort: "Zone 3–4", notes: "" },
            { day: "Wed", workout: "Easy run + strength", distance: "7 miles", effort: "Zone 2", notes: "" },
            { day: "Thu", workout: "Hill repeats", distance: "7 miles", effort: "Zone 3", notes: "6 × 400m hills" },
            { day: "Fri", workout: "Rest", distance: "—", effort: "—", notes: "" },
            { day: "Sat", workout: "Long run", distance: "26 miles", effort: "Zone 2", notes: "Full race kit" },
            { day: "Sun", workout: "Night run (back-to-back)", distance: "10 miles", effort: "Zone 1–2", notes: "Practice headlamp, night nutrition" },
          ],
        },
        {
          label: "Week 18 — Taper",
          context: "Volume drops sharply. Keep intensity to stay sharp.",
          days: [
            { day: "Mon", workout: "Rest", distance: "—", effort: "—", notes: "" },
            { day: "Tue", workout: "Easy run + strides", distance: "5 miles", effort: "Zone 2", notes: "" },
            { day: "Wed", workout: "Easy run", distance: "5 miles", effort: "Zone 2", notes: "" },
            { day: "Thu", workout: "Short tempo", distance: "5 miles (3 at tempo)", effort: "Zone 3", notes: "" },
            { day: "Fri", workout: "Rest", distance: "—", effort: "—", notes: "" },
            { day: "Sat", workout: "Easy long run", distance: "14 miles", effort: "Zone 2", notes: "" },
            { day: "Sun", workout: "Easy run", distance: "5 miles", effort: "Zone 1", notes: "" },
          ],
        },
      ],
      longRunProgression: [
        { week: 1, longRun: "16 mi", b2b: "8 mi", total: "24 mi", phase: "Base" },
        { week: 4, longRun: "10 mi", b2b: "—", total: "10 mi", phase: "Cutback" },
        { week: 7, longRun: "20 mi", b2b: "10 mi", total: "30 mi", phase: "Build" },
        { week: 11, longRun: "26 mi", b2b: "10 mi", total: "36 mi", phase: "Build" },
        { week: 13, longRun: "30 mi", b2b: "12 mi", total: "42 mi", phase: "Peak" },
        { week: 15, longRun: "22 mi", b2b: "10 mi", total: "32 mi", phase: "Sharpen" },
        { week: 18, longRun: "14 mi", b2b: "—", total: "14 mi", phase: "Taper" },
        { week: 19, longRun: "10 mi", b2b: "—", total: "10 mi", phase: "Taper" },
        { week: 20, longRun: "50M Race!", b2b: "—", total: "50 mi", phase: "Race" },
      ],
    },
    intermediate: {
      duration: 22,
      prerequisites: ["2+ ultra finishes including a 50K", "40+ miles/week base", "Experience with elevation gain training"],
      weeklyRange: "45–70 miles",
      peakMileage: "65–70 miles",
      runsPerWeek: "5–6",
      keyWorkouts: ["Interval workouts (800m, mile repeats)", "Tempo runs 8–10 miles", "Back-to-back 30+ total miles", "2 night running sessions", "2 race simulations in full gear"],
      highlights: ["Peak long run 32 miles", "Speed work from week 3", "Mandatory 3,000+ ft vertical in peak phase long runs", "Drop bag practice during long runs"],
      sampleWeeks: [
        {
          label: "Week 1 — Base Phase",
          context: "Starting at a higher aerobic floor.",
          days: [
            { day: "Mon", workout: "Rest", distance: "—", effort: "—", notes: "" },
            { day: "Tue", workout: "Easy run", distance: "7 miles", effort: "Zone 2", notes: "" },
            { day: "Wed", workout: "Easy run + strength", distance: "8 miles", effort: "Zone 2", notes: "" },
            { day: "Thu", workout: "Fartlek run", distance: "7 miles", effort: "Zone 2–4", notes: "5 × 3-min surges" },
            { day: "Fri", workout: "Easy run", distance: "5 miles", effort: "Zone 1–2", notes: "" },
            { day: "Sat", workout: "Long run", distance: "18 miles", effort: "Zone 2", notes: "Hilly trail" },
            { day: "Sun", workout: "Back-to-back", distance: "10 miles", effort: "Zone 1", notes: "" },
          ],
        },
        {
          label: "Week 12 — Build Phase",
          context: "Highest combined volume and intensity.",
          days: [
            { day: "Mon", workout: "Rest", distance: "—", effort: "—", notes: "" },
            { day: "Tue", workout: "Mile repeats", distance: "10 miles (6 × mile)", effort: "Zone 4–5", notes: "" },
            { day: "Wed", workout: "Easy run + strength", distance: "7 miles", effort: "Zone 2", notes: "" },
            { day: "Thu", workout: "Tempo run", distance: "9 miles (6 at tempo)", effort: "Zone 3–4", notes: "" },
            { day: "Fri", workout: "Rest", distance: "—", effort: "—", notes: "" },
            { day: "Sat", workout: "Race simulation", distance: "30 miles", effort: "Zone 2", notes: "Full kit, simulate crew stops" },
            { day: "Sun", workout: "Night back-to-back", distance: "12 miles", effort: "Zone 1–2", notes: "Headlamp required" },
          ],
        },
        {
          label: "Week 20 — Taper",
          context: "Sharp and rested. Race week preparation.",
          days: [
            { day: "Mon", workout: "Rest", distance: "—", effort: "—", notes: "" },
            { day: "Tue", workout: "Easy run + strides", distance: "6 miles", effort: "Zone 2", notes: "" },
            { day: "Wed", workout: "Easy run", distance: "5 miles", effort: "Zone 2", notes: "" },
            { day: "Thu", workout: "Sharpener", distance: "5 miles (2 × mile at tempo)", effort: "Zone 3", notes: "" },
            { day: "Fri", workout: "Rest", distance: "—", effort: "—", notes: "" },
            { day: "Sat", workout: "Easy long run", distance: "12 miles", effort: "Zone 2", notes: "" },
            { day: "Sun", workout: "Easy run", distance: "5 miles", effort: "Zone 1", notes: "" },
          ],
        },
      ],
      longRunProgression: [
        { week: 1, longRun: "18 mi", b2b: "10 mi", total: "28 mi", phase: "Base" },
        { week: 5, longRun: "12 mi", b2b: "—", total: "12 mi", phase: "Cutback" },
        { week: 8, longRun: "24 mi", b2b: "12 mi", total: "36 mi", phase: "Build" },
        { week: 12, longRun: "30 mi", b2b: "13 mi", total: "43 mi", phase: "Build" },
        { week: 14, longRun: "32 mi", b2b: "14 mi", total: "46 mi", phase: "Peak" },
        { week: 16, longRun: "24 mi", b2b: "10 mi", total: "34 mi", phase: "Sharpen" },
        { week: 20, longRun: "12 mi", b2b: "—", total: "12 mi", phase: "Taper" },
        { week: 22, longRun: "50M Race!", b2b: "—", total: "50 mi", phase: "Race" },
      ],
    },
    advanced: {
      duration: 26,
      prerequisites: ["3+ ultra finishes including a 50K or better", "55+ miles/week baseline", "Double-day training experience", "Strong strength training background"],
      weeklyRange: "60–90 miles",
      peakMileage: "85–90 miles",
      runsPerWeek: "6–7",
      keyWorkouts: ["Double-day workouts 1–2×/week in peak", "VO2 max intervals", "Long tempo runs 10–12 miles", "Back-to-back 35+ total miles", "3 race simulations", "2+ night runs"],
      highlights: ["Peak long run of 34–36 miles", "Multiple double-day weeks", "Competitive pacing strategy built in", "Mandatory elevation simulation for mountain 50s"],
      sampleWeeks: [
        {
          label: "Week 1 — Base Phase",
          context: "High-volume aerobic base. Two-a-days in weeks 8–16.",
          days: [
            { day: "Mon", workout: "Easy recovery run", distance: "6 miles", effort: "Zone 1", notes: "" },
            { day: "Tue", workout: "Easy run + strength", distance: "9 miles", effort: "Zone 2", notes: "" },
            { day: "Wed", workout: "Tempo run", distance: "10 miles (6 at tempo)", effort: "Zone 3–4", notes: "" },
            { day: "Thu", workout: "Easy run", distance: "7 miles", effort: "Zone 2", notes: "" },
            { day: "Fri", workout: "Easy run", distance: "5 miles", effort: "Zone 2", notes: "" },
            { day: "Sat", workout: "Long run", distance: "20 miles", effort: "Zone 2", notes: "Technical trail, max elevation" },
            { day: "Sun", workout: "Back-to-back", distance: "12 miles", effort: "Zone 1–2", notes: "" },
          ],
        },
        {
          label: "Week 14 — Peak Phase",
          context: "Two-a-days and race simulation. Maximum fatigue stimulus.",
          days: [
            { day: "Mon", workout: "Rest", distance: "—", effort: "—", notes: "" },
            { day: "Tue", workout: "Mile repeats", distance: "12 miles (6 × mile)", effort: "Zone 4–5", notes: "" },
            { day: "Wed", workout: "Double: AM easy / PM easy", distance: "7 mi + 5 mi", effort: "Zone 1–2", notes: "Two-a-day fatigue accumulation" },
            { day: "Thu", workout: "Tempo + hill repeats", distance: "10 miles", effort: "Zone 3–4", notes: "5 mi tempo + 4 × 800m hills" },
            { day: "Fri", workout: "Rest", distance: "—", effort: "—", notes: "" },
            { day: "Sat", workout: "Race simulation", distance: "34 miles", effort: "Zone 2 / race effort", notes: "Full crew, drop bags, race nutrition" },
            { day: "Sun", workout: "Night back-to-back", distance: "14 miles", effort: "Zone 1", notes: "" },
          ],
        },
        {
          label: "Week 23 — Taper",
          context: "Two weeks out. Sharpen, don't add.",
          days: [
            { day: "Mon", workout: "Rest", distance: "—", effort: "—", notes: "" },
            { day: "Tue", workout: "Easy run + strides", distance: "7 miles", effort: "Zone 2", notes: "" },
            { day: "Wed", workout: "Sharpener workout", distance: "7 miles (3 × mile @ tempo)", effort: "Zone 3", notes: "" },
            { day: "Thu", workout: "Easy run", distance: "5 miles", effort: "Zone 2", notes: "" },
            { day: "Fri", workout: "Rest", distance: "—", effort: "—", notes: "" },
            { day: "Sat", workout: "Easy long run", distance: "16 miles", effort: "Zone 2", notes: "" },
            { day: "Sun", workout: "Easy run", distance: "6 miles", effort: "Zone 1", notes: "" },
          ],
        },
      ],
      longRunProgression: [
        { week: 1, longRun: "20 mi", b2b: "12 mi", total: "32 mi", phase: "Base" },
        { week: 5, longRun: "14 mi", b2b: "—", total: "14 mi", phase: "Cutback" },
        { week: 8, longRun: "26 mi", b2b: "14 mi", total: "40 mi", phase: "Build" },
        { week: 12, longRun: "30 mi", b2b: "15 mi", total: "45 mi", phase: "Build" },
        { week: 14, longRun: "34 mi", b2b: "16 mi", total: "50 mi", phase: "Peak" },
        { week: 18, longRun: "26 mi", b2b: "12 mi", total: "38 mi", phase: "Sharpen" },
        { week: 22, longRun: "16 mi", b2b: "—", total: "16 mi", phase: "Taper" },
        { week: 26, longRun: "50M Race!", b2b: "—", total: "50 mi", phase: "Race" },
      ],
    },
  },

  "100K": {
    beginner: {
      duration: 24,
      prerequisites: ["50-mile finish", "40+ miles/week baseline", "Comfortable running 25+ miles in a day"],
      weeklyRange: "45–70 miles",
      peakMileage: "65–70 miles",
      runsPerWeek: "5–6",
      keyWorkouts: ["Long runs to 32–34 miles", "Back-to-back 35+ mile weekends", "2 night running sessions", "Mandatory elevation training", "Race simulation × 2"],
      highlights: ["32-mile long run in peak phase", "Night run protocol built in from week 12", "Drop bag and aid station simulation", "Focus on 100K-specific nutrition timing"],
      sampleWeeks: [
        {
          label: "Week 1 — Base Phase",
          context: "Coming off 50M base. Rebuild aerobic foundation.",
          days: [
            { day: "Mon", workout: "Rest", distance: "—", effort: "—", notes: "" },
            { day: "Tue", workout: "Easy run", distance: "7 miles", effort: "Zone 2", notes: "" },
            { day: "Wed", workout: "Easy run + strength", distance: "8 miles", effort: "Zone 2", notes: "" },
            { day: "Thu", workout: "Hill repeats", distance: "7 miles", effort: "Zone 3", notes: "5 × 400m hills" },
            { day: "Fri", workout: "Rest", distance: "—", effort: "—", notes: "" },
            { day: "Sat", workout: "Long run", distance: "18 miles", effort: "Zone 2", notes: "Technical trail, 2,500+ ft" },
            { day: "Sun", workout: "Back-to-back", distance: "10 miles", effort: "Zone 1", notes: "" },
          ],
        },
        {
          label: "Week 14 — Build Phase",
          context: "Volume and night running. Simulate 100K conditions.",
          days: [
            { day: "Mon", workout: "Rest", distance: "—", effort: "—", notes: "" },
            { day: "Tue", workout: "Interval workout", distance: "9 miles (5 × 1K)", effort: "Zone 4", notes: "" },
            { day: "Wed", workout: "Easy run + strength", distance: "8 miles", effort: "Zone 2", notes: "" },
            { day: "Thu", workout: "Tempo run", distance: "9 miles (6 at tempo)", effort: "Zone 3–4", notes: "" },
            { day: "Fri", workout: "Rest", distance: "—", effort: "—", notes: "" },
            { day: "Sat", workout: "Long run — day into night", distance: "30 miles", effort: "Zone 2", notes: "Start at 3PM, run into dark, use headlamp" },
            { day: "Sun", workout: "Back-to-back", distance: "12 miles", effort: "Zone 1", notes: "" },
          ],
        },
        {
          label: "Week 22 — Taper",
          context: "Two weeks out. Protect fitness, don't build it.",
          days: [
            { day: "Mon", workout: "Rest", distance: "—", effort: "—", notes: "" },
            { day: "Tue", workout: "Easy run + strides", distance: "6 miles", effort: "Zone 2", notes: "" },
            { day: "Wed", workout: "Easy run", distance: "5 miles", effort: "Zone 2", notes: "" },
            { day: "Thu", workout: "Sharpener", distance: "5 miles (2 × mile tempo)", effort: "Zone 3", notes: "" },
            { day: "Fri", workout: "Rest", distance: "—", effort: "—", notes: "" },
            { day: "Sat", workout: "Easy long run", distance: "14 miles", effort: "Zone 2", notes: "" },
            { day: "Sun", workout: "Easy run", distance: "5 miles", effort: "Zone 1", notes: "" },
          ],
        },
      ],
      longRunProgression: [
        { week: 1, longRun: "18 mi", b2b: "10 mi", total: "28 mi", phase: "Base" },
        { week: 5, longRun: "12 mi", b2b: "—", total: "12 mi", phase: "Cutback" },
        { week: 9, longRun: "24 mi", b2b: "12 mi", total: "36 mi", phase: "Build" },
        { week: 13, longRun: "28 mi", b2b: "12 mi", total: "40 mi", phase: "Build" },
        { week: 16, longRun: "32 mi", b2b: "14 mi", total: "46 mi", phase: "Peak" },
        { week: 19, longRun: "24 mi", b2b: "10 mi", total: "34 mi", phase: "Sharpen" },
        { week: 22, longRun: "14 mi", b2b: "—", total: "14 mi", phase: "Taper" },
        { week: 24, longRun: "100K Race!", b2b: "—", total: "62 mi", phase: "Race" },
      ],
    },
    intermediate: {
      duration: 26,
      prerequisites: ["2+ ultras including a 50-miler", "50+ miles/week base", "Hill and night running experience"],
      weeklyRange: "55–80 miles",
      peakMileage: "75–80 miles",
      runsPerWeek: "6",
      keyWorkouts: ["Back-to-back 40+ miles", "3 race simulations", "Double-day weeks × 3", "Long tempo runs 10–12 miles", "Night running × 3"],
      highlights: ["Peak long run 36 miles", "Double-day weeks in peak phase", "Advanced elevation simulation 4,000+ ft per long run", "Crew and pacer practice runs"],
      sampleWeeks: [
        {
          label: "Week 1 — Base Phase",
          context: "High aerobic volume. Double-days begin week 10.",
          days: [
            { day: "Mon", workout: "Easy run", distance: "6 miles", effort: "Zone 1–2", notes: "" },
            { day: "Tue", workout: "Easy run + strength", distance: "9 miles", effort: "Zone 2", notes: "" },
            { day: "Wed", workout: "Tempo run", distance: "9 miles (5 at tempo)", effort: "Zone 3–4", notes: "" },
            { day: "Thu", workout: "Easy run", distance: "7 miles", effort: "Zone 2", notes: "" },
            { day: "Fri", workout: "Easy run", distance: "5 miles", effort: "Zone 2", notes: "" },
            { day: "Sat", workout: "Long run", distance: "20 miles", effort: "Zone 2", notes: "" },
            { day: "Sun", workout: "Back-to-back", distance: "12 miles", effort: "Zone 1", notes: "" },
          ],
        },
        {
          label: "Week 16 — Peak Phase",
          context: "Maximum training stress. Double-days and race simulation.",
          days: [
            { day: "Mon", workout: "Rest", distance: "—", effort: "—", notes: "" },
            { day: "Tue", workout: "Mile repeats", distance: "12 miles", effort: "Zone 4–5", notes: "7 × mile with 90-sec recovery" },
            { day: "Wed", workout: "AM easy / PM easy", distance: "8 mi + 5 mi", effort: "Zone 1–2", notes: "Two-a-day" },
            { day: "Thu", workout: "Tempo + hills", distance: "10 miles", effort: "Zone 3–4", notes: "" },
            { day: "Fri", workout: "Rest", distance: "—", effort: "—", notes: "" },
            { day: "Sat", workout: "Race simulation", distance: "36 miles", effort: "Zone 2 / race effort", notes: "Full kit, night section" },
            { day: "Sun", workout: "Back-to-back night run", distance: "14 miles", effort: "Zone 1", notes: "Headlamp" },
          ],
        },
        {
          label: "Week 24 — Taper",
          context: "Two weeks out. Stay sharp.",
          days: [
            { day: "Mon", workout: "Rest", distance: "—", effort: "—", notes: "" },
            { day: "Tue", workout: "Easy + strides", distance: "7 miles", effort: "Zone 2", notes: "" },
            { day: "Wed", workout: "Sharpener", distance: "7 miles (4 × mile)", effort: "Zone 3", notes: "" },
            { day: "Thu", workout: "Easy run", distance: "5 miles", effort: "Zone 2", notes: "" },
            { day: "Fri", workout: "Rest", distance: "—", effort: "—", notes: "" },
            { day: "Sat", workout: "Easy long run", distance: "14 miles", effort: "Zone 2", notes: "" },
            { day: "Sun", workout: "Easy run", distance: "6 miles", effort: "Zone 1", notes: "" },
          ],
        },
      ],
      longRunProgression: [
        { week: 1, longRun: "20 mi", b2b: "12 mi", total: "32 mi", phase: "Base" },
        { week: 6, longRun: "14 mi", b2b: "—", total: "14 mi", phase: "Cutback" },
        { week: 10, longRun: "28 mi", b2b: "14 mi", total: "42 mi", phase: "Build" },
        { week: 14, longRun: "32 mi", b2b: "15 mi", total: "47 mi", phase: "Build" },
        { week: 16, longRun: "36 mi", b2b: "16 mi", total: "52 mi", phase: "Peak" },
        { week: 20, longRun: "26 mi", b2b: "12 mi", total: "38 mi", phase: "Sharpen" },
        { week: 24, longRun: "14 mi", b2b: "—", total: "14 mi", phase: "Taper" },
        { week: 26, longRun: "100K Race!", b2b: "—", total: "62 mi", phase: "Race" },
      ],
    },
    advanced: {
      duration: 28,
      prerequisites: ["3+ ultra finishes including a 50-miler or 100K", "60+ miles/week", "Double-day experience"],
      weeklyRange: "70–100 miles",
      peakMileage: "95–100 miles",
      runsPerWeek: "6–7",
      keyWorkouts: ["Double-day weeks × 5", "VO2 max intervals", "Back-to-back 45+ miles", "4 race simulations", "Mandatory night training", "Altitude/heat simulation if applicable"],
      highlights: ["Peak long run 38–40 miles", "5 double-day weeks", "Competitive 100K pacing strategy", "Full pacer practice run in peak phase"],
      sampleWeeks: [
        {
          label: "Week 1 — Base Phase",
          context: "High volume, all aerobic. Double-days begin week 8.",
          days: [
            { day: "Mon", workout: "Easy recovery", distance: "7 miles", effort: "Zone 1", notes: "" },
            { day: "Tue", workout: "Easy run + strength", distance: "10 miles", effort: "Zone 2", notes: "" },
            { day: "Wed", workout: "Tempo run", distance: "11 miles (7 at tempo)", effort: "Zone 3–4", notes: "" },
            { day: "Thu", workout: "Easy run", distance: "8 miles", effort: "Zone 2", notes: "" },
            { day: "Fri", workout: "Easy run", distance: "6 miles", effort: "Zone 2", notes: "" },
            { day: "Sat", workout: "Long run", distance: "22 miles", effort: "Zone 2", notes: "4,000+ ft elevation" },
            { day: "Sun", workout: "Back-to-back", distance: "14 miles", effort: "Zone 1–2", notes: "" },
          ],
        },
        {
          label: "Week 16 — Peak Phase",
          context: "Highest training stress. All systems tested.",
          days: [
            { day: "Mon", workout: "Rest", distance: "—", effort: "—", notes: "" },
            { day: "Tue", workout: "VO2 max intervals", distance: "12 miles", effort: "Zone 5", notes: "8 × 800m @ 5K pace" },
            { day: "Wed", workout: "Double: AM + PM easy", distance: "9 mi + 6 mi", effort: "Zone 1–2", notes: "" },
            { day: "Thu", workout: "Long tempo + hills", distance: "12 miles", effort: "Zone 3–4", notes: "" },
            { day: "Fri", workout: "Rest", distance: "—", effort: "—", notes: "" },
            { day: "Sat", workout: "Race simulation", distance: "38 miles", effort: "Race effort", notes: "Full pacer simulation, aid stations" },
            { day: "Sun", workout: "Back-to-back (night)", distance: "16 miles", effort: "Zone 1", notes: "" },
          ],
        },
        {
          label: "Week 26 — Taper",
          context: "Two weeks out. Perfect the plan.",
          days: [
            { day: "Mon", workout: "Rest", distance: "—", effort: "—", notes: "" },
            { day: "Tue", workout: "Easy + strides", distance: "8 miles", effort: "Zone 2", notes: "" },
            { day: "Wed", workout: "Sharpener", distance: "8 miles (3 × mile)", effort: "Zone 3", notes: "" },
            { day: "Thu", workout: "Easy run", distance: "6 miles", effort: "Zone 2", notes: "" },
            { day: "Fri", workout: "Rest", distance: "—", effort: "—", notes: "" },
            { day: "Sat", workout: "Easy long run", distance: "16 miles", effort: "Zone 2", notes: "" },
            { day: "Sun", workout: "Easy run", distance: "7 miles", effort: "Zone 1", notes: "" },
          ],
        },
      ],
      longRunProgression: [
        { week: 1, longRun: "22 mi", b2b: "14 mi", total: "36 mi", phase: "Base" },
        { week: 6, longRun: "16 mi", b2b: "—", total: "16 mi", phase: "Cutback" },
        { week: 10, longRun: "30 mi", b2b: "16 mi", total: "46 mi", phase: "Build" },
        { week: 14, longRun: "35 mi", b2b: "17 mi", total: "52 mi", phase: "Build" },
        { week: 16, longRun: "38 mi", b2b: "18 mi", total: "56 mi", phase: "Peak" },
        { week: 20, longRun: "28 mi", b2b: "14 mi", total: "42 mi", phase: "Sharpen" },
        { week: 24, longRun: "16 mi", b2b: "—", total: "16 mi", phase: "Taper" },
        { week: 28, longRun: "100K Race!", b2b: "—", total: "62 mi", phase: "Race" },
      ],
    },
  },

  "100M": {
    beginner: {
      duration: 32,
      prerequisites: ["100K or 2× 50-mile finish", "40+ miles/week", "Night running experience", "Crew and pacer coordination experience"],
      weeklyRange: "50–80 miles",
      peakMileage: "75–80 miles",
      runsPerWeek: "5–6",
      keyWorkouts: ["Long runs to 35 miles", "Back-to-back 38+ miles", "3+ night runs", "Race simulation × 3", "Crew and pacer practice runs"],
      highlights: ["35-mile long run in peak phase", "Multiple night running sessions", "Mandatory crew practice", "100M-specific mental training protocols"],
      sampleWeeks: [
        {
          label: "Week 1 — Base Phase",
          context: "32-week build requires patience. Aerobic base is everything.",
          days: [
            { day: "Mon", workout: "Rest", distance: "—", effort: "—", notes: "" },
            { day: "Tue", workout: "Easy run", distance: "7 miles", effort: "Zone 2", notes: "" },
            { day: "Wed", workout: "Easy run + strength", distance: "8 miles", effort: "Zone 2", notes: "" },
            { day: "Thu", workout: "Hill repeats", distance: "7 miles", effort: "Zone 3", notes: "" },
            { day: "Fri", workout: "Rest", distance: "—", effort: "—", notes: "" },
            { day: "Sat", workout: "Long run", distance: "20 miles", effort: "Zone 2", notes: "" },
            { day: "Sun", workout: "Back-to-back", distance: "10 miles", effort: "Zone 1", notes: "" },
          ],
        },
        {
          label: "Week 18 — Build Phase",
          context: "Night training and race simulation. Full crew simulation run.",
          days: [
            { day: "Mon", workout: "Rest", distance: "—", effort: "—", notes: "" },
            { day: "Tue", workout: "Tempo run", distance: "8 miles (5 at tempo)", effort: "Zone 3–4", notes: "" },
            { day: "Wed", workout: "Easy run + strength", distance: "8 miles", effort: "Zone 2", notes: "" },
            { day: "Thu", workout: "Interval workout", distance: "9 miles", effort: "Zone 4", notes: "5 × 1-mile with 90-sec recovery" },
            { day: "Fri", workout: "Rest", distance: "—", effort: "—", notes: "" },
            { day: "Sat", workout: "Race simulation (day/night)", distance: "32 miles", effort: "Zone 2 / race effort", notes: "Start at 2PM — practice headlamp transition" },
            { day: "Sun", workout: "Crew back-to-back", distance: "14 miles", effort: "Zone 1", notes: "Crew brings aid at miles 5 and 10" },
          ],
        },
        {
          label: "Week 29 — Taper",
          context: "Three weeks out. Protect your fitness.",
          days: [
            { day: "Mon", workout: "Rest", distance: "—", effort: "—", notes: "" },
            { day: "Tue", workout: "Easy run + strides", distance: "6 miles", effort: "Zone 2", notes: "" },
            { day: "Wed", workout: "Easy run", distance: "6 miles", effort: "Zone 2", notes: "" },
            { day: "Thu", workout: "Short sharpener", distance: "5 miles (2 × mile)", effort: "Zone 3", notes: "" },
            { day: "Fri", workout: "Rest", distance: "—", effort: "—", notes: "" },
            { day: "Sat", workout: "Easy long run", distance: "16 miles", effort: "Zone 2", notes: "" },
            { day: "Sun", workout: "Easy run", distance: "6 miles", effort: "Zone 1", notes: "" },
          ],
        },
      ],
      longRunProgression: [
        { week: 1, longRun: "20 mi", b2b: "10 mi", total: "30 mi", phase: "Base" },
        { week: 6, longRun: "14 mi", b2b: "—", total: "14 mi", phase: "Cutback" },
        { week: 10, longRun: "26 mi", b2b: "13 mi", total: "39 mi", phase: "Build" },
        { week: 15, longRun: "30 mi", b2b: "14 mi", total: "44 mi", phase: "Build" },
        { week: 19, longRun: "35 mi", b2b: "16 mi", total: "51 mi", phase: "Peak" },
        { week: 24, longRun: "26 mi", b2b: "12 mi", total: "38 mi", phase: "Sharpen" },
        { week: 28, longRun: "16 mi", b2b: "—", total: "16 mi", phase: "Taper" },
        { week: 32, longRun: "100M Race!", b2b: "—", total: "100 mi", phase: "Race" },
      ],
    },
    intermediate: {
      duration: 32,
      prerequisites: ["100K finish or 3× 50-mile finishes", "55+ miles/week", "Double-day experience", "Crew/pacer logistics experience"],
      weeklyRange: "60–90 miles",
      peakMileage: "85–90 miles",
      runsPerWeek: "6",
      keyWorkouts: ["Long runs to 38 miles", "Double-day weeks × 4", "4 race simulations", "4+ night runs", "Mandatory pacer practice"],
      highlights: ["38-mile peak long run", "Extensive night running protocol", "Double-day training weeks in build and peak phases", "100M pacing strategy — managing the inevitable low points"],
      sampleWeeks: [
        {
          label: "Week 1 — Base Phase",
          context: "32-week journey begins. Aerobic base must be bulletproof.",
          days: [
            { day: "Mon", workout: "Easy run", distance: "7 miles", effort: "Zone 1–2", notes: "" },
            { day: "Tue", workout: "Easy run + strength", distance: "9 miles", effort: "Zone 2", notes: "" },
            { day: "Wed", workout: "Tempo run", distance: "9 miles (5 at tempo)", effort: "Zone 3–4", notes: "" },
            { day: "Thu", workout: "Easy run", distance: "7 miles", effort: "Zone 2", notes: "" },
            { day: "Fri", workout: "Easy run", distance: "5 miles", effort: "Zone 2", notes: "" },
            { day: "Sat", workout: "Long run", distance: "22 miles", effort: "Zone 2", notes: "" },
            { day: "Sun", workout: "Back-to-back", distance: "12 miles", effort: "Zone 1", notes: "" },
          ],
        },
        {
          label: "Week 20 — Peak Phase",
          context: "Highest volume. Full 100M simulation run.",
          days: [
            { day: "Mon", workout: "Rest", distance: "—", effort: "—", notes: "" },
            { day: "Tue", workout: "Mile repeats", distance: "12 miles", effort: "Zone 4–5", notes: "7 × mile" },
            { day: "Wed", workout: "Double day", distance: "8 mi + 5 mi", effort: "Zone 1–2", notes: "AM and PM" },
            { day: "Thu", workout: "Tempo + hills", distance: "10 miles", effort: "Zone 3–4", notes: "" },
            { day: "Fri", workout: "Rest", distance: "—", effort: "—", notes: "" },
            { day: "Sat", workout: "100M simulation run", distance: "38 miles", effort: "Race effort", notes: "Start at noon, full night section, pacer from mile 28" },
            { day: "Sun", workout: "Back-to-back", distance: "14 miles", effort: "Zone 1", notes: "" },
          ],
        },
        {
          label: "Week 30 — Taper",
          context: "Two weeks out. Finalize every detail.",
          days: [
            { day: "Mon", workout: "Rest", distance: "—", effort: "—", notes: "" },
            { day: "Tue", workout: "Easy + strides", distance: "7 miles", effort: "Zone 2", notes: "" },
            { day: "Wed", workout: "Sharpener", distance: "7 miles (3 × mile)", effort: "Zone 3", notes: "" },
            { day: "Thu", workout: "Easy run", distance: "5 miles", effort: "Zone 2", notes: "" },
            { day: "Fri", workout: "Rest", distance: "—", effort: "—", notes: "" },
            { day: "Sat", workout: "Easy long run", distance: "16 miles", effort: "Zone 2", notes: "" },
            { day: "Sun", workout: "Easy run", distance: "6 miles", effort: "Zone 1", notes: "" },
          ],
        },
      ],
      longRunProgression: [
        { week: 1, longRun: "22 mi", b2b: "12 mi", total: "34 mi", phase: "Base" },
        { week: 6, longRun: "14 mi", b2b: "—", total: "14 mi", phase: "Cutback" },
        { week: 11, longRun: "28 mi", b2b: "14 mi", total: "42 mi", phase: "Build" },
        { week: 16, longRun: "34 mi", b2b: "16 mi", total: "50 mi", phase: "Build" },
        { week: 20, longRun: "38 mi", b2b: "18 mi", total: "56 mi", phase: "Peak" },
        { week: 25, longRun: "28 mi", b2b: "13 mi", total: "41 mi", phase: "Sharpen" },
        { week: 29, longRun: "16 mi", b2b: "—", total: "16 mi", phase: "Taper" },
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
        { week: 20, longRun: "40 mi", b2b: "20 mi", total: "60 mi", phase: "Peak" },
        { week: 26, longRun: "30 mi", b2b: "15 mi", total: "45 mi", phase: "Sharpen" },
        { week: 31, longRun: "18 mi", b2b: "—", total: "18 mi", phase: "Taper" },
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
export default function PlansClient() {
  const [activeDistance, setActiveDistance] = useState<Distance>("50K");
  const [activeLevel, setActiveLevel] = useState<Level>("beginner");
  const [activeSampleWeek, setActiveSampleWeek] = useState(0);
  const [openSection, setOpenSection] = useState<string | null>(null);

  // Calculator state
  const [longestRun, setLongestRun] = useState("");
  const [targetHours, setTargetHours] = useState("");
  const [targetMins, setTargetMins] = useState("");

  const plan = PLANS[activeDistance][activeLevel];
  const distances: Distance[] = ["50K", "50M", "100K", "100M"];
  const levels: Level[] = ["beginner", "intermediate", "advanced"];
  const levelLabel: Record<Level, string> = { beginner: "Beginner", intermediate: "Intermediate", advanced: "Advanced" };

  // Readiness calculator
  const readinessResult = () => {
    const miles = parseFloat(longestRun);
    if (!miles || isNaN(miles)) return null;
    if (miles < 10) return { verdict: "Not Quite Ready", color: "text-red-600", rec: "Start with our Base Building Plan to build up to 15+ miles before beginning a distance-specific program." };
    if (miles < 14) return { verdict: "Base Building", color: "text-yellow-700", rec: "You're close. Follow the Base Building plan for 8–10 weeks, then re-assess for a 50K Beginner plan." };
    if (miles < 20) return { verdict: "50K Beginner", color: "text-green-700", rec: "You have the base for the 50K Beginner plan. Start in week 1 and don't skip the cutback weeks." };
    if (miles < 26) return { verdict: "50K Intermediate or 50M Beginner", color: "text-primary", rec: "Strong base. Choose the 50K Intermediate plan for a competitive debut, or the 50M Beginner if you want to go long." };
    return { verdict: "50M+ Ready", color: "text-primary font-bold", rec: "You're prepared for advanced training. Select your target distance and the Intermediate or Advanced plan tier." };
  };

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

  const readiness = readinessResult();
  const pacing = pacingResult();

  const toggleSection = (s: string) => setOpenSection(openSection === s ? null : s);

  return (
    <main style={{ scrollBehavior: "smooth" }}>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="bg-dark py-20 sm:py-28 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 20% 50%, #0066FF 0%, transparent 50%), radial-gradient(circle at 80% 20%, #0066FF 0%, transparent 40%)" }} />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-primary/20 text-primary text-sm font-semibold px-4 py-2 rounded-full mb-6">
            <span>📋</span><span>4 Distances · 3 Levels · Full Schedules</span>
          </div>
          <h1 className="font-headline text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Ultra Marathon<br /><span className="text-primary">Training Plans</span>
          </h1>
          <p className="text-xl text-gray max-w-3xl mx-auto mb-10 leading-relaxed">
            Structured programs for every distance and experience level. Select your target race, choose your tier, and follow a proven path to the finish line.
          </p>
          <div className="flex flex-wrap justify-center gap-8">
            {[{ value: "4", label: "Distances" }, { value: "12", label: "Plan Tiers" }, { value: "100+", label: "Sample Workouts" }].map((s) => (
              <div key={s.label} className="text-center">
                <div className="font-headline text-3xl font-bold text-primary">{s.value}</div>
                <div className="text-sm text-gray mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Sticky Nav ───────────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-1 overflow-x-auto py-3">
            {["plan", "zones", "nutrition", "strength", "injury", "gear", "calculators", "resources"].map((sec) => (
              <a key={sec} href={`#${sec}`} className="whitespace-nowrap px-3 py-1.5 rounded-lg text-sm font-medium text-gray hover:text-dark hover:bg-light transition-colors flex-shrink-0 capitalize">
                {sec === "zones" ? "Training Zones" : sec === "gear" ? "Gear Testing" : sec}
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* ── Distance + Level Selector ─────────────────────────────────────  */}
      <section id="plan" className="py-14 bg-light">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="font-headline text-3xl sm:text-4xl font-bold text-dark mb-3">Choose Your Plan</h2>
            <p className="text-gray">Select your target distance and experience level.</p>
          </div>

          {/* Distance tabs */}
          <div className="flex flex-wrap justify-center gap-3 mb-6">
            {distances.map((d) => (
              <button key={d} onClick={() => { setActiveDistance(d); setActiveSampleWeek(0); }}
                className={`px-6 py-3 rounded-xl font-headline font-bold text-lg transition-all ${activeDistance === d ? "bg-primary text-white shadow-md" : "bg-white text-dark border border-gray-200 hover:border-primary/40 hover:text-primary"}`}>
                {d}
              </button>
            ))}
          </div>

          {/* Level tabs */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {levels.map((l) => (
              <button key={l} onClick={() => { setActiveLevel(l); setActiveSampleWeek(0); }}
                className={`px-5 py-2 rounded-lg font-medium text-sm transition-all ${activeLevel === l ? "bg-dark text-white" : "bg-white text-dark border border-gray-200 hover:border-dark/40"}`}>
                {levelLabel[l]}
              </button>
            ))}
          </div>

          {/* Plan overview card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-10">
            <div className="bg-gradient-to-r from-primary to-primary-dark p-6 sm:p-8">
              <div className="flex flex-wrap gap-3 mb-3">
                <span className="bg-white/20 text-white text-sm font-semibold px-3 py-1 rounded-full">{activeDistance}</span>
                <span className="bg-white/20 text-white text-sm font-semibold px-3 py-1 rounded-full capitalize">{levelLabel[activeLevel]}</span>
                <span className="bg-white/20 text-white text-sm px-3 py-1 rounded-full">{plan.duration} Weeks</span>
              </div>
              <h3 className="font-headline text-2xl sm:text-3xl font-bold text-white mb-1">{activeDistance} {levelLabel[activeLevel]} Plan</h3>
              <p className="text-white/80 text-sm">{plan.runsPerWeek} runs/week · {plan.weeklyRange} · Peak: {plan.peakMileage}</p>
            </div>

            <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h4 className="font-headline font-bold text-dark mb-3 text-sm uppercase tracking-wider">Prerequisites</h4>
                <ul className="space-y-2">
                  {plan.prerequisites.map((p, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray">
                      <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span>{p}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-headline font-bold text-dark mb-3 text-sm uppercase tracking-wider">Key Workouts</h4>
                <ul className="space-y-2">
                  {plan.keyWorkouts.map((w, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray">
                      <span className="text-primary mt-0.5 flex-shrink-0">→</span>{w}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-headline font-bold text-dark mb-3 text-sm uppercase tracking-wider">Plan Highlights</h4>
                <ul className="space-y-2">
                  {plan.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray">
                      <span className="text-accent mt-0.5 flex-shrink-0">★</span>{h}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Training phases */}
          <div className="mb-10">
            <h3 className="font-headline text-xl font-bold text-dark mb-4">Training Phases</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { phase: "Base Building", weeks: `Weeks 1–${Math.round(plan.duration * 0.3)}`, desc: "Aerobic development. All easy running.", color: "bg-blue-50 border-blue-200 text-blue-800" },
                { phase: "Build Phase", weeks: `Weeks ${Math.round(plan.duration * 0.3) + 1}–${Math.round(plan.duration * 0.6)}`, desc: "Increasing mileage and introducing intensity.", color: "bg-yellow-50 border-yellow-200 text-yellow-800" },
                { phase: "Peak Phase", weeks: `Weeks ${Math.round(plan.duration * 0.6) + 1}–${Math.round(plan.duration * 0.85)}`, desc: "Highest volume. Race simulations.", color: "bg-orange-50 border-orange-200 text-orange-800" },
                { phase: "Taper", weeks: `Final ${plan.duration - Math.round(plan.duration * 0.85)} weeks`, desc: "Volume drops. Intensity maintained. Rest.", color: "bg-green-50 border-green-200 text-green-800" },
              ].map((p) => (
                <div key={p.phase} className={`rounded-xl border p-4 ${p.color}`}>
                  <div className="font-headline font-bold text-sm mb-1">{p.phase}</div>
                  <div className="text-xs font-semibold mb-2 opacity-80">{p.weeks}</div>
                  <div className="text-xs leading-relaxed opacity-90">{p.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Sample weekly schedules */}
          <div className="mb-10">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
              <h3 className="font-headline text-xl font-bold text-dark">Sample Weekly Schedules</h3>
              <div className="flex gap-2">
                {plan.sampleWeeks.map((w, i) => (
                  <button key={i} onClick={() => setActiveSampleWeek(i)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${activeSampleWeek === i ? "bg-primary text-white" : "bg-white border border-gray-200 text-dark hover:border-primary/40"}`}>
                    {w.label.split("—")[0].trim()}
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-gray-100 bg-light">
                <div className="font-headline font-bold text-dark">{plan.sampleWeeks[activeSampleWeek].label}</div>
                <div className="text-sm text-gray mt-1">{plan.sampleWeeks[activeSampleWeek].context}</div>
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
                    {plan.sampleWeeks[activeSampleWeek].days.map((d, i) => (
                      <tr key={i} className="border-b border-gray-50 hover:bg-light/40">
                        <td className="py-3 px-4 font-bold text-dark">{d.day}</td>
                        <td className="py-3 px-4 text-dark">{d.workout}</td>
                        <td className="py-3 px-4 font-medium text-dark">{d.distance}</td>
                        <td className={`py-3 px-4 text-xs font-medium ${effortColor(d.effort)}`}>{d.effort}</td>
                        <td className="py-3 px-4 text-gray">{d.notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Long run progression */}
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
                  {plan.longRunProgression.map((row, i) => (
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
        </div>
      </section>

      {/* ── Training Zones ────────────────────────────────────────────────── */}
      <section id="zones" className="py-14 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="font-headline text-3xl font-bold text-dark mb-3">Training Zones Guide</h2>
            <p className="text-gray max-w-xl mx-auto">Ultra running is 80% Zone 2. Knowing your zones makes every workout intentional.</p>
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
      </section>

      {/* ── Accordion Sections ───────────────────────────────────────────── */}
      <section className="py-14 bg-light">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">

          {/* Nutrition */}
          <div id="nutrition" className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <button onClick={() => toggleSection("nutrition")} className="w-full flex items-center justify-between p-6 text-left hover:bg-light/50 transition-colors">
              <div className="flex items-center gap-3">
                <span className="text-2xl">⚡</span>
                <h2 className="font-headline text-xl font-bold text-dark">Nutrition & Fueling Strategy</h2>
              </div>
              <span className="text-gray text-xl">{openSection === "nutrition" ? "−" : "+"}</span>
            </button>
            {openSection === "nutrition" && (
              <div className="px-6 pb-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
                {NUTRITION_TIPS.map((t) => (
                  <div key={t.title} className="bg-light rounded-xl p-4">
                    <h3 className="font-headline font-bold text-dark mb-2 text-sm">{t.title}</h3>
                    <p className="text-sm text-gray leading-relaxed">{t.body}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Strength */}
          <div id="strength" className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <button onClick={() => toggleSection("strength")} className="w-full flex items-center justify-between p-6 text-left hover:bg-light/50 transition-colors">
              <div className="flex items-center gap-3">
                <span className="text-2xl">💪</span>
                <h2 className="font-headline text-xl font-bold text-dark">Strength & Cross Training</h2>
              </div>
              <span className="text-gray text-xl">{openSection === "strength" ? "−" : "+"}</span>
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
                        {["Exercise", "Sets × Reps", "Purpose"].map((h) => (
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
                <p className="text-sm text-gray mt-4">Cross-training options: cycling, swimming, hiking (with poles), elliptical. All work Zone 1–2 cardio without run-specific impact stress. Use on rest days or as a second workout.</p>
              </div>
            )}
          </div>

          {/* Injury Prevention */}
          <div id="injury" className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <button onClick={() => toggleSection("injury")} className="w-full flex items-center justify-between p-6 text-left hover:bg-light/50 transition-colors">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🩹</span>
                <h2 className="font-headline text-xl font-bold text-dark">Injury Prevention & Warning Signs</h2>
              </div>
              <span className="text-gray text-xl">{openSection === "injury" ? "−" : "+"}</span>
            </button>
            {openSection === "injury" && (
              <div className="px-6 pb-6 space-y-3">
                {INJURY_WARNINGS.map((w, i) => (
                  <div key={i} className="flex gap-4 p-4 bg-red-50 border border-red-100 rounded-xl">
                    <span className="text-red-500 text-lg flex-shrink-0 mt-0.5">⚠</span>
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
          <div id="gear" className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <button onClick={() => toggleSection("gear")} className="w-full flex items-center justify-between p-6 text-left hover:bg-light/50 transition-colors">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🎒</span>
                <h2 className="font-headline text-xl font-bold text-dark">Gear Testing Schedule</h2>
              </div>
              <span className="text-gray text-xl">{openSection === "gear" ? "−" : "+"}</span>
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
                    View the complete Race Day Kit guide →
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Calculators ──────────────────────────────────────────────────── */}
      <section id="calculators" className="py-14 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="font-headline text-3xl font-bold text-dark mb-3">Training Calculators</h2>
            <p className="text-gray">Two tools to personalize your training.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            {/* Readiness calculator */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="font-headline text-xl font-bold text-dark mb-1">Readiness Check</h3>
              <p className="text-sm text-gray mb-5">Enter your current longest run to see which plan level is right for you.</p>
              <div className="mb-4">
                <label className="block text-sm font-medium text-dark mb-2">Longest run in the last 4 weeks (miles)</label>
                <input type="number" value={longestRun} onChange={(e) => setLongestRun(e.target.value)}
                  placeholder="e.g. 16" className="w-full border border-gray-200 rounded-lg px-4 py-3 text-dark focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
              </div>
              {readiness && (
                <div className="bg-light rounded-xl p-4">
                  <div className={`font-headline font-bold text-lg mb-2 ${readiness.color}`}>{readiness.verdict}</div>
                  <p className="text-sm text-gray leading-relaxed">{readiness.rec}</p>
                </div>
              )}
            </div>

            {/* Pacing calculator */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="font-headline text-xl font-bold text-dark mb-1">Training Pace Calculator</h3>
              <p className="text-sm text-gray mb-5">Enter a target finish time for your selected distance ({activeDistance}) to get training paces.</p>
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
        </div>
      </section>

      {/* ── Training Resources ────────────────────────────────────────────  */}
      <section id="resources" className="py-14 bg-light">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="font-headline text-3xl font-bold text-dark mb-3">Training Resources</h2>
            <p className="text-gray">Tools and reading to take your training further.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {AFFILIATE_RESOURCES.map((r) => (
              <a key={r.name} href={r.url} target="_blank" rel="noopener noreferrer sponsored"
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md hover:border-primary/20 transition-all group">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-headline font-bold text-dark group-hover:text-primary transition-colors">{r.name}</h3>
                  <span className="text-sm font-bold text-dark ml-2 flex-shrink-0">{r.price}</span>
                </div>
                <p className="text-sm text-gray leading-relaxed">{r.desc}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="bg-dark py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-headline text-3xl font-bold text-white mb-4">Ready to Start Training?</h2>
          <p className="text-gray mb-8 max-w-xl mx-auto">Pick your distance, commit to the plan, and trust the process. Consistency beats intensity every time.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/gear/race-day-kit" className="inline-flex items-center gap-2 px-7 py-3.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-colors">
              Build Your Race Kit
            </Link>
            <Link href="/training/first-50k" className="inline-flex items-center gap-2 px-7 py-3.5 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition-colors border border-white/20">
              First 50K Plan
            </Link>
          </div>
        </div>
      </section>

      {/* Affiliate disclosure */}
      <div className="bg-white border-t border-gray-100 py-6">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs text-gray text-center leading-relaxed">
            <span className="font-semibold">Affiliate Disclosure:</span> Some links in the resources section are affiliate links. We may earn a small commission at no extra cost to you. We only recommend tools and resources we would genuinely use.
          </p>
        </div>
      </div>
    </main>
  );
}
