import { NextResponse } from "next/server";
import { materializePublicKit, type PublicKitRow } from "@/lib/public-kits";
import { createSupabaseServer } from "@/lib/supabase/server";

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

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;
    const supabase = await createSupabaseServer();

    const { data, error } = await supabase
      .from("public_kits")
      .select(PUBLIC_KIT_SELECT)
      .eq("slug", slug)
      .maybeSingle();

    if (error) {
      console.error("Public kit detail GET error:", error);
      return NextResponse.json({ error: "Failed to load public kit" }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ error: "Public kit not found" }, { status: 404 });
    }

    return NextResponse.json({ kit: materializePublicKit(data as unknown as PublicKitRow) });
  } catch (error) {
    console.error("Public kit detail route error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
