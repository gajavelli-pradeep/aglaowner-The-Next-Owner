"use client";

import { OtpStatus } from "@/components/ui/Misc";

/** .otprow — mobile number + Send OTP button + verified status, shared by both referral forms. */
export function OtpField({ verified, onSend }: { verified: boolean; onSend: () => void }) {
  return (
    <div>
      <label className="mb-2 block text-[13px] font-semibold">Your mobile number</label>
      <div className="flex gap-2.5">
        <input
          type="tel"
          placeholder="+91 98xxxxxxx1"
          className="w-full flex-1 rounded border border-line bg-paper-2 px-3 py-[11px] font-sans text-sm text-ink"
        />
        <button
          type="button"
          onClick={onSend}
          className="shrink-0 rounded bg-ink px-[18px] text-[13px] font-semibold whitespace-nowrap text-paper"
        >
          Send OTP
        </button>
      </div>
      <OtpStatus show={verified} />
    </div>
  );
}
