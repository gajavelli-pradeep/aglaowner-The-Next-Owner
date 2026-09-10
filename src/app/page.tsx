import { AglaownerApp } from "@/components/AglaownerApp";
import { getPricingPlans } from "@/lib/data/pricing";

// Static generation stays fast/cacheable (createAnonClient avoids cookies()), but pricing
// is admin-editable once Supabase is connected -- without a revalidate window this page
// would only pick up a fee change on the next deploy. 1 hour bounds that staleness.
export const revalidate = 3600;

export default async function Home() {
  const pricingPlans = await getPricingPlans();
  return <AglaownerApp pricingPlans={pricingPlans} />;
}
