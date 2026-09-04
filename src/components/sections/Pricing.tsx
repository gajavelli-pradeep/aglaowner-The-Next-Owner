"use client";

import { IconCheck, IconArchive, IconCircleCheck, IconReceipt2 } from "@tabler/icons-react";
import { PriceCta } from "@/components/ui/Buttons";
import { getPricingPlans } from "@/lib/data/pricing";
import type { PricingPlan } from "@/types/listing";

export function Pricing({ onCta }: { onCta: (screen: PricingPlan["ctaScreen"]) => void }) {
  const plans = getPricingPlans();
  return (
    <section id="pricing" className="px-6 py-11 sm:py-16">
      <div className="mx-auto max-w-[1080px]">
        <p className="mb-2.5 text-xs font-semibold tracking-[0.1em] text-oxide uppercase">Pricing</p>
        <div className="mb-9">
          <h2 className="mb-3 max-w-[560px] text-[26px] sm:text-[30px]">One flat fee. No commission, ever.</h2>
          <p className="max-w-[520px] text-[15px] text-ink-soft">
            Buyers browse and connect for free. Sellers pay once to list — nothing more, whether or not it sells.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-[22px] sm:grid-cols-2">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-[10px] border bg-paper p-[30px] ${plan.featured ? "border-2 border-oxide" : "border-line"}`}
            >
              {plan.archiveWindow && (
                <div className="absolute top-4 right-4 inline-flex items-center gap-1 rounded-[20px] border border-line-soft bg-paper-2 px-2.5 py-[3px] text-[10px] text-ink-soft">
                  <IconArchive size={11} /> {plan.archiveWindow}
                </div>
              )}
              <h3 className="mb-1 text-base font-semibold">{plan.title}</h3>
              <p className="mb-[18px] text-[12.5px] text-ink-soft">{plan.planDesc}</p>
              <div className="mb-0.5 font-mono text-[34px] font-semibold">
                {plan.amount} <span className="font-sans text-sm font-normal text-ink-soft">{plan.period}</span>
              </div>
              <ul className="my-5 list-none">
                {plan.features.map((feat) => (
                  <li key={feat} className="flex gap-2.5 border-b border-line-soft py-2 text-[13.5px] last:border-b-0">
                    <IconCheck size={16} className="mt-0.5 shrink-0 text-stamp-green" /> {feat}
                  </li>
                ))}
              </ul>
              <PriceCta featured={plan.featured} onClick={() => onCta(plan.ctaScreen)}>
                {plan.ctaLabel}
              </PriceCta>
            </div>
          ))}
        </div>
        <p className="mt-7 flex items-center justify-center gap-2 text-center text-[13.5px] text-ink-soft">
          <IconCircleCheck size={17} className="text-stamp-green" /> No success fee. No hidden charges. What you see here is the entire cost of listing.
        </p>
        <p className="mt-2 flex items-center justify-center gap-2 text-center text-[13.5px] text-ink-soft">
          <IconReceipt2 size={17} className="text-stamp-green" /> All prices shown are exclusive of GST.
        </p>
      </div>
    </section>
  );
}
