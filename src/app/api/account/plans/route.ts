import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";
import type { SavedPlan } from "@/lib/training-types";

interface PlanListRow {
  id: string;
  is_active: boolean;
  race_date: string | null;
  distance: string | null;
  race_name: string | null;
  created_at: string;
  updated_at: string;
  plan_data: SavedPlan;
}

export async function GET() {
  try {
    const supabase = await createSupabaseServer();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabase
      .from("training_plans")
      .select("id, is_active, race_date, distance, race_name, created_at, updated_at, plan_data")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false });

    if (error) {
      console.error("Error listing plans:", error);
      return NextResponse.json({ error: "Failed to list plans" }, { status: 500 });
    }

    const plans = ((data as PlanListRow[]) ?? []).map((row) => {
      const totalWorkouts = row.plan_data.weeks?.reduce(
        (sum, w) => sum + (w.days?.length ?? 0),
        0,
      ) ?? 0;
      const completed = Object.keys(row.plan_data.completedWorkouts ?? {}).length;
      return {
        id: row.id,
        is_active: row.is_active,
        race_date: row.race_date,
        distance: row.distance,
        race_name: row.race_name,
        level: row.plan_data.level,
        weeks_total: row.plan_data.weeksTotal,
        completed_count: completed,
        total_workouts: totalWorkouts,
        created_at: row.created_at,
        updated_at: row.updated_at,
      };
    });

    return NextResponse.json({ plans });
  } catch (error) {
    console.error("Plans list GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

interface PlansActionBody {
  id?: string;
  action?: "activate" | "deactivate" | "delete";
}

export async function POST(request: Request) {
  try {
    const supabase = await createSupabaseServer();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json().catch(() => null)) as PlansActionBody | null;
    if (!body || !body.id || !body.action) {
      return NextResponse.json({ error: "Missing id or action" }, { status: 400 });
    }

    if (body.action === "activate") {
      // Deactivate any other active plans first
      const { error: deactivateError } = await supabase
        .from("training_plans")
        .update({ is_active: false })
        .eq("user_id", user.id)
        .eq("is_active", true)
        .neq("id", body.id);

      if (deactivateError) {
        console.error("Deactivate other plans failed:", deactivateError);
        return NextResponse.json({ error: "Failed to activate plan" }, { status: 500 });
      }

      const { error } = await supabase
        .from("training_plans")
        .update({ is_active: true, updated_at: new Date().toISOString() })
        .eq("id", body.id)
        .eq("user_id", user.id);

      if (error) {
        console.error("Activate plan failed:", error);
        return NextResponse.json({ error: "Failed to activate plan" }, { status: 500 });
      }

      return NextResponse.json({ success: true });
    }

    if (body.action === "deactivate") {
      const { error } = await supabase
        .from("training_plans")
        .update({ is_active: false })
        .eq("id", body.id)
        .eq("user_id", user.id);

      if (error) {
        console.error("Deactivate plan failed:", error);
        return NextResponse.json({ error: "Failed to deactivate plan" }, { status: 500 });
      }

      // Tear down any public share for this plan
      await supabase.from("public_training_plans").delete().eq("source_plan_id", body.id);

      return NextResponse.json({ success: true });
    }

    if (body.action === "delete") {
      const { error } = await supabase
        .from("training_plans")
        .delete()
        .eq("id", body.id)
        .eq("user_id", user.id);

      if (error) {
        console.error("Delete plan failed:", error);
        return NextResponse.json({ error: "Failed to delete plan" }, { status: 500 });
      }

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (error) {
    console.error("Plans POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
