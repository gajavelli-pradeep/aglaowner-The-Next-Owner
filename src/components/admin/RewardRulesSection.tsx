"use client";

import { useState } from "react";
import { getCreditRules, getRewardTierSeeds } from "@/lib/data/referral";
import type { PromoMode } from "@/types/admin";

const PROMO_OPTIONS: { mode: PromoMode; title: string; desc: string }[] = [
  {
    mode: "flat",
    title: "Flat voucher per referral",
    desc: "skip the ladder entirely; every successful referral earns a fixed voucher amount, regardless of listing type.",
  },
  {
    mode: "multiplier",
    title: "Credit multiplier",
    desc: "keep the ladder, but multiply every credit earned by a fixed factor so referrers reach milestones faster.",
  },
  {
    mode: "free-listing",
    title: "Free listing for referred users",
    desc: "the referred seller's listing fee is waived entirely during the promotion, instead of rewarding the referrer more.",
  },
];

/** #sec-rules — editable credit table, voucher milestones, and the promo-override toggle group. */
export function RewardRulesSection({ onToast }: { onToast: (msg: string) => void }) {
  const [credits, setCredits] = useState(() => getCreditRules().map((r) => ({ ...r, value: r.credits.toLocaleString("en-IN") })));
  const [milestones, setMilestones] = useState(() =>
    getRewardTierSeeds().map((t) => ({ threshold: t.credits.toLocaleString("en-IN"), amount: t.amount.toLocaleString("en-IN") }))
  );
  const [promoOn, setPromoOn] = useState(true);
  const [promoMode, setPromoMode] = useState<PromoMode>("flat");
  const [flatAmount, setFlatAmount] = useState("₹300");
  const [multiplier, setMultiplier] = useState("2x");
  const [startDate, setStartDate] = useState("01 Jul 2026");
  const [endDate, setEndDate] = useState("31 Dec 2026");

  return (
    <div>
      <div className="mb-7 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-[23px] font-semibold">Reward Rules</h1>
          <p className="mt-[3px] text-[13px] text-ink-soft">Credit values, voucher tiers, and promotional overrides</p>
        </div>
      </div>

      <div className="mb-5 rounded-lg border border-line bg-paper p-[22px]">
        <h3 className="mb-1 text-[14.5px] font-semibold">Credits earned per action</h3>
        <p className="mb-4 text-[12.5px] text-ink-soft">
          How many credits each successful referral type contributes to a referrer&apos;s ongoing cycle
        </p>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="border-b-2 border-line px-3 py-[9px] text-left text-[11px] font-semibold tracking-[0.04em] text-ink-soft uppercase">Action</th>
                <th className="border-b-2 border-line px-3 py-[9px] text-left text-[11px] font-semibold tracking-[0.04em] text-ink-soft uppercase">Credits</th>
              </tr>
            </thead>
            <tbody>
              {credits.map((rule, i) => (
                <tr key={rule.label}>
                  <td className="border-b border-line-soft px-3 py-[11px] text-[13px]">{rule.label}</td>
                  <td className="border-b border-line-soft px-3 py-[11px] text-[13px]">
                    <input
                      type="text"
                      value={rule.value}
                      onChange={(e) =>
                        setCredits((prev) => prev.map((r, idx) => (idx === i ? { ...r, value: e.target.value } : r)))
                      }
                      className="w-[90px] rounded border border-line bg-paper-2 px-[9px] py-[7px] font-mono text-[13px] text-ink"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button
          className="mt-3.5 rounded-[5px] bg-ink px-[18px] py-[9px] text-[13px] font-semibold text-paper hover:bg-[#3a4235]"
          onClick={() => onToast("Credit values saved")}
        >
          Save credit values
        </button>
      </div>

      <div className="mb-5 rounded-lg border border-line bg-paper p-[22px]">
        <h3 className="mb-1 text-[14.5px] font-semibold">Voucher milestones</h3>
        <p className="mb-4 text-[12.5px] text-ink-soft">The repeating ladder every referrer&apos;s ongoing cycle follows</p>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="border-b-2 border-line px-3 py-[9px] text-left text-[11px] font-semibold tracking-[0.04em] text-ink-soft uppercase">
                  Credits threshold
                </th>
                <th className="border-b-2 border-line px-3 py-[9px] text-left text-[11px] font-semibold tracking-[0.04em] text-ink-soft uppercase">
                  Voucher amount
                </th>
              </tr>
            </thead>
            <tbody>
              {milestones.map((m, i) => (
                <tr key={i}>
                  <td className="border-b border-line-soft px-3 py-[11px] text-[13px]">
                    <input
                      type="text"
                      value={m.threshold}
                      onChange={(e) => setMilestones((prev) => prev.map((row, idx) => (idx === i ? { ...row, threshold: e.target.value } : row)))}
                      className="w-[90px] rounded border border-line bg-paper-2 px-[9px] py-[7px] font-mono text-[13px] text-ink"
                    />
                  </td>
                  <td className="border-b border-line-soft px-3 py-[11px] text-[13px]">
                    <input
                      type="text"
                      value={m.amount}
                      onChange={(e) => setMilestones((prev) => prev.map((row, idx) => (idx === i ? { ...row, amount: e.target.value } : row)))}
                      className="w-[90px] rounded border border-line bg-paper-2 px-[9px] py-[7px] font-mono text-[13px] text-ink"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button
          className="mt-3.5 rounded-[5px] bg-ink px-[18px] py-[9px] text-[13px] font-semibold text-paper hover:bg-[#3a4235]"
          onClick={() => onToast("Voucher milestones saved")}
        >
          Save milestones
        </button>
      </div>

      <div className="rounded-lg border border-line bg-paper p-[22px]">
        <div className="flex items-center justify-between pb-0">
          <div>
            <div className="text-[13.5px] font-semibold">Launch promotion override</div>
            <div className="mt-0.5 text-xs text-ink-soft">Temporarily boost or simplify rewards to incentivise early adoption</div>
          </div>
          <label className="relative h-[23px] w-[42px] shrink-0">
            <input type="checkbox" checked={promoOn} onChange={(e) => setPromoOn(e.target.checked)} className="peer h-0 w-0 opacity-0" />
            <span className="absolute inset-0 cursor-pointer rounded-[20px] bg-line transition-colors peer-checked:bg-stamp-green" />
            <span className="pointer-events-none absolute bottom-[3px] left-[3px] h-[17px] w-[17px] rounded-full bg-paper transition-transform peer-checked:translate-x-[19px]" />
          </label>
        </div>

        {promoOn && (
          <div className="mt-3.5 border-t border-dashed border-line pt-3.5">
            <div className="mb-3.5 flex flex-col gap-2.5">
              {PROMO_OPTIONS.map((opt) => (
                <label key={opt.mode} className="flex items-start gap-[9px] text-[13px]">
                  <input type="radio" name="promomode" checked={promoMode === opt.mode} onChange={() => setPromoMode(opt.mode)} className="mt-[3px]" />
                  <span>
                    <strong>{opt.title}</strong> — {opt.desc}
                  </span>
                </label>
              ))}
            </div>
            <div className="mb-3.5 grid grid-cols-1 gap-3.5 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-ink-soft">Flat voucher amount</label>
                <input
                  type="text"
                  value={flatAmount}
                  onChange={(e) => setFlatAmount(e.target.value)}
                  className="w-full rounded-[5px] border border-line bg-paper-2 px-[11px] py-[9px] text-[13px] text-ink"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-ink-soft">Multiplier (if selected)</label>
                <input
                  type="text"
                  value={multiplier}
                  onChange={(e) => setMultiplier(e.target.value)}
                  className="w-full rounded-[5px] border border-line bg-paper-2 px-[11px] py-[9px] text-[13px] text-ink"
                />
              </div>
            </div>
            <div className="mb-3.5 grid grid-cols-1 gap-3.5 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-ink-soft">Promotion start date</label>
                <input
                  type="text"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full rounded-[5px] border border-line bg-paper-2 px-[11px] py-[9px] text-[13px] text-ink"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-ink-soft">Promotion end date</label>
                <input
                  type="text"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full rounded-[5px] border border-line bg-paper-2 px-[11px] py-[9px] text-[13px] text-ink"
                />
              </div>
            </div>
            <button
              className="rounded-[5px] bg-ink px-[18px] py-[9px] text-[13px] font-semibold text-paper hover:bg-[#3a4235]"
              onClick={() => onToast("Promotion settings saved")}
            >
              Save promotion settings
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
