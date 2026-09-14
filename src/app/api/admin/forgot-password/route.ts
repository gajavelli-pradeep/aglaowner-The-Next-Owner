import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";

/**
 * Server-side existence check before sending a reset email -- by design (per explicit
 * product decision, not Supabase's default): a closed, admin-only console with a
 * handful of known accounts, so a clear "no admin account" error is more useful here
 * than the usual public-signup anti-enumeration hedge.
 */
export async function POST(request: NextRequest) {
  const { email } = (await request.json().catch(() => ({}))) as { email?: string };
  if (!email) return NextResponse.json({ error: "Enter your email address" }, { status: 400 });

  const supabase = createServiceRoleClient();
  const { data, error: listError } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1000 });
  if (listError) return NextResponse.json({ error: listError.message }, { status: 500 });

  const match = data.users.find((u) => u.email?.toLowerCase() === email.toLowerCase());
  const isAdmin = (match?.app_metadata as { role?: string } | undefined)?.role === "admin";
  if (!match || !isAdmin) {
    return NextResponse.json({ error: "No admin account found for this email." }, { status: 404 });
  }

  const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${request.nextUrl.origin}/auth/confirm?next=/admin/reset-password`,
  });
  if (resetError) return NextResponse.json({ error: resetError.message }, { status: 400 });

  return NextResponse.json({ ok: true });
}
