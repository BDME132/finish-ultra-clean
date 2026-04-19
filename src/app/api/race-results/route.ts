import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";
import {
  RACE_RESULT_FIELDS,
  type RaceResultDraft,
  type RaceResultRow,
} from "@/lib/account/race-results";
import type { SavedPlan } from "@/lib/training-types";

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
      .from("race_results")
      .select(RACE_RESULT_FIELDS)
      .eq("user_id", user.id)
      .order("race_date", { ascending: false });

    if (error) {
      console.error("Error loading race results:", error);
      return NextResponse.json({ error: "Failed to load race results" }, { status: 500 });
    }

    return NextResponse.json({ results: (data as RaceResultRow[]) ?? [] });
  } catch (error) {
    console.error("Race results GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

interface ArchivePlanBody {
  archive_plan_id?: string;
}

interface ManualResultBody {
  result?: RaceResultDraft;
}

type PostBody = ArchivePlanBody & ManualResultBody;

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

    const body = (await request.json().catch(() => null)) as PostBody | null;
    if (!body) {
      return NextResponse.json({ error: "Invalid body" }, { status: 400 });
    }

    let draft: RaceResultDraft | null = null;

    if (body.archive_plan_id) {
      const { data: planRow, error: planError } = await supabase
        .from("training_plans")
        .select("id, plan_data, race_date, distance, race_name")
        .eq("id", body.archive_plan_id)
        .eq("user_id", user.id)
        .maybeSingle();

      if (planError) {
        console.error("Error loading plan to archive:", planError);
        return NextResponse.json({ error: "Failed to archive plan" }, { status: 500 });
      }
      if (!planRow) {
        return NextResponse.json({ error: "Plan not found" }, { status: 404 });
      }

      const plan = planRow.plan_data as SavedPlan;
      const report = plan.postRaceReport ?? {};

      draft = {
        plan_id: planRow.id,
        race_name: plan.raceName || planRow.race_name || null,
        race_date: plan.raceDate || planRow.race_date,
        distance: plan.distance || planRow.distance,
        finish_time: report.finishTime ?? null,
        placing: report.placing ?? null,
        age_group_placing: report.ageGroupPlacing ?? null,
        dnf: !!report.dnf,
        report,
      };

      // Deactivate the plan so it falls into the archive
      const { error: deactivateError } = await supabase
        .from("training_plans")
        .update({ is_active: false })
        .eq("id", planRow.id)
        .eq("user_id", user.id);

      if (deactivateError) {
        console.error("Error deactivating plan:", deactivateError);
        return NextResponse.json({ error: "Failed to archive plan" }, { status: 500 });
      }

      // Tear down any public share for that plan
      await supabase
        .from("public_training_plans")
        .delete()
        .eq("source_plan_id", planRow.id);
    } else if (body.result) {
      draft = body.result;
    } else {
      return NextResponse.json({ error: "Provide either archive_plan_id or result" }, { status: 400 });
    }

    if (!draft.race_date || !draft.distance) {
      return NextResponse.json({ error: "race_date and distance are required" }, { status: 400 });
    }

    const insert = {
      user_id: user.id,
      plan_id: draft.plan_id ?? null,
      race_name: draft.race_name ?? null,
      race_date: draft.race_date,
      distance: draft.distance,
      finish_time: draft.finish_time ?? null,
      placing: draft.placing ?? null,
      age_group_placing: draft.age_group_placing ?? null,
      dnf: !!draft.dnf,
      report: draft.report ?? {},
    };

    const { data, error } = await supabase
      .from("race_results")
      .insert(insert)
      .select(RACE_RESULT_FIELDS)
      .single();

    if (error) {
      console.error("Error creating race result:", error);
      return NextResponse.json({ error: "Failed to create race result" }, { status: 500 });
    }

    return NextResponse.json({ result: data as RaceResultRow }, { status: 201 });
  } catch (error) {
    console.error("Race results POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const supabase = await createSupabaseServer();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json().catch(() => null)) as
      | (RaceResultDraft & { id?: string })
      | null;
    if (!body || !body.id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    const updates: Record<string, unknown> = {};
    if ("race_name" in body) updates.race_name = body.race_name ?? null;
    if ("race_date" in body && body.race_date) updates.race_date = body.race_date;
    if ("distance" in body && body.distance) updates.distance = body.distance;
    if ("finish_time" in body) updates.finish_time = body.finish_time ?? null;
    if ("placing" in body) updates.placing = body.placing ?? null;
    if ("age_group_placing" in body) updates.age_group_placing = body.age_group_placing ?? null;
    if ("dnf" in body) updates.dnf = !!body.dnf;
    if ("report" in body) updates.report = body.report ?? {};
    updates.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from("race_results")
      .update(updates)
      .eq("id", body.id)
      .eq("user_id", user.id)
      .select(RACE_RESULT_FIELDS)
      .single();

    if (error) {
      console.error("Error updating race result:", error);
      return NextResponse.json({ error: "Failed to update race result" }, { status: 500 });
    }

    return NextResponse.json({ result: data as RaceResultRow });
  } catch (error) {
    console.error("Race results PATCH error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const supabase = await createSupabaseServer();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(request.url);
    const id = url.searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    const { error } = await supabase
      .from("race_results")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      console.error("Error deleting race result:", error);
      return NextResponse.json({ error: "Failed to delete race result" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Race results DELETE error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
