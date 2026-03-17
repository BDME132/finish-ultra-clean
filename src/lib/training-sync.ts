import type { User } from "@supabase/supabase-js";
import type { SavedPlan } from "./training-types";
import { loadSavedPlan, savePlan as saveToLocalStorage, PLAN_STORAGE_KEY } from "./training-types";

// ─── Load plan: Supabase for auth users, localStorage for guests ─────────────

export async function loadPlan(user: User | null): Promise<SavedPlan | null> {
  if (!user) {
    return loadSavedPlan();
  }

  try {
    const res = await fetch("/api/training-plans", { credentials: "include" });
    if (!res.ok) {
      // Fall back to localStorage if API fails
      return loadSavedPlan();
    }
    const data = await res.json();
    return data.plan ?? null;
  } catch {
    return loadSavedPlan();
  }
}

// ─── Persist plan: Supabase for auth users, localStorage for guests ──────────

export async function persistPlan(plan: SavedPlan, user: User | null): Promise<void> {
  // Always save to localStorage as a cache
  saveToLocalStorage(plan);

  if (!user) return;

  try {
    await fetch("/api/training-plans", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ plan }),
    });
  } catch {
    // Silently fail — localStorage backup is in place
  }
}

// ─── Save new plan to Supabase ───────────────────────────────────────────────

export async function saveNewPlan(plan: SavedPlan, user: User | null): Promise<boolean> {
  // Always save to localStorage
  saveToLocalStorage(plan);

  if (!user) return true;

  try {
    const res = await fetch("/api/training-plans", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ plan }),
    });
    return res.ok;
  } catch {
    return true; // localStorage fallback succeeded
  }
}

// ─── Delete plan ─────────────────────────────────────────────────────────────

export async function deletePlanData(user: User | null): Promise<void> {
  if (typeof window !== "undefined") {
    localStorage.removeItem(PLAN_STORAGE_KEY);
  }

  if (!user) return;

  try {
    await fetch("/api/training-plans", {
      method: "DELETE",
      credentials: "include",
    });
  } catch {
    // Silent fail
  }
}

// ─── Migrate local plan to cloud when user signs in ──────────────────────────

export async function migrateLocalToCloud(user: User): Promise<SavedPlan | null> {
  const localPlan = loadSavedPlan();
  if (!localPlan) return null;

  // Check if cloud already has a plan
  try {
    const res = await fetch("/api/training-plans", { credentials: "include" });
    if (res.ok) {
      const data = await res.json();
      if (data.plan) {
        // Cloud plan exists — keep it, don't overwrite
        return data.plan;
      }
    }
  } catch {
    return localPlan;
  }

  // No cloud plan — upload local plan
  await saveNewPlan(localPlan, user);
  return localPlan;
}
