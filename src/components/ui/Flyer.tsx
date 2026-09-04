"use client";

/* eslint-disable react-hooks/static-components -- icon lookup functions return a stable component reference from a static map */

import { useRef } from "react";
import { IconMapPin, IconPhoto, IconBrandWhatsapp, IconDownload, IconLink } from "@tabler/icons-react";
import { iconFor } from "@/lib/tablerIconMap";
import type { ConfirmFlyerData } from "@/types/listing";

/** .flyer-card + .share-row — shareable listing flyer with real WhatsApp/download/link-share actions. */
export function Flyer({ data, onToast }: { data: ConfirmFlyerData; onToast: (msg: string) => void }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const Icon = iconFor(data.icon);
  const shareUrl = `https://aglaowner.in/l/${data.ref}`;
  const shareText = `${data.title} is up for sale on aglaowner — ${data.price}, ${data.loc.split(",")[0]}. Check it out: ${shareUrl}`;

  function shareWhatsApp() {
    window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, "_blank");
  }

  async function downloadFlyer() {
    try {
      const html2canvas = (await import("html2canvas")).default;
      if (!cardRef.current) return;
      const canvas = await html2canvas(cardRef.current, { backgroundColor: "#F6F3EA", scale: 2 });
      const link = document.createElement("a");
      link.download = `${data.filename}-aglaowner-flyer.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
      onToast("Flyer downloaded — ready to post");
    } catch {
      onToast("Could not generate the flyer — try again");
    }
  }

  async function shareLink() {
    const title = `${data.title} — for sale on aglaowner`;
    const text = `${data.title} is up for sale on aglaowner — ${data.price}, ${data.loc.split(",")[0]}.`;
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url: shareUrl });
      } catch {
        /* user cancelled */
      }
    } else if (navigator.clipboard) {
      await navigator.clipboard.writeText(`${shareUrl} — ${text}`);
      onToast("Link copied — paste it anywhere to share");
    } else {
      onToast(`Copy this link: ${shareUrl}`);
    }
  }

  return (
    <>
      <div
        ref={cardRef}
        className="relative mx-auto mt-1 mb-[18px] flex aspect-square w-[300px] flex-col items-center justify-center gap-1.5 rounded-[10px] border-2 border-ink bg-paper px-5 py-[22px] text-center"
      >
        <div className="absolute top-3.5 right-3.5 z-[5] rotate-[-6deg] rounded bg-oxide px-2.5 py-[5px] font-display text-[11px] tracking-[0.03em] text-paper">
          FOR SALE
        </div>
        <div className="relative mb-1.5 h-24 w-full shrink-0">
          <div className="absolute top-2.5 left-[calc(50%-78px)] z-[1] flex h-14 w-14 -rotate-[9deg] items-center justify-center rounded-md border border-line bg-paper-2 shadow-[0_2px_5px_rgba(34,41,31,0.12)]">
            <IconPhoto size={18} className="text-line" />
          </div>
          <div className="absolute top-2.5 right-[calc(50%-78px)] z-[1] flex h-14 w-14 rotate-[9deg] items-center justify-center rounded-md border border-line bg-paper-2 shadow-[0_2px_5px_rgba(34,41,31,0.12)]">
            <IconPhoto size={18} className="text-line" />
          </div>
          <div className="absolute top-0 left-1/2 z-[2] flex h-24 w-[150px] -translate-x-1/2 items-center justify-center rounded-lg border-[1.5px] border-ink bg-paper-2">
            <Icon size={32} className="text-stamp-green" />
          </div>
        </div>
        <div className="px-1.5 font-serif text-lg leading-[1.2] font-semibold">{data.title}</div>
        <div className="font-mono text-xl font-semibold text-mustard-dark">{data.price}</div>
        <div className="flex items-center gap-1 text-xs text-ink-soft">
          <IconMapPin size={13} /> {data.loc}
        </div>
        <div className="px-2.5 text-[11px] text-ink-soft italic">{data.highlight}</div>
        <div className="absolute right-0 bottom-3.5 left-0 flex justify-between px-5 text-[10px] text-ink-soft">
          <span className="font-display text-ink">
            agla<b className="font-normal text-oxide">owner</b>
          </span>
          <span>{data.ref}</span>
        </div>
      </div>
      <div className="mb-2 flex flex-wrap justify-center gap-2.5">
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
          onClick={shareLink}
          className="inline-flex items-center gap-1.5 rounded-md border border-ink bg-transparent px-[18px] py-[11px] text-[13px] font-semibold text-ink transition-opacity hover:opacity-85"
        >
          <IconLink size={16} /> Share link
        </button>
      </div>
    </>
  );
}
