/** credit_rules.action <-> the admin/referral-page display label, mirroring listing-types.ts's dbType<->label pattern. */
export const CREDIT_ACTIONS = [
  { code: "business_listing", label: "Business listing" },
  { code: "business_reactivation", label: "Business reactivation" },
  { code: "lease_listing", label: "Space handover listing" },
  { code: "lease_reactivation", label: "Space handover reactivation" },
  { code: "equipment_listing", label: "Equipment & assets listing" },
  { code: "equipment_reactivation", label: "Equipment & assets reactivation" },
  { code: "inventory_listing", label: "Inventory & stock listing" },
  { code: "inventory_reactivation", label: "Inventory & stock reactivation" },
] as const;

export type CreditActionCode = (typeof CREDIT_ACTIONS)[number]["code"];
