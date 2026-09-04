import { pricingPlans } from "@/data/pricing";
import type { PricingPlan } from "@/types/listing";

export function getPricingPlans(): PricingPlan[] {
  return pricingPlans;
}
