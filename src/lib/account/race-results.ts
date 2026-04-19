// ─── Race log types and helpers ──────────────────────────────────────────────

import type { PostRaceReport, SavedPlan } from "@/lib/training-types";

export interface RaceResultRow {
  id: string;
  user_id: string;
  plan_id: string | null;
  race_name: string | null;
  race_date: string;
  distance: string;
  finish_time: string | null;
  placing: string | null;
  age_group_placing: string | null;
  dnf: boolean;
  report: PostRaceReport;
  created_at: string;
  updated_at: string;
}

export const RACE_RESULT_FIELDS =
  "id, user_id, plan_id, race_name, race_date, distance, finish_time, placing, age_group_placing, dnf, report, created_at, updated_at";

export function reportFromPlan(plan: SavedPlan): PostRaceReport {
  return plan.postRaceReport ?? {};
}

export interface RaceResultDraft {
  plan_id?: string | null;
  race_name?: string | null;
  race_date: string;
  distance: string;
  finish_time?: string | null;
  placing?: string | null;
  age_group_placing?: string | null;
  dnf?: boolean;
  report?: PostRaceReport;
}

export function buildResultDraftFromPlan(plan: SavedPlan, planId: string | null): RaceResultDraft {
  const report = reportFromPlan(plan);
  return {
    plan_id: planId,
    race_name: plan.raceName || null,
    race_date: plan.raceDate,
    distance: plan.distance,
    finish_time: report.finishTime ?? null,
    placing: report.placing ?? null,
    age_group_placing: report.ageGroupPlacing ?? null,
    dnf: !!report.dnf,
    report,
  };
}

export function formatRaceDate(date: string): string {
  return new Date(`${date}T00:00:00`).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}
