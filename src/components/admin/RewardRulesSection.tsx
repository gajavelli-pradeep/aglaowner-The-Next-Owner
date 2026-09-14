"use client";

import { useState } from "react";
import type { AdminCreditRule, AdminRewardTier, AdminPromotion, PromoMode } from "@/types/admin";

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

type OnToast = (msg: string, variant?: "default" | "error") => void;

/** #sec-rules — editable credit table, voucher milestones, and the promo-override toggle group, all backed by the real credit_rules / reward_tiers / promotions tables. */
export function RewardRulesSection({
  onToast,
  initialCreditRules,
  initialRewardTiers,
  initialPromotion,
}: {
  onToast: OnToast;
  initialCreditRules: AdminCreditRule[];
  initialRewardTiers: AdminRewardTier[];
  initialPromotion: AdminPromotion;
}) {
  const [credits, setCredits] = useState(() => initialCreditRules.map((r) => ({ ...r, value: String(r.credits) })));
  const [savingCredits, setSavingCredits] = useState(false);

  const [milestones, setMilestones] = useState(() =>
    initialRewardTiers.map((t) => ({ id: t.id, threshold: String(t.credits), amount: String(t.amount) }))
  );
  const [savingMilestones, setSavingMilestones] = useState(false);

  const [promoOn, setPromoOn] = useState(initialPromotion.active);
  const [promoMode, setPromoMode] = useState<PromoMode>(initialPromotion.mode);
  const [flatAmount, setFlatAmount] = useState(String(initialPromotion.flatAmount));
  const [multiplier, setMultiplier] = useState(String(initialPromotion.multiplier));
  const [startDate, setStartDate] = useState(initialPromotion.startsAt);
  const [endDate, setEndDate] = useState(initialPromotion.endsAt);
  const [savingPromo, setSavingPromo] = useState(false);

  async function saveCredits() {
    const rows = credits.map((r) => ({ code: r.code, credits: Number(r.value) }));
    if (rows.some((r) => !Number.isInteger(r.credits) || r.credits <= 0)) {
      onToast("Every credit value must be a whole number greater than zero.", "error");
      return;
    }
    setSavingCredits(true);
    const res = await fetch("/api/admin/reward-rules/credits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rows }),
    });
    setSavingCredits(false);
    if (!res.ok) {
      const { error } = await res.json().catch(() => ({ error: "Could not save. Try again." }));
      onToast(error, "error");
      return;
    }
    onToast("Credit values saved — live on the referral page now");
  }

  async function saveMilestones() {
    const rows = milestones.map((m) => ({ credits: Number(m.threshold), amount: Number(m.amount) }));
    if (rows.some((r) => !Number.isInteger(r.credits) || r.credits <= 0 || !Number.isInteger(r.amount) || r.amount <= 0)) {
      onToast("Every threshold and voucher amount must be a whole number greater than zero.", "error");
      return;
    }
    setSavingMilestones(true);
    const res = await fetch("/api/admin/reward-rules/tiers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rows }),
    });
    setSavingMilestones(false);
    if (!res.ok) {
      const { error } = await res.json().catch(() => ({ error: "Could not save. Try again." }));
      onToast(error, "error");
      return;
    }
    onToast("Voucher milestones saved — live on the referral page now");
  }

  async function savePromotion() {
    const flat = Number(flatAmount);
    const mult = Number(multiplier);
    if (!Number.isInteger(flat) || flat <= 0) {
      onToast("Flat voucher amount must be a whole number greater than zero.", "error");
      return;
    }
    if (!(mult > 0)) {
      onToast("Multiplier must be a number greater than zero.", "error");
      return;
    }
    setSavingPromo(true);
    const res = await fetch("/api/admin/reward-rules/promotion", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: promoOn, mode: promoMode, flatAmount: flat, multiplier: mult, startsAt: startDate, endsAt: endDate }),
    });
    setSavingPromo(false);
    if (!res.ok) {
      const { error } = await res.json().catch(() => ({ error: "Could not save. Try again." }));
      onToast(error, "error");
      return;
    }
    onToast("Promotion settings saved");
  }

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
                <tr key={rule.code}>
                  <td className="border-b border-line-soft px-3 py-[11px] text-[13px]">{rule.label}</td>
                  <td className="border-b border-line-soft px-3 py-[11px] text-[13px]">
                    <input
                      type="text"
                      inputMode="numeric"
                      value={rule.value}
                      onChange={(e) => setCredits((prev) => prev.map((r, idx) => (idx === i ? { ...r, value: e.target.value } : r)))}
                      className="w-[90px] rounded border border-line bg-paper-2 px-[9px] py-[7px] font-mono text-[13px] text-ink"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button
          disabled={savingCredits}
          className="mt-3.5 rounded-[5px] bg-ink px-[18px] py-[9px] text-[13px] font-semibold text-paper hover:bg-[#3a4235] disabled:opacity-60"
          onClick={saveCredits}
        >
          {savingCredits ? "Saving…" : "Save credit values"}
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
                      inputMode="numeric"
                      value={m.threshold}
                      onChange={(e) => setMilestones((prev) => prev.map((row, idx) => (idx === i ? { ...row, threshold: e.target.value } : row)))}
                      className="w-[90px] rounded border border-line bg-paper-2 px-[9px] py-[7px] font-mono text-[13px] text-ink"
                    />
                  </td>
                  <td className="border-b border-line-soft px-3 py-[11px] text-[13px]">
                    <input
                      type="text"
                      inputMode="numeric"
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
          disabled={savingMilestones}
          className="mt-3.5 rounded-[5px] bg-ink px-[18px] py-[9px] text-[13px] font-semibold text-paper hover:bg-[#3a4235] disabled:opacity-60"
          onClick={saveMilestones}
        >
          {savingMilestones ? "Saving…" : "Save milestones"}
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
                <label className="mb-1.5 block text-xs font-semibold text-ink-soft">Flat voucher amount (₹)</label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={flatAmount}
                  onChange={(e) => setFlatAmount(e.target.value)}
                  className="w-full rounded-[5px] border border-line bg-paper-2 px-[11px] py-[9px] text-[13px] text-ink"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-ink-soft">Multiplier (if selected)</label>
                <input
                  type="text"
                  inputMode="decimal"
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
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full rounded-[5px] border border-line bg-paper-2 px-[11px] py-[9px] text-[13px] text-ink"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-ink-soft">Promotion end date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full rounded-[5px] border border-line bg-paper-2 px-[11px] py-[9px] text-[13px] text-ink"
                />
              </div>
            </div>
            <button
              disabled={savingPromo}
              className="rounded-[5px] bg-ink px-[18px] py-[9px] text-[13px] font-semibold text-paper hover:bg-[#3a4235] disabled:opacity-60"
              onClick={savePromotion}
            >
              {savingPromo ? "Saving…" : "Save promotion settings"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
