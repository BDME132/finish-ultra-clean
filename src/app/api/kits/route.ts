import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";
import type { PublicShare, SavedKit } from "@/lib/kit-types";
import { toPublicShare } from "@/lib/public-kits";

type SavedKitRow = {
  id: string;
  kit_id: string;
  kit_data: SavedKit;
  created_at: string;
  updated_at: string;
  status: SavedKit["status"];
};

type PublicShareRow = {
  source_kit_id: string;
  slug: string;
  published_at: string;
  updated_at: string;
};

const SAVED_KIT_SELECT = "id, kit_id, kit_data, created_at, updated_at, status";

function normalizedKitStatus(status?: SavedKit["status"]): SavedKit["status"] {
  if (status === "complete" || status === "archived") return status;
  return "active";
}

function materializeKit(row: SavedKitRow, publicShare: PublicShare | null = null): SavedKit {
  return {
    ...row.kit_data,
    status: row.status,
    publicShare,
  };
}

async function loadPublicShareMap(
  supabase: Awaited<ReturnType<typeof createSupabaseServer>>,
  userId: string,
  kitIds: string[],
): Promise<Map<string, PublicShare>> {
  if (kitIds.length === 0) return new Map();

  const { data } = await supabase
    .from("public_kits")
    .select("source_kit_id, slug, published_at, updated_at")
    .eq("user_id", userId)
    .in("source_kit_id", kitIds);

  return new Map(
    ((data ?? []) as PublicShareRow[]).map((row) => [
      row.source_kit_id,
      toPublicShare(row),
    ]),
  );
}

async function loadPublicShareForKit(
  supabase: Awaited<ReturnType<typeof createSupabaseServer>>,
  userId: string,
  kitId: string,
): Promise<PublicShare | null> {
  const publicShareMap = await loadPublicShareMap(supabase, userId, [kitId]);
  return publicShareMap.get(kitId) ?? null;
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
        .select(SAVED_KIT_SELECT)
        .eq("user_id", user.id)
        .eq("kit_id", kitId)
        .single();

      if (error) {
        return NextResponse.json({ kit: null });
      }

      const publicShare = await loadPublicShareForKit(supabase, user.id, kitId);
      return NextResponse.json({ kit: materializeKit(data as SavedKitRow, publicShare) });
    }

    if (scope === "active") {
      let activeRow: SavedKitRow | null = null;

      const { data: activeData } = await supabase
        .from("saved_kits")
        .select(SAVED_KIT_SELECT)
        .eq("user_id", user.id)
        .eq("status", "active")
        .order("updated_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      activeRow = (activeData as SavedKitRow | null) ?? null;

      if (!activeRow) {
        const { data: latestData } = await supabase
          .from("saved_kits")
          .select(SAVED_KIT_SELECT)
          .eq("user_id", user.id)
          .order("updated_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        activeRow = (latestData as SavedKitRow | null) ?? null;
      }

      if (!activeRow) {
        return NextResponse.json({ kit: null });
      }

      const publicShare = await loadPublicShareForKit(supabase, user.id, activeRow.kit_id);
      return NextResponse.json({ kit: materializeKit(activeRow, publicShare) });
    }

    const { data, error } = await supabase
      .from("saved_kits")
      .select(SAVED_KIT_SELECT)
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false });

    if (error) {
      console.error("Error loading kits:", error);
      return NextResponse.json({ error: "Failed to load kits" }, { status: 500 });
    }

    const rows = (data ?? []) as SavedKitRow[];
    const publicShareMap = await loadPublicShareMap(
      supabase,
      user.id,
      rows.map((row) => row.kit_id),
    );
    const kits = rows.map((row) => materializeKit(row, publicShareMap.get(row.kit_id) ?? null));
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

    await supabase
      .from("public_kits")
      .delete()
      .eq("user_id", user.id)
      .eq("source_kit_id", kitId);

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
