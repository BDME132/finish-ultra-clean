import { getSupabasePublic, hasSupabasePublicEnv } from "@/lib/supabase";

export interface PublishedNewsletterRow {
  id: string;
  subject: string;
  slug: string | null;
  published_at: string | null;
  body: string | null;
}

export async function loadPublishedNewsletters(): Promise<PublishedNewsletterRow[]> {
  if (!hasSupabasePublicEnv()) {
    return [];
  }

  const supabase = getSupabasePublic();
  const { data, error } = await supabase
    .from("newsletters")
    .select("id, subject, slug, published_at, body")
    .order("published_at", { ascending: false });

  if (error) {
    console.error("loadPublishedNewsletters:", error);
    return [];
  }

  return (data as PublishedNewsletterRow[]) ?? [];
}

export async function loadPublishedNewsletterBySlug(
  slug: string
): Promise<PublishedNewsletterRow | null> {
  if (!hasSupabasePublicEnv() || !slug) {
    return null;
  }

  const supabase = getSupabasePublic();
  const { data, error } = await supabase
    .from("newsletters")
    .select("id, subject, slug, published_at, body")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    console.error("loadPublishedNewsletterBySlug:", error);
    return null;
  }

  return data as PublishedNewsletterRow | null;
}
