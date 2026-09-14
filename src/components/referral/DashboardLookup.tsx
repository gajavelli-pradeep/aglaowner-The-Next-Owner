"use client";

import { useState } from "react";
import { IconAlertCircle } from "@tabler/icons-react";
import { OtpField } from "@/components/referral/OtpField";
import { RefError } from "@/components/ui/Misc";
import { SubmitButton } from "@/components/ui/Buttons";

/** dashboard-lookup screen — mobile OTP gate before viewing the dashboard. */
export function DashboardLookup({ onSubmit }: { onSubmit: () => void }) {
  const [verified, setVerified] = useState(false);
  const [notVerifiedError, setNotVerifiedError] = useState(false);

  return (
    <div className="px-6">
      <div className="pt-7 pb-1 text-center">
        <h2 className="mb-1.5 text-2xl">View your dashboard</h2>
        <p className="text-[13.5px] text-ink-soft">Enter the mobile number you used to get your code.</p>
      </div>
      <form
        className="mx-auto my-5 max-w-[460px] rounded-lg border border-line bg-paper p-7"
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
        <SubmitButton type="submit" className="mt-5 w-full">
          View my dashboard
        </SubmitButton>
      </form>
    </div>
  );
}
