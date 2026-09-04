import {
  REFERRAL_CODE,
  referralSteps,
  rewardTierSeeds,
  creditRules,
  voucherProviders,
  referralFaqItems,
  referralActivity,
  initialRewardHistory,
  initialDashboard,
} from "@/data/referral";

export function getReferralCode(): string {
  return REFERRAL_CODE;
}

export function getReferralSteps() {
  return referralSteps;
}

export function getRewardTierSeeds() {
  return rewardTierSeeds;
}

export function getCreditRules() {
  return creditRules;
}

export function getVoucherProviders() {
  return voucherProviders;
}

export function getReferralFaq() {
  return referralFaqItems;
}

export function getReferralActivity() {
  return referralActivity;
}

export function getInitialRewardHistory() {
  return initialRewardHistory;
}

export function getInitialDashboardStats() {
  return initialDashboard;
}
