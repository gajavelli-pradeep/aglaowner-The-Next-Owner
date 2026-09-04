"use client";

 

import { SubmitButton, ButtonOutlineSm } from "@/components/ui/Buttons";
import { iconFor } from "@/lib/tablerIconMap";
import { getMyListings } from "@/lib/data/listings";
import type { MyListing } from "@/types/listing";

/** .reactivate-list — listings tied to the looked-up mobile number. */
export function ReactivateList({ onEdit, onReactivateAsIs }: { onEdit: (listing: MyListing) => void; onReactivateAsIs: (listing: MyListing) => void }) {
  const listings = getMyListings();
  const active = listings.filter((l) => l.status === "active");
  const archived = listings.filter((l) => l.status === "archived");

  return (
    <div className="mx-auto max-w-[1080px] px-6">
      <div className="py-8 pb-2">
        <h2 className="mb-1.5 text-[22px] sm:text-2xl">Listings tied to +91 98xxxxxxx1</h2>
        <p className="text-[14.5px] text-ink-soft">
          Business, equipment, and space handover listings all show up here. Edit an active one anytime, or bring an archived one back — as-is or
          with updates.
        </p>
      </div>
      <div className="flex max-w-[640px] flex-col gap-3.5 pb-12">
        {active.map((l) => {
          const Icon = iconFor(l.icon);
          return (
            <div key={l.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-line bg-paper px-[22px] py-[18px]">
              <div className="flex items-center gap-3.5">
                <div className="flex h-11 w-11 items-center justify-center rounded-md border border-line bg-paper-2">
                        <Icon size={18} className="text-stamp-green" />
                </div>
                <div>
                  <div className="text-sm font-semibold">{l.title}</div>
                  <div className="text-[11px] text-ink-soft">{l.ref} &nbsp;·&nbsp; Business &nbsp;·&nbsp; {l.statusNote}</div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className="rounded-[20px] bg-[#e7efe6] px-3 py-[5px] text-[11px] font-bold text-stamp-green">ACTIVE</span>
                <ButtonOutlineSm onClick={() => onEdit(l)}>Edit</ButtonOutlineSm>
              </div>
            </div>
          );
        })}

        {archived.map((l) => {
          const Icon = iconFor(l.icon);
          return (
            <div key={l.id} className="rounded-lg border border-line bg-paper px-[22px] py-[18px]">
              <div className="mb-3.5 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3.5">
                  <div className="flex h-11 w-11 items-center justify-center rounded-md border border-line bg-paper-2">
                            <Icon size={18} className="text-mustard-dark" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold">{l.title}</div>
                    <div className="text-[11px] text-ink-soft">{l.ref} &nbsp;·&nbsp; {l.type === "business" ? "Business" : l.type === "equipment" ? "Equipment & assets" : l.type === "lease" ? "Space handover" : "Inventory & stock"} &nbsp;·&nbsp; {l.statusNote}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-base font-semibold text-mustard-dark">{l.reactivatePrice}</div>
                  <div className="text-[10px] text-ink-soft">to go live again, either way</div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2.5 border-t border-line-soft pt-3.5">
                <SubmitButton className="min-w-[150px] flex-1 py-2.5 text-[12.5px]" onClick={() => onReactivateAsIs(l)}>
                  Reactivate as-is
                </SubmitButton>
                <ButtonOutlineSm className="min-w-[150px] flex-1 py-2.5 text-[12.5px]" onClick={() => onEdit(l)}>
                  Edit &amp; reactivate
                </ButtonOutlineSm>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
