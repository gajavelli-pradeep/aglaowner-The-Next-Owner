"use client";

import type { InputHTMLAttributes, ReactNode } from "react";
import { IconCheck } from "@tabler/icons-react";

/** .stat — hero stat row item. */
export function StatBox({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <b className="block font-mono text-2xl font-semibold">{value}</b>
      <span className="text-xs tracking-[0.06em] text-ink-soft uppercase">{label}</span>
    </div>
  );
}

/** .suggest-chip — small search-suggestion pill. */
export function SuggestChip({ children, ...props }: { children: ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      className="rounded-[20px] border border-line bg-paper-2 px-3 py-1.5 text-xs text-ink transition-colors hover:border-oxide hover:text-oxide"
      {...props}
    >
      {children}
    </button>
  );
}

/** .include-chip — toggleable multi-select pill (lease "what's included"). */
export function IncludeChip({ selected, children, ...props }: { selected: boolean; children: ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      className={`rounded-[20px] border px-[15px] py-2 text-[12.5px] font-medium transition-colors ${
        selected ? "border-stamp-green bg-[#e7efe6] font-semibold text-stamp-green" : "border-line bg-paper-2 text-ink-soft"
      }`}
      {...props}
    >
      {children}
    </button>
  );
}

/** .otprow input — mobile-number field used ahead of an OTP button. */
export function TextField({ label, hint, ...props }: InputHTMLAttributes<HTMLInputElement> & { label?: string; hint?: string }) {
  return (
    <div>
      {label && (
        <label className="mb-2 block text-[13px] font-semibold">
          {label} {hint && <span className="ml-1.5 text-[11px] font-normal text-ink-soft">{hint}</span>}
        </label>
      )}
      <input
        className="w-full rounded border border-line bg-paper-2 px-3 py-[11px] font-sans text-sm text-ink"
        {...props}
      />
    </div>
  );
}

export function SelectField({ label, children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement> & { label: string }) {
  return (
    <div>
      <label className="mb-2 block text-[13px] font-semibold">{label}</label>
      <select className="w-full rounded border border-line bg-paper-2 px-3 py-[11px] font-sans text-sm text-ink" {...props}>
        {children}
      </select>
    </div>
  );
}

export function TextAreaField({
  label,
  hint,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string; hint?: string }) {
  return (
    <div>
      {label && (
        <label className="mb-2 block text-[13px] font-semibold">
          {label} {hint && <span className="ml-1.5 text-[11px] font-normal text-ink-soft">{hint}</span>}
        </label>
      )}
      <textarea className="min-h-20 w-full resize-y rounded border border-line bg-paper-2 px-3 py-[11px] font-sans text-sm text-ink" {...props} />
    </div>
  );
}

/** .radiorow button — the debt-disclosure Yes/No toggle. */
export function RadioRowButton({ picked, children, ...props }: { picked: boolean; children: ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      className={`flex-1 rounded border px-2.5 py-2.5 text-[13px] font-semibold transition-colors ${
        picked ? "border-stamp-green bg-[#e7efe6] text-stamp-green" : "border-line bg-paper-2 text-ink-soft"
      }`}
      {...props}
    >
      {children}
    </button>
  );
}

/** .otp-status — inline "Number verified" confirmation shown after OTP send. */
export function OtpStatus({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <p className="mt-2 flex items-center gap-1 text-xs font-semibold text-stamp-green">
      <IconCheck size={14} /> Number verified
    </p>
  );
}

/** .ref-error — inline self-referral validation error. */
export function RefError({ show, children }: { show: boolean; children: ReactNode }) {
  if (!show) return null;
  return <p className="mt-[7px] flex items-center gap-1.5 text-xs font-semibold text-oxide">{children}</p>;
}
