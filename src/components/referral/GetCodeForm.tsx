"use client";

import { useState } from "react";
import { IconAlertCircle } from "@tabler/icons-react";
import { OtpField } from "@/components/referral/OtpField";
import { TextField, RefError } from "@/components/ui/Misc";
import { SubmitButton } from "@/components/ui/Buttons";

/** get-code-form screen — mobile OTP + basic details, then generates the referral code. */
export function GetCodeForm({ onSubmit }: { onSubmit: () => void }) {
  const [verified, setVerified] = useState(false);
  const [notVerifiedError, setNotVerifiedError] = useState(false);

  return (
    <div className="px-6">
      <div className="pt-7 pb-1 text-center">
        <h2 className="mb-1.5 text-2xl">Get your referral code</h2>
        <p className="text-[13.5px] text-ink-soft">Just a few basic details — takes about 2 minutes.</p>
      </div>
      <form
        className="mx-auto my-5 max-w-[460px] space-y-5 rounded-lg border border-line bg-paper p-7"
        onSubmit={(e) => {
          e.preventDefault();
          if (!verified) {
            setNotVerifiedError(true);
            return;
          }
          setNotVerifiedError(false);
          onSubmit();
        }}
      >
        <OtpField verified={verified} onSend={() => setVerified(true)} />
        <RefError show={notVerifiedError}>
          <IconAlertCircle size={14} /> Verify your mobile number first.
        </RefError>
        <TextField label="Email address" type="text" placeholder="you@example.com" required />
        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
          <TextField label="City" type="text" placeholder="e.g. Bengaluru" required />
          <TextField label="State" type="text" placeholder="e.g. Karnataka" required />
        </div>
        <SubmitButton type="submit" className="w-full">
          Generate my code
        </SubmitButton>
      </form>
    </div>
  );
}
