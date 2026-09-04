import { faqItems } from "@/data/faq";
import type { FaqItem } from "@/types/listing";

export function getFaqItems(): FaqItem[] {
  return faqItems;
}
