"use client";

import { IconTag, IconSearch } from "@tabler/icons-react";
import { DoorTile } from "@/components/ui/Tiles";
import { StatBox } from "@/components/ui/Misc";

export function Hero({ onSell, onBuy, onReactivate }: { onSell: () => void; onBuy: () => void; onReactivate: () => void }) {
  return (
    <section className="px-6 pt-14 pb-10 text-center">
      <div className="mx-auto max-w-[1080px]">
        <p className="mb-3 text-xs font-semibold tracking-[0.12em] text-stamp-green uppercase">Pan-India &amp; self-serve</p>
        <h1 className="mx-auto mb-5 max-w-[680px] font-serif text-[28px] leading-[1.2] font-semibold sm:text-[42px]">
          <span className="block">
            Having a <span className="text-oxide">business</span> to <span className="text-oxide">sell</span>?
          </span>
          <span className="block">
            Or looking to <span className="text-oxide">buy</span> one?
          </span>
        </h1>
        <p className="mt-[-4px] mb-[22px] text-[15px] font-medium text-ink-soft">
          <span className="font-normal text-oxide">Whole business</span>, <span className="font-normal text-oxide">just the equipment</span>,{" "}
          <span className="font-normal text-oxide">simply the space</span>, or <span className="font-normal text-oxide">your leftover stock</span> —
          whatever you&apos;re passing on.
        </p>
        <div className="mx-auto mb-3.5 grid max-w-[480px] grid-cols-1 gap-4 sm:grid-cols-2">
          <DoorTile icon={IconTag} label="Sell" sub="List yours in 5 minutes" onClick={onSell} />
          <DoorTile icon={IconSearch} label="Buy" sub="Browse verified listings" onClick={onBuy} />
        </div>
        <button type="button" onClick={onReactivate} className="mb-[30px] block w-full text-center text-[13px] font-medium text-ink-soft hover:text-oxide">
          Already listed with us? Find &amp; reactivate →
        </button>
        <p className="mx-auto mb-[30px] max-w-[520px] text-[17px] text-ink-soft">
          Every small business has a story worth passing on. Connect directly on WhatsApp once both sides are verified — we never take a cut.
        </p>
        <div className="flex flex-wrap justify-center gap-10">
          <StatBox value="811" label="Active listings" />
          <StatBox value="38" label="Cities" />
          <StatBox value="₹0" label="Commission, ever" />
        </div>
      </div>
    </section>
  );
}
