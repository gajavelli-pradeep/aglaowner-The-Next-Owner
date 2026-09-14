import { AglaownerApp } from "@/components/AglaownerApp";
import { getPricingPlans } from "@/lib/data/pricing";

export const revalidate = 3600;

export default async function SellPage() {
  const pricingPlans = await getPricingPlans();
  return <AglaownerApp pricingPlans={pricingPlans} initialScreen="sell-category" />;
}
