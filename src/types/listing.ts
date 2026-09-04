import type { Icon, IconProps } from "@tabler/icons-react";
import type { ComponentType, ForwardRefExoticComponent, RefAttributes } from "react";

export type TablerIcon = ForwardRefExoticComponent<Omit<IconProps, "ref"> & RefAttributes<Icon>> | ComponentType<IconProps>;

export type ListingType = "business" | "equipment" | "lease" | "inventory";

export interface Category {
  slug: string;
  name: string;
  icon: TablerIcon;
  hint: string;
}

/** Per-category tile copy shown on sell/buy picker grids, keyed by listing type. */
export interface CategoryPickerCopy {
  business: string;
  equipment: string;
  lease: string;
  inventory: string;
}

export interface PricingPlan {
  id: string;
  title: string;
  planDesc: string;
  amount: string;
  period: string;
  featured: boolean;
  archiveWindow?: string;
  features: string[];
  ctaLabel: string;
  ctaScreen: "sell-category" | "reactivate-lookup";
}

export interface FaqItem {
  question: string;
  answer: string;
  openByDefault?: boolean;
}

export interface TrustItem {
  icon: TablerIcon;
  title: string;
  description: string;
}

export interface HowItWorksStep {
  title: string;
  description: string;
  badge?: string;
}

export interface HowItWorksColumn {
  tag: string;
  variant: "seller" | "buyer";
  steps: HowItWorksStep[];
}

export interface RestoreStep {
  num: string;
  title: string;
  description: string;
}

export interface TimelineNode {
  day: string;
  label: string;
  description: string;
  state: "live" | "archived" | "gone";
}

export interface SampleListing {
  title: string;
  loc: string;
  price: string;
  icon: string;
  tag: string;
  warn: boolean;
  desc: string;
  reason: string;
  /** business */ legacy?: string; turnover?: string;
  /** equipment */ condition?: string; brand?: string;
  /** lease */ leaseLeft?: string; rent?: string;
  /** inventory */ lotSize?: string; category?: string;
}

export interface ConfirmFlyerData {
  title: string;
  price: string;
  loc: string;
  highlight: string;
  icon: string;
  ref: string;
  filename: string;
}

export interface MyListing {
  id: string;
  title: string;
  ref: string;
  type: ListingType;
  icon: string;
  status: "active" | "archived";
  statusNote: string;
  reactivatePrice?: string;
  reactivateScreen: string;
}
