"use client";

/* eslint-disable react-hooks/static-components -- icon lookup functions return a stable component reference from a static map */

import { MediaUploadGrid } from "@/components/ui/MediaUploadGrid";
import { TextField, TextAreaField, SelectField } from "@/components/ui/Misc";
import { SubmitButton } from "@/components/ui/Buttons";
import { iconFor } from "@/lib/tablerIconMap";
import type { MyListing } from "@/types/listing";

/** .edit-form — shared edit screen for both an active listing and an archived listing about to be reactivated. */
export function EditForm({ listing, onToast, onSubmit }: { listing: MyListing; onToast: (msg: string) => void; onSubmit: () => void }) {
  const Icon = iconFor(listing.icon);
  const isActive = listing.status === "active";
  const amount = isActive ? "Free" : listing.reactivatePrice ?? "";
  const amountNote = isActive ? "no charge to edit an active listing" : `save your edits, then live for 90 days`;
  const submitLabel = isActive ? "Save changes" : `Save & pay ${listing.reactivatePrice} to go live`;

  return (
    <div className="mx-auto max-w-[1080px] px-6">
      <div className="pt-7 pb-1">
        <div className="mb-3 inline-flex items-center gap-1.5 rounded-[20px] border border-line bg-paper-2 px-3 py-[5px] text-xs font-semibold">
          <Icon size={14} /> Food &amp; Beverage
        </div>
        <h2 className="mb-1 text-[22px] sm:text-2xl">Edit your listing</h2>
        <p className="mb-5 text-[13px] text-ink-soft">
          {isActive ? "You're verified — update anything below and save. Your 90-day timer doesn't change." : "You're verified — update anything before it goes live again."}
        </p>
      </div>
      <div className="mb-6 rounded-lg border border-line bg-paper p-7">
        <div className="mb-[22px]">
          <label className="mb-2 block text-[13px] font-semibold">
            Photos &amp; Videos <span className="ml-1.5 text-[11px] font-normal text-ink-soft">up to 8 images &amp; 2 videos (30 secs each)</span>
          </label>
          <MediaUploadGrid onToast={onToast} />
        </div>
        <div className="mb-[22px]">
          <TextField label="Listing title" defaultValue={listing.title} />
        </div>
        <div className="mb-[22px]">
          <TextAreaField label="Describe your business" defaultValue="A well-established listing with steady interest and a loyal customer base." />
        </div>
        <div className="mb-[22px] grid grid-cols-1 gap-3.5 sm:grid-cols-2">
          <TextField label="City" defaultValue="Bengaluru" />
          <TextField label="Locality" defaultValue="HSR Layout" />
        </div>
        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
          <SelectField label="Years running"><option>3–5 years</option></SelectField>
          <SelectField label="Monthly turnover band"><option>₹3L–7L</option></SelectField>
        </div>
      </div>
      <div className="mb-12 flex items-center justify-between gap-4 rounded-lg border border-line bg-paper-2 px-[22px] py-[18px]">
        <div className="font-mono text-xl font-semibold">
          {amount} <span className="block font-sans text-[11px] font-normal text-ink-soft">{amountNote}</span>
        </div>
        <SubmitButton onClick={onSubmit}>{submitLabel}</SubmitButton>
      </div>
    </div>
  );
}
