import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";

// POST — Flag content (auth required)
export async function POST(request: Request) {
  try {
    const supabase = await createSupabaseServer();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { contentType, contentId, reason, details } = body;

    if (!contentType || !contentId || !reason) {
      return NextResponse.json(
        { error: "Missing required fields (contentType, contentId, reason)" },
        { status: 400 }
      );
    }

    const validTypes = ["review", "comment"];
    if (!validTypes.includes(contentType)) {
      return NextResponse.json(
        { error: "contentType must be 'review' or 'comment'" },
        { status: 400 }
      );
    }

    const validReasons = ["spam", "offensive", "misleading", "off-topic", "other"];
    if (!validReasons.includes(reason)) {
      return NextResponse.json(
        { error: "Invalid reason. Must be: spam, offensive, misleading, off-topic, or other" },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("content_flags")
      .insert({
        user_id: user.id,
        content_type: contentType,
        content_id: contentId,
        reason,
        details: details || null,
      });

    if (error) {
      // Handle unique constraint (user already flagged this content)
      if (error.code === "23505") {
        return NextResponse.json(
          { error: "You have already flagged this content" },
          { status: 409 }
        );
      }
      console.error("Error creating flag:", error);
      return NextResponse.json({ error: "Failed to flag content" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Flags POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
