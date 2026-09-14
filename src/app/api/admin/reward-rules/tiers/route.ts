import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/supabase/require-admin";

interface Row {
  credits: number;
  amount: number;
}

function validateRows(input: unknown): Row[] | null {
  if (!Array.isArray(input) || input.length === 0) return null;
  const rows: Row[] = [];
  for (const r of input) {
    if (typeof r !== "object" || r === null) return null;
    const { credits, amount } = r as Record<string, unknown>;
    if (typeof credits !== "number" || !Number.isInteger(credits) || credits <= 0) return null;
    if (typeof amount !== "number" || !Number.isInteger(amount) || amount <= 0) return null;
    rows.push({ credits, amount });
  }
  return rows;
}

/** No natural stable key beyond the DB identity id and the admin panel never adds/removes rows -- replace-all is simplest and safe: nothing else in the schema references reward_tiers.id. */
export async function POST(request: NextRequest) {
  const caller = await requireAdmin();
  if (!caller) return NextResponse.json({ error: "Admin access required" }, { status: 403 });

  const body = await request.json().catch(() => null);
  const rows = validateRows(body?.rows);
  if (!rows) return NextResponse.json({ error: "Every threshold and voucher amount must be a whole number greater than zero." }, { status: 400 });

  const supabase = createServiceRoleClient();
  const { error: deleteError } = await supabase.from("reward_tiers").delete().gte("id", 0);
  if (deleteError) return NextResponse.json({ error: deleteError.message }, { status: 500 });

  const { error: insertError } = await supabase
    .from("reward_tiers")
    .insert(rows.map((r) => ({ credits_threshold: r.credits, voucher_amount_paise: r.amount * 100 })));
  if (insertError) return NextResponse.json({ error: insertError.message }, { status: 500 });

  revalidatePath("/referral");
  return NextResponse.json({ ok: true });
}
