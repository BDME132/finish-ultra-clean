import { NextResponse } from "next/server";
import { hasAdminSession } from "@/lib/admin-server";
import { getSupabase, hasSupabaseServiceEnv } from "@/lib/supabase";

type RouteProps = {
  params: Promise<{ id: string }>;
};

export async function POST(
  _request: Request,
  { params }: RouteProps,
) {
  if (!(await hasAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!hasSupabaseServiceEnv()) {
    return NextResponse.json(
      { error: "Supabase service credentials are not configured." },
      { status: 503 },
    );
  }

  try {
    const { id } = await params;
    const { error } = await getSupabase()
      .from("blog_comments")
      .update({
        moderation_status: "visible",
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) {
      console.error("Unhide comment error:", error);
      return NextResponse.json(
        { error: "Failed to restore comment" },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Unhide comment route error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
