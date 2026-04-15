import { getSupabase } from "@/lib/supabase";

const WINDOW_MS = 60 * 1000;
const MAX_REQUESTS = 5;

export async function isEmailSignupRateLimited(ip: string): Promise<boolean> {
  if (ip === "unknown") {
    return false;
  }

  const supabase = getSupabase();
  const now = new Date();

  const { data: row, error } = await supabase
    .from("email_signup_rate_limits")
    .select("window_start, request_count")
    .eq("ip", ip)
    .maybeSingle();

  if (error) {
    console.error("email_signup_rate_limits read:", error);
    return false;
  }

  if (!row) {
    const { error: insErr } = await supabase.from("email_signup_rate_limits").insert({
      ip,
      window_start: now.toISOString(),
      request_count: 1,
    });
    if (insErr) {
      console.error("email_signup_rate_limits insert:", insErr);
    }
    return false;
  }

  const windowStart = new Date(row.window_start).getTime();
  if (now.getTime() - windowStart > WINDOW_MS) {
    await supabase
      .from("email_signup_rate_limits")
      .update({
        window_start: now.toISOString(),
        request_count: 1,
      })
      .eq("ip", ip);
    return false;
  }

  if (row.request_count >= MAX_REQUESTS) {
    return true;
  }

  await supabase
    .from("email_signup_rate_limits")
    .update({ request_count: row.request_count + 1 })
    .eq("ip", ip);

  return false;
}
