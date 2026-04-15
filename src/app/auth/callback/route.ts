import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServer, hasSupabaseServerEnv } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (!hasSupabaseServerEnv()) {
    return NextResponse.redirect(
      new URL("/login?error=supabase_not_configured", request.url)
    );
  }

  if (code) {
    const supabase = await createSupabaseServer();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      // Link any existing email_signups row to this account by email match
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email) {
        await supabase
          .from("email_signups")
          .update({ user_id: user.id })
          .eq("email", user.email.toLowerCase())
          .is("user_id", null);
      }
      return NextResponse.redirect(new URL(next, request.url));
    }
  }

  return NextResponse.redirect(
    new URL("/login?error=auth_callback_failed", request.url)
  );
}
