import { getSupabase } from "./supabase";

const FREE_LIMIT = 5; // messages before signup required
const DAILY_LIMIT = 30; // messages per day after signup

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: string | null; // ISO timestamp, null if no reset (anonymous limit)
  requiresSignup: boolean;
}

export async function checkChatRateLimit(
  ip: string,
  isSubscribed: boolean,
  userId?: string
): Promise<RateLimitResult> {
  // Logged-in users get tracked by user_id and always get the subscribed tier
  if (userId) {
    return checkUserRateLimit(userId);
  }

  return checkIpRateLimit(ip, isSubscribed);
}

/** Peek at rate limit status without incrementing the counter */
export async function peekChatRateLimit(
  ip: string,
  isSubscribed: boolean,
  userId?: string
): Promise<RateLimitResult> {
  if (userId) {
    return peekUserRateLimit(userId);
  }

  return peekIpRateLimit(ip, isSubscribed);
}

// ─── User-based rate limiting (logged-in users) ─────────────────────────────

async function checkUserRateLimit(userId: string): Promise<RateLimitResult> {
  const supabase = getSupabase();
  const now = new Date();

  const { data: existing } = await supabase
    .from("chat_rate_limits")
    .select("message_count, window_start")
    .eq("user_id", userId)
    .single();

  if (!existing) {
    await supabase.from("chat_rate_limits").insert({
      ip_address: `user:${userId}`,
      user_id: userId,
      message_count: 1,
      window_start: now.toISOString(),
      is_subscribed: true,
    });

    return {
      allowed: true,
      remaining: DAILY_LIMIT - 1,
      resetAt: getMidnightUTC().toISOString(),
      requiresSignup: false,
    };
  }

  const windowStart = new Date(existing.window_start);
  const todayMidnight = getTodayMidnightUTC();

  if (windowStart < todayMidnight) {
    await supabase
      .from("chat_rate_limits")
      .update({ message_count: 1, window_start: now.toISOString() })
      .eq("user_id", userId);

    return {
      allowed: true,
      remaining: DAILY_LIMIT - 1,
      resetAt: getMidnightUTC().toISOString(),
      requiresSignup: false,
    };
  }

  if (existing.message_count >= DAILY_LIMIT) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: getMidnightUTC().toISOString(),
      requiresSignup: false,
    };
  }

  const newCount = existing.message_count + 1;
  await supabase
    .from("chat_rate_limits")
    .update({ message_count: newCount })
    .eq("user_id", userId);

  return {
    allowed: true,
    remaining: DAILY_LIMIT - newCount,
    resetAt: getMidnightUTC().toISOString(),
    requiresSignup: false,
  };
}

async function peekUserRateLimit(userId: string): Promise<RateLimitResult> {
  const supabase = getSupabase();

  const { data: existing } = await supabase
    .from("chat_rate_limits")
    .select("message_count, window_start")
    .eq("user_id", userId)
    .single();

  if (!existing) {
    return {
      allowed: true,
      remaining: DAILY_LIMIT,
      resetAt: null,
      requiresSignup: false,
    };
  }

  const windowStart = new Date(existing.window_start);
  const todayMidnight = getTodayMidnightUTC();

  if (windowStart < todayMidnight) {
    return {
      allowed: true,
      remaining: DAILY_LIMIT,
      resetAt: getMidnightUTC().toISOString(),
      requiresSignup: false,
    };
  }

  const remaining = Math.max(0, DAILY_LIMIT - existing.message_count);
  return {
    allowed: remaining > 0,
    remaining,
    resetAt: getMidnightUTC().toISOString(),
    requiresSignup: false,
  };
}

// ─── IP-based rate limiting (anonymous users) ────────────────────────────────

async function checkIpRateLimit(
  ip: string,
  isSubscribed: boolean
): Promise<RateLimitResult> {
  const supabase = getSupabase();
  const now = new Date();

  const { data: existing } = await supabase
    .from("chat_rate_limits")
    .select("message_count, window_start, is_subscribed")
    .eq("ip_address", ip)
    .is("user_id", null)
    .single();

  if (!existing) {
    await supabase.from("chat_rate_limits").insert({
      ip_address: ip,
      message_count: 1,
      window_start: now.toISOString(),
      is_subscribed: isSubscribed,
    });

    const limit = isSubscribed ? DAILY_LIMIT : FREE_LIMIT;
    return {
      allowed: true,
      remaining: limit - 1,
      resetAt: isSubscribed ? getMidnightUTC().toISOString() : null,
      requiresSignup: false,
    };
  }

  // Update subscription status if newly subscribed
  if (isSubscribed && !existing.is_subscribed) {
    await supabase
      .from("chat_rate_limits")
      .update({
        is_subscribed: true,
        message_count: 0,
        window_start: now.toISOString(),
      })
      .eq("ip_address", ip)
      .is("user_id", null);

    return {
      allowed: true,
      remaining: DAILY_LIMIT,
      resetAt: getMidnightUTC().toISOString(),
      requiresSignup: false,
    };
  }

  const effectiveSubscribed = isSubscribed || existing.is_subscribed;

  if (!effectiveSubscribed) {
    if (existing.message_count >= FREE_LIMIT) {
      return {
        allowed: false,
        remaining: 0,
        resetAt: null,
        requiresSignup: true,
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

  // Subscribed: 30 per calendar day (UTC)
  const windowStart = new Date(existing.window_start);
  const todayMidnight = getTodayMidnightUTC();

  if (windowStart < todayMidnight) {
    await supabase
      .from("chat_rate_limits")
      .update({ message_count: 1, window_start: now.toISOString() })
      .eq("ip_address", ip)
      .is("user_id", null);

    return {
      allowed: true,
      remaining: DAILY_LIMIT - 1,
      resetAt: getMidnightUTC().toISOString(),
      requiresSignup: false,
    };
  }

  if (existing.message_count >= DAILY_LIMIT) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: getMidnightUTC().toISOString(),
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
    remaining: DAILY_LIMIT - newCount,
    resetAt: getMidnightUTC().toISOString(),
    requiresSignup: false,
  };
}

async function peekIpRateLimit(
  ip: string,
  isSubscribed: boolean
): Promise<RateLimitResult> {
  const supabase = getSupabase();

  const { data: existing } = await supabase
    .from("chat_rate_limits")
    .select("message_count, window_start, is_subscribed")
    .eq("ip_address", ip)
    .is("user_id", null)
    .single();

  if (!existing) {
    const limit = isSubscribed ? DAILY_LIMIT : FREE_LIMIT;
    return { allowed: true, remaining: limit, resetAt: null, requiresSignup: false };
  }

  const effectiveSubscribed = isSubscribed || existing.is_subscribed;

  if (!effectiveSubscribed) {
    const remaining = Math.max(0, FREE_LIMIT - existing.message_count);
    return {
      allowed: remaining > 0,
      remaining,
      resetAt: null,
      requiresSignup: remaining === 0,
    };
  }

  const windowStart = new Date(existing.window_start);
  const todayMidnight = getTodayMidnightUTC();

  if (windowStart < todayMidnight) {
    return {
      allowed: true,
      remaining: DAILY_LIMIT,
      resetAt: getMidnightUTC().toISOString(),
      requiresSignup: false,
    };
  }

  const remaining = Math.max(0, DAILY_LIMIT - existing.message_count);
  return {
    allowed: remaining > 0,
    remaining,
    resetAt: getMidnightUTC().toISOString(),
    requiresSignup: false,
  };
}

// ─── Utilities ───────────────────────────────────────────────────────────────

function getTodayMidnightUTC(): Date {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
}

function getMidnightUTC(): Date {
  const now = new Date();
  return new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1)
  );
}
