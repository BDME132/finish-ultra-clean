import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";
import type { SavedKit } from "@/lib/kit-types";

type SavedKitRow = {
  id: string;
  kit_id: string;
  kit_data: SavedKit;
  created_at: string;
  updated_at: string;
  status: SavedKit["status"];
};

function normalizedKitStatus(status?: SavedKit["status"]): SavedKit["status"] {
  if (status === "complete" || status === "archived") return status;
  return "active";
}

function materializeKit(row: SavedKitRow): SavedKit {
  return {
    ...row.kit_data,
    status: row.status,
  };
}

// GET — Load all kits for the authenticated user
export async function GET(request: Request) {
  try {
    const supabase = await createSupabaseServer();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const kitId = searchParams.get("kitId");
    const scope = searchParams.get("scope");

    if (kitId) {
      const { data, error } = await supabase
        .from("saved_kits")
        .select("id, kit_id, kit_data, created_at, updated_at, status")
        .eq("user_id", user.id)
        .eq("kit_id", kitId)
        .single();

      if (error) {
        return NextResponse.json({ kit: null });
      }

      return NextResponse.json({ kit: materializeKit(data as SavedKitRow) });
    }

    if (scope === "active") {
      let activeRow: SavedKitRow | null = null;

      const { data: activeData } = await supabase
        .from("saved_kits")
        .select("id, kit_id, kit_data, created_at, updated_at, status")
        .eq("user_id", user.id)
        .eq("status", "active")
        .order("updated_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      activeRow = (activeData as SavedKitRow | null) ?? null;

      if (!activeRow) {
        const { data: latestData } = await supabase
          .from("saved_kits")
          .select("id, kit_id, kit_data, created_at, updated_at, status")
          .eq("user_id", user.id)
          .order("updated_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        activeRow = (latestData as SavedKitRow | null) ?? null;
      }

      return NextResponse.json({ kit: activeRow ? materializeKit(activeRow) : null });
    }

    const { data, error } = await supabase
      .from("saved_kits")
      .select("id, kit_id, kit_data, created_at, updated_at, status")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false });

    if (error) {
      console.error("Error loading kits:", error);
      return NextResponse.json({ error: "Failed to load kits" }, { status: 500 });
    }

    const kits = (data ?? []).map((row) => materializeKit(row as SavedKitRow));
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

    const kitToSave: SavedKit = {
      ...kit,
      status: normalizedKitStatus(kit.status),
    };

    if (kitToSave.status === "active") {
      await supabase
        .from("saved_kits")
        .update({ status: "archived" })
        .eq("user_id", user.id)
        .eq("status", "active");
    }

    const { data, error } = await supabase
      .from("saved_kits")
      .insert({
        user_id: user.id,
        kit_id: kitToSave.kitId,
        kit_data: kitToSave,
        kit_title: kitToSave.kitTitle || "Untitled Kit",
        distance: kitToSave.raceDetails?.distance || null,
        total_cost: kitToSave.totalCost,
        status: kitToSave.status,
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

    const kitToSave: SavedKit = {
      ...kit,
      status: normalizedKitStatus(kit.status),
    };

    if (kitToSave.status === "active") {
      await supabase
        .from("saved_kits")
        .update({ status: "archived" })
        .eq("user_id", user.id)
        .eq("status", "active")
        .neq("kit_id", kitToSave.kitId);
    }

    const { error } = await supabase
      .from("saved_kits")
      .update({
        kit_data: kitToSave,
        kit_title: kitToSave.kitTitle || "Untitled Kit",
        total_cost: kitToSave.totalCost,
        status: kitToSave.status,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", user.id)
      .eq("kit_id", kitToSave.kitId);

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

    const { data: remaining } = await supabase
      .from("saved_kits")
      .select("kit_id, status")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false });

    const hasActive = (remaining ?? []).some((row) => row.status === "active");
    const latestRemaining = remaining?.[0];

    if (!hasActive && latestRemaining) {
      await supabase
        .from("saved_kits")
        .update({ status: "active" })
        .eq("user_id", user.id)
        .eq("kit_id", latestRemaining.kit_id);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Kits DELETE error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
