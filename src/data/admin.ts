import type { AdminActivityItem, AdminReferrer, AdminStat, ListingTypeSetting, SettingsSurface, VoucherProviderConnect } from "@/types/admin";

export const overviewStats: AdminStat[] = [
  { value: "142", label: "Total referrers" },
  { value: "38", label: "Referrals this month" },
  { value: "612,000", label: "Credits issued (all cycles)" },
  { value: "₹41,200", label: "Voucher value redeemed" },
];

export const overviewActivity: AdminActivityItem[] = [
  { listingRef: "AGL-9T21", type: "Business", referrerCode: "AGL-REF-7F42", date: "13 Jul 2026", credits: 10000 },
  { listingRef: "AGL-E551", type: "Equipment & assets", referrerCode: "AGL-REF-3C19", date: "12 Jul 2026", credits: 2000 },
  { listingRef: "AGL-L402", type: "Space handover", referrerCode: "AGL-REF-7F42", date: "11 Jul 2026", credits: 5000 },
  { listingRef: "AGL-I209", type: "Inventory & stock", referrerCode: "AGL-REF-9K05", date: "10 Jul 2026", credits: 3000 },
  { listingRef: "AGL-4B87", type: "Business", referrerCode: "AGL-REF-9K05", date: "10 Jul 2026", credits: 10000 },
];

export const adminReferrers: AdminReferrer[] = [
  { code: "AGL-REF-7F42", mobile: "+91 98xxxxx741", referrals: 4, cycleProgress: 27000, cycleTarget: 50000, status: "active", statusLabel: "Active" },
  { code: "AGL-REF-3C19", mobile: "+91 96xxxxx208", referrals: 1, cycleProgress: 2000, cycleTarget: 50000, status: "active", statusLabel: "Active" },
  { code: "AGL-REF-9K05", mobile: "+91 90xxxxx554", referrals: 7, cycleProgress: 18000, cycleTarget: 50000, status: "active", statusLabel: "Active" },
  { code: "AGL-REF-1M88", mobile: "+91 88xxxxx902", referrals: 0, cycleProgress: 0, cycleTarget: 50000, status: "inactive", statusLabel: "No referrals yet" },
  { code: "AGL-REF-5D63", mobile: "+91 97xxxxx317", referrals: 12, cycleProgress: 9000, cycleTarget: 50000, status: "active", statusLabel: "Active" },
];

export const listingTypeSettings: ListingTypeSetting[] = [
  { type: "Business", activeDays: 90, archiveDays: 120, listingFee: 799, reactivationFee: 499 },
  { type: "Equipment & assets", activeDays: 60, archiveDays: 30, listingFee: 149, reactivationFee: 79 },
  { type: "Space handover", activeDays: 60, archiveDays: 30, listingFee: 399, reactivationFee: 199 },
  { type: "Inventory & stock", activeDays: 60, archiveDays: 30, listingFee: 249, reactivationFee: 129 },
];

export const settingsSurfaces: SettingsSurface[] = [
  { surface: "Main site — pricing cards", shows: "Listing fee & active period, per type" },
  { surface: "Main site — listing forms & confirmation screens", shows: "Active period in paybar and refbox text" },
  { surface: "Main site — Archive & renewal section", shows: "Archive window, shown as a worked example for Business" },
  { surface: "Main site — FAQ answers", shows: "Fees, active period, and archive window, stated in plain sentences" },
  { surface: "Main site — \"my listings\" sample cards", shows: "Days remaining, must stay within the archive window above" },
  { surface: "Referral page — credit table & sample dashboard", shows: "Fees implied by the credit values assigned per type" },
];

export const voucherProviderConnects: VoucherProviderConnect[] = [
  {
    id: "xoxoday",
    name: "Xoxoday Plum",
    icon: "ti-gift",
    description: "Wallet-funded rewards API — fund once, issue any mix of 10M+ gift cards including Amazon, on demand.",
    connectLabel: "+ Connect API",
    fields: [
      { label: "Client ID", placeholder: "Paste your Xoxoday Client ID", type: "text" },
      { label: "Client Secret", placeholder: "Paste your Client Secret", type: "password" },
    ],
    hasEnvToggle: true,
    gstNote: "GST-compliant invoice issued per wallet top-up.",
  },
  {
    id: "enkash",
    name: "EnKash Vouchers",
    icon: "ti-gift",
    description: "Spend-management platform with bulk gift card issuance across e-commerce, food & entertainment brands.",
    connectLabel: "+ Connect API",
    fields: [
      { label: "API Key", placeholder: "Paste your EnKash API key", type: "text" },
      { label: "Account ID", placeholder: "Your EnKash account ID", type: "text" },
    ],
    hasEnvToggle: true,
    gstNote: "GST-compliant invoice confirmed for corporate voucher purchases.",
  },
  {
    id: "qwikcilver",
    name: "Qwikcilver / Woohoo",
    icon: "ti-gift",
    description: "Pine Labs' gift card network — 700M+ cards issued, 250+ brands, established API suite for resellers.",
    connectLabel: "+ Connect API",
    fields: [
      { label: "Merchant ID", placeholder: "Your Qwikcilver merchant ID", type: "text" },
      { label: "API Key", placeholder: "Paste your API key", type: "password" },
    ],
    hasEnvToggle: true,
    gstNote: "GST invoice standard for corporate/reseller purchases.",
  },
  {
    id: "amazon-business",
    name: "Amazon Business",
    icon: "ti-brand-amazon",
    description: "Guaranteed GST invoice on Amazon Pay gift cards specifically — Amazon-brand only, not multi-brand.",
    connectLabel: "+ Connect account",
    fields: [{ label: "Amazon Business account email", placeholder: "procurement@yourcompany.com", type: "text" }],
    hasEnvToggle: false,
    gstNote: "GST invoice guaranteed on every eligible B2B purchase.",
  },
];
