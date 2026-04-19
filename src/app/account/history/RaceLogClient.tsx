"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Flag, Trophy, Trash2 } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { hasSupabaseBrowserEnv } from "@/lib/supabase/client";
import { formatRaceDate, type RaceResultRow } from "@/lib/account/race-results";

interface ManualForm {
  race_name: string;
  race_date: string;
  distance: string;
  finish_time: string;
  placing: string;
  age_group_placing: string;
  dnf: boolean;
  notes: string;
}

const EMPTY_FORM: ManualForm = {
  race_name: "",
  race_date: "",
  distance: "50K",
  finish_time: "",
  placing: "",
  age_group_placing: "",
  dnf: false,
  notes: "",
};

interface ActivePlanSummary {
  id: string;
  race_name: string | null;
  race_date: string;
  distance: string;
}

export default function RaceLogClient() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const isSupabaseConfigured = hasSupabaseBrowserEnv();

  const [results, setResults] = useState<RaceResultRow[]>([]);
  const [activePlan, setActivePlan] = useState<ActivePlanSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [showManualForm, setShowManualForm] = useState(false);
  const [manualForm, setManualForm] = useState<ManualForm>(EMPTY_FORM);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }
    if (authLoading) return;
    if (!user) {
      router.replace("/login");
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const [resultsRes, planRes] = await Promise.all([
          fetch("/api/race-results", { credentials: "include" }),
          fetch("/api/training-plans", { credentials: "include" }),
        ]);
        if (!resultsRes.ok) throw new Error("Failed to load history");
        const resultsJson = await resultsRes.json();
        if (cancelled) return;
        setResults(resultsJson.results ?? []);

        if (planRes.ok) {
          const planJson = await planRes.json();
          if (planJson.plan && planJson.planId) {
            setActivePlan({
              id: planJson.planId,
              race_name: planJson.plan.raceName ?? null,
              race_date: planJson.plan.raceDate,
              distance: planJson.plan.distance,
            });
          } else {
            setActivePlan(null);
          }
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [authLoading, user, router, isSupabaseConfigured]);

  const totals = useMemo(() => {
    const total = results.length;
    const finished = results.filter((r) => !r.dnf).length;
    const distances = new Set(results.map((r) => r.distance));
    return { total, finished, distances: distances.size };
  }, [results]);

  async function handleArchiveActivePlan() {
    if (!activePlan) return;
    if (!confirm(`Archive your active ${activePlan.distance} plan as a race result?`)) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/race-results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ archive_plan_id: activePlan.id }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to archive plan");
      setResults((prev) => [json.result as RaceResultRow, ...prev]);
      setActivePlan(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to archive plan");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleManualSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!manualForm.race_date || !manualForm.distance) {
      setError("Race date and distance are required.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/race-results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          result: {
            race_name: manualForm.race_name || null,
            race_date: manualForm.race_date,
            distance: manualForm.distance,
            finish_time: manualForm.finish_time || null,
            placing: manualForm.placing || null,
            age_group_placing: manualForm.age_group_placing || null,
            dnf: manualForm.dnf,
            report: manualForm.notes ? { wentWell: manualForm.notes } : {},
          },
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to add race");
      setResults((prev) => [json.result as RaceResultRow, ...prev]);
      setManualForm(EMPTY_FORM);
      setShowManualForm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add race");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this race result? This cannot be undone.")) return;
    try {
      const res = await fetch(`/api/race-results?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.error || "Failed to delete");
      }
      setResults((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete");
    }
  }

  if (!isSupabaseConfigured) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
        <p className="text-sm text-gray">Add Supabase env vars to use the race log.</p>
      </div>
    );
  }

  if (authLoading || loading || !user) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 p-8 text-center text-sm text-gray">
        Loading race log...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-3 gap-3">
        <StatCard label="Total races" value={totals.total} />
        <StatCard label="Finished" value={totals.finished} />
        <StatCard label="Distances" value={totals.distances} />
      </div>

      {activePlan && (
        <div className="bg-white rounded-xl border border-primary/30 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <p className="text-xs font-semibold text-primary uppercase tracking-wider">Active plan</p>
              <p className="text-base font-semibold text-dark mt-1">
                {activePlan.race_name || `${activePlan.distance} plan`}
              </p>
              <p className="text-sm text-gray">
                {formatRaceDate(activePlan.race_date)} · {activePlan.distance}
              </p>
            </div>
            <button
              onClick={handleArchiveActivePlan}
              disabled={submitting}
              className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 disabled:opacity-50"
            >
              Archive as race result
            </button>
          </div>
          <p className="text-xs text-gray mt-3">
            This deactivates the plan in your dashboard and saves it (with any post-race report) to your race log.
          </p>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-medium text-gray uppercase tracking-wider">Race log</h2>
          <button
            onClick={() => setShowManualForm((v) => !v)}
            className="text-sm font-medium text-primary hover:underline"
          >
            {showManualForm ? "Cancel" : "Add a race manually"}
          </button>
        </div>

        {showManualForm && (
          <form onSubmit={handleManualSubmit} className="space-y-3 border border-gray-100 rounded-lg p-4 mb-6">
            <div className="grid sm:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Race name"
                value={manualForm.race_name}
                onChange={(e) => setManualForm({ ...manualForm, race_name: e.target.value })}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
              />
              <input
                type="date"
                value={manualForm.race_date}
                onChange={(e) => setManualForm({ ...manualForm, race_date: e.target.value })}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
                required
              />
              <select
                value={manualForm.distance}
                onChange={(e) => setManualForm({ ...manualForm, distance: e.target.value })}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white"
              >
                {["50K", "50M", "100K", "100M", "Other"].map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Finish time (e.g. 6:42:18)"
                value={manualForm.finish_time}
                onChange={(e) => setManualForm({ ...manualForm, finish_time: e.target.value })}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
              />
              <input
                type="text"
                placeholder="Overall placing"
                value={manualForm.placing}
                onChange={(e) => setManualForm({ ...manualForm, placing: e.target.value })}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
              />
              <input
                type="text"
                placeholder="Age group placing"
                value={manualForm.age_group_placing}
                onChange={(e) => setManualForm({ ...manualForm, age_group_placing: e.target.value })}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
              />
            </div>
            <textarea
              placeholder="Notes from the day"
              value={manualForm.notes}
              onChange={(e) => setManualForm({ ...manualForm, notes: e.target.value })}
              rows={2}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
            />
            <label className="flex items-center gap-2 text-sm text-dark">
              <input
                type="checkbox"
                checked={manualForm.dnf}
                onChange={(e) => setManualForm({ ...manualForm, dnf: e.target.checked })}
              />
              Did not finish (DNF)
            </label>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 disabled:opacity-50"
            >
              {submitting ? "Saving..." : "Add race"}
            </button>
          </form>
        )}

        {results.length === 0 ? (
          <div className="text-center py-12 text-sm text-gray">
            <Trophy className="w-10 h-10 mx-auto mb-3 text-gray-300" />
            No races logged yet. Archive your active plan after race day, or add past races manually.
          </div>
        ) : (
          <ul className="space-y-3">
            {results.map((race) => (
              <li
                key={race.id}
                className="border border-gray-100 rounded-lg p-4 flex items-start gap-4"
              >
                <Flag className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <p className="font-semibold text-dark">
                      {race.race_name || `${race.distance} race`}
                    </p>
                    <span className="text-xs text-gray">{formatRaceDate(race.race_date)}</span>
                  </div>
                  <p className="text-sm text-gray mt-0.5">
                    {race.distance}
                    {race.finish_time && ` · ${race.finish_time}`}
                    {race.placing && ` · ${race.placing} overall`}
                    {race.age_group_placing && ` · ${race.age_group_placing} AG`}
                    {race.dnf && <span className="ml-2 text-red-600 font-medium">DNF</span>}
                  </p>
                  {race.report?.wentWell && (
                    <p className="text-sm text-dark mt-2 italic">{race.report.wentWell}</p>
                  )}
                </div>
                <button
                  onClick={() => handleDelete(race.id)}
                  className="p-2 text-gray hover:text-red-600"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </li>
            ))}
          </ul>
        )}

        {error && (
          <div className="mt-4 bg-red-50 border border-red-100 text-red-700 text-sm rounded-lg px-4 py-3">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4">
      <p className="text-xs text-gray uppercase tracking-wider">{label}</p>
      <p className="text-2xl font-bold text-dark mt-1">{value}</p>
    </div>
  );
}
