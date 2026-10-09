"use client";

import { useState } from "react";
import { IconLock, IconCircleCheck, IconAlertCircle, IconX, IconShieldCheck } from "@tabler/icons-react";
import { isTestModeEnabled } from "@/lib/testMode";

const DEMO_DOCUMENTS = ["Driving licence", "PAN card", "Aadhaar card"];

const testBadge = <span className="rounded bg-mustard px-1.5 py-0.5 text-[9px] font-bold tracking-[0.04em] text-paper uppercase">Test mode</span>;

type Step = "intro" | "consent" | "verified" | "unavailable";

/** .modal-overlay / .modal — DigiLocker verify modal: intro → (test-mode consent screen) → verified. */
export function VerifyModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [step, setStep] = useState<Step>("intro");
  const [selectedDoc, setSelectedDoc] = useState(DEMO_DOCUMENTS[0]);
  const testMode = isTestModeEnabled();

  if (!open) return null;

  function handleClose() {
    onClose();
    // reset for next open, after the close transition would run in the source (instant here)
    setTimeout(() => {
      setStep("intro");
      setSelectedDoc(DEMO_DOCUMENTS[0]);
    }, 200);
  }

  // No DigiLocker integration connected yet -- outside test mode, fail honestly instead of
  // silently pretending to verify a real ID and revealing seller contact info.
  const handleContinue = () => setStep(testMode ? "consent" : "unavailable");

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-5"
      role="dialog"
      aria-modal="true"
      onClick={handleClose}
    >
      <div className="max-h-[calc(100dvh-40px)] w-full max-w-[400px] overflow-y-auto overscroll-contain rounded-lg bg-paper p-[26px]" onClick={(e) => e.stopPropagation()}>
        <button type="button" aria-label="Close" onClick={handleClose} className="float-right text-xl text-ink-soft">
          <IconX size={20} />
        </button>
        {step === "unavailable" ? (
          <div className="py-2.5 text-center">
            <IconAlertCircle size={36} className="mx-auto mb-2.5 text-oxide" />
            <h3 className="mb-1.5 text-[17px] font-semibold">Verification isn&apos;t connected yet</h3>
            <p className="mb-[18px] text-[13px] text-ink-soft">DigiLocker isn&apos;t wired up yet -- check back soon to contact this seller.</p>
            <button type="button" onClick={handleClose} className="mt-1 w-full rounded bg-ink py-3 text-sm font-semibold text-paper">
              Close
            </button>
          </div>
        ) : step === "intro" ? (
          <div>
            <h3 className="mb-1.5 flex items-center gap-1.5 text-[17px] font-semibold">
              Verify with DigiLocker
              {testMode && testBadge}
            </h3>
            <p className="mb-[18px] text-[13px] text-ink-soft">
              Share one verified ID document — driving licence, PAN, or similar — with a single tap. We only receive a confirmation, never the document itself.
            </p>
            <button
              type="button"
              onClick={handleContinue}
              className="mt-1 flex w-full items-center justify-center gap-1.5 rounded bg-navyblue py-3 text-sm font-semibold text-paper"
            >
              <IconLock size={16} /> Continue to DigiLocker
            </button>
          </div>
        ) : step === "consent" ? (
          <div>
            <h3 className="mb-1.5 flex items-center gap-1.5 text-[17px] font-semibold">
              <IconShieldCheck size={20} className="text-navyblue" /> DigiLocker
              {testBadge}
            </h3>
            <p className="mb-3.5 text-[13px] text-ink-soft">
              <b className="text-ink">aglaowner</b> is requesting a confirmation that you hold a verified ID. Pick the document to share:
            </p>
            <fieldset className="mb-[18px] flex flex-col gap-2">
              <legend className="sr-only">Document to share</legend>
              {DEMO_DOCUMENTS.map((doc) => (
                <label
                  key={doc}
                  className={`flex cursor-pointer items-center gap-2.5 rounded border px-3 py-[11px] text-[13px] font-semibold transition-colors ${
                    selectedDoc === doc ? "border-navyblue bg-paper-2 text-ink" : "border-line text-ink-soft"
                  }`}
                >
                  <input type="radio" name="digilocker-doc" value={doc} checked={selectedDoc === doc} onChange={() => setSelectedDoc(doc)} className="accent-navyblue" />
                  {doc}
                </label>
              ))}
            </fieldset>
            <div className="flex gap-2.5">
              <button type="button" onClick={() => setStep("intro")} className="flex-1 rounded border border-line py-3 text-sm font-semibold text-ink-soft">
                Deny
              </button>
              <button type="button" onClick={() => setStep("verified")} className="flex-1 rounded bg-navyblue py-3 text-sm font-semibold text-paper">
                Allow
              </button>
            </div>
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
