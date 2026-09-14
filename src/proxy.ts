import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy-session";

/**
 * Gates /admin behind a real signed-in session with app_metadata.role === "admin"
 * (never user_metadata -- that's user-editable). Replaces the earlier Basic Auth
 * stopgap -- see requirements/AUDIT.md #4.
 *
 * Scoped to /admin only: no other route uses Supabase auth yet, and running the
 * session-refresh call site-wide would throw on every request (including the
 * public marketplace and referral pages) until real Supabase env vars exist --
 * confirmed by a live dev-server check before this was scoped down.
 */
export async function proxy(request: NextRequest) {
  const isLoginRoute = request.nextUrl.pathname === "/admin/login";
  if (isLoginRoute) return NextResponse.next();

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) {
    // Fail closed: no Supabase project configured yet means /admin stays locked, not open.
    return new NextResponse("Admin access is not configured", { status: 503 });
  }

  const { response, claims } = await updateSession(request);
  const role = (claims?.app_metadata as { role?: string } | undefined)?.role;

  if (!claims || role !== "admin") {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    url.searchParams.set("next", request.nextUrl.pathname);
    // Copy the refreshed-session cookies from updateSession()'s response onto the
    // redirect -- a bare NextResponse.redirect() carries none of its own, so a
    // signed-in-but-non-admin user's just-refreshed session cookie would otherwise
    // be silently dropped. Found by /strix audit (2026-09-10).
    const redirectResponse = NextResponse.redirect(url);
    response.cookies.getAll().forEach((cookie) => redirectResponse.cookies.set(cookie));
    return redirectResponse;
  }

  return response;
}

export const config = {
  matcher: "/admin/:path*",
};
