import type { SupabaseClient } from "@supabase/supabase-js";

export function slugifyNewsletter(input: string): string {
  const s = input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 96);
  return s || "newsletter";
}

export async function uniqueNewsletterSlug(
  supabase: SupabaseClient,
  base: string
): Promise<string> {
  const slugBase = slugifyNewsletter(base);
  for (let n = 0; n < 50; n++) {
    const candidate = n === 0 ? slugBase : `${slugBase}-${n}`;
    const { data } = await supabase
      .from("newsletters")
      .select("id")
      .eq("slug", candidate)
      .maybeSingle();
    if (!data) return candidate;
  }
  return `${slugBase}-${Date.now()}`;
}
