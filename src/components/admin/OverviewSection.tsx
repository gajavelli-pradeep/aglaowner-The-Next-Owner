"use client";

import { IconRocket } from "@tabler/icons-react";
import { getOverviewStats, getOverviewActivity } from "@/lib/data/admin";
import type { AdminSection } from "@/types/admin";

/** #sec-overview — stat grid, launch-promo banner, recent referral activity table. */
export function OverviewSection({ onNavigate }: { onNavigate: (section: AdminSection) => void }) {
  const stats = getOverviewStats();
  const activity = getOverviewActivity();

  return (
    <div>
      <div className="mb-7 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-[23px] font-semibold">Overview</h1>
          <p className="mt-[3px] text-[13px] text-ink-soft">How the referral program is doing right now</p>
        </div>
      </div>

      <div className="mb-[26px] flex flex-wrap items-center justify-between gap-3 rounded-lg border border-mustard bg-[#f0e2cf] px-5 py-4">
        <div className="flex items-start gap-3">
          <IconRocket size={19} className="mt-px shrink-0 text-mustard-dark" stroke={1.75} />
          <div>
            <strong className="mb-0.5 block text-[13.5px]">Launch promotion is active</strong>
            <p className="text-[12.5px] text-ink-soft">Every successful referral earns a flat ₹300 voucher, no ladder — running until 31 Dec 2026.</p>
          </div>
        </div>
        <span className="cursor-pointer text-[12.5px] font-semibold text-navyblue hover:underline" onClick={() => onNavigate("rules")}>
          Manage promotion →
        </span>
      </div>

      <div className="mb-7 grid grid-cols-2 gap-4 md:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-lg border border-line bg-paper px-5 py-[18px]">
            <b className="block font-mono text-[23px] font-semibold">{s.value}</b>
            <span className="text-[11.5px] tracking-[0.04em] text-ink-soft uppercase">{s.label}</span>
          </div>
        ))}
      </div>

      <div className="mb-5 rounded-lg border border-line bg-paper p-[22px]">
        <h3 className="mb-1 text-[14.5px] font-semibold">Recent referral activity</h3>
        <p className="mb-4 text-[12.5px] text-ink-soft">Latest listings created using a referral code, across all referrers</p>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                {["Listing ref", "Type", "Referrer code", "Date", "Credits"].map((h) => (
                  <th key={h} className="border-b-2 border-line px-3 py-[9px] text-left text-[11px] font-semibold tracking-[0.04em] text-ink-soft uppercase">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {activity.map((row) => (
                <tr key={row.listingRef} className="last:[&>td]:border-b-0">
                  <td className="border-b border-line-soft px-3 py-[11px] font-mono text-[13px]">{row.listingRef}</td>
                  <td className="border-b border-line-soft px-3 py-[11px] text-[13px]">{row.type}</td>
                  <td className="border-b border-line-soft px-3 py-[11px] font-mono text-[13px]">{row.referrerCode}</td>
                  <td className="border-b border-line-soft px-3 py-[11px] text-[13px]">{row.date}</td>
                  <td className="border-b border-line-soft px-3 py-[11px] text-[13px]">+{row.credits.toLocaleString("en-IN")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
