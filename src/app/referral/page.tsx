import { ReferralApp } from "@/components/referral/ReferralApp";
import { getLiveCreditRules, getLiveRewardTiers } from "@/lib/data/reward-rules";

export const revalidate = 3600;

export default async function ReferralPage() {
  const [creditRules, rewardTiers] = await Promise.all([getLiveCreditRules(), getLiveRewardTiers()]);
  return <ReferralApp creditRules={creditRules} rewardTiers={rewardTiers} />;
}
