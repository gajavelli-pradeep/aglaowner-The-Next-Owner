import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/supabase/require-admin";
import { CREDIT_ACTIONS } from "@/lib/data/reward-rule-map";

const VALID_CODES = new Set<string>(CREDIT_ACTIONS.map((a) => a.code));

interface Row {
  code: string;
  credits: number;
}

function validateRows(input: unknown): Row[] | null {
  if (!Array.isArray(input) || input.length === 0) return null;
  const rows: Row[] = [];
  for (const r of input) {
    if (typeof r !== "object" || r === null) return null;
    const { code, credits } = r as Record<string, unknown>;
    if (typeof code !== "string" || !VALID_CODES.has(code)) return null;
    if (typeof credits !== "number" || !Number.isInteger(credits) || credits <= 0) return null;
    rows.push({ code, credits });
  }
  return rows;
}

export async function POST(request: NextRequest) {
  const caller = await requireAdmin();
  if (!caller) return NextResponse.json({ error: "Admin access required" }, { status: 403 });

  const body = await request.json().catch(() => null);
  const rows = validateRows(body?.rows);
  if (!rows) return NextResponse.json({ error: "Every credit value must be a whole number greater than zero." }, { status: 400 });

  const supabase = createServiceRoleClient();
  const { error } = await supabase.from("credit_rules").upsert(
    rows.map((r) => ({ action: r.code, credits: r.credits })),
    { onConflict: "action" }
  );
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  revalidatePath("/referral");
  return NextResponse.json({ ok: true });
}
