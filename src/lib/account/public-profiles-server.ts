import "server-only";

import { createSupabaseServer, hasSupabaseServerEnv } from "@/lib/supabase/server";

export interface PublicProfileListEntry {
  username: string;
  updated_at: string | null;
}

export async function loadPublicProfilesServer(): Promise<PublicProfileListEntry[]> {
  if (!hasSupabaseServerEnv()) return [];

  try {
    const supabase = await createSupabaseServer();
    const { data, error } = await supabase
      .from("profiles")
      .select("username, updated_at")
      .eq("profile_visibility", "public")
      .not("username", "is", null)
      .limit(1000);

    if (error) {
      console.error("loadPublicProfilesServer error:", error);
      return [];
    }

    return ((data ?? []) as { username: string | null; updated_at: string | null }[])
      .filter((row): row is PublicProfileListEntry => Boolean(row.username))
      .map((row) => ({ username: row.username, updated_at: row.updated_at }));
  } catch (error) {
    console.error("loadPublicProfilesServer route error:", error);
    return [];
  }
}
