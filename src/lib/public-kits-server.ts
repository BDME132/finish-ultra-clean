import "server-only";

import type { PublicKit } from "@/lib/kit-types";
import { materializePublicKit, sortPublicKits, type PublicKitRow } from "@/lib/public-kits";
import { createSupabaseServer, hasSupabaseServerEnv } from "@/lib/supabase/server";

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

export async function loadPublicKitsServer(): Promise<PublicKit[]> {
  if (!hasSupabaseServerEnv()) {
    return [];
  }

  try {
    const supabase = await createSupabaseServer();
    const { data, error } = await supabase
      .from("public_kits")
      .select(PUBLIC_KIT_SELECT)
      .order("published_at", { ascending: false })
      .limit(200);

    if (error) {
      console.error("loadPublicKitsServer error:", error);
      return [];
    }

    return sortPublicKits(
      ((data ?? []) as unknown as PublicKitRow[]).map((row) => materializePublicKit(row)),
      "newest",
    );
  } catch (error) {
    console.error("loadPublicKitsServer route error:", error);
    return [];
  }
}

export async function loadPublicKitBySlugServer(slug: string): Promise<PublicKit | null> {
  if (!hasSupabaseServerEnv()) {
    return null;
  }

  try {
    const supabase = await createSupabaseServer();
    const { data, error } = await supabase
      .from("public_kits")
      .select(PUBLIC_KIT_SELECT)
      .eq("slug", slug)
      .maybeSingle();

    if (error || !data) {
      if (error) {
        console.error("loadPublicKitBySlugServer error:", error);
      }
      return null;
    }

    return materializePublicKit(data as unknown as PublicKitRow);
  } catch (error) {
    console.error("loadPublicKitBySlugServer route error:", error);
    return null;
  }
}
