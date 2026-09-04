export interface CreditRule {
  label: string;
  credits: number;
}

export interface RewardTierSeed {
  credits: number;
  amount: number;
}

export interface ReferralActivityItem {
  code: string;
  label: string;
  date: string;
  credits: number;
  icon: string;
}

export interface RewardHistoryEntry {
  provider: string;
  amount: number;
  date: string;
}

export interface ReferralFaqItem {
  question: string;
  answer: string;
  openByDefault?: boolean;
}

export interface ReferralStep {
  title: string;
  description: string;
}

export interface VoucherProvider {
  name: string;
}
