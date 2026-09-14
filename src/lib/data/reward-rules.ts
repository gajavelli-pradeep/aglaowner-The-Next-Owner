import { creditRules, rewardTierSeeds } from "@/data/referral";
import type { CreditRule, RewardTierSeed } from "@/types/referral";
import { createAnonClient } from "@/lib/supabase/server";
import { CREDIT_ACTIONS } from "@/lib/data/reward-rule-map";

/** Live version of getCreditRules() -- same fallback contract as getPricingPlans() (src/lib/data/pricing.ts): a misconfigured/unreachable project must never break the referral page. */
export async function getLiveCreditRules(): Promise<CreditRule[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) return creditRules;
  try {
    const supabase = createAnonClient();
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);
    const { data, error } = await supabase.from("credit_rules").select("action, credits").abortSignal(controller.signal);
    clearTimeout(timeout);
    if (error || !data || data.length === 0) return creditRules;

    const byAction = new Map<string, number>(data.map((row: { action: string; credits: number }) => [row.action, row.credits]));
    return creditRules.map((rule) => {
      const action = CREDIT_ACTIONS.find((a) => a.label === rule.label)?.code;
      const liveCredits = action ? byAction.get(action) : undefined;
      return liveCredits === undefined ? rule : { ...rule, credits: liveCredits };
    });
  } catch {
    return creditRules;
  }
}

/** Live version of getRewardTierSeeds(). */
export async function getLiveRewardTiers(): Promise<RewardTierSeed[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) return rewardTierSeeds;
  try {
    const supabase = createAnonClient();
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);
    const { data, error } = await supabase
      .from("reward_tiers")
      .select("credits_threshold, voucher_amount_paise")
      .order("credits_threshold", { ascending: true })
      .abortSignal(controller.signal);
    clearTimeout(timeout);
    if (error || !data || data.length === 0) return rewardTierSeeds;
    return data.map((row: { credits_threshold: number; voucher_amount_paise: number }) => ({
      credits: row.credits_threshold,
      amount: Math.round(row.voucher_amount_paise / 100),
    }));
  } catch {
    return rewardTierSeeds;
  }
}
