"use client";

import { IconBadge, IconLayoutDashboard, IconCoins, IconShieldCheck, IconRefresh } from "@tabler/icons-react";
import Link from "next/link";
import { AccordionItem } from "@/components/ui/Accordion";
import { getReferralSteps, getRewardTierSeeds, getCreditRules, getReferralFaq } from "@/lib/data/referral";

const WHO_CHIPS = ["CAs & tax consultants", "Trade & market associations", "Local business networks", "Anyone who hears about closures first"];

/** Referral landing screen — hero, how-it-works, rewards + credit table, faq, cta band, footer. */
export function ReferralHomeScreen({ onGetCode, onDashboard }: { onGetCode: () => void; onDashboard: () => void }) {
  const steps = getReferralSteps();
  const tiers = getRewardTierSeeds();
  const rules = getCreditRules();
  const faq = getReferralFaq();

  return (
    <div>
      <section className="px-6 pt-13 pb-10 text-center">
        <div className="mx-auto max-w-[1080px]">
          <p className="mb-3 text-xs font-semibold tracking-[0.12em] text-stamp-green uppercase">aglaowner referral network</p>
          <h1 className="mx-auto mb-[18px] max-w-[680px] font-serif text-[26px] leading-[1.2] font-semibold sm:text-[38px]">
            <span className="block">
              Know someone who is <span className="text-oxide">closing down or moving on</span> with their current business?
            </span>
            <span className="block">
              Tell them about <span className="text-oxide">aglaowner</span>.
            </span>
          </h1>
          <p className="mx-auto mb-7 max-w-[560px] text-[15.5px] text-ink-soft">
            Whether you&apos;re a CA, a trade association member, a property broker, or simply someone who always hears about it first — when
            someone&apos;s selling a business, planning to sell their equipment &amp; assets, looking to transfer their lease, or clearing out
            excess stock — <span className="font-semibold text-oxide">refer them to aglaowner &amp; earn</span> from your referral.
          </p>
          <div className="flex flex-wrap justify-center gap-3.5">
            <button
              type="button"
              onClick={onGetCode}
              className="inline-flex items-center gap-2 rounded-md border-2 border-transparent bg-oxide px-[30px] py-[15px] text-[15px] font-semibold text-paper transition-colors hover:bg-oxide-dark"
            >
              <IconBadge size={17} /> Get my referral code
            </button>
            <button
              type="button"
              onClick={onDashboard}
              className="inline-flex items-center gap-2 rounded-md border-2 border-ink bg-transparent px-[30px] py-[15px] text-[15px] font-semibold text-ink transition-colors hover:bg-ink hover:text-paper"
            >
              <IconLayoutDashboard size={17} /> View my dashboard
            </button>
          </div>
          <div className="mt-[22px] flex flex-wrap justify-center gap-2.5">
            {WHO_CHIPS.map((chip) => (
              <span key={chip} className="rounded-[20px] border border-line bg-paper-2 px-[15px] py-2 text-[12.5px] font-semibold text-ink-soft">
                {chip}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="px-6 py-11 sm:py-16">
        <div className="mx-auto max-w-[1080px]">
          <p className="mb-2.5 text-xs font-semibold tracking-[0.1em] text-oxide uppercase">How it works</p>
          <h2 className="mb-2.5 max-w-[520px] text-[26px] sm:text-[30px]">Three steps, no paperwork</h2>
          <p className="mb-8 max-w-[500px] text-[14.5px] text-ink-soft">No targets, no minimums — refer as often or as rarely as it comes up naturally.</p>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {steps.map((step, i) => (
              <div key={step.title} className="rounded-[10px] border border-line bg-paper p-6">
                <div className="mb-3.5 flex h-[30px] w-[30px] items-center justify-center rounded-full border border-line bg-paper-2 font-mono text-[13px] font-semibold">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <h3 className="mb-1.5 text-[15px] font-semibold">{step.title}</h3>
                <p className="text-[13px] text-ink-soft">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="rewards" className="border-t border-b border-line bg-paper-2 px-6 py-11 sm:py-16">
        <div className="mx-auto max-w-[1080px]">
          <p className="mb-2.5 text-xs font-semibold tracking-[0.1em] text-oxide uppercase">Rewards</p>
          <h2 className="mb-2.5 max-w-[520px] text-[26px] sm:text-[30px]">Earn credits, unlock vouchers</h2>
          <p className="mb-8 max-w-[500px] text-[14.5px] text-ink-soft">
            Every successful referral adds credits — how many depends on what got listed. Cross a milestone, pick a voucher — then the cycle
            starts fresh so you can earn all over again.
          </p>
          <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {tiers.map((tier) => (
              <div key={tier.credits} className="rounded-[10px] border border-line bg-paper p-[22px] text-center">
                <IconCoins size={28} className="mx-auto mb-2.5 text-mustard-dark" />
                <h4 className="mb-1 text-sm font-semibold">{tier.credits.toLocaleString("en-IN")} credits</h4>
                <span className="font-mono text-[13px] font-semibold text-stamp-green">₹{tier.amount} voucher</span>
              </div>
            ))}
          </div>
          <div className="flex items-start gap-2.5 rounded-lg border border-dashed border-stamp-green bg-paper-2 px-[18px] py-4 text-[13px] text-ink-soft">
            <IconShieldCheck size={18} className="mt-0.5 shrink-0 text-stamp-green" />
            <div>
              <strong className="text-ink">Clean and simple, by design.</strong> Credits accumulate automatically from every successful
              referral. Once you cross a milestone, pick your voucher — Amazon Pay, Zomato or BookMyShow — no cash changes hands, which keeps
              this straightforward for everyone involved.
            </div>
          </div>
          <div className="mt-3.5 flex items-start gap-2.5 rounded-lg border border-dashed border-oxide bg-paper-2 px-[18px] py-4 text-[13px] text-ink-soft">
            <IconRefresh size={18} className="mt-0.5 shrink-0 text-oxide" />
            <div>
              <strong className="text-ink">The ladder repeats — it never runs out.</strong> Once you claim the 50,000-credit voucher, your
              progress resets to zero and the same three milestones start over. Refer as much as you like; there&apos;s always another reward
              ahead.
            </div>
          </div>
          <div className="mt-4 overflow-hidden rounded-lg border border-line bg-paper">
            <div className="flex justify-between bg-paper-2 px-[18px] py-[11px] text-[11px] font-bold tracking-[0.03em] text-ink-soft uppercase">
              <span>What gets referred</span>
              <span>Credits earned</span>
            </div>
            {rules.map((rule) => (
              <div key={rule.label} className="flex justify-between border-b border-line-soft px-[18px] py-[11px] text-[13px] last:border-b-0">
                <span>{rule.label}</span>
                <span className="font-mono font-semibold text-stamp-green">{rule.credits.toLocaleString("en-IN")}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="px-6 py-11 sm:py-16">
        <div className="mx-auto max-w-[1080px]">
          <p className="mb-2.5 text-xs font-semibold tracking-[0.1em] text-oxide uppercase">Questions</p>
          <h2 className="mb-9 text-[26px] sm:text-[30px]">Common questions</h2>
          <div className="max-w-[680px]">
            {faq.map((item) => (
              <AccordionItem key={item.question} question={item.question} answer={item.answer} defaultOpen={item.openByDefault} />
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-11 sm:py-16">
        <div className="mx-auto max-w-[1080px]">
          <div className="flex flex-wrap items-center justify-between gap-[18px] rounded-[10px] bg-ink px-7 py-9 text-left text-paper">
            <div>
              <h2 className="mb-1 text-[22px]">Ready to start earning?</h2>
              <p className="text-[13.5px] text-[#c9c4b4]">Get your code in about 2 minutes.</p>
            </div>
            <button type="button" onClick={onGetCode} className="rounded-[5px] bg-oxide px-[22px] py-3 text-sm font-semibold text-paper hover:bg-oxide-dark">
              Get my referral code
            </button>
          </div>
        </div>
      </section>

      <footer className="border-t border-line bg-paper-2 py-7">
        <div className="mx-auto flex max-w-[1080px] flex-wrap items-center justify-between gap-3 px-6 text-[13px] text-ink-soft">
          <span>© 2026 aglaowner referral network</span>
          <span>
            Looking to buy or sell your own business, equipment, a space, or excess stock?{" "}
            <Link href="/" className="hover:text-oxide">
              Visit aglaowner →
            </Link>{" "}
            &nbsp;·&nbsp;{" "}
            <button type="button" onClick={onDashboard} className="hover:text-oxide">
              My dashboard
            </button>
          </span>
        </div>
      </footer>
    </div>
  );
}
