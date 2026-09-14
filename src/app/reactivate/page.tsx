import { AglaownerApp } from "@/components/AglaownerApp";
import { getPricingPlans } from "@/lib/data/pricing";

export const revalidate = 3600;

export default async function ReactivatePage() {
  const pricingPlans = await getPricingPlans();
  return <AglaownerApp pricingPlans={pricingPlans} initialScreen="reactivate-lookup" />;
}
