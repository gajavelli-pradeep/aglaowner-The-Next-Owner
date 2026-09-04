"use client";

import { useRef } from "react";
import { IconBrandWhatsapp, IconDownload, IconCopy } from "@tabler/icons-react";

/** .rflyer + .share-row — the referral-code flyer (distinct square design from the listing flyer) with real share/download/copy actions. */
export function ReferralFlyer({ code, onToast }: { code: string; onToast: (msg: string) => void }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const shareText = `Heard about aglaowner from someone and tried it myself — genuinely useful when selling a business, equipment, a lease, or excess stock. Use my code ${code} when you list: https://aglaowner.in`;

  function shareWhatsApp() {
    window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, "_blank");
  }

  async function downloadFlyer() {
    try {
      const html2canvas = (await import("html2canvas")).default;
      if (!cardRef.current) return;
      const canvas = await html2canvas(cardRef.current, { backgroundColor: "#F6F3EA", scale: 2 });
      const link = document.createElement("a");
      link.download = "my-aglaowner-referral-code.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
      onToast("Flyer downloaded — ready to post");
    } catch {
      onToast("Could not generate the flyer — try again");
    }
  }

  async function copyCode() {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(code);
      onToast("Code copied — paste it anywhere");
    } else {
      onToast(`Your code: ${code}`);
    }
  }

  return (
    <>
      <div
        ref={cardRef}
        className="relative mx-auto mt-1 mb-5 flex aspect-square w-[300px] flex-col items-center justify-center gap-2.5 rounded-[10px] border-2 border-ink bg-paper px-6 py-7 text-center"
      >
        <div className="absolute top-3.5 right-3.5 rotate-[-6deg] rounded bg-stamp-green px-2.5 py-[5px] font-display text-[10.5px] tracking-[0.03em] text-paper">
          TRUSTED
        </div>
        <div className="mb-0.5 font-display text-[25px]">
          agla<b className="font-normal text-oxide">owner</b>
        </div>
        <div className="px-1.5 font-serif text-[16.5px] leading-[1.3] font-semibold">
          Heard about this, tried it myself — happy to vouch for it.
        </div>
        <div className="px-3.5 text-xs text-ink-soft">Selling a business, equipment, handing over a lease, or clearing stock? Worth a look.</div>
        <div className="mt-0.5 rounded-lg border-[1.5px] border-dashed border-oxide bg-paper-2 px-[22px] py-[11px] font-mono text-[17px] font-semibold tracking-[0.05em] text-oxide">
          <span className="mb-1 block font-sans text-[9.5px] font-semibold tracking-[0.03em] text-ink-soft uppercase">Use my code</span>
          {code}
        </div>
        <div className="absolute bottom-3.5 text-[9.5px] font-semibold tracking-[0.02em] text-ink-soft">aglaowner.in</div>
      </div>

      <div className="mb-[22px] flex flex-wrap justify-center gap-2.5">
        <button
          type="button"
          onClick={shareWhatsApp}
          className="inline-flex items-center gap-1.5 rounded-md border border-stamp-green bg-stamp-green px-[18px] py-[11px] text-[13px] font-semibold text-paper transition-opacity hover:opacity-85"
        >
          <IconBrandWhatsapp size={16} /> Share on WhatsApp
        </button>
        <button
          type="button"
          onClick={downloadFlyer}
          className="inline-flex items-center gap-1.5 rounded-md border border-ink bg-transparent px-[18px] py-[11px] text-[13px] font-semibold text-ink transition-opacity hover:opacity-85"
        >
          <IconDownload size={16} /> Download flyer
        </button>
        <button
          type="button"
          onClick={copyCode}
          className="inline-flex items-center gap-1.5 rounded-md border border-ink bg-transparent px-[18px] py-[11px] text-[13px] font-semibold text-ink transition-opacity hover:opacity-85"
        >
          <IconCopy size={16} /> Copy code
        </button>
      </div>
    </>
  );
}
