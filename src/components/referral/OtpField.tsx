"use client";

import { useState } from "react";
import { IconAlertCircle } from "@tabler/icons-react";
import { OtpStatus, RefError } from "@/components/ui/Misc";
import { isValidMobile } from "@/lib/validation";
import { isTestModeEnabled } from "@/lib/testMode";

/** .otprow — country code + mobile number + Send OTP button + verified status, shared by both referral forms. */
export function OtpField({ verified, onSend }: { verified: boolean; onSend: () => void }) {
  const [mobile, setMobile] = useState("");
  const [error, setError] = useState(false);
  const [unavailable, setUnavailable] = useState(false);
  const testMode = isTestModeEnabled();

  function handleSend() {
    if (!isValidMobile(mobile)) {
      setError(true);
      setUnavailable(false);
      return;
    }
    setError(false);
    if (!testMode) {
      // No SMS/OTP provider connected yet -- fail honestly instead of silently
      // pretending to send and verify a code that never went anywhere.
      setUnavailable(true);
      return;
    }
    setUnavailable(false);
    onSend();
  }

  return (
    <div>
      <label className="mb-2 flex items-center gap-1.5 text-[13px] font-semibold">
        Your mobile number
        {testMode && <span className="rounded bg-mustard px-1.5 py-0.5 text-[9px] font-bold tracking-[0.04em] text-paper uppercase">Test mode</span>}
      </label>
      <div className="flex gap-2.5">
        <span className="flex w-[58px] shrink-0 items-center justify-center rounded border border-line bg-paper-2 px-2 py-[11px] font-sans text-sm text-ink-soft">
          +91
        </span>
        <input
          type="tel"
          value={mobile}
          onChange={(e) => {
            setMobile(e.target.value);
            setError(false);
            setUnavailable(false);
          }}
          placeholder="98xxxxxxx1"
          maxLength={10}
          className="w-full flex-1 rounded border border-line bg-paper-2 px-3 py-[11px] font-sans text-sm text-ink"
        />
        <button
          type="button"
          onClick={handleSend}
          className="shrink-0 rounded bg-ink px-[18px] text-[13px] font-semibold whitespace-nowrap text-paper"
        >
          Send OTP
        </button>
      </div>
      <RefError show={error}>
        <IconAlertCircle size={14} /> Enter a valid 10-digit mobile number.
      </RefError>
      <RefError show={unavailable}>
        <IconAlertCircle size={14} /> Phone verification isn&apos;t connected yet -- check back soon.
      </RefError>
      <OtpStatus show={verified} />
    </div>
  );
}
