import { NextResponse } from "next/server";
import { hasAdminSession } from "@/lib/admin-server";
import { getSupabase, hasSupabaseServiceEnv } from "@/lib/supabase";
import {
  createSupabaseServer,
  hasSupabaseServerEnv,
} from "@/lib/supabase/server";

type RouteProps = {
  params: Promise<{ id: string }>;
};

export async function DELETE(
  _request: Request,
  { params }: RouteProps,
) {
  const { id } = await params;

  if (await hasAdminSession()) {
    if (!hasSupabaseServiceEnv()) {
      return NextResponse.json(
        { error: "Admin moderation requires Supabase service credentials." },
        { status: 503 },
      );
    }

    const supabase = getSupabase();
    const { error } = await supabase
      .from("blog_comments")
      .update({
        moderation_status: "deleted",
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) {
      console.error("Admin delete comment error:", error);
      return NextResponse.json(
        { error: "Failed to delete comment" },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true });
  }

  if (!hasSupabaseServerEnv()) {
    return NextResponse.json(
      { error: "Comments require Supabase configuration." },
      { status: 503 },
    );
  }

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
      .from("blog_comments")
      .update({
        moderation_status: "deleted",
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .eq("author_user_id", user.id);

    if (error) {
      console.error("Delete own comment error:", error);
      return NextResponse.json(
        { error: "Failed to delete comment" },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete comment route error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
