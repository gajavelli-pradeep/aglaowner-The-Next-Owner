import {
  IconCoffee,
  IconSchool,
  IconScissors,
  IconShoppingBag,
  IconCalendarEvent,
  IconStethoscope,
  IconBuildingCottage,
} from "@tabler/icons-react";
import type { Category, CategoryPickerCopy } from "@/types/listing";

export const categories: Category[] = [
  { slug: "food-beverage", name: "Food & Beverage", icon: IconCoffee, hint: "Cafés, restaurants, cloud kitchens, bakeries" },
  { slug: "education-childcare", name: "Education & Childcare", icon: IconSchool, hint: "Playschools, daycares, coaching & tuition centres" },
  { slug: "beauty-wellness", name: "Beauty & Wellness", icon: IconScissors, hint: "Salons, spas, gyms, yoga studios" },
  { slug: "retail-shops", name: "Retail & Shops", icon: IconShoppingBag, hint: "Boutiques, kirana stores, mobile shops" },
  { slug: "events-services", name: "Events & Services", icon: IconCalendarEvent, hint: "Decor, photography studios, printing shops" },
  { slug: "health-diagnostics", name: "Health & Diagnostics", icon: IconStethoscope, hint: "Clinics, diagnostic centres, pharmacies" },
  { slug: "hospitality-stay", name: "Hospitality & Stay", icon: IconBuildingCottage, hint: "PGs, guest houses, small lodges" },
];

/** `ti-*` icon class name per category slug, matching the source HTML's onclick(name, icon) calls. */
export const categoryIconNames: Record<string, string> = {
  "food-beverage": "ti-coffee",
  "education-childcare": "ti-school",
  "beauty-wellness": "ti-scissors",
  "retail-shops": "ti-shopping-bag",
  "events-services": "ti-calendar-event",
  "health-diagnostics": "ti-stethoscope",
  "hospitality-stay": "ti-building-cottage",
};

/** Sell-picker tile subtitle, per category, per listing type. */
export const sellPickerHints: Record<string, CategoryPickerCopy> = {
  "food-beverage": { business: "Cafés, restaurants, cloud kitchens", equipment: "Ovens, fridges, POS systems", lease: "Fitted café/restaurant space", inventory: "Packaged snacks, ingredients, overstock" },
  "education-childcare": { business: "Playschools, daycares, coaching centres", equipment: "Classroom furniture, smart boards", lease: "Ready-to-run playschool space", inventory: "Stationery, workbooks, supplies" },
  "beauty-wellness": { business: "Salons, spas, gyms, yoga studios", equipment: "Salon chairs, gym machines", lease: "Fitted salon/spa space", inventory: "Salon consumables, unopened stock" },
  "retail-shops": { business: "Boutiques, kirana stores, mobile shops", equipment: "Shelving, billing counters", lease: "Fitted retail space with shelving", inventory: "Apparel, seasonal lots, dead stock" },
  "events-services": { business: "Decor, photography, printing shops", equipment: "Cameras, lighting, decor inventory", lease: "Studio or office space", inventory: "Decor lots, unused party supplies" },
  "health-diagnostics": { business: "Clinics, diagnostic centres, pharmacies", equipment: "Diagnostic machines, dental chairs", lease: "Fitted clinic space", inventory: "Unopened medical/consumable stock" },
  "hospitality-stay": { business: "PGs, guest houses, small lodges", equipment: "Furniture, linens, AC units", lease: "Furnished PG/guesthouse space", inventory: "Linens, toiletries, bulk supplies" },
};

/** Buy-picker tile "N listed" counts, per category, per listing type. */
export const buyListedCounts: Record<string, Record<import("@/types/listing").ListingType, number>> = {
  "food-beverage": { business: 212, equipment: 64, lease: 18, inventory: 26 },
  "education-childcare": { business: 94, equipment: 22, lease: 7, inventory: 9 },
  "beauty-wellness": { business: 156, equipment: 41, lease: 11, inventory: 15 },
  "retail-shops": { business: 143, equipment: 35, lease: 14, inventory: 41 },
  "events-services": { business: 38, equipment: 17, lease: 4, inventory: 12 },
  "health-diagnostics": { business: 29, equipment: 9, lease: 3, inventory: 6 },
  "hospitality-stay": { business: 22, equipment: 12, lease: 6, inventory: 8 },
};

export const sellTypeHints: Record<import("@/types/listing").ListingType, string> = {
  business: "Ready to hand over what you've built? A structured listing — verified, with real details on price and turnover — helps serious buyers take you seriously and reach out faster than a post ever could.",
  equipment: "Still got life left in it? That equipment doesn't have to sit idle or go for scrap value — a dedicated listing puts it in front of someone who needs exactly what you're letting go of.",
  lease: "The option that helps almost everyone at once. Your landlord skips the search for a new tenant, you save the cost and hassle of clearing everything out, and the next person gets a head start instead of an empty shell.",
  inventory: "Dead stock doesn't have to just sit there. Overstock, season-end lots, discontinued items — list the whole lot once and let someone who actually wants it take it off your hands.",
};

export const buyTypeHints: Record<import("@/types/listing").ListingType, string> = {
  business: "Every listing here is mobile-verified. Real details on price, turnover and why the owner is selling — so you can shortlist with confidence before you even make contact.",
  equipment: "Good gear, honest prices. Sellers here are upgrading, downsizing or closing up — this is where the gap between businesses gets filled, often for a fraction of retail.",
  lease: "Walk into a space that's already set up. Many come with furniture, fixtures or equipment ready to go — skip months of fitting out a place from scratch.",
  inventory: "Stock at a fraction of retail. Overstock, season-end lots and closing-down stock — buy the whole lot at once, direct from the seller, no middleman markup.",
};

export const typeLabels: Record<import("@/types/listing").ListingType, string> = {
  business: "Whole business",
  equipment: "Equipment & assets",
  lease: "Space handover",
  inventory: "Inventory & stock",
};
