import { categories, categoryIconNames, sellPickerHints, buyListedCounts, sellTypeHints, buyTypeHints, typeLabels } from "@/data/categories";
import type { Category, ListingType } from "@/types/listing";

export function getCategories(): Category[] {
  return categories;
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function getSellPickerHint(slug: string, type: ListingType): string {
  return sellPickerHints[slug]?.[type] ?? "";
}

export function getBuyListedCount(slug: string, type: ListingType): number {
  return buyListedCounts[slug]?.[type] ?? 0;
}

export function getSellTypeHint(type: ListingType): string {
  return sellTypeHints[type];
}

export function getBuyTypeHint(type: ListingType): string {
  return buyTypeHints[type];
}

export function getTypeLabel(type: ListingType): string {
  return typeLabels[type];
}

export function getCategoryIconName(slug: string): string {
  return categoryIconNames[slug] ?? "ti-tag";
}
