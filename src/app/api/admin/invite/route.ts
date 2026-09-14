import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/supabase/require-admin";

/** Lets an existing admin invite a new one via a magic link -- the only path that creates an admin account; /admin/login itself never does (see auth-model note in requirements/aglaowner-admin-login.html). */
export async function POST(request: NextRequest) {
  const caller = await requireAdmin();
  if (!caller) return NextResponse.json({ error: "Admin access required" }, { status: 403 });

  const { email } = (await request.json().catch(() => ({}))) as { email?: string };
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Enter a valid email address" }, { status: 400 });
  }

  const supabase = createServiceRoleClient();
  const { data, error } = await supabase.auth.admin.inviteUserByEmail(email, {
    redirectTo: `${request.nextUrl.origin}/auth/confirm?next=/admin/reset-password`,
  });
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  // inviteUserByEmail only writes user_metadata -- app_metadata.role is what proxy.ts
  // actually checks, and that field is only settable via the service-role admin API.
  const { error: roleError } = await supabase.auth.admin.updateUserById(data.user.id, {
    app_metadata: { role: "admin" },
  });
  if (roleError) {
    // Compensate: an invite email already went out for this account, but it isn't
    // actually an admin -- leaving it would be a dangling non-admin user that no
    // longer shows as "not found" for a future invite attempt. Undo the invite
    // itself so the caller can safely retry from a clean state.
    await supabase.auth.admin.deleteUser(data.user.id).catch(() => {});
    return NextResponse.json({ error: `Could not finish setting up the invite (${roleError.message}) -- try again.` }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
