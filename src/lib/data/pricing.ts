import { pricingPlans } from "@/data/pricing";
import type { PricingPlan } from "@/types/listing";
import { createClient } from "@/lib/supabase/server";

interface ListingTypeSettingsRow {
  type: string;
  active_days: number;
  archive_days: number;
  listing_fee_paise: number;
  reactivation_fee_paise: number;
}

/** plan.id -> (listing_type_settings.type, is this the reactivation card) */
const PLAN_ID_MAP: Record<string, { type: string; reactivation: boolean }> = {
  business: { type: "business", reactivation: false },
  "business-reactivation": { type: "business", reactivation: true },
  equipment: { type: "equipment", reactivation: false },
  "equipment-reactivation": { type: "equipment", reactivation: true },
  lease: { type: "lease", reactivation: false },
  "lease-reactivation": { type: "lease", reactivation: true },
  inventory: { type: "inventory", reactivation: false },
  "inventory-reactivation": { type: "inventory", reactivation: true },
};

function applyLiveNumbers(plan: PricingPlan, row: ListingTypeSettingsRow, reactivation: boolean): PricingPlan {
  const feePaise = reactivation ? row.reactivation_fee_paise : row.listing_fee_paise;
  return {
    ...plan,
    amount: `₹${Math.round(feePaise / 100)}`,
    period: `/ ${row.active_days} days`,
    archiveWindow: plan.archiveWindow ? `${row.archive_days}-day archive window` : plan.archiveWindow,
  };
}

/**
 * Marketing copy (title, planDesc, features, ctaLabel) stays code-owned -- the
 * listing_type_settings table only has fees and day windows, not copy, so there's
 * nothing to fetch for those fields. Falls back to the static plans, unmodified,
 * whenever Supabase isn't configured or the query fails -- this must never be the
 * thing that breaks the pricing section.
 */
export async function getPricingPlans(): Promise<PricingPlan[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) {
    return pricingPlans;
  }

  try {
    const supabase = await createClient();
    // Bound the query -- a misconfigured/paused/unreachable project must degrade fast,
    // not hang the whole homepage. Verified live: an unreachable host took 7+s without
    // this before falling back.
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);
    const { data, error } = await supabase
      .from("listing_type_settings")
      .select("type, active_days, archive_days, listing_fee_paise, reactivation_fee_paise")
      .abortSignal(controller.signal);
    clearTimeout(timeout);

    if (error || !data) return pricingPlans;

    const byType = new Map<string, ListingTypeSettingsRow>(data.map((row: ListingTypeSettingsRow) => [row.type, row]));

    return pricingPlans.map((plan) => {
      const mapping = PLAN_ID_MAP[plan.id];
      const row = mapping ? byType.get(mapping.type) : undefined;
      return row && mapping ? applyLiveNumbers(plan, row, mapping.reactivation) : plan;
    });
  } catch {
    return pricingPlans;
  }
}
