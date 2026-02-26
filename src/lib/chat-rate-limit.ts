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
  isSubscribed: boolean
): Promise<RateLimitResult> {
  const supabase = getSupabase();
  const now = new Date();

  const { data: existing } = await supabase
    .from("chat_rate_limits")
    .select("message_count, window_start, is_subscribed")
    .eq("ip_address", ip)
    .single();

  if (!existing) {
    // First message from this IP
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
    // Reset their count when they subscribe — fresh start
    await supabase
      .from("chat_rate_limits")
      .update({
        is_subscribed: true,
        message_count: 0,
        window_start: now.toISOString(),
      })
      .eq("ip_address", ip);

    return {
      allowed: true,
      remaining: DAILY_LIMIT,
      resetAt: getMidnightUTC().toISOString(),
      requiresSignup: false,
    };
  }

  const effectiveSubscribed = isSubscribed || existing.is_subscribed;

  if (!effectiveSubscribed) {
    // Anonymous: hard cap at FREE_LIMIT, no reset
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
      .eq("ip_address", ip);

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
  const windowIsFromPreviousDay = windowStart < todayMidnight;

  if (windowIsFromPreviousDay) {
    // New day — reset count
    await supabase
      .from("chat_rate_limits")
      .update({
        message_count: 1,
        window_start: now.toISOString(),
      })
      .eq("ip_address", ip);

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
    .eq("ip_address", ip);

  return {
    allowed: true,
    remaining: DAILY_LIMIT - newCount,
    resetAt: getMidnightUTC().toISOString(),
    requiresSignup: false,
  };
}

/** Peek at rate limit status without incrementing the counter */
export async function peekChatRateLimit(
  ip: string,
  isSubscribed: boolean
): Promise<RateLimitResult> {
  const supabase = getSupabase();

  const { data: existing } = await supabase
    .from("chat_rate_limits")
    .select("message_count, window_start, is_subscribed")
    .eq("ip_address", ip)
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

  // Subscribed: check daily limit
  const windowStart = new Date(existing.window_start);
  const todayMidnight = getTodayMidnightUTC();

  if (windowStart < todayMidnight) {
    // New day — full allowance
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

/** Returns the start of today in UTC */
function getTodayMidnightUTC(): Date {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
}

/** Returns the next midnight UTC */
function getMidnightUTC(): Date {
  const now = new Date();
  return new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1)
  );
}
