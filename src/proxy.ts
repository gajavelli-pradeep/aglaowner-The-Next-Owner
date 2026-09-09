import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * ponytail: Basic Auth stopgap until Supabase admin-role auth is wired up.
 * Blocks anonymous access to /admin — see requirements/AUDIT.md finding #4.
 * Upgrade path: replace with a Supabase session check once auth exists.
 */
export function proxy(request: NextRequest) {
  const user = process.env.ADMIN_BASIC_AUTH_USER;
  const pass = process.env.ADMIN_BASIC_AUTH_PASS;

  if (!user || !pass) {
    // Fail closed: no credentials configured means /admin stays locked, not open.
    return new NextResponse("Admin access is not configured", { status: 503 });
  }

  const auth = request.headers.get("authorization");
  if (auth) {
    const [scheme, encoded] = auth.split(" ");
    if (scheme === "Basic" && encoded) {
      const [reqUser, reqPass] = atob(encoded).split(":");
      if (reqUser === user && reqPass === pass) {
        return NextResponse.next();
      }
    }
  }

  return new NextResponse("Authentication required", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="aglaowner admin"' },
  });
}

export const config = {
  matcher: "/admin/:path*",
};
