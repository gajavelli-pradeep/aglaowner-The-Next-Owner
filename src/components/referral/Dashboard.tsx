"use client";

import { useState } from "react";
import { IconCheck, IconGift, IconLock, IconRefresh } from "@tabler/icons-react";
import { iconFor } from "@/lib/tablerIconMap";
import { VoucherModal } from "@/components/referral/VoucherModal";
import { getReferralCode, getRewardTierSeeds, getReferralActivity, getInitialRewardHistory, getInitialDashboardStats } from "@/lib/data/referral";
import type { RewardHistoryEntry } from "@/types/referral";

type TierStatus = "claimed" | "unlocked" | "locked";
interface TierState {
  credits: number;
  amount: number;
  status: TierStatus;
  claimedLabel?: string;
}

/** dashboard screen — stats, progress, claimable tier ladder, reward history, and this-cycle referral activity. */
export function Dashboard({ onToast }: { onToast: (msg: string) => void }) {
  const code = getReferralCode();
  const seeds = getRewardTierSeeds();
  const activity = getReferralActivity();
  const stats0 = getInitialDashboardStats();

  const [earnedSoFar, setEarnedSoFar] = useState(stats0.earnedSoFar);
  const [availableNow, setAvailableNow] = useState(stats0.availableNow);
  const [cycleProgress, setCycleProgress] = useState(stats0.cycleProgress);
  const cycleTarget = stats0.cycleTarget;
  // Seed matches the source HTML's initial snapshot: tier 1 already claimed, tier 2 unlocked, tier 3 locked.
  const [tiers, setTiers] = useState<TierState[]>([
    { credits: seeds[0].credits, amount: seeds[0].amount, status: "claimed", claimedLabel: "Amazon Pay ₹500 claimed" },
    { credits: seeds[1].credits, amount: seeds[1].amount, status: "unlocked" },
    { credits: seeds[2].credits, amount: seeds[2].amount, status: "locked" },
  ]);
  const [history, setHistory] = useState<RewardHistoryEntry[]>(getInitialRewardHistory());
  const [modalTierIndex, setModalTierIndex] = useState<number | null>(null);

  const activeTier = modalTierIndex !== null ? tiers[modalTierIndex] : null;

  function claimVoucher(provider: string) {
    if (modalTierIndex === null) return;
    const tier = tiers[modalTierIndex];
    const isFinalTier = modalTierIndex === tiers.length - 1;
    const amount = tier.amount;

    setTiers((prev) => prev.map((t, i) => (i === modalTierIndex ? { ...t, status: "claimed", claimedLabel: `${provider} ₹${amount} claimed` } : t)));
    setHistory((prev) => [{ provider, amount, date: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) }, ...prev]);
    setEarnedSoFar((v) => v + amount);
    setAvailableNow((v) => Math.max(0, v - 1));
    setModalTierIndex(null);
    onToast(`Reward claimed — ${provider} ₹${amount} voucher sent to your email`);

    if (isFinalTier) {
      setTimeout(() => {
        setTiers((prev) => prev.map((t) => ({ credits: t.credits, amount: t.amount, status: "locked" as TierStatus })));
        setCycleProgress(0);
        onToast("Cycle complete — your progress has reset. Keep referring to start earning again!");
      }, 700);
    }
  }

  const progressPct = Math.min(100, Math.round((cycleProgress / cycleTarget) * 100));

  return (
    <div className="px-6 pt-7 pb-12">
      <div className="mb-[22px] flex flex-wrap items-center justify-between gap-4 rounded-[10px] border border-line bg-paper p-[22px_26px]">
        <div>
          <div className="mb-1 text-[11px] font-semibold tracking-[0.03em] text-ink-soft uppercase">Your referral code</div>
          <div className="font-mono text-xl font-semibold tracking-[0.05em] text-oxide">{code}</div>
        </div>
        <button
          type="button"
          onClick={() =>
            window.open(
              `https://wa.me/?text=${encodeURIComponent(
                `Heard about aglaowner from someone and tried it myself — genuinely useful when selling a business, equipment, a lease, or excess stock. Use my code ${code} when you list: https://aglaowner.in`
              )}`,
              "_blank"
            )
          }
          className="inline-flex items-center gap-1.5 rounded-md border border-stamp-green bg-stamp-green px-[18px] py-[11px] text-[13px] font-semibold text-paper hover:opacity-85"
        >
          Share code
        </button>
      </div>

      <div className="mb-[26px] grid grid-cols-2 gap-3.5">
        <div className="rounded-lg border border-line bg-paper p-[18px] text-center">
          <b className="block font-mono text-2xl font-semibold">₹{earnedSoFar}</b>
          <span className="text-[11px] tracking-[0.05em] text-ink-soft uppercase">Earned so far</span>
        </div>
        <div className="rounded-lg border border-line bg-paper p-[18px] text-center">
          <b className="block font-mono text-2xl font-semibold">{availableNow}</b>
          <span className="text-[11px] tracking-[0.05em] text-ink-soft uppercase">Available now</span>
        </div>
      </div>

      <div className="mb-6">
        <div className="mb-2 text-[12.5px] font-semibold text-ink-soft">
          Ongoing cycle &nbsp;·&nbsp; {cycleProgress.toLocaleString("en-IN")} / {cycleTarget.toLocaleString("en-IN")} credits toward your next milestone
        </div>
        <div className="h-2.5 overflow-hidden rounded-[20px] border border-line bg-paper-2">
          <div className="h-full rounded-[20px] bg-stamp-green transition-[width]" style={{ width: `${progressPct}%` }} />
        </div>
      </div>

      <div className="mb-7 flex flex-col gap-3">
        {tiers.map((tier, i) => (
          <div
            key={tier.credits}
            className={`flex items-center gap-3.5 rounded-lg border bg-paper p-[16px_18px] ${
              tier.status === "unlocked" ? "border-2 border-oxide" : "border-line"
            } ${tier.status === "claimed" ? "opacity-70" : ""}`}
          >
            <div
              className={`flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-full border bg-paper-2 ${
                tier.status === "claimed" ? "border-stamp-green text-stamp-green" : tier.status === "unlocked" ? "border-oxide text-oxide" : "border-line text-line"
              }`}
            >
              {tier.status === "claimed" ? <IconCheck size={17} /> : tier.status === "unlocked" ? <IconGift size={17} /> : <IconLock size={17} />}
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold">{tier.credits.toLocaleString("en-IN")} credits</div>
              <div className="text-xs text-ink-soft">₹{tier.amount} voucher</div>
            </div>
            {tier.status === "claimed" && (
              <span className="rounded-[20px] bg-[#e7efe6] px-3 py-1.5 text-[11px] font-bold text-stamp-green">{tier.claimedLabel}</span>
            )}
            {tier.status === "unlocked" && (
              <button
                type="button"
                onClick={() => setModalTierIndex(i)}
                className="rounded-[5px] bg-oxide px-4 py-2.5 text-[12.5px] font-semibold text-paper hover:bg-oxide-dark"
              >
                Claim voucher
              </button>
            )}
            {tier.status === "locked" && (
              <span className="text-xs font-semibold text-ink-soft">{Math.max(0, tier.credits - cycleProgress).toLocaleString("en-IN")} credits to go</span>
            )}
          </div>
        ))}
      </div>

      <p className="mb-[22px] flex items-center gap-1.5 text-[12.5px] font-medium text-stamp-green">
        <IconRefresh size={14} /> This ladder repeats — once you claim the 50,000-credit voucher, it resets to zero and starts over. No limit on how many times.
      </p>

      <p className="mb-3.5 text-[13px] text-ink-soft">Reward history — every voucher you&apos;ve earned, regardless of which cycle it came from</p>
      <div className="mb-2">
        {history.map((h, i) => (
          <div key={`${h.provider}-${h.date}-${i}`} className="mb-2.5 flex items-center justify-between rounded-lg border border-line bg-paper p-[13px_18px]">
            <div className="flex items-center gap-2 text-[13.5px] font-semibold">
              <IconGift size={16} className="text-stamp-green" /> {h.provider} ₹{h.amount}
            </div>
            <div className="text-xs text-ink-soft">{h.date}</div>
          </div>
        ))}
      </div>

      <p className="mt-[26px] mb-3.5 text-[13px] text-ink-soft">
        How you&apos;re earning credits this cycle — shown for transparency, not clickable, to keep every listing private
      </p>
      {activity.map((row) => {
        const Icon = iconFor(row.icon);
        return (
          <div key={row.code} className="mb-3 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-line bg-paper-2 p-[16px_20px]">
            <div className="flex items-center gap-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-line bg-paper">
                <Icon size={17} className="text-line" />
              </div>
              <div>
                <div className="text-[13.5px] font-semibold text-ink-soft">
                  {row.code} &nbsp;·&nbsp; {row.label}
                </div>
                <div className="text-[11px] text-ink-soft opacity-80">Used {row.date}</div>
              </div>
            </div>
            <span className="rounded-[20px] bg-[#e7efe6] px-3 py-1.5 font-mono text-[12.5px] font-semibold text-stamp-green">
              +{row.credits.toLocaleString("en-IN")} credits
            </span>
          </div>
        );
      })}

      <VoucherModal open={activeTier !== null} amount={activeTier?.amount ?? 0} onClose={() => setModalTierIndex(null)} onClaim={claimVoucher} />
    </div>
  );
}
