import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";
import type { SavedPlan } from "@/lib/training-types";

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
      .single();

    if (error && error.code !== "PGRST116") {
      // PGRST116 = no rows returned — that's OK
      console.error("Error loading training plan:", error);
      return NextResponse.json({ error: "Failed to load plan" }, { status: 500 });
    }

    return NextResponse.json({
      plan: data ? (data.plan_data as SavedPlan) : null,
      planId: data?.id ?? null,
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

    const { error } = await supabase
      .from("training_plans")
      .update({
        plan_data: plan,
        race_date: plan.raceDate,
        distance: plan.distance,
        race_name: plan.raceName || null,
        updated_at: new Date().toISOString(),
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

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Training plans DELETE error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
