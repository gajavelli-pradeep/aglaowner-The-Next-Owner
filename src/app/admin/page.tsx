import { AdminApp } from "@/components/admin/AdminApp";
import { createClient } from "@/lib/supabase/server";
import { LISTING_TYPES } from "@/lib/data/listing-types";
import { CREDIT_ACTIONS } from "@/lib/data/reward-rule-map";
import { listingTypeSettings as fallbackListingTypeSettings } from "@/data/admin";
import { creditRules as fallbackCreditRules, rewardTierSeeds as fallbackRewardTiers } from "@/data/referral";
import type { ListingTypeSetting, AdminCreditRule, AdminRewardTier, AdminPromotion } from "@/types/admin";

interface ListingTypeSettingsRow {
  type: string;
  active_days: number;
  archive_days: number;
  listing_fee_paise: number;
  reactivation_fee_paise: number;
}
interface CreditRuleRow {
  action: string;
  credits: number;
}
interface RewardTierRow {
  id: number;
  credits_threshold: number;
  voucher_amount_paise: number;
}
interface PromotionRow {
  mode: string;
  flat_amount_paise: number | null;
  multiplier: number | null;
  starts_at: string | null;
  ends_at: string | null;
  active: boolean;
}

export default async function AdminPage() {
  const supabase = await createClient();
  const [{ data: userData }, { data: settingsRows }, { data: creditRows }, { data: tierRows }, { data: promoRow }] = await Promise.all([
    supabase.auth.getUser(),
    supabase.from("listing_type_settings").select("type, active_days, archive_days, listing_fee_paise, reactivation_fee_paise"),
    supabase.from("credit_rules").select("action, credits"),
    supabase.from("reward_tiers").select("id, credits_threshold, voucher_amount_paise").order("credits_threshold", { ascending: true }),
    supabase.from("promotions").select("mode, flat_amount_paise, multiplier, starts_at, ends_at, active").eq("id", 1).maybeSingle(),
  ]);

  const byType = new Map<string, ListingTypeSettingsRow>((settingsRows ?? []).map((row: ListingTypeSettingsRow) => [row.type, row]));
  const listingTypeSettings: ListingTypeSetting[] = LISTING_TYPES.map(({ dbType, label }) => {
    const row = byType.get(dbType);
    const fallback = fallbackListingTypeSettings.find((s) => s.type === label);
    return {
      type: label,
      activeDays: row?.active_days ?? fallback?.activeDays ?? 0,
      archiveDays: row?.archive_days ?? fallback?.archiveDays ?? 0,
      listingFee: row ? Math.round(row.listing_fee_paise / 100) : (fallback?.listingFee ?? 0),
      reactivationFee: row ? Math.round(row.reactivation_fee_paise / 100) : (fallback?.reactivationFee ?? 0),
    };
  });

  const byAction = new Map<string, number>((creditRows ?? []).map((row: CreditRuleRow) => [row.action, row.credits]));
  const creditRules: AdminCreditRule[] = CREDIT_ACTIONS.map(({ code, label }) => {
    const fallback = fallbackCreditRules.find((r) => r.label === label);
    return { code, label, credits: byAction.get(code) ?? fallback?.credits ?? 0 };
  });

  const rewardTiers: AdminRewardTier[] =
    tierRows && tierRows.length > 0
      ? (tierRows as RewardTierRow[]).map((row) => ({ id: row.id, credits: row.credits_threshold, amount: Math.round(row.voucher_amount_paise / 100) }))
      : fallbackRewardTiers.map((t) => ({ id: null, credits: t.credits, amount: t.amount }));

  const promo = promoRow as PromotionRow | null;
  const promotion: AdminPromotion = {
    active: promo?.active ?? false,
    mode: (promo?.mode as AdminPromotion["mode"]) ?? "flat",
    flatAmount: promo?.flat_amount_paise ? Math.round(promo.flat_amount_paise / 100) : 300,
    multiplier: promo?.multiplier ?? 2,
    startsAt: promo?.starts_at ? promo.starts_at.slice(0, 10) : "",
    endsAt: promo?.ends_at ? promo.ends_at.slice(0, 10) : "",
  };

  return (
    <AdminApp
      adminEmail={userData.user?.email ?? ""}
      listingTypeSettings={listingTypeSettings}
      creditRules={creditRules}
      rewardTiers={rewardTiers}
      promotion={promotion}
    />
  );
}
