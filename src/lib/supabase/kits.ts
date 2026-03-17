import { createSupabaseBrowser, hasSupabaseBrowserEnv } from "@/lib/supabase/client";
import type { Answers, KitSummary } from "@/types/gear";

export async function saveKit(
  userId: string,
  answers: Answers,
  kitSummary: KitSummary
): Promise<boolean> {
  if (!hasSupabaseBrowserEnv()) return false;
  const supabase = createSupabaseBrowser();
  if (!supabase) return false;

  const { error } = await supabase
    .from("user_saved_kits")
    .upsert(
      {
        user_id: userId,
        answers,
        kit_summary: kitSummary,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" }
    );

  return !error;
}

export async function getMyKit(
  userId: string
): Promise<{ answers: Answers; kit_summary: KitSummary; updated_at: string } | null> {
  if (!hasSupabaseBrowserEnv()) return null;
  const supabase = createSupabaseBrowser();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("user_saved_kits")
    .select("answers, kit_summary, updated_at")
    .eq("user_id", userId)
    .single();

  if (error || !data) return null;
  return data as { answers: Answers; kit_summary: KitSummary; updated_at: string };
}
