import type { User } from "@supabase/supabase-js";
import type { SavedKit } from "./kit-types";
import { loadSavedKits, saveKitsToLocal } from "./kit-types";

// ─── Load kits: Supabase for auth users, localStorage for guests ────────────

export async function loadKits(user: User | null): Promise<SavedKit[]> {
  if (!user) {
    return loadSavedKits();
  }

  try {
    const res = await fetch("/api/kits", { credentials: "include" });
    if (!res.ok) {
      return loadSavedKits();
    }
    const data = await res.json();
    return data.kits ?? [];
  } catch {
    return loadSavedKits();
  }
}

// ─── Save a new kit ─────────────────────────────────────────────────────────

export async function saveNewKit(kit: SavedKit, user: User | null): Promise<boolean> {
  // Always save to localStorage
  const existing = loadSavedKits();
  const updated = [kit, ...existing.filter((k) => k.kitId !== kit.kitId)];
  saveKitsToLocal(updated);

  if (!user) return true;

  try {
    const res = await fetch("/api/kits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ kit }),
    });
    return res.ok;
  } catch {
    return true; // localStorage fallback succeeded
  }
}

// ─── Update an existing kit ─────────────────────────────────────────────────

export async function updateKit(kit: SavedKit, user: User | null): Promise<void> {
  // Always save to localStorage
  const existing = loadSavedKits();
  const updated = existing.map((k) => (k.kitId === kit.kitId ? kit : k));
  saveKitsToLocal(updated);

  if (!user) return;

  try {
    await fetch("/api/kits", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ kit }),
    });
  } catch {
    // Silent fail — localStorage backup is in place
  }
}

// ─── Delete a kit ───────────────────────────────────────────────────────────

export async function deleteKit(kitId: string, user: User | null): Promise<void> {
  // Remove from localStorage
  const existing = loadSavedKits();
  saveKitsToLocal(existing.filter((k) => k.kitId !== kitId));

  if (!user) return;

  try {
    await fetch(`/api/kits?kitId=${encodeURIComponent(kitId)}`, {
      method: "DELETE",
      credentials: "include",
    });
  } catch {
    // Silent fail
  }
}
