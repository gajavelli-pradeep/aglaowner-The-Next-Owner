"use client";

import { useState } from "react";
import { IconCheck, IconRefresh } from "@tabler/icons-react";
import { Flyer } from "@/components/ui/Flyer";
import { CtaBuy } from "@/components/ui/Buttons";
import type { ConfirmFlyerData } from "@/types/listing";

interface RefLine {
  k: string;
  v: string;
}

/** .confirm — generic confirmation screen shared by every sell/reactivate/equipment-addon flow (same structure, different data). */
export function ConfirmScreen({
  reactivated = false,
  heading,
  body,
  refLines,
  shareIntro,
  flyer,
  flyerAlt,
  onToast,
  onHome,
}: {
  reactivated?: boolean;
  heading?: string;
  body: string;
  refLines: RefLine[];
  shareIntro?: string;
  flyer: ConfirmFlyerData;
  /** When present, renders the sell-confirm business/equipment flyer pager toggle. */
  flyerAlt?: { business: ConfirmFlyerData; equipment: ConfirmFlyerData };
  onToast: (msg: string) => void;
  onHome: () => void;
}) {
  const [pagerType, setPagerType] = useState<"business" | "equipment">("business");
  const activeFlyer = flyerAlt ? flyerAlt[pagerType] : flyer;

  return (
    <div className="mx-auto max-w-[440px] px-6 py-14 text-center">
      <div className={`mx-auto mb-[22px] flex h-[110px] w-[110px] rotate-[-6deg] items-center justify-center rounded-full border-[3px] border-dashed border-stamp-green`}>
        {reactivated ? <IconRefresh size={40} className="text-stamp-green" /> : <IconCheck size={40} className="text-stamp-green" />}
      </div>
      <h2 className="mb-2.5 text-[22px]">{heading ?? (reactivated ? "Your listing is live again" : "Your listing is live")}</h2>
      <p className="mb-[22px] text-sm text-ink-soft">{body}</p>
      <div className="mb-6 rounded-md border border-line bg-paper-2 p-4 text-left font-mono text-[13px]">
        {refLines.map((line) => (
          <div key={line.k}>
            <span className="font-sans text-ink-soft">{line.k}</span> &nbsp; {line.v}
          </div>
        ))}
      </div>

      <p className="mb-3.5 text-[13px] font-semibold text-ink-soft">
        {shareIntro ?? (reactivated ? "Back live — a fresh share can bring fresh eyes" : "Spread the word — every share helps it sell faster")}
      </p>

      {flyerAlt && (
        <div className="mb-3.5 inline-flex rounded-[9px] border border-line bg-paper-2 p-[3px]">
          {(["business", "equipment"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setPagerType(t)}
              className={`rounded-md px-[18px] py-[9px] text-[13px] font-semibold transition-colors ${
                pagerType === t ? "bg-ink text-paper" : "bg-transparent text-ink-soft"
              }`}
            >
              {t === "business" ? "Business flyer" : "Equipment flyer"}
            </button>
          ))}
        </div>
      )}

      <Flyer data={activeFlyer} onToast={onToast} />

      <CtaBuy onClick={onHome}>Back to home</CtaBuy>
    </div>
  );
}
