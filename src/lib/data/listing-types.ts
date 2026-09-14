/** Canonical display order + label <-> DB `listing_type_settings.type` mapping, shared by the admin settings panel and its save route. */
export const LISTING_TYPES = [
  { dbType: "business", label: "Business" },
  { dbType: "equipment", label: "Equipment & assets" },
  { dbType: "lease", label: "Space handover" },
  { dbType: "inventory", label: "Inventory & stock" },
] as const;

export type ListingTypeCode = (typeof LISTING_TYPES)[number]["dbType"];
