"use client";

/* eslint-disable react-hooks/static-components -- icon lookup functions return a stable component reference from a static map */

import { useState } from "react";
import { IconAlertCircle } from "@tabler/icons-react";
import { MediaUploadGrid } from "@/components/ui/MediaUploadGrid";
import { TextField, SelectField, TextAreaField, RadioRowButton, OtpStatus, RefError, IncludeChip } from "@/components/ui/Misc";
import { SubmitButton } from "@/components/ui/Buttons";
import { iconFor } from "@/lib/tablerIconMap";
import { getDemoReferrer } from "@/lib/data/listings";
import type { ListingType } from "@/types/listing";

const INCLUDE_OPTIONS = ["Furniture", "Kitchen equipment", "Fixtures & fittings", "Signage", "AC / electricals"];

const COPY: Record<ListingType, { title: string; subtitle: string; amount: string; amountNote: string; submitLabel: string }> = {
  business: { title: "Tell buyers about your business", subtitle: "Takes about 5 minutes. Simple questions, no paperwork or jargon.", amount: "₹799", amountNote: "listing stays live for 90 days", submitLabel: "Pay & go live" },
  equipment: { title: "Tell buyers about the equipment", subtitle: "Same quick process — a couple of extra details specific to equipment and assets.", amount: "₹149", amountNote: "listing stays live for 60 days", submitLabel: "Pay & go live" },
  lease: { title: "Help your landlord find their next tenant", subtitle: "Many buyers are happy to take furniture and fixtures off your hands too — you save on hauling things out, they save on furnishing from scratch. Same quick process, with a few extra details for a space handover.", amount: "₹399", amountNote: "listing stays live for 60 days", submitLabel: "Pay & go live" },
  inventory: { title: "Clearing out stock? List the whole lot at once", subtitle: "Dead stock, overstock, seasonal leftovers — one listing, one price, no need to sell it piece by piece.", amount: "₹249", amountNote: "listing stays live for 60 days", submitLabel: "Pay & go live" },
};

export interface SellFormEditDefaults {
  mode: "new" | "reactivate";
  amount: string;
  amountNote: string;
  submitLabel: string;
  hideMobile?: boolean;
}

/** Generic sell-listing form — one component covering business/equipment/lease/inventory (same structure, type-specific fields). */
export function SellForm({
  type,
  categoryName,
  categoryIcon,
  editDefaults,
  onToast,
  onSubmit,
}: {
  type: ListingType;
  categoryName: string;
  categoryIcon: string;
  editDefaults?: SellFormEditDefaults;
  onToast: (msg: string) => void;
  onSubmit: (addedEquip: boolean) => void;
}) {
  const copy = COPY[type];
  const CatIcon = iconFor(categoryIcon);
  const demoReferrer = getDemoReferrer();

  const [otpSent, setOtpSent] = useState(false);
  const [mobile, setMobile] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [refError, setRefError] = useState(false);
  const [debtOption, setDebtOption] = useState<"no" | "yes">("no");
  const [addEquip, setAddEquip] = useState(false);
  const [includeSelected, setIncludeSelected] = useState<string[]>([]);
  const [othersSelected, setOthersSelected] = useState(false);

  const showMobile = !editDefaults?.hideMobile;
  const amount = addEquip ? "₹948" : (editDefaults?.amount ?? copy.amount);
  const amountNote = addEquip ? "₹799 business + ₹149 equipment, each live for its own term" : (editDefaults?.amountNote ?? copy.amountNote);
  const submitLabel = editDefaults?.submitLabel ?? copy.submitLabel;

  function toggleInclude(label: string) {
    setIncludeSelected((prev) => (prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]));
  }

  function handleSubmit() {
    const mobileClean = mobile.replace(/\s+/g, "");
    const code = referralCode.trim().toUpperCase();
    if (code && mobileClean === demoReferrer.mobile && code === demoReferrer.code) {
      setRefError(true);
      return;
    }
    setRefError(false);
    onSubmit(type === "business" && addEquip);
  }

  return (
    <div className="mx-auto max-w-[1080px] px-6">
      <div className="pt-7 pb-1">
        <div className="mb-3 inline-flex items-center gap-1.5 rounded-[20px] border border-line bg-paper-2 px-3 py-[5px] text-xs font-semibold">
          <CatIcon size={14} /> {categoryName}
        </div>
        <h2 className="mb-1 text-[22px] sm:text-2xl">{editDefaults ? "Edit your listing" : copy.title}</h2>
        <p className="mb-5 text-[13px] text-ink-soft">{editDefaults ? "You're verified — update anything below and save." : copy.subtitle}</p>
      </div>

      <div className="mb-6 rounded-lg border border-line bg-paper p-7">
        <div className="mb-[22px]">
          <label className="mb-2 block text-[13px] font-semibold">
            Photos &amp; Videos <span className="ml-1.5 text-[11px] font-normal text-ink-soft">up to 8 images &amp; 2 videos (30 secs each)</span>
          </label>
          <MediaUploadGrid onToast={onToast} />
        </div>

        <div className="mb-[22px]">
          <TextField label="Listing title" placeholder={type === "inventory" ? "e.g. Mixed apparel lot — shirts & trousers, various sizes" : "e.g. Corner café with outdoor seating, HSR Layout"} />
        </div>

        <div className="mb-[22px]">
          <TextAreaField
            label={type === "inventory" ? "What's in this lot?" : type === "lease" ? "Describe the space" : type === "equipment" ? "Describe the item" : "Describe your business"}
            hint="max 500 characters"
            placeholder="What makes this worth buying..."
          />
        </div>

        <div className="mb-[22px] grid grid-cols-1 gap-3.5 sm:grid-cols-2">
          <TextField label="City" placeholder="e.g. Bengaluru" />
          <TextField label="Locality" placeholder="e.g. HSR Layout" />
        </div>

        {type === "business" && (
          <>
            <div className="mb-[22px] grid grid-cols-1 gap-3.5 sm:grid-cols-2">
              <SelectField label="Years running">
                <option>Under 1 year</option><option>1–3 years</option><option>3–5 years</option><option>5+ years</option>
              </SelectField>
              <SelectField label="Monthly turnover band">
                <option>Under ₹1L</option><option>₹1L–3L</option><option>₹3L–7L</option><option>₹7L+</option>
              </SelectField>
            </div>
            <div className="mb-[22px] grid grid-cols-1 gap-3.5 sm:grid-cols-2">
              <SelectField label="Asking price band">
                <option>Under ₹5L</option><option>₹5L–15L</option><option>₹15L–30L</option><option>₹30L+</option>
              </SelectField>
              <SelectField label="Reason for sale">
                <option>Relocating</option><option>Starting new venture</option><option>Health reasons</option><option>Partnership issue</option><option>Other</option>
              </SelectField>
            </div>
            <div className="mb-[22px]">
              <label className="mb-2 block text-[13px] font-semibold">Any outstanding debt on the business?</label>
              <div className="flex flex-col gap-2.5">
                <RadioRowButton picked={debtOption === "no"} onClick={() => setDebtOption("no")}>No debt</RadioRowButton>
                <RadioRowButton picked={debtOption === "yes"} onClick={() => setDebtOption("yes")}>Yes, with a note</RadioRowButton>
              </div>
              {debtOption === "yes" && (
                <div className="mt-2.5">
                  <TextAreaField placeholder="Briefly describe the outstanding debt — amount, type, lender..." />
                </div>
              )}
            </div>
            <div className="mb-[22px]">
              <label className="flex cursor-pointer items-start gap-2.5 text-[13px] font-semibold">
                <input type="checkbox" checked={addEquip} onChange={(e) => setAddEquip(e.target.checked)} className="mt-0.5 h-[18px] w-[18px] shrink-0" />
                <span>
                  Also list equipment &amp; assets from this business <span className="text-[11px] font-normal text-ink-soft">+₹149</span>
                </span>
              </label>
              <p className="mt-1.5 ml-7 text-xs text-ink-soft">Creates a second listing for anything you&apos;re selling separately — ovens, furniture, fixtures — using the same photo and video process.</p>
            </div>
            {addEquip && (
              <div className="mb-[22px] rounded-lg border border-dashed border-stamp-green bg-paper-2 p-4">
                <p className="mb-3.5 text-[11px] font-bold tracking-[0.03em] text-stamp-green uppercase">Equipment &amp; assets listing details</p>
                <div className="mb-[22px]">
                  <label className="mb-2 block text-[13px] font-semibold">Photos &amp; video</label>
                  <MediaUploadGrid onToast={onToast} />
                </div>
                <div className="mb-[22px]">
                  <TextField label="Equipment title" placeholder="e.g. Commercial espresso machine" />
                </div>
                <div className="mb-[22px] grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                  <SelectField label="Condition"><option>New / unused</option><option>Like new</option><option>Used - good</option><option>Used - fair</option></SelectField>
                  <TextField label="Brand & model" hint="optional" placeholder="e.g. La Marzocco, 3-group" />
                </div>
                <TextField label="Asking price" placeholder="e.g. ₹45,000" />
              </div>
            )}
          </>
        )}

        {type === "equipment" && (
          <div className="mb-[22px] grid grid-cols-1 gap-3.5 sm:grid-cols-2">
            <SelectField label="Condition"><option>New / unused</option><option>Like new</option><option>Used - good</option><option>Used - fair</option></SelectField>
            <TextField label="Brand & model" hint="optional" placeholder="e.g. La Marzocco, 3-group" />
          </div>
        )}
        {type === "equipment" && (
          <div className="mb-[22px] grid grid-cols-1 gap-3.5 sm:grid-cols-2">
            <TextField label="Asking price" placeholder="e.g. ₹45,000" />
            <SelectField label="Reason for sale"><option>Upgrading</option><option>Downsizing</option><option>Renovation</option><option>Business closing</option><option>Other</option></SelectField>
          </div>
        )}

        {type === "lease" && (
          <>
            <div className="mb-[22px] grid grid-cols-1 gap-3.5 sm:grid-cols-2">
              <SelectField label="Lease remaining"><option>Under 6 months</option><option>6–12 months</option><option>1–2 years</option><option>2+ years</option></SelectField>
              <TextField label="Monthly rent" placeholder="e.g. ₹45,000" />
            </div>
            <div className="mb-[22px] grid grid-cols-1 gap-3.5 sm:grid-cols-2">
              <TextField label="Security deposit" placeholder="e.g. ₹1,50,000" />
              <TextField label="Transfer / goodwill amount" placeholder="e.g. ₹2,00,000" />
            </div>
            <div className="mb-[22px]">
              <label className="mb-2 block text-[13px] font-semibold">
                What can the new tenant also buy, if they&apos;d like? <span className="text-[11px] font-normal text-ink-soft">as part of the existing setup — tap all that apply</span>
              </label>
              <div className="flex flex-wrap justify-start gap-2.5">
                {INCLUDE_OPTIONS.map((opt) => (
                  <IncludeChip key={opt} selected={includeSelected.includes(opt)} onClick={() => toggleInclude(opt)}>
                    {opt}
                  </IncludeChip>
                ))}
                <IncludeChip selected={othersSelected} onClick={() => setOthersSelected((v) => !v)}>
                  Others
                </IncludeChip>
              </div>
              {othersSelected && (
                <div className="mt-2.5">
                  <TextField placeholder="Describe what else is available (optional)" />
                </div>
              )}
            </div>
            <div className="mb-[22px] grid grid-cols-1 gap-3.5 sm:grid-cols-2">
              <SelectField label="Landlord status"><option>Landlord has agreed to transfer</option><option>Landlord not yet informed</option><option>New tenant re-signs directly</option></SelectField>
              <SelectField label="Reason for exit"><option>Relocating</option><option>Business closing</option><option>Financial reasons</option><option>Other</option></SelectField>
            </div>
          </>
        )}

        {type === "inventory" && (
          <>
            <div className="mb-[22px] grid grid-cols-1 gap-3.5 sm:grid-cols-2">
              <TextField label="Approx. lot size" placeholder="e.g. ~350 pieces" />
              <SelectField label="Condition"><option>New / unused</option><option>Seasonal overstock</option><option>Slightly aged stock</option><option>Mixed condition</option></SelectField>
            </div>
            <div className="mb-[22px] grid grid-cols-1 gap-3.5 sm:grid-cols-2">
              <TextField label="Asking price for the lot" placeholder="e.g. ₹50,000" />
              <SelectField label="Reason for clearing"><option>Season change</option><option>Dead stock</option><option>Store closing</option><option>Overstock</option><option>Other</option></SelectField>
            </div>
          </>
        )}

        {showMobile && (
          <div className="mb-[22px]">
            <label className="mb-2 block text-[13px] font-semibold">
              Your mobile number <span className="text-[11px] font-normal text-ink-soft">this is how you&apos;ll manage &amp; reactivate this listing later</span>
            </label>
            <div className="flex gap-2.5">
              <input
                type="tel"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="+91 98xxxxxxx1"
                className="flex-1 rounded border border-line bg-paper-2 px-3 py-[11px] text-sm"
              />
              <button type="button" onClick={() => setOtpSent(true)} className="rounded bg-ink px-[18px] text-[13px] font-semibold whitespace-nowrap text-paper">
                Send OTP
              </button>
            </div>
            <OtpStatus show={otpSent} />
          </div>
        )}

        <div>
          <label className="mb-2 block text-[13px] font-semibold">
            Have a referral code? <span className="text-[11px] font-normal text-ink-soft">optional</span>
          </label>
          <input
            type="text"
            value={referralCode}
            onChange={(e) => {
              setReferralCode(e.target.value);
              setRefError(false);
            }}
            placeholder="e.g. AGL-REF-7F42"
            className="w-full rounded border border-line bg-paper-2 px-3 py-[11px] text-sm"
          />
          <RefError show={refError}>
            <IconAlertCircle size={14} /> That&apos;s your own referral code — referrers can&apos;t use their own code on their own listing.
          </RefError>
        </div>
      </div>

      <div className="mb-12 flex items-center justify-between gap-4 rounded-lg border border-line bg-paper-2 px-[22px] py-[18px]">
        <div className="font-mono text-xl font-semibold">
          {amount} <span className="block font-sans text-[11px] font-normal text-ink-soft">{amountNote}</span>
        </div>
        <SubmitButton onClick={handleSubmit}>{submitLabel}</SubmitButton>
      </div>
    </div>
  );
}
