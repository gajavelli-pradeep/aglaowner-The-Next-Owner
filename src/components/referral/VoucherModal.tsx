"use client";

import { IconX } from "@tabler/icons-react";
import { getVoucherProviders } from "@/lib/data/referral";

/** .modal-overlay / .modal — voucher-provider picker for claiming a tier. */
export function VoucherModal({
  open,
  amount,
  onClose,
  onClaim,
}: {
  open: boolean;
  amount: number;
  onClose: () => void;
  onClaim: (provider: string) => void;
}) {
  if (!open) return null;
  const providers = getVoucherProviders();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-5" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="w-full max-w-[420px] rounded-lg bg-paper p-[26px]" onClick={(e) => e.stopPropagation()}>
        <button type="button" aria-label="Close" onClick={onClose} className="float-right text-xl text-ink-soft">
          <IconX size={20} />
        </button>
        <h3 className="mb-1.5 text-[17px] font-semibold">Choose your reward</h3>
        <p className="mb-[18px] text-[13px] text-ink-soft">Pick one voucher for this milestone — it&apos;ll be sent to your registered email.</p>
        {providers.map((p) => (
          <button
            key={p.name}
            type="button"
            onClick={() => onClaim(p.name)}
            className="mb-2.5 flex w-full items-center justify-between rounded-md border border-line px-4 py-3 text-left transition-colors hover:border-oxide"
          >
            <span className="text-[13.5px] font-semibold">{p.name}</span>
            <span className="font-mono text-[13px] font-semibold text-stamp-green">₹{amount}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
