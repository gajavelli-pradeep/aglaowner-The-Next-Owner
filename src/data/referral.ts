import type { CreditRule, RewardTierSeed, ReferralActivityItem, RewardHistoryEntry, ReferralFaqItem, ReferralStep, VoucherProvider } from "@/types/referral";

export const REFERRAL_CODE = "AGL-REF-7F42";

export const referralSteps: ReferralStep[] = [
  { title: "Get your free code", description: "Mobile OTP and a few basic details — done in about 2 minutes, no cost to join." },
  { title: "Share it naturally", description: "A WhatsApp message, a mention in conversation — whenever it comes up with someone selling or clearing out." },
  { title: "Earn credits, redeem vouchers", description: "Every successful referral adds credits to your account — redeem them for a voucher once you cross a milestone." },
];

export const rewardTierSeeds: RewardTierSeed[] = [
  { credits: 10000, amount: 500 },
  { credits: 25000, amount: 1000 },
  { credits: 50000, amount: 1500 },
];

export const creditRules: CreditRule[] = [
  { label: "Business listing", credits: 10000 },
  { label: "Business reactivation", credits: 5000 },
  { label: "Space handover listing", credits: 5000 },
  { label: "Space handover reactivation", credits: 2500 },
  { label: "Equipment & assets listing", credits: 2000 },
  { label: "Equipment & assets reactivation", credits: 1000 },
  { label: "Inventory & stock listing", credits: 3000 },
  { label: "Inventory & stock reactivation", credits: 1500 },
];

export const voucherProviders: VoucherProvider[] = [{ name: "Amazon Pay" }, { name: "Zomato" }, { name: "BookMyShow" }];

export const referralFaqItems: ReferralFaqItem[] = [
  {
    question: "Does it cost anything to become a referrer?",
    answer: "No. Getting your code is free, and there's no fee at any point in the referral process.",
    openByDefault: true,
  },
  {
    question: "What counts as a \"successful\" referral?",
    answer:
      "Anyone who uses your code while creating a listing — a business, equipment, a space handover, or an inventory lot — and pays to publish it. Credits are added to your account as soon as that happens.",
  },
  {
    question: "How do credits turn into a voucher?",
    answer:
      "Different listing types earn different credits, since they're worth different amounts — see the table above for the exact breakdown. Once your running total crosses 10,000, 25,000 or 50,000 credits, a voucher unlocks in your dashboard and you pick which one you'd like. After you claim the 50,000-credit voucher, your progress resets to zero and the same three milestones start over — there's no limit to how many times you can go through the cycle.",
  },
  {
    question: "Is there a limit on how many people I can refer?",
    answer: "No limit. Share your code as often as it comes up — every successful referral adds to your credit total.",
  },
];

/** Seed activity for this cycle — display-only, matches the source's static example rows. */
export const referralActivity: ReferralActivityItem[] = [
  { code: "AGL-7K21", label: "Business listing", date: "2 July 2026", credits: 10000, icon: "ti-coffee" },
  { code: "AGL-9M55", label: "Business listing", date: "20 June 2026", credits: 10000, icon: "ti-coffee" },
  { code: "AGL-L317", label: "Space handover listing", date: "10 June 2026", credits: 5000, icon: "ti-key" },
  { code: "AGL-E482", label: "Equipment & assets listing", date: "28 June 2026", credits: 2000, icon: "ti-tools-kitchen-2" },
  { code: "AGL-I209", label: "Inventory & stock listing", date: "5 July 2026", credits: 3000, icon: "ti-package" },
];

export const initialRewardHistory: RewardHistoryEntry[] = [{ provider: "Amazon Pay", amount: 500, date: "15 June 2026" }];

/** Seed state matching the source HTML's initial dashboard snapshot. */
export const initialDashboard = {
  earnedSoFar: 500,
  availableNow: 1,
  cycleProgress: 30000,
  cycleTarget: 50000,
};
