import { getSupabase } from "./supabase";

/**
 * Anonymous Stripe checkouts land in `pending_pro_emails` keyed by the email
 * the customer entered at checkout. When that user later signs up (or first
 * visits /pheidi while logged in without is_pro), we match by email and flip
 * their profile to pro.
 *
 * Returns true if the caller's profile was just upgraded (UI can show a toast).
 */
export async function claimPendingPro(
  userId: string,
  email: string | null | undefined,
): Promise<boolean> {
  if (!email) return false;
  const supabase = getSupabase();
  const normalized = email.toLowerCase();

  const { data: pending, error: pendingErr } = await supabase
    .from("pending_pro_emails")
    .select("email")
    .eq("email", normalized)
    .maybeSingle();

  if (pendingErr) {
    console.error("[claim-pending-pro] lookup failed:", pendingErr);
    return false;
  }
  if (!pending) return false;

  const { error: upsertErr } = await supabase
    .from("profiles")
    .upsert({ id: userId, is_pro: true }, { onConflict: "id" });

  if (upsertErr) {
    console.error("[claim-pending-pro] profile upsert failed:", upsertErr);
    return false;
  }

  await supabase.from("pending_pro_emails").delete().eq("email", normalized);
  return true;
}
