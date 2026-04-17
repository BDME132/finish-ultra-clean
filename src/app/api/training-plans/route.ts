import { NextResponse } from "next/server";
import {
  toPublicTrainingShare,
} from "@/lib/public-training-plans";
import { createSupabaseServer } from "@/lib/supabase/server";
import type { SavedPlan } from "@/lib/training-types";

type TrainingPlanRow = {
  id: string;
  plan_data: SavedPlan;
  updated_at: string;
};

type PublicTrainingShareRow = {
  slug: string;
  published_at: string;
  updated_at: string;
};

function buildPublicPlanComparableState(plan: SavedPlan) {
  return JSON.stringify({
    raceDate: plan.raceDate,
    raceName: plan.raceName,
    distance: plan.distance,
    level: plan.level,
    weeksTotal: plan.weeksTotal,
    currentWeeklyMiles: plan.currentWeeklyMiles,
    weeks: plan.weeks,
  });
}

// GET — Load the active plan for the authenticated user
export async function GET() {
  try {
    const supabase = await createSupabaseServer();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabase
      .from("training_plans")
      .select("id, plan_data, created_at, updated_at")
      .eq("user_id", user.id)
      .eq("is_active", true)
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("Error loading training plan:", error);
      return NextResponse.json({ error: "Failed to load plan" }, { status: 500 });
    }

    let publicShare = null;

    if (data?.id) {
      const { data: publicShareData, error: publicShareError } = await supabase
        .from("public_training_plans")
        .select("slug, published_at, updated_at")
        .eq("source_plan_id", data.id)
        .maybeSingle();

      if (publicShareError) {
        console.error("Error loading public training share:", publicShareError);
        return NextResponse.json({ error: "Failed to load plan" }, { status: 500 });
      }

      publicShare = publicShareData
        ? toPublicTrainingShare(publicShareData as PublicTrainingShareRow)
        : null;
    }

    return NextResponse.json({
      plan: data ? (data.plan_data as SavedPlan) : null,
      planId: data?.id ?? null,
      planUpdatedAt: data?.updated_at ?? null,
      publicShare,
    });
  } catch (error) {
    console.error("Training plans GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST — Save a new plan (deactivates any existing active plan)
export async function POST(request: Request) {
  try {
    const supabase = await createSupabaseServer();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const plan: SavedPlan = body.plan;

    if (!plan || !plan.raceDate || !plan.distance) {
      return NextResponse.json({ error: "Invalid plan data" }, { status: 400 });
    }

    // Deactivate any existing active plans
    await supabase
      .from("training_plans")
      .update({ is_active: false })
      .eq("user_id", user.id)
      .eq("is_active", true);

    // Insert new plan
    const { data, error } = await supabase
      .from("training_plans")
      .insert({
        user_id: user.id,
        plan_data: plan,
        race_date: plan.raceDate,
        distance: plan.distance,
        race_name: plan.raceName || null,
        is_active: true,
      })
      .select("id")
      .single();

    if (error) {
      console.error("Error saving training plan:", error);
      return NextResponse.json({ error: "Failed to save plan" }, { status: 500 });
    }

    const { error: publicPlanDeleteError } = await supabase
      .from("public_training_plans")
      .delete()
      .eq("user_id", user.id);

    if (publicPlanDeleteError) {
      console.error("Error clearing public training plan after creating new plan:", publicPlanDeleteError);
      return NextResponse.json({ error: "Failed to save plan" }, { status: 500 });
    }

    return NextResponse.json({ success: true, planId: data.id });
  } catch (error) {
    console.error("Training plans POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PUT — Update the active plan (for workout completions, gear toggles, etc.)
export async function PUT(request: Request) {
  try {
    const supabase = await createSupabaseServer();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const plan: SavedPlan = body.plan;

    if (!plan) {
      return NextResponse.json({ error: "Invalid plan data" }, { status: 400 });
    }

    const { data: currentData, error: currentError } = await supabase
      .from("training_plans")
      .select("id, plan_data, updated_at")
      .eq("user_id", user.id)
      .eq("is_active", true)
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (currentError) {
      console.error("Error loading current training plan before update:", currentError);
      return NextResponse.json({ error: "Failed to update plan" }, { status: 500 });
    }

    if (!currentData) {
      return NextResponse.json({ error: "Training plan not found" }, { status: 404 });
    }

    const currentPlanRow = currentData as TrainingPlanRow;
    const shouldRefreshPlanTimestamp =
      buildPublicPlanComparableState(currentPlanRow.plan_data) !==
      buildPublicPlanComparableState(plan);
    const nextUpdatedAt = shouldRefreshPlanTimestamp
      ? new Date().toISOString()
      : currentPlanRow.updated_at;

    const { error } = await supabase
      .from("training_plans")
      .update({
        plan_data: plan,
        race_date: plan.raceDate,
        distance: plan.distance,
        race_name: plan.raceName || null,
        updated_at: nextUpdatedAt,
      })
      .eq("user_id", user.id)
      .eq("is_active", true);

    if (error) {
      console.error("Error updating training plan:", error);
      return NextResponse.json({ error: "Failed to update plan" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Training plans PUT error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE — Deactivate the active plan
export async function DELETE() {
  try {
    const supabase = await createSupabaseServer();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { error } = await supabase
      .from("training_plans")
      .update({ is_active: false })
      .eq("user_id", user.id)
      .eq("is_active", true);

    if (error) {
      console.error("Error deleting training plan:", error);
      return NextResponse.json({ error: "Failed to delete plan" }, { status: 500 });
    }

    const { error: publicPlanDeleteError } = await supabase
      .from("public_training_plans")
      .delete()
      .eq("user_id", user.id);

    if (publicPlanDeleteError) {
      console.error("Error deleting public training plan:", publicPlanDeleteError);
      return NextResponse.json({ error: "Failed to delete plan" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Training plans DELETE error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
