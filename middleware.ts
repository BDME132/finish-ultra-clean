import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseMiddleware } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  const { supabase, response } = createSupabaseMiddleware(request);

  if (!supabase) {
    return response;
  }

  // Refresh the auth session on every request (standard @supabase/ssr pattern).
  // This keeps the session alive by exchanging expired JWTs for fresh ones.
  await supabase.auth.getUser();

  // --- Admin route protection (existing logic) ---
  if (request.nextUrl.pathname === "/api/admin/auth") {
    return response;
  }

  if (
    request.nextUrl.pathname.startsWith("/admin") ||
    request.nextUrl.pathname.startsWith("/api/admin")
  ) {
    const adminSession = request.cookies.get("admin_session")?.value;

    if (!adminSession && request.nextUrl.pathname.startsWith("/api/admin")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  // --- Protected routes (require login) ---
  const { data: { user } } = await supabase.auth.getUser();
  if (
    (request.nextUrl.pathname.startsWith("/account") ||
      request.nextUrl.pathname.startsWith("/race-hq")) &&
    !user
  ) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    // Match all routes except static files and images
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
