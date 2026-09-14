"use client";

import { useState } from "react";
import { IconAlertCircle } from "@tabler/icons-react";
import { OtpStatus, RefError } from "@/components/ui/Misc";
import { isValidMobile } from "@/lib/validation";

/** .otprow — mobile number + Send OTP button + verified status, shared by both referral forms. */
export function OtpField({ verified, onSend }: { verified: boolean; onSend: () => void }) {
  const [mobile, setMobile] = useState("");
  const [error, setError] = useState(false);

  function handleSend() {
    if (!isValidMobile(mobile)) {
      setError(true);
      return;
    }
    setError(false);
    onSend();
  }

  return (
    <div>
      <label className="mb-2 block text-[13px] font-semibold">Your mobile number</label>
      <div className="flex gap-2.5">
        <input
          type="tel"
          value={mobile}
          onChange={(e) => {
            setMobile(e.target.value);
            setError(false);
          }}
          placeholder="+91 98xxxxxxx1"
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
      <OtpStatus show={verified} />
    </div>
  );
}
