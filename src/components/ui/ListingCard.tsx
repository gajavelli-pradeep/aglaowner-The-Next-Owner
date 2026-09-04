"use client";

/* eslint-disable react-hooks/static-components -- icon lookup functions return a stable component reference from a static map */

import { IconMapPin } from "@tabler/icons-react";
import { iconFor } from "@/lib/tablerIconMap";

/** .card — result grid card (buy-results screen). */
export function ListingCard({
  icon,
  tag,
  warn,
  title,
  loc,
  price,
  metaRight,
  onView,
}: {
  icon: string;
  tag: string;
  warn: boolean;
  title: string;
  loc: string;
  price: string;
  metaRight: string;
  onView: () => void;
}) {
  const Icon = iconFor(icon);
  return (
    <div className="relative overflow-hidden rounded-md border border-line bg-paper">
      <div className="relative flex h-[130px] items-center justify-center border-b border-line bg-paper-2">
        <Icon size={30} className="text-line" />
        <div
          className={`absolute top-2 right-2 flex h-[52px] w-[52px] -rotate-[9deg] items-center justify-center rounded-full border-2 border-dashed bg-paper/90 text-center ${
            warn ? "border-mustard" : "border-stamp-green"
          }`}
        >
          <span className="text-[8px] leading-tight font-bold text-stamp-green uppercase">{tag}</span>
        </div>
      </div>
      <div className="px-3.5 pt-[13px] pb-[15px]">
        <h3 className="mb-[3px] text-sm font-semibold">{title}</h3>
        <p className="mb-2.5 flex items-center gap-1 text-[11px] text-ink-soft">
          <IconMapPin size={12} /> {loc}
        </p>
        <div className="mb-2.5 flex items-center justify-between">
          <span className="font-mono text-[13px] font-semibold text-mustard-dark">{price}</span>
          <span className="text-[10px] text-ink-soft">{metaRight}</span>
        </div>
        <button
          type="button"
          onClick={onView}
          className="block w-full rounded border border-ink bg-transparent py-2 text-center text-xs font-semibold transition-colors hover:bg-ink hover:text-paper"
        >
          View listing
        </button>
      </div>
    </div>
  );
}
