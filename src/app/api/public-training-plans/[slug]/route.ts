import { NextResponse } from "next/server";
import {
  materializePublicTrainingPlan,
  PUBLIC_TRAINING_PLAN_SELECT,
  type PublicTrainingPlanRow,
} from "@/lib/public-training-plans";
import { createSupabaseServer } from "@/lib/supabase/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;
    const supabase = await createSupabaseServer();

    const { data, error } = await supabase
      .from("public_training_plans")
      .select(PUBLIC_TRAINING_PLAN_SELECT)
      .eq("slug", slug)
      .maybeSingle();

    if (error) {
      console.error("Public training plan detail GET error:", error);
      return NextResponse.json({ error: "Failed to load public training plan" }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ error: "Public training plan not found" }, { status: 404 });
    }

    return NextResponse.json({ plan: materializePublicTrainingPlan(data as unknown as PublicTrainingPlanRow) });
  } catch (error) {
    console.error("Public training plan detail route error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
