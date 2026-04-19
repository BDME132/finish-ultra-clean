"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Calendar, Trash2 } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { hasSupabaseBrowserEnv } from "@/lib/supabase/client";

interface PlanSummary {
  id: string;
  is_active: boolean;
  race_date: string | null;
  distance: string | null;
  race_name: string | null;
  level: string;
  weeks_total: number;
  completed_count: number;
  total_workouts: number;
  created_at: string;
  updated_at: string;
}

function formatDate(date: string | null): string {
  if (!date) return "—";
  return new Date(`${date}T00:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export default function PlansClient() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const isSupabaseConfigured = hasSupabaseBrowserEnv();
  const [plans, setPlans] = useState<PlanSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

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
        const res = await fetch("/api/account/plans", { credentials: "include" });
        if (!res.ok) throw new Error("Failed to load plans");
        const json = await res.json();
        if (!cancelled) setPlans(json.plans ?? []);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [authLoading, user, router, isSupabaseConfigured]);

  async function performAction(id: string, action: "activate" | "deactivate" | "delete") {
    setBusyId(id);
    setError(null);
    try {
      const res = await fetch("/api/account/plans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ id, action }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || "Action failed");

      if (action === "delete") {
        setPlans((prev) => prev.filter((p) => p.id !== id));
      } else if (action === "activate") {
        setPlans((prev) =>
          prev.map((p) => ({ ...p, is_active: p.id === id })),
        );
      } else {
        setPlans((prev) =>
          prev.map((p) => (p.id === id ? { ...p, is_active: false } : p)),
        );
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Action failed");
    } finally {
      setBusyId(null);
    }
  }

  if (!isSupabaseConfigured) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
        <p className="text-sm text-gray">Add Supabase env vars to manage plans.</p>
      </div>
    );
  }

  if (authLoading || loading || !user) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 p-8 text-center text-sm text-gray">
        Loading plans...
      </div>
    );
  }

  const active = plans.filter((p) => p.is_active);
  const archived = plans.filter((p) => !p.is_active);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray">
          {plans.length} plan{plans.length === 1 ? "" : "s"}
        </p>
        <Link
          href="/training/plans"
          className="text-sm font-medium text-primary hover:underline"
        >
          Generate a new plan →
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-700 text-sm rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      <Section title="Active">
        {active.length === 0 ? (
          <Empty message="No active plan. Activate an archived one or create a new plan." />
        ) : (
          <ul className="space-y-3">
            {active.map((plan) => (
              <PlanRow
                key={plan.id}
                plan={plan}
                busy={busyId === plan.id}
                onAction={performAction}
              />
            ))}
          </ul>
        )}
      </Section>

      {archived.length > 0 && (
        <Section title="Archived">
          <ul className="space-y-3">
            {archived.map((plan) => (
              <PlanRow
                key={plan.id}
                plan={plan}
                busy={busyId === plan.id}
                onAction={performAction}
              />
            ))}
          </ul>
        </Section>
      )}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6">
      <h2 className="text-sm font-medium text-gray uppercase tracking-wider mb-4">{title}</h2>
      {children}
    </div>
  );
}

function Empty({ message }: { message: string }) {
  return (
    <div className="text-center py-8 text-sm text-gray">
      <Calendar className="w-10 h-10 mx-auto mb-3 text-gray-300" />
      {message}
    </div>
  );
}

function PlanRow({
  plan,
  busy,
  onAction,
}: {
  plan: PlanSummary;
  busy: boolean;
  onAction: (id: string, action: "activate" | "deactivate" | "delete") => Promise<void>;
}) {
  const progress =
    plan.total_workouts > 0
      ? Math.round((plan.completed_count / plan.total_workouts) * 100)
      : 0;

  return (
    <li className="border border-gray-100 rounded-lg p-4 flex flex-col sm:flex-row gap-4">
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-dark">
          {plan.race_name || `${plan.distance ?? "Plan"}`}
        </p>
        <p className="text-sm text-gray mt-1">
          {capitalize(plan.level)} · {plan.distance} · {plan.weeks_total} weeks
        </p>
        <p className="text-xs text-gray mt-1">
          Race day {formatDate(plan.race_date)} · {plan.completed_count}/{plan.total_workouts} workouts ({progress}%)
        </p>
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        {plan.is_active ? (
          <Link
            href="/training/dashboard"
            className="px-3 py-1.5 bg-primary text-white text-xs font-medium rounded-lg hover:bg-primary/90"
          >
            Open dashboard
          </Link>
        ) : (
          <button
            onClick={() => onAction(plan.id, "activate")}
            disabled={busy}
            className="px-3 py-1.5 bg-primary text-white text-xs font-medium rounded-lg hover:bg-primary/90 disabled:opacity-50"
          >
            {busy ? "..." : "Reactivate"}
          </button>
        )}
        {plan.is_active && (
          <button
            onClick={() => onAction(plan.id, "deactivate")}
            disabled={busy}
            className="px-3 py-1.5 border border-gray-200 text-xs font-medium text-dark rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            Archive
          </button>
        )}
        <button
          onClick={() => {
            if (confirm("Delete this plan permanently?")) onAction(plan.id, "delete");
          }}
          disabled={busy}
          className="p-1.5 text-gray hover:text-red-600"
          title="Delete plan"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </li>
  );
}
