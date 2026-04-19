// ─── Follow graph types and helpers ──────────────────────────────────────────

import type { AccountProfile } from "./profile";

export interface FollowRow {
  follower_user_id: string;
  followed_user_id: string;
  created_at: string;
}

export type FollowProfile = Pick<
  AccountProfile,
  "id" | "username" | "display_name" | "avatar_url" | "bio" | "location" | "goal_distance"
>;

export interface FollowEdge {
  created_at: string;
  profile: FollowProfile;
}

export interface FollowCounts {
  followers: number;
  following: number;
}

export const FOLLOW_PROFILE_FIELDS =
  "id, username, display_name, avatar_url, bio, location, goal_distance";
