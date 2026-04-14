import type { User } from "@supabase/supabase-js";
import type { SavedKit } from "./kit-types";
import {
  ensureSingleActiveKit,
  getActiveKit,
  loadSavedKits,
  removeSavedKit,
  saveKitsToLocal,
  upsertSavedKit,
} from "./kit-types";

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
    return ensureSingleActiveKit(data.kits ?? []);
  } catch {
    return loadSavedKits();
  }
}

export async function loadKitById(user: User | null, kitId: string): Promise<SavedKit | null> {
  if (!user) {
    return loadSavedKits().find((kit) => kit.kitId === kitId) ?? null;
  }

  try {
    const res = await fetch(`/api/kits?kitId=${encodeURIComponent(kitId)}`, { credentials: "include" });
    if (!res.ok) {
      return loadSavedKits().find((kit) => kit.kitId === kitId) ?? null;
    }
    const data = await res.json();
    return data.kit ?? null;
  } catch {
    return loadSavedKits().find((kit) => kit.kitId === kitId) ?? null;
  }
}

export async function loadActiveKit(user: User | null): Promise<SavedKit | null> {
  if (!user) {
    return getActiveKit(loadSavedKits());
  }

  try {
    const res = await fetch("/api/kits?scope=active", { credentials: "include" });
    if (!res.ok) {
      return getActiveKit(loadSavedKits());
    }
    const data = await res.json();
    return data.kit ?? null;
  } catch {
    return getActiveKit(loadSavedKits());
  }
}

// ─── Save a new kit ─────────────────────────────────────────────────────────

export async function saveNewKit(kit: SavedKit, user: User | null): Promise<boolean> {
  // Always save to localStorage
  saveKitsToLocal(upsertSavedKit(loadSavedKits(), kit));

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
  saveKitsToLocal(upsertSavedKit(loadSavedKits(), kit));

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
  saveKitsToLocal(removeSavedKit(loadSavedKits(), kitId));

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
