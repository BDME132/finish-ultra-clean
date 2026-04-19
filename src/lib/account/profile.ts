// ─── Profile types and helpers ───────────────────────────────────────────────

export type ProfileVisibility = "public" | "private";

export interface AccountProfile {
  id: string;
  display_name: string | null;
  username: string | null;
  bio: string | null;
  avatar_url: string | null;
  location: string | null;
  website_url: string | null;
  profile_visibility: ProfileVisibility;
  goal_distance: string | null;
  is_newsletter_subscriber?: boolean | null;
  updated_at?: string | null;
}

export interface PublicProfileSummary {
  id: string;
  username: string;
  display_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  location: string | null;
  website_url: string | null;
  goal_distance: string | null;
  follower_count: number;
  following_count: number;
}

export const PROFILE_FIELDS =
  "id, display_name, username, bio, avatar_url, location, website_url, profile_visibility, goal_distance, updated_at";

export const GOAL_DISTANCES = ["50K", "50M", "100K", "100M"] as const;
export type GoalDistance = (typeof GOAL_DISTANCES)[number];

export function isGoalDistance(value: string | null | undefined): value is GoalDistance {
  if (!value) return false;
  return (GOAL_DISTANCES as readonly string[]).includes(value);
}

const USERNAME_REGEX = /^[a-z0-9_]+$/;
export const USERNAME_MIN_LENGTH = 3;
export const USERNAME_MAX_LENGTH = 30;

export type UsernameValidation = { ok: true } | { ok: false; reason: string };

export function validateUsername(raw: string): UsernameValidation {
  const value = raw.trim();
  if (value.length < USERNAME_MIN_LENGTH) {
    return { ok: false, reason: `Username must be at least ${USERNAME_MIN_LENGTH} characters.` };
  }
  if (value.length > USERNAME_MAX_LENGTH) {
    return { ok: false, reason: `Username must be at most ${USERNAME_MAX_LENGTH} characters.` };
  }
  if (!USERNAME_REGEX.test(value)) {
    return { ok: false, reason: "Use only lowercase letters, numbers, and underscores." };
  }
  return { ok: true };
}

// Slugify a display name or email local-part into a username candidate.
export function slugifyUsernameCandidate(raw: string): string {
  const base = raw
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, USERNAME_MAX_LENGTH);
  if (base.length >= USERNAME_MIN_LENGTH) return base;
  // pad short candidates with random hex
  const pad = Math.random().toString(16).slice(2, 8);
  return `${base || "runner"}_${pad}`.slice(0, USERNAME_MAX_LENGTH);
}

export function profileDisplayName(profile: Pick<AccountProfile, "display_name" | "username">): string {
  return profile.display_name?.trim() || profile.username || "FinishUltra Runner";
}

export function profileInitials(profile: Pick<AccountProfile, "display_name" | "username">): string {
  const name = profileDisplayName(profile);
  const parts = name.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "U";
  if (parts.length === 1) return parts[0].slice(0, 1).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
