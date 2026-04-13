import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";

type ProfileJoin = { display_name: string } | { display_name: string }[] | null;

function extractDisplayName(profiles: ProfileJoin): string | null {
  if (!profiles) return null;
  if (Array.isArray(profiles)) return profiles[0]?.display_name ?? null;
  return profiles.display_name ?? null;
}

// GET — Fetch all published comments for a product (public, no auth required)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId");

    if (!productId) {
      return NextResponse.json({ error: "Missing productId" }, { status: 400 });
    }

    const supabase = await createSupabaseServer();

    const { data, error } = await supabase
      .from("comments")
      .select("id, user_id, product_id, parent_id, body, helpful_count, created_at, profiles(display_name)")
      .eq("product_id", productId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error loading comments:", error);
      return NextResponse.json({ error: "Failed to load comments" }, { status: 500 });
    }

    const comments = (data ?? []).map((row) => ({
      id: row.id,
      userId: row.user_id,
      displayName: extractDisplayName(row.profiles as ProfileJoin),
      productId: row.product_id,
      parentId: row.parent_id,
      body: row.body,
      helpfulCount: row.helpful_count,
      createdAt: row.created_at,
    }));

    return NextResponse.json({ comments });
  } catch (error) {
    console.error("Comments GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST — Create a new comment (auth required)
export async function POST(request: Request) {
  try {
    const supabase = await createSupabaseServer();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { productId, parentId, body: commentBody } = body;

    if (!productId || !commentBody?.trim()) {
      return NextResponse.json({ error: "Missing productId or body" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("comments")
      .insert({
        user_id: user.id,
        product_id: productId,
        parent_id: parentId ?? null,
        body: commentBody.trim(),
      })
      .select("id, user_id, product_id, parent_id, body, helpful_count, created_at, profiles(display_name)")
      .single();

    if (error) {
      console.error("Error creating comment:", error);
      return NextResponse.json({ error: "Failed to create comment" }, { status: 500 });
    }

    const comment = {
      id: data.id,
      userId: data.user_id,
      displayName: extractDisplayName(data.profiles as ProfileJoin),
      productId: data.product_id,
      parentId: data.parent_id,
      body: data.body,
      helpfulCount: data.helpful_count,
      createdAt: data.created_at,
    };

    return NextResponse.json({ comment }, { status: 201 });
  } catch (error) {
    console.error("Comments POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PUT — Update a comment (auth required, must be owner)
export async function PUT(request: Request) {
  try {
    const supabase = await createSupabaseServer();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id, body: commentBody } = body;

    if (!id || !commentBody?.trim()) {
      return NextResponse.json({ error: "Missing id or body" }, { status: 400 });
    }

    // Verify ownership
    const { data: existing, error: fetchError } = await supabase
      .from("comments")
      .select("user_id")
      .eq("id", id)
      .single();

    if (fetchError || !existing) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }

    if (existing.user_id !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { data, error } = await supabase
      .from("comments")
      .update({ body: commentBody.trim() })
      .eq("id", id)
      .select("id, user_id, product_id, parent_id, body, helpful_count, created_at, profiles(display_name)")
      .single();

    if (error) {
      console.error("Error updating comment:", error);
      return NextResponse.json({ error: "Failed to update comment" }, { status: 500 });
    }

    const comment = {
      id: data.id,
      userId: data.user_id,
      displayName: extractDisplayName(data.profiles as ProfileJoin),
      productId: data.product_id,
      parentId: data.parent_id,
      body: data.body,
      helpfulCount: data.helpful_count,
      createdAt: data.created_at,
    };

    return NextResponse.json({ comment });
  } catch (error) {
    console.error("Comments PUT error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE — Delete a comment (auth required, must be owner)
export async function DELETE(request: Request) {
  try {
    const supabase = await createSupabaseServer();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    // Verify ownership
    const { data: existing, error: fetchError } = await supabase
      .from("comments")
      .select("user_id")
      .eq("id", id)
      .single();

    if (fetchError || !existing) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }

    if (existing.user_id !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { error } = await supabase
      .from("comments")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting comment:", error);
      return NextResponse.json({ error: "Failed to delete comment" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Comments DELETE error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
