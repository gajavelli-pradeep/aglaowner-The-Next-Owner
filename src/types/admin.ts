export type AdminSection = "overview" | "referrers" | "rules" | "listing" | "providers";

export interface AdminStat {
  value: string;
  label: string;
}

export interface AdminActivityItem {
  listingRef: string;
  type: string;
  referrerCode: string;
  date: string;
  credits: number;
}

export interface AdminReferrer {
  code: string;
  mobile: string;
  referrals: number;
  cycleProgress: number;
  cycleTarget: number;
  status: "active" | "inactive";
  statusLabel: string;
}

export interface ListingTypeSetting {
  type: string;
  activeDays: number;
  archiveDays: number;
  listingFee: number;
  reactivationFee: number;
}

export interface SettingsSurface {
  surface: string;
  shows: string;
}

export interface VoucherProviderConnect {
  id: string;
  name: string;
  icon: string;
  description: string;
  connectLabel: string;
  fields: { label: string; placeholder: string; type: "text" | "password" }[];
  hasEnvToggle: boolean;
  gstNote: string;
}

export type PromoMode = "flat" | "multiplier" | "free-listing";
