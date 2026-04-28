import { getSupabase } from "./supabase";

const FREE_LIMIT = 5; // lifetime free messages — never resets, upgrade to pro for more

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: string | null;
  requiresSignup: boolean;
}

export async function checkChatRateLimit(
  ip: string,
  userId?: string
): Promise<RateLimitResult> {
  if (userId) {
    return checkUserRateLimit(userId);
  }
  return checkIpRateLimit(ip);
}

export async function peekChatRateLimit(
  ip: string,
  userId?: string
): Promise<RateLimitResult> {
  if (userId) {
    return peekUserRateLimit(userId);
  }
  return peekIpRateLimit(ip);
}

// ─── User-based rate limiting (logged-in non-pro users) ──────────────────────

async function checkUserRateLimit(userId: string): Promise<RateLimitResult> {
  const supabase = getSupabase();
  const now = new Date();

  const { data: existing } = await supabase
    .from("chat_rate_limits")
    .select("message_count")
    .eq("user_id", userId)
    .single();

  if (!existing) {
    await supabase.from("chat_rate_limits").insert({
      ip_address: `user:${userId}`,
      user_id: userId,
      message_count: 1,
      window_start: now.toISOString(),
      is_subscribed: false,
    });
    return { allowed: true, remaining: FREE_LIMIT - 1, resetAt: null, requiresSignup: false };
  }

  if (existing.message_count >= FREE_LIMIT) {
    return { allowed: false, remaining: 0, resetAt: null, requiresSignup: false };
  }

  const newCount = existing.message_count + 1;
  await supabase
    .from("chat_rate_limits")
    .update({ message_count: newCount })
    .eq("user_id", userId);

  return { allowed: true, remaining: FREE_LIMIT - newCount, resetAt: null, requiresSignup: false };
}

async function peekUserRateLimit(userId: string): Promise<RateLimitResult> {
  const supabase = getSupabase();

  const { data: existing } = await supabase
    .from("chat_rate_limits")
    .select("message_count")
    .eq("user_id", userId)
    .single();

  if (!existing) {
    return { allowed: true, remaining: FREE_LIMIT, resetAt: null, requiresSignup: false };
  }

  const remaining = Math.max(0, FREE_LIMIT - existing.message_count);
  return { allowed: remaining > 0, remaining, resetAt: null, requiresSignup: false };
}

// ─── IP-based rate limiting (anonymous users) ────────────────────────────────

async function checkIpRateLimit(ip: string): Promise<RateLimitResult> {
  const supabase = getSupabase();
  const now = new Date();

  const { data: existing } = await supabase
    .from("chat_rate_limits")
    .select("message_count")
    .eq("ip_address", ip)
    .is("user_id", null)
    .single();

  if (!existing) {
    await supabase.from("chat_rate_limits").insert({
      ip_address: ip,
      message_count: 1,
      window_start: now.toISOString(),
      is_subscribed: false,
    });

    return {
      allowed: true,
      remaining: FREE_LIMIT - 1,
      resetAt: null,
      requiresSignup: false,
    };
  }

  if (existing.message_count >= FREE_LIMIT) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: null,
      requiresSignup: false,
    };
  }

  const newCount = existing.message_count + 1;
  await supabase
    .from("chat_rate_limits")
    .update({ message_count: newCount })
    .eq("ip_address", ip)
    .is("user_id", null);

  return {
    allowed: true,
    remaining: FREE_LIMIT - newCount,
    resetAt: null,
    requiresSignup: false,
  };
}

async function peekIpRateLimit(ip: string): Promise<RateLimitResult> {
  const supabase = getSupabase();

  const { data: existing } = await supabase
    .from("chat_rate_limits")
    .select("message_count")
    .eq("ip_address", ip)
    .is("user_id", null)
    .single();

  if (!existing) {
    return { allowed: true, remaining: FREE_LIMIT, resetAt: null, requiresSignup: false };
  }

  const remaining = Math.max(0, FREE_LIMIT - existing.message_count);
  return {
    allowed: remaining > 0,
    remaining,
    resetAt: null,
    requiresSignup: false,
  };
}
