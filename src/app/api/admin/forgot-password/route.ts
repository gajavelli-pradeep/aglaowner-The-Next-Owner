import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const RATE_LIMIT_PER_WINDOW = 5; // per email, per 15-minute bucket

/**
 * Server-side existence check before sending a reset email -- by design (per explicit
 * product decision, not Supabase's default): a closed, admin-only console with a
 * handful of known accounts, so a clear "no admin account" error is more useful here
 * than the usual public-signup anti-enumeration hedge.
 */
export async function POST(request: NextRequest) {
  const { email } = (await request.json().catch(() => ({}))) as { email?: unknown };
  if (typeof email !== "string" || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Enter a valid email address" }, { status: 400 });
  }

  const supabase = createServiceRoleClient();

  // Bound the (deliberately unauthenticated) listUsers scan below to a few tries per
  // email per 15 minutes -- same rate_limits table + minute-bucket-key pattern as
  // reveal_seller_contact() in the schema, done here in JS since there's no caller
  // session (auth.uid()) to key a security-definer RPC off of.
  const bucket = Math.floor(Date.now() / (15 * 60 * 1000));
  const rateLimitKey = `admin_forgot_password:${email.toLowerCase()}:${bucket}`;
  const { data: existing } = await supabase.from("rate_limits").select("count").eq("key", rateLimitKey).maybeSingle();
  const nextCount = (existing?.count ?? 0) + 1;
  // Small race window on concurrent requests within the same 15-minute bucket is
  // acceptable here -- this is a defense-in-depth cost bound on the listUsers scan
  // below, not the sole security boundary. A rate_limits write failure (e.g. table
  // missing in an older schema) must not block the real flow -- fail open on the
  // limiter itself, never on the feature.
  await supabase.from("rate_limits").upsert({ key: rateLimitKey, count: nextCount });
  if (nextCount > RATE_LIMIT_PER_WINDOW) {
    return NextResponse.json({ error: "Too many attempts. Try again in a few minutes." }, { status: 429 });
  }

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
