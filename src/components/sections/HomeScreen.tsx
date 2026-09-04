import { Hero } from "@/components/sections/Hero";
import { TrustStrip } from "@/components/sections/TrustStrip";
import { CategoryGrid } from "@/components/sections/CategoryGrid";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { ArchiveSection } from "@/components/sections/ArchiveSection";
import { Pricing } from "@/components/sections/Pricing";
import { Faq } from "@/components/sections/Faq";
import { CtaBand } from "@/components/sections/CtaBand";
import type { PricingPlan } from "@/types/listing";

export function HomeScreen({
  onSell,
  onBuy,
  onReactivate,
  onCategory,
  onAllCategories,
  onPricingCta,
}: {
  onSell: () => void;
  onBuy: () => void;
  onReactivate: () => void;
  onCategory: (name: string) => void;
  onAllCategories: () => void;
  onPricingCta: (screen: PricingPlan["ctaScreen"]) => void;
}) {
  return (
    <div>
      <Hero onSell={onSell} onBuy={onBuy} onReactivate={onReactivate} />
      <TrustStrip />
      <CategoryGrid onCategory={onCategory} onAll={onAllCategories} />
      <HowItWorks />
      <ArchiveSection onReactivate={onReactivate} />
      <Pricing onCta={onPricingCta} />
      <Faq />
      <CtaBand onSell={onSell} onBuy={onBuy} />
    </div>
  );
}
