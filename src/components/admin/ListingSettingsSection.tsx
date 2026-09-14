"use client";

import { useState } from "react";
import { getSettingsSurfaces } from "@/lib/data/admin";
import { LISTING_TYPES } from "@/lib/data/listing-types";
import type { ListingTypeSetting } from "@/types/admin";

type Field = "activeDays" | "archiveDays" | "listingFee" | "reactivationFee";
const FIELDS: Field[] = ["activeDays", "archiveDays", "listingFee", "reactivationFee"];
const TYPE_BY_LABEL = new Map<string, string>(LISTING_TYPES.map((t) => [t.label, t.dbType]));

/** #sec-listing — editable active/archive/fee table per listing type, backed by the real listing_type_settings table (also read by the homepage Pricing section). */
export function ListingSettingsSection({
  onToast,
  initialSettings,
}: {
  onToast: (msg: string, variant?: "default" | "error") => void;
  initialSettings: ListingTypeSetting[];
}) {
  const [rows, setRows] = useState(() =>
    initialSettings.map((r) => ({
      type: r.type,
      activeDays: String(r.activeDays),
      archiveDays: String(r.archiveDays),
      listingFee: String(r.listingFee),
      reactivationFee: String(r.reactivationFee),
    }))
  );
  const [saving, setSaving] = useState(false);
  const surfaces = getSettingsSurfaces();

  function updateRow(i: number, field: Field, value: string) {
    setRows((prev) => prev.map((r, idx) => (idx === i ? { ...r, [field]: value } : r)));
  }

  async function handleSave() {
    const payload = rows.map((r) => ({
      type: TYPE_BY_LABEL.get(r.type),
      activeDays: Number(r.activeDays),
      archiveDays: Number(r.archiveDays),
      listingFee: Number(r.listingFee),
      reactivationFee: Number(r.reactivationFee),
    }));
    const invalid = payload.some((r) => !r.type || FIELDS.some((f) => !Number.isInteger(r[f]) || r[f] <= 0));
    if (invalid) {
      onToast("Every field must be a whole number greater than zero.", "error");
      return;
    }

    setSaving(true);
    const res = await fetch("/api/admin/listing-settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rows: payload }),
    });
    setSaving(false);
    if (!res.ok) {
      const { error } = await res.json().catch(() => ({ error: "Could not save. Try again." }));
      onToast(error, "error");
      return;
    }
    onToast("Listing settings saved — live on the site now");
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
                  {FIELDS.map((field) => (
                    <td key={field} className="border-b border-line-soft px-3 py-[11px] text-[13px]">
                      <input
                        type="text"
                        inputMode="numeric"
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
          disabled={saving}
          className="mt-3.5 rounded-[5px] bg-ink px-[18px] py-[9px] text-[13px] font-semibold text-paper hover:bg-[#3a4235] disabled:opacity-60"
          onClick={handleSave}
        >
          {saving ? "Saving…" : "Save listing settings"}
        </button>
      </div>

      <div className="rounded-lg border border-line bg-paper p-[22px]">
        <h3 className="mb-1 text-[14.5px] font-semibold">Where these numbers currently live</h3>
        <p className="mb-4 text-[12.5px] text-ink-soft">
          Surfaces across the site that read these values today; the homepage Pricing section reads them live, the rest still hardcode copy from them.
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
