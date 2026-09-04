"use client";

import { useState } from "react";
import { SubmitButton } from "@/components/ui/Buttons";
import { OtpStatus } from "@/components/ui/Misc";

export function ReactivateLookup({ onContinue }: { onContinue: () => void }) {
  const [mobile, setMobile] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  return (
    <div className="mx-auto max-w-[1080px] px-6">
      <div className="py-8 pb-2">
        <h2 className="mb-1.5 text-[22px] sm:text-2xl">Find your listing</h2>
        <p className="text-[14.5px] text-ink-soft">Enter the mobile number you used when you first listed. No account, no password.</p>
      </div>
      <div className="mt-6 max-w-[440px] rounded-lg border border-line bg-paper p-7">
        <div className="mb-[22px]">
          <label className="mb-2 block text-[13px] font-semibold">Mobile number</label>
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
        {otpSent && (
          <div className="mb-[22px]">
            <label className="mb-2 block text-[13px] font-semibold">Enter OTP</label>
            <input type="text" maxLength={4} placeholder="4-digit code" className="w-full rounded border border-line bg-paper-2 px-3 py-[11px] text-sm" />
          </div>
        )}
        <SubmitButton onClick={onContinue} className="w-full">
          View my listings
        </SubmitButton>
      </div>
    </div>
  );
}
