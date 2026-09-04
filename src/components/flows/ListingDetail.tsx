"use client";

/* eslint-disable react-hooks/static-components -- icon lookup functions return a stable component reference from a static map */

import { IconMapPin, IconShieldCheck } from "@tabler/icons-react";
import { SubmitButton } from "@/components/ui/Buttons";
import { iconFor } from "@/lib/tablerIconMap";
import type { ListingType, SampleListing } from "@/types/listing";

const LABELS: Record<ListingType, [string, string]> = {
  business: ["Years running", "Monthly turnover"],
  equipment: ["Condition", "Brand & model"],
  lease: ["Lease remaining", "Monthly rent"],
  inventory: ["Lot size", "Condition"],
};

function value2(type: ListingType, l: SampleListing): string {
  return { business: l.legacy, equipment: l.condition, lease: l.leaseLeft, inventory: l.lotSize }[type] ?? "";
}
function value3(type: ListingType, l: SampleListing): string {
  return { business: l.turnover, equipment: l.brand, lease: l.rent, inventory: l.category }[type] ?? "";
}

/** .listing-detail — buy-flow listing detail page, opens the verify modal on connect. */
export function ListingDetail({ type, listing, onConnect }: { type: ListingType; listing: SampleListing; onConnect: () => void }) {
  const Icon = iconFor(listing.icon);
  const [label2, label3] = LABELS[type];

  return (
    <div className="mx-auto max-w-[1080px] px-6">
      <div className="pb-0">
        <h2 className="mb-1.5 text-[22px] sm:text-2xl">{listing.title}</h2>
        <p className="flex items-center gap-1 text-ink-soft">
          <IconMapPin size={16} /> {listing.loc}
        </p>
      </div>
      <div className="mt-5 max-w-[640px] rounded-lg border border-line bg-paper p-7">
        <div className="relative mb-[22px] flex h-[220px] items-center justify-center rounded-md bg-paper-2">
          <Icon size={44} className="text-line" />
          <div
            className={`absolute top-3 right-3 flex h-16 w-16 items-center justify-center rounded-full border-2 border-dashed text-center ${
              listing.warn ? "border-mustard" : "border-stamp-green"
            }`}
          >
            <span className="text-[8px] leading-tight font-bold text-stamp-green uppercase">{listing.tag}</span>
          </div>
        </div>
        <div className="mb-[22px] grid grid-cols-2 gap-4">
          <div>
            <label className="mb-[3px] block text-[11px] font-semibold text-ink-soft">Asking price</label>
            <div className="font-mono text-base font-semibold text-mustard-dark">{listing.price}</div>
          </div>
          <div>
            <label className="mb-[3px] block text-[11px] font-semibold text-ink-soft">{label2}</label>
            <div className="text-sm font-semibold">{value2(type, listing)}</div>
          </div>
          <div>
            <label className="mb-[3px] block text-[11px] font-semibold text-ink-soft">{label3}</label>
            <div className="text-sm font-semibold">{value3(type, listing)}</div>
          </div>
          <div>
            <label className="mb-[3px] block text-[11px] font-semibold text-ink-soft">Reason for sale</label>
            <div className="text-sm font-semibold">{listing.reason}</div>
          </div>
        </div>
        <p className="text-sm leading-[1.6] text-ink-soft">{listing.desc}</p>
      </div>
      <div className="my-12 flex justify-center rounded-lg border border-line bg-paper-2 px-[22px] py-[18px]">
        <SubmitButton onClick={onConnect} className="flex w-full items-center justify-center gap-1.5">
          <IconShieldCheck size={16} /> Connect with seller
        </SubmitButton>
      </div>
    </div>
  );
}
