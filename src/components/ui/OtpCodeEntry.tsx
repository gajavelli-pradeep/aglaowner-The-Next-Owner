"use client";

import { useId, useState } from "react";
import { IconAlertCircle } from "@tabler/icons-react";
import { RefError } from "@/components/ui/Misc";
import { DEMO_OTP } from "@/lib/testMode";

/** 6-digit code box shown after "Send OTP" in test mode -- only DEMO_OTP verifies. */
export function OtpCodeEntry({ onVerified }: { onVerified: () => void }) {
  const id = useId();
  const [code, setCode] = useState("");
  const [wrong, setWrong] = useState(false);

  function handleVerify() {
    if (code !== DEMO_OTP) {
      setWrong(true);
      return;
    }
    onVerified();
  }

  return (
    <div className="mt-3">
      <label htmlFor={id} className="mb-2 block text-[13px] font-semibold">
        Enter OTP <span className="ml-1.5 text-[11px] font-normal text-ink-soft">test code: {DEMO_OTP}</span>
      </label>
      <div className="flex gap-2.5">
        <input
          id={id}
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          autoFocus
          value={code}
          onChange={(e) => {
            setCode(e.target.value.replace(/\D/g, ""));
            setWrong(false);
          }}
          onKeyDown={(e) => {
            // Inside the referral <form>s, Enter would submit the whole form instead of verifying.
            if (e.key === "Enter") {
              e.preventDefault();
              handleVerify();
            }
          }}
          placeholder="6-digit code"
          maxLength={6}
          className="w-full flex-1 rounded border border-line bg-paper-2 px-3 py-[11px] font-mono text-sm tracking-[0.3em] text-ink"
        />
        <button
          type="button"
          onClick={handleVerify}
          className="shrink-0 rounded bg-ink px-[18px] text-[13px] font-semibold whitespace-nowrap text-paper"
        >
          Verify
        </button>
      </div>
      <RefError show={wrong}>
        <IconAlertCircle size={14} /> That code didn&apos;t match -- in test mode, use {DEMO_OTP}.
      </RefError>
    </div>
  );
}
