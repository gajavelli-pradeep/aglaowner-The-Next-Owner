import { createClient } from "@/lib/supabase/server";

/** Verifies the caller's own session is a signed-in admin. Use at the top of any /api/admin/* route -- proxy.ts only gates /admin page routes, not /api/*. */
export async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const role = (user?.app_metadata as { role?: string } | undefined)?.role;
  return role === "admin" ? user : null;
}
