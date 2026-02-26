import { streamText, convertToModelMessages } from "ai";
import { openai } from "@ai-sdk/openai";
import { NextRequest } from "next/server";
import { checkChatRateLimit, peekChatRateLimit } from "@/lib/chat-rate-limit";
import { getSupabase } from "@/lib/supabase";

async function resolveSubscription(req: NextRequest): Promise<boolean> {
  const subscriberEmail = req.cookies.get("chat_subscribed")?.value;
  if (!subscriberEmail) return false;

  const { data } = await getSupabase()
    .from("email_signups")
    .select("email")
    .eq("email", decodeURIComponent(subscriberEmail))
    .single();
  return !!data;
}

function getIP(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

/** GET /api/chat — returns remaining message count without incrementing */
export async function GET(req: NextRequest) {
  const ip = getIP(req);
  const isSubscribed = await resolveSubscription(req);
  const rateLimit = await peekChatRateLimit(ip, isSubscribed);

  return Response.json({
    remaining: rateLimit.remaining,
    resetAt: rateLimit.resetAt,
    requiresSignup: rateLimit.requiresSignup,
    allowed: rateLimit.allowed,
  });
}

/** POST /api/chat — send a chat message */
export async function POST(req: NextRequest) {
  const ip = getIP(req);
  const isSubscribed = await resolveSubscription(req);
  const rateLimit = await checkChatRateLimit(ip, isSubscribed);

  if (!rateLimit.allowed) {
    return Response.json(
      {
        error: rateLimit.requiresSignup
          ? "signup_required"
          : "daily_limit_reached",
        remaining: 0,
        resetAt: rateLimit.resetAt,
      },
      { status: 429 }
    );
  }

  const { messages } = await req.json();

  const result = streamText({
    model: openai("gpt-4o-mini"),
    system: `You are the FinishUltra Coach, an AI assistant for beginner ultra runners. You help with training plans, gear selection, nutrition strategy, and race day preparation.

Guidelines:
- Be encouraging but honest. Ultra running is hard, and beginners deserve straight talk.
- Give specific, actionable advice — not vague encouragement.
- When relevant, reference FinishUltra resources: the First 50K training plan (/training/first-50k), gear guides (/gear), and blog posts (/blog).
- Keep responses concise (2-3 paragraphs max). Beginners get overwhelmed by walls of text.
- If someone asks about medical issues or injuries, remind them to see a doctor — you're a coach, not a medical professional.
- You know about popular ultra running gear (Hoka, Salomon, Tailwind, etc.) and can make specific recommendations.`,
    messages: await convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
}
