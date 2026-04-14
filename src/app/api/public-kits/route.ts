import { NextResponse } from "next/server";
import type { SavedKit } from "@/lib/kit-types";
import {
  buildPublicKitSnapshot,
  filterPublicKits,
  getPublicAuthorName,
  materializePublicKit,
  sanitizePublicKitItems,
  slugifyKitTitle,
  sortPublicKits,
  toPublicShare,
  type PublicKitRow,
} from "@/lib/public-kits";
import { createSupabaseServer } from "@/lib/supabase/server";

type SavedKitRow = {
  kit_id: string;
  kit_data: SavedKit;
};

type ProfileRow = {
  display_name: string | null;
};

const PUBLIC_KIT_SELECT = [
  "id",
  "source_kit_id",
  "slug",
  "author_display_name",
  "kit_title",
  "kit_subtitle",
  "race_details",
  "items",
  "packing_checklist",
  "drop_bag_essentials",
  "testing_timeline",
  "total_cost",
  "preset_id",
  "published_at",
  "updated_at",
].join(", ");

async function buildUniqueSlug(
  supabase: Awaited<ReturnType<typeof createSupabaseServer>>,
  kitTitle: string,
): Promise<string> {
  const base = slugifyKitTitle(kitTitle);

  for (let attempt = 0; attempt < 12; attempt += 1) {
    const suffix = Math.random().toString(36).slice(2, 6);
    const candidate = `${base}-${suffix}`;
    const { data } = await supabase
      .from("public_kits")
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
    const terrain = searchParams.get("terrain") ?? undefined;
    const budget = searchParams.get("budget") ?? undefined;
    const sort = (searchParams.get("sort") as "newest" | "updated" | "lowest-cost" | "highest-cost" | null) ?? "newest";

    const { data, error } = await supabase
      .from("public_kits")
      .select(PUBLIC_KIT_SELECT)
      .order("published_at", { ascending: false })
      .limit(200);

    if (error) {
      console.error("Public kits GET error:", error);
      return NextResponse.json({ error: "Failed to load public kits" }, { status: 500 });
    }

    const kits = sortPublicKits(
      filterPublicKits(
        ((data ?? []) as unknown as PublicKitRow[]).map((row) => materializePublicKit(row)),
        { distance, terrain, budget, sort },
      ),
      sort,
    );

    return NextResponse.json({ kits });
  } catch (error) {
    console.error("Public kits GET route error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

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

    const body = await request.json();
    const kitId = typeof body.kitId === "string" ? body.kitId : "";

    if (!kitId) {
      return NextResponse.json({ error: "Missing kitId" }, { status: 400 });
    }

    const { data: savedKitData, error: savedKitError } = await supabase
      .from("saved_kits")
      .select("kit_id, kit_data")
      .eq("user_id", user.id)
      .eq("kit_id", kitId)
      .maybeSingle();

    if (savedKitError || !savedKitData) {
      return NextResponse.json({ error: "Saved kit not found" }, { status: 404 });
    }

    const savedKitRow = savedKitData as SavedKitRow;
    const savedKit = savedKitRow.kit_data;
    const now = new Date().toISOString();

    const [{ data: existingData }, { data: profileData }] = await Promise.all([
      supabase
        .from("public_kits")
        .select(PUBLIC_KIT_SELECT)
        .eq("user_id", user.id)
        .eq("source_kit_id", kitId)
        .maybeSingle(),
      supabase
        .from("profiles")
        .select("display_name")
        .eq("id", user.id)
        .maybeSingle(),
    ]);

    const existing = (existingData as unknown as PublicKitRow | null) ?? null;
    const authorDisplayName = getPublicAuthorName((profileData as ProfileRow | null)?.display_name);
    const slug = existing?.slug ?? await buildUniqueSlug(supabase, savedKit.kitTitle);
    const publishedAt = existing?.published_at ?? now;

    const payload = {
      user_id: user.id,
      source_kit_id: kitId,
      slug,
      author_display_name: authorDisplayName,
      kit_title: savedKit.kitTitle,
      kit_subtitle: savedKit.kitSubtitle,
      race_details: savedKit.raceDetails,
      items: sanitizePublicKitItems(savedKit.items),
      packing_checklist: savedKit.packingChecklist,
      drop_bag_essentials: savedKit.dropBagEssentials,
      testing_timeline: savedKit.testingTimeline,
      total_cost: savedKit.totalCost,
      preset_id: savedKit.presetId ?? null,
      published_at: publishedAt,
      updated_at: now,
    };

    const writeQuery = existing
      ? supabase
          .from("public_kits")
          .update(payload)
          .eq("id", existing.id)
          .select(PUBLIC_KIT_SELECT)
          .single()
      : supabase
          .from("public_kits")
          .insert(payload)
          .select(PUBLIC_KIT_SELECT)
          .single();

    const { data, error } = await writeQuery;

    if (error || !data) {
      console.error("Public kits POST error:", error);
      return NextResponse.json({ error: "Failed to publish kit" }, { status: 500 });
    }

    const publicRow = data as unknown as PublicKitRow;
    return NextResponse.json({
      success: true,
      kit: buildPublicKitSnapshot({
        savedKit,
        authorDisplayName,
        slug: publicRow.slug,
        publicId: publicRow.id,
        publishedAt: publicRow.published_at,
        updatedAt: publicRow.updated_at,
      }),
      publicShare: toPublicShare(publicRow),
    });
  } catch (error) {
    console.error("Public kits POST route error:", error);
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

    const { searchParams } = new URL(request.url);
    const kitId = searchParams.get("kitId");

    if (!kitId) {
      return NextResponse.json({ error: "Missing kitId" }, { status: 400 });
    }

    const { error } = await supabase
      .from("public_kits")
      .delete()
      .eq("user_id", user.id)
      .eq("source_kit_id", kitId);

    if (error) {
      console.error("Public kits DELETE error:", error);
      return NextResponse.json({ error: "Failed to unpublish kit" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Public kits DELETE route error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
