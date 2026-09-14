import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/supabase/require-admin";

const VALID_MODES = new Set(["flat", "multiplier", "free-listing"]);
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export async function POST(request: NextRequest) {
  const caller = await requireAdmin();
  if (!caller) return NextResponse.json({ error: "Admin access required" }, { status: 403 });

  const body = (await request.json().catch(() => null)) as {
    active?: boolean;
    mode?: string;
    flatAmount?: number;
    multiplier?: number;
    startsAt?: string;
    endsAt?: string;
  } | null;
  if (!body || typeof body.active !== "boolean" || typeof body.mode !== "string" || !VALID_MODES.has(body.mode)) {
    return NextResponse.json({ error: "Invalid promotion payload." }, { status: 400 });
  }
  if (typeof body.flatAmount !== "number" || !Number.isInteger(body.flatAmount) || body.flatAmount <= 0) {
    return NextResponse.json({ error: "Flat voucher amount must be a whole number greater than zero." }, { status: 400 });
  }
  if (typeof body.multiplier !== "number" || body.multiplier <= 0) {
    return NextResponse.json({ error: "Multiplier must be a number greater than zero." }, { status: 400 });
  }
  if (body.startsAt && !DATE_RE.test(body.startsAt)) return NextResponse.json({ error: "Invalid start date." }, { status: 400 });
  if (body.endsAt && !DATE_RE.test(body.endsAt)) return NextResponse.json({ error: "Invalid end date." }, { status: 400 });

  const supabase = createServiceRoleClient();
  const { error } = await supabase.from("promotions").upsert(
    {
      id: 1,
      mode: body.mode,
      flat_amount_paise: body.flatAmount * 100,
      multiplier: body.multiplier,
      starts_at: body.startsAt || null,
      ends_at: body.endsAt || null,
      active: body.active,
    },
    { onConflict: "id" }
  );
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Nothing in the app currently reads the promotions table yet -- this persists the
  // setting for real, but the revalidate is a no-op until a page starts reading it.
  revalidatePath("/referral");
  return NextResponse.json({ ok: true });
}
