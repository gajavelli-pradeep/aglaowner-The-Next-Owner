import { AglaownerApp } from "@/components/AglaownerApp";
import { getPricingPlans } from "@/lib/data/pricing";

export default async function Home() {
  const pricingPlans = await getPricingPlans();
  return <AglaownerApp pricingPlans={pricingPlans} />;
}
