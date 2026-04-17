import { NextResponse } from "next/server";
import type { SavedPlan } from "@/lib/training-types";
import {
  buildPublicTrainingPlanSnapshot,
  filterPublicTrainingPlans,
  getPublicTrainingAuthorName,
  getPublicTrainingPlanTitle,
  materializePublicTrainingPlan,
  PUBLIC_TRAINING_PLAN_SELECT,
  slugifyTrainingPlanTitle,
  sortPublicTrainingPlans,
  toPublicTrainingShare,
  type PublicTrainingPlanRow,
} from "@/lib/public-training-plans";
import { createSupabaseServer } from "@/lib/supabase/server";

type TrainingPlanRow = {
  id: string;
  plan_data: SavedPlan;
};

type ProfileRow = {
  display_name: string | null;
};

async function buildUniqueSlug(
  supabase: Awaited<ReturnType<typeof createSupabaseServer>>,
  title: string,
): Promise<string> {
  const base = slugifyTrainingPlanTitle(title);

  for (let attempt = 0; attempt < 12; attempt += 1) {
    const suffix = Math.random().toString(36).slice(2, 6);
    const candidate = `${base}-${suffix}`;
    const { data } = await supabase
      .from("public_training_plans")
      .select("id")
      .eq("slug", candidate)
      .limit(1)
      .maybeSingle();

    if (!data) return candidate;
  }

  return `${base}-${Date.now().toString(36)}`;
}

export async function GET(request: Request) {
  try {
    const supabase = await createSupabaseServer();
    const { searchParams } = new URL(request.url);
    const distance = searchParams.get("distance") ?? undefined;
    const level = searchParams.get("level") ?? undefined;
    const sort = (searchParams.get("sort") as "newest" | "updated" | null) ?? "newest";

    const { data, error } = await supabase
      .from("public_training_plans")
      .select(PUBLIC_TRAINING_PLAN_SELECT)
      .order("published_at", { ascending: false })
      .limit(200);

    if (error) {
      console.error("Public training plans GET error:", error);
      return NextResponse.json({ error: "Failed to load public training plans" }, { status: 500 });
    }

    const plans = sortPublicTrainingPlans(
      filterPublicTrainingPlans(
        ((data ?? []) as unknown as PublicTrainingPlanRow[]).map((row) => materializePublicTrainingPlan(row)),
        { distance, level, sort },
      ),
      sort,
    );

    return NextResponse.json({ plans });
  } catch (error) {
    console.error("Public training plans GET route error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST() {
  try {
    const supabase = await createSupabaseServer();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: trainingPlanData, error: trainingPlanError } = await supabase
      .from("training_plans")
      .select("id, plan_data")
      .eq("user_id", user.id)
      .eq("is_active", true)
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (trainingPlanError) {
      console.error("Public training plan POST load active plan error:", trainingPlanError);
      return NextResponse.json({ error: "Failed to publish training plan" }, { status: 500 });
    }

    if (!trainingPlanData) {
      return NextResponse.json({ error: "Active training plan not found" }, { status: 404 });
    }

    const trainingPlanRow = trainingPlanData as TrainingPlanRow;
    const savedPlan = trainingPlanRow.plan_data;
    const now = new Date().toISOString();

    const [{ data: existingData }, { data: profileData }] = await Promise.all([
      supabase
        .from("public_training_plans")
        .select(PUBLIC_TRAINING_PLAN_SELECT)
        .eq("user_id", user.id)
        .maybeSingle(),
      supabase
        .from("profiles")
        .select("display_name")
        .eq("id", user.id)
        .maybeSingle(),
    ]);

    const existing = (existingData as unknown as PublicTrainingPlanRow | null) ?? null;
    const authorDisplayName = getPublicTrainingAuthorName((profileData as ProfileRow | null)?.display_name);
    const planTitle = getPublicTrainingPlanTitle(savedPlan);
    const slug = existing?.slug ?? await buildUniqueSlug(supabase, planTitle);
    const publishedAt = existing?.published_at ?? now;

    const payload = {
      user_id: user.id,
      source_plan_id: trainingPlanRow.id,
      slug,
      author_display_name: authorDisplayName,
      plan_title: planTitle,
      race_name: savedPlan.raceName.trim() || null,
      race_date: savedPlan.raceDate,
      distance: savedPlan.distance,
      level: savedPlan.level,
      weeks_total: savedPlan.weeksTotal,
      current_weekly_miles: savedPlan.currentWeeklyMiles,
      weeks: savedPlan.weeks,
      published_at: publishedAt,
      updated_at: now,
    };

    const writeQuery = existing
      ? supabase
          .from("public_training_plans")
          .update(payload)
          .eq("id", existing.id)
          .select(PUBLIC_TRAINING_PLAN_SELECT)
          .single()
      : supabase
          .from("public_training_plans")
          .insert(payload)
          .select(PUBLIC_TRAINING_PLAN_SELECT)
          .single();

    const { data, error } = await writeQuery;

    if (error || !data) {
      console.error("Public training plans POST error:", error);
      return NextResponse.json({ error: "Failed to publish training plan" }, { status: 500 });
    }

    const publicRow = data as unknown as PublicTrainingPlanRow;
    return NextResponse.json({
      success: true,
      plan: buildPublicTrainingPlanSnapshot({
        savedPlan,
        authorDisplayName,
        slug: publicRow.slug,
        publicId: publicRow.id,
        sourcePlanId: trainingPlanRow.id,
        publishedAt: publicRow.published_at,
        updatedAt: publicRow.updated_at,
      }),
      publicShare: toPublicTrainingShare(publicRow),
    });
  } catch (error) {
    console.error("Public training plans POST route error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const supabase = await createSupabaseServer();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { error } = await supabase
      .from("public_training_plans")
      .delete()
      .eq("user_id", user.id);

    if (error) {
      console.error("Public training plans DELETE error:", error);
      return NextResponse.json({ error: "Failed to unpublish training plan" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Public training plans DELETE route error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
