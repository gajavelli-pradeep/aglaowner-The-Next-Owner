"use client";

import { useState } from "react";
import { IconLock, IconCircleCheck, IconX } from "@tabler/icons-react";

/** .modal-overlay / .modal — DigiLocker verify modal with real open/verify/close state. */
export function VerifyModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [verified, setVerified] = useState(false);

  if (!open) return null;

  function handleClose() {
    onClose();
    // reset for next open, after the close transition would run in the source (instant here)
    setTimeout(() => setVerified(false), 200);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-5"
      role="dialog"
      aria-modal="true"
      onClick={handleClose}
    >
      <div className="w-full max-w-[400px] rounded-lg bg-paper p-[26px]" onClick={(e) => e.stopPropagation()}>
        <button type="button" aria-label="Close" onClick={handleClose} className="float-right text-xl text-ink-soft">
          <IconX size={20} />
        </button>
        {!verified ? (
          <div>
            <h3 className="mb-1.5 text-[17px] font-semibold">Verify with DigiLocker</h3>
            <p className="mb-[18px] text-[13px] text-ink-soft">
              Share one verified ID document — driving licence, PAN, or similar — with a single tap. We only receive a confirmation, never the document itself.
            </p>
            <button
              type="button"
              onClick={() => setVerified(true)}
              className="mt-1 flex w-full items-center justify-center gap-1.5 rounded bg-navyblue py-3 text-sm font-semibold text-paper"
            >
              <IconLock size={16} /> Continue to DigiLocker
            </button>
          </div>
        ) : (
          <div className="py-2.5 text-center">
            <IconCircleCheck size={36} className="mx-auto mb-2.5 text-stamp-green" />
            <h3 className="mb-1.5 text-[17px] font-semibold">Verified &amp; request sent</h3>
            <p className="mb-[18px] text-[13px] text-ink-soft">
              The seller has been notified on WhatsApp. If they choose to respond, you&apos;ll hear from them directly.
            </p>
            <button type="button" onClick={handleClose} className="mt-1 w-full rounded bg-oxide py-3 text-sm font-semibold text-paper">
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
