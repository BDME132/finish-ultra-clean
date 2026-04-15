import { NextResponse } from "next/server";
import { SITE_URL } from "@/lib/schema";
import { getSupabase } from "@/lib/supabase";
import { verifyUnsubscribeToken } from "@/lib/unsubscribe-token";

const OK_REDIRECT = `${SITE_URL}/newsletter/unsubscribe?status=ok`;
const ERR_REDIRECT = `${SITE_URL}/newsletter/unsubscribe?status=error`;

async function performUnsubscribe(token: string | null): Promise<boolean> {
  if (!token) return false;

  const email = verifyUnsubscribeToken(token);
  if (!email) return false;

  const supabase = getSupabase();
  const now = new Date().toISOString();

  const { error: updateErr } = await supabase
    .from("email_signups")
    .update({ unsubscribed_at: now })
    .eq("email", email);

  if (updateErr) {
    console.error("Unsubscribe update:", updateErr);
    return false;
  }

  const { error: rpcErr } = await supabase.rpc("unsubscribe_profile_by_email", {
    p_email: email,
  });

  if (rpcErr) {
    console.error("unsubscribe_profile_by_email:", rpcErr);
  }

  return true;
}

export async function GET(request: Request): Promise<NextResponse> {
  const token = new URL(request.url).searchParams.get("token");
  const ok = await performUnsubscribe(token);
  return NextResponse.redirect(ok ? OK_REDIRECT : ERR_REDIRECT);
}

export async function POST(request: Request): Promise<NextResponse> {
  const contentType = request.headers.get("content-type") || "";
  if (contentType.includes("application/x-www-form-urlencoded")) {
    const body = await request.text();
    if (
      body.trim() &&
      !body.includes("List-Unsubscribe=One-Click")
    ) {
      return new NextResponse(null, { status: 400 });
    }
  }

  const token = new URL(request.url).searchParams.get("token");
  const ok = await performUnsubscribe(token);
  if (ok) {
    return new NextResponse(null, { status: 204 });
  }
  return new NextResponse(null, { status: 400 });
}
