"use client";

import { useMemo, useState } from "react";
import { IconSearch } from "@tabler/icons-react";
import { getAdminReferrers } from "@/lib/data/admin";

/** #sec-referrers — searchable referrer table with status badges. Search actually filters. */
export function ReferrersSection({ onToast }: { onToast: (msg: string) => void }) {
  const referrers = getAdminReferrers();
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return referrers;
    return referrers.filter((r) => r.code.toLowerCase().includes(q) || r.mobile.toLowerCase().includes(q));
  }, [referrers, query]);

  return (
    <div>
      <div className="mb-7 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-[23px] font-semibold">Referrers</h1>
          <p className="mt-[3px] text-[13px] text-ink-soft">Everyone who has generated a referral code</p>
        </div>
      </div>

      <div className="mb-4 flex max-w-[320px] items-center gap-2 rounded-md border border-line bg-paper-2 px-3.5 py-[9px]">
        <IconSearch size={16} className="text-ink-soft" stroke={1.75} />
        <input
          type="text"
          placeholder="Search by code or mobile number"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 border-none bg-transparent text-[13px] text-ink outline-none"
        />
      </div>

      <div className="overflow-hidden rounded-lg border border-line bg-paper">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                {["Code", "Mobile", "Referrals", "Ongoing cycle", "Status", ""].map((h) => (
                  <th key={h} className="border-b-2 border-line px-3 py-[9px] text-left text-[11px] font-semibold tracking-[0.04em] text-ink-soft uppercase">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.code}>
                  <td className="border-b border-line-soft px-3 py-[11px] font-mono text-[13px]">{r.code}</td>
                  <td className="border-b border-line-soft px-3 py-[11px] text-[13px]">{r.mobile}</td>
                  <td className="border-b border-line-soft px-3 py-[11px] text-[13px]">{r.referrals}</td>
                  <td className="border-b border-line-soft px-3 py-[11px] text-[13px]">
                    {r.cycleProgress.toLocaleString("en-IN")} / {r.cycleTarget.toLocaleString("en-IN")}
                  </td>
                  <td className="border-b border-line-soft px-3 py-[11px] text-[13px]">
                    <span
                      className={`rounded-[20px] px-2.5 py-1 text-[11px] font-bold ${
                        r.status === "active" ? "bg-[#e7efe6] text-stamp-green" : "bg-paper-2 text-ink-soft"
                      }`}
                    >
                      {r.statusLabel}
                    </span>
                  </td>
                  <td className="border-b border-line-soft px-3 py-[11px] text-[13px]">
                    <span
                      className="cursor-pointer text-[12.5px] font-semibold text-navyblue hover:underline"
                      onClick={() => onToast(`Viewing ${r.code} — this is a prototype, no detail view is wired`)}
                    >
                      View
                    </span>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-3 py-6 text-center text-[13px] text-ink-soft">
                    No referrers match &ldquo;{query}&rdquo;.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
