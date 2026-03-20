import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";
import type { SavedKit } from "@/lib/kit-types";

// GET — Load all kits for the authenticated user
export async function GET() {
  try {
    const supabase = await createSupabaseServer();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabase
      .from("saved_kits")
      .select("id, kit_data, created_at, updated_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error loading kits:", error);
      return NextResponse.json({ error: "Failed to load kits" }, { status: 500 });
    }

    const kits = (data ?? []).map((row) => row.kit_data as SavedKit);
    return NextResponse.json({ kits });
  } catch (error) {
    console.error("Kits GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST — Save a new kit
export async function POST(request: Request) {
  try {
    const supabase = await createSupabaseServer();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const kit: SavedKit = body.kit;

    if (!kit || !kit.kitId || !kit.items?.length) {
      return NextResponse.json({ error: "Invalid kit data" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("saved_kits")
      .insert({
        user_id: user.id,
        kit_id: kit.kitId,
        kit_data: kit,
        kit_title: kit.kitTitle || "Untitled Kit",
        distance: kit.raceDetails?.distance || null,
        total_cost: kit.totalCost,
        status: kit.status || "active",
      })
      .select("id")
      .single();

    if (error) {
      console.error("Error saving kit:", error);
      return NextResponse.json({ error: "Failed to save kit" }, { status: 500 });
    }

    return NextResponse.json({ success: true, id: data.id, kitId: kit.kitId });
  } catch (error) {
    console.error("Kits POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PUT — Update an existing kit
export async function PUT(request: Request) {
  try {
    const supabase = await createSupabaseServer();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const kit: SavedKit = body.kit;

    if (!kit || !kit.kitId) {
      return NextResponse.json({ error: "Invalid kit data" }, { status: 400 });
    }

    const { error } = await supabase
      .from("saved_kits")
      .update({
        kit_data: kit,
        kit_title: kit.kitTitle || "Untitled Kit",
        total_cost: kit.totalCost,
        status: kit.status || "active",
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", user.id)
      .eq("kit_id", kit.kitId);

    if (error) {
      console.error("Error updating kit:", error);
      return NextResponse.json({ error: "Failed to update kit" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Kits PUT error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE — Delete a kit
export async function DELETE(request: Request) {
  try {
    const supabase = await createSupabaseServer();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const kitId = searchParams.get("kitId");

    if (!kitId) {
      return NextResponse.json({ error: "Missing kitId" }, { status: 400 });
    }

    const { error } = await supabase
      .from("saved_kits")
      .delete()
      .eq("user_id", user.id)
      .eq("kit_id", kitId);

    if (error) {
      console.error("Error deleting kit:", error);
      return NextResponse.json({ error: "Failed to delete kit" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Kits DELETE error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
