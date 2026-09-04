"use client";

import { IconBadge } from "@tabler/icons-react";
import { ReferralFlyer } from "@/components/referral/ReferralFlyer";
import { CtaBuy } from "@/components/ui/Buttons";
import { getReferralCode } from "@/lib/data/referral";

/** code-confirm screen — shows the generated code, shareable flyer, and a dashboard CTA. */
export function CodeConfirm({ onToast, onDashboard }: { onToast: (msg: string) => void; onDashboard: () => void }) {
  const code = getReferralCode();

  return (
    <div className="mx-auto max-w-[460px] px-6 py-11 text-center">
      <div className="mx-auto mb-5 flex h-[100px] w-[100px] -rotate-6 items-center justify-center rounded-full border-[3px] border-dashed border-stamp-green">
        <IconBadge size={38} className="text-stamp-green" />
      </div>
      <h2 className="mb-2.5 text-[22px]">Your referral code is ready</h2>
      <p className="mb-[22px] text-[13.5px] text-ink-soft">
        Share it with business owners you know. When they use it while listing, credits show up in your dashboard automatically.
      </p>
      <div className="mb-[22px] rounded-lg border-2 border-ink bg-paper p-[22px] font-mono text-2xl font-semibold tracking-[0.08em] text-oxide">
        <span className="mb-2 block font-sans text-[11px] font-semibold tracking-[0.03em] text-ink-soft uppercase">Your code</span>
        {code}
      </div>

      <p className="mb-3.5 text-[13px] font-semibold text-ink-soft">
        A flyer travels further than a link — post it as your WhatsApp status and every contact sees it
      </p>
      <ReferralFlyer code={code} onToast={onToast} />

      <CtaBuy onClick={onDashboard}>View my dashboard</CtaBuy>
    </div>
  );
}
