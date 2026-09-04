"use client";

import { useState } from "react";
import { IconInfoCircle } from "@tabler/icons-react";
import { getListingTypeSettings, getSettingsSurfaces } from "@/lib/data/admin";

/** #sec-listing — editable active/archive/fee table per listing type + informational surfaces table. */
export function ListingSettingsSection({ onToast }: { onToast: (msg: string) => void }) {
  const [rows, setRows] = useState(() =>
    getListingTypeSettings().map((r) => ({
      type: r.type,
      activeDays: String(r.activeDays),
      archiveDays: String(r.archiveDays),
      listingFee: String(r.listingFee),
      reactivationFee: String(r.reactivationFee),
    }))
  );
  const surfaces = getSettingsSurfaces();

  function updateRow(i: number, field: "activeDays" | "archiveDays" | "listingFee" | "reactivationFee", value: string) {
    setRows((prev) => prev.map((r, idx) => (idx === i ? { ...r, [field]: value } : r)));
  }

  return (
    <div>
      <div className="mb-7 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-[23px] font-semibold">Listing Settings</h1>
          <p className="mt-[3px] text-[13px] text-ink-soft">
            Active period, archive window, and fees — the numbers every listing screen on the site reads from
          </p>
        </div>
      </div>

      <div className="mb-[26px] flex flex-wrap items-center gap-3 rounded-lg border border-navyblue px-5 py-4" style={{ background: "#e0e8f0" }}>
        <div className="flex items-start gap-3">
          <IconInfoCircle size={19} className="mt-px shrink-0 text-navyblue" stroke={1.75} />
          <div>
            <strong className="mb-0.5 block text-[13.5px]">This is a demonstration, not a live control.</strong>
            <p className="text-[12.5px] text-ink-soft">
              In a real build, changing a value here would update every mention of it across the whole site instantly. Since this prototype has no backend,
              clicking &ldquo;Save&rdquo; below confirms the intent but doesn&apos;t actually propagate the change to the live pages — someone would still
              need to update those files directly, the same way it was just done manually.
            </p>
          </div>
        </div>
      </div>

      <div className="mb-5 rounded-lg border border-line bg-paper p-[22px]">
        <h3 className="mb-1 text-[14.5px] font-semibold">Active period, archive window &amp; fees, by listing type</h3>
        <p className="mb-4 text-[12.5px] text-ink-soft">
          Business intentionally gets a longer runway than the other three — see the reasoning captured in Reward Rules if this ever needs revisiting
        </p>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                {["Listing type", "Active (days)", "Archive (days)", "Listing fee (₹)", "Reactivation fee (₹)"].map((h) => (
                  <th key={h} className="border-b-2 border-line px-3 py-[9px] text-left text-[11px] font-semibold tracking-[0.04em] text-ink-soft uppercase">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={r.type}>
                  <td className="border-b border-line-soft px-3 py-[11px] text-[13px]">{r.type}</td>
                  {(["activeDays", "archiveDays", "listingFee", "reactivationFee"] as const).map((field) => (
                    <td key={field} className="border-b border-line-soft px-3 py-[11px] text-[13px]">
                      <input
                        type="text"
                        value={r[field]}
                        onChange={(e) => updateRow(i, field, e.target.value)}
                        className="w-[90px] rounded border border-line bg-paper-2 px-[9px] py-[7px] font-mono text-[13px] text-ink"
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button
          className="mt-3.5 rounded-[5px] bg-ink px-[18px] py-[9px] text-[13px] font-semibold text-paper hover:bg-[#3a4235]"
          onClick={() => onToast('Listing settings saved — see note above on what this does today')}
        >
          Save listing settings
        </button>
      </div>

      <div className="rounded-lg border border-line bg-paper p-[22px]">
        <h3 className="mb-1 text-[14.5px] font-semibold">Where these numbers currently live</h3>
        <p className="mb-4 text-[12.5px] text-ink-soft">
          Until this panel is wired to a real backend, these are the actual places that would each need a manual edit today
        </p>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="border-b-2 border-line px-3 py-[9px] text-left text-[11px] font-semibold tracking-[0.04em] text-ink-soft uppercase">Surface</th>
                <th className="border-b-2 border-line px-3 py-[9px] text-left text-[11px] font-semibold tracking-[0.04em] text-ink-soft uppercase">
                  What it shows
                </th>
              </tr>
            </thead>
            <tbody>
              {surfaces.map((s) => (
                <tr key={s.surface}>
                  <td className="border-b border-line-soft px-3 py-[11px] text-[13px]">{s.surface}</td>
                  <td className="border-b border-line-soft px-3 py-[11px] text-[13px]">{s.shows}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
