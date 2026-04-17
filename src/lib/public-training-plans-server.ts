import "server-only";

import type { PublicTrainingPlan } from "@/lib/training-types";
import {
  materializePublicTrainingPlan,
  PUBLIC_TRAINING_PLAN_SELECT,
  sortPublicTrainingPlans,
  type PublicTrainingPlanRow,
} from "@/lib/public-training-plans";
import { createSupabaseServer, hasSupabaseServerEnv } from "@/lib/supabase/server";

export async function loadPublicTrainingPlansServer(): Promise<PublicTrainingPlan[]> {
  if (!hasSupabaseServerEnv()) {
    return [];
  }

  try {
    const supabase = await createSupabaseServer();
    const { data, error } = await supabase
      .from("public_training_plans")
      .select(PUBLIC_TRAINING_PLAN_SELECT)
      .order("published_at", { ascending: false })
      .limit(200);

    if (error) {
      console.error("loadPublicTrainingPlansServer error:", error);
      return [];
    }

    return sortPublicTrainingPlans(
      ((data ?? []) as unknown as PublicTrainingPlanRow[]).map((row) => materializePublicTrainingPlan(row)),
      "newest",
    );
  } catch (error) {
    console.error("loadPublicTrainingPlansServer route error:", error);
    return [];
  }
}

export async function loadPublicTrainingPlanBySlugServer(slug: string): Promise<PublicTrainingPlan | null> {
  if (!hasSupabaseServerEnv()) {
    return null;
  }

  try {
    const supabase = await createSupabaseServer();
    const { data, error } = await supabase
      .from("public_training_plans")
      .select(PUBLIC_TRAINING_PLAN_SELECT)
      .eq("slug", slug)
      .maybeSingle();

    if (error || !data) {
      if (error) {
        console.error("loadPublicTrainingPlanBySlugServer error:", error);
      }
      return null;
    }

    return materializePublicTrainingPlan(data as unknown as PublicTrainingPlanRow);
  } catch (error) {
    console.error("loadPublicTrainingPlanBySlugServer route error:", error);
    return null;
  }
}
