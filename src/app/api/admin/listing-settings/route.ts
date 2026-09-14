import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/supabase/require-admin";
import { LISTING_TYPES, type ListingTypeCode } from "@/lib/data/listing-types";

interface Row {
  type: ListingTypeCode;
  activeDays: number;
  archiveDays: number;
  listingFee: number;
  reactivationFee: number;
}

const VALID_TYPES = new Set<string>(LISTING_TYPES.map((t) => t.dbType));

function validateRows(input: unknown): Row[] | null {
  if (!Array.isArray(input) || input.length === 0) return null;
  const rows: Row[] = [];
  for (const r of input) {
    if (typeof r !== "object" || r === null) return null;
    const { type, activeDays, archiveDays, listingFee, reactivationFee } = r as Record<string, unknown>;
    if (typeof type !== "string" || !VALID_TYPES.has(type)) return null;
    const nums = [activeDays, archiveDays, listingFee, reactivationFee];
    if (!nums.every((n) => typeof n === "number" && Number.isInteger(n) && n > 0)) return null;
    rows.push({ type: type as ListingTypeCode, activeDays: activeDays as number, archiveDays: archiveDays as number, listingFee: listingFee as number, reactivationFee: reactivationFee as number });
  }
  return rows;
}

/** Real backing for the admin "Listing Settings" panel -- both the pricing section (src/lib/data/pricing.ts) and this panel now read/write the same listing_type_settings table. */
export async function POST(request: NextRequest) {
  const caller = await requireAdmin();
  if (!caller) return NextResponse.json({ error: "Admin access required" }, { status: 403 });

  const body = await request.json().catch(() => null);
  const rows = validateRows(body?.rows);
  if (!rows) return NextResponse.json({ error: "Every field must be a whole number greater than zero." }, { status: 400 });

  const supabase = createServiceRoleClient();
  const { error } = await supabase.from("listing_type_settings").upsert(
    rows.map((r) => ({
      type: r.type,
      active_days: r.activeDays,
      archive_days: r.archiveDays,
      listing_fee_paise: r.listingFee * 100,
      reactivation_fee_paise: r.reactivationFee * 100,
    })),
    { onConflict: "type" }
  );
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // The homepage Pricing section has revalidate=3600 (ISR) -- without this, a saved
  // change wouldn't show up there for up to an hour.
  revalidatePath("/");

  return NextResponse.json({ ok: true });
}
