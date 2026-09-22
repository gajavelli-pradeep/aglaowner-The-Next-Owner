"use client";

import { useState } from "react";
import { IconLock, IconCircleCheck, IconAlertCircle, IconX } from "@tabler/icons-react";
import { isTestModeEnabled } from "@/lib/testMode";

/** .modal-overlay / .modal — DigiLocker verify modal with real open/verify/close state. */
export function VerifyModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [verified, setVerified] = useState(false);
  const [unavailable, setUnavailable] = useState(false);
  const testMode = isTestModeEnabled();

  if (!open) return null;

  function handleClose() {
    onClose();
    // reset for next open, after the close transition would run in the source (instant here)
    setTimeout(() => {
      setVerified(false);
      setUnavailable(false);
    }, 200);
  }

  function handleVerify() {
    if (!testMode) {
      // No DigiLocker integration connected yet -- fail honestly instead of
      // silently pretending to verify a real ID and revealing seller contact info.
      setUnavailable(true);
      return;
    }
    setVerified(true);
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
        {unavailable ? (
          <div className="py-2.5 text-center">
            <IconAlertCircle size={36} className="mx-auto mb-2.5 text-oxide" />
            <h3 className="mb-1.5 text-[17px] font-semibold">Verification isn&apos;t connected yet</h3>
            <p className="mb-[18px] text-[13px] text-ink-soft">DigiLocker isn&apos;t wired up yet -- check back soon to contact this seller.</p>
            <button type="button" onClick={handleClose} className="mt-1 w-full rounded bg-ink py-3 text-sm font-semibold text-paper">
              Close
            </button>
          </div>
        ) : !verified ? (
          <div>
            <h3 className="mb-1.5 flex items-center gap-1.5 text-[17px] font-semibold">
              Verify with DigiLocker
              {testMode && <span className="rounded bg-mustard px-1.5 py-0.5 text-[9px] font-bold tracking-[0.04em] text-paper uppercase">Test mode</span>}
            </h3>
            <p className="mb-[18px] text-[13px] text-ink-soft">
              Share one verified ID document — driving licence, PAN, or similar — with a single tap. We only receive a confirmation, never the document itself.
            </p>
            <button
              type="button"
              onClick={handleVerify}
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
