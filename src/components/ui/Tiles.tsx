"use client";

import type { ButtonHTMLAttributes } from "react";
import type { TablerIcon } from "@/types/listing";

type BaseProps = ButtonHTMLAttributes<HTMLButtonElement>;

/** .door-tile — the two large Sell/Buy tiles in the hero. */
export function DoorTile({
  icon: Icon,
  label,
  sub,
  ...props
}: BaseProps & { icon: TablerIcon; label: string; sub: string }) {
  return (
    <button
      className="group flex w-full flex-col items-center rounded-[10px] border border-line bg-paper px-5 py-7 text-center transition-[border-color,transform] duration-150 hover:-translate-y-0.5 hover:border-oxide"
      {...props}
    >
      <Icon size={28} className="mb-2.5 text-stamp-green" stroke={1.75} />
      <span className="group-hover:text-oxide mb-1 font-display text-xl tracking-[-0.01em]">{label}</span>
      <span className="text-[13px] text-ink-soft">{sub}</span>
    </button>
  );
}

/** .cat-tile — home page "Browse by category" grid tile. */
export function CatTile({
  icon: Icon,
  heading,
  hint,
  ...props
}: BaseProps & { icon: TablerIcon; heading: string; hint: string }) {
  return (
    <button
      className="flex w-full items-start gap-3.5 rounded-lg border border-line bg-paper px-[18px] py-5 text-left transition-[border-color,transform] duration-150 hover:-translate-y-0.5 hover:border-oxide"
      {...props}
    >
      <Icon size={24} className="mt-0.5 shrink-0 text-stamp-green" stroke={1.75} />
      <div>
        <span className="mb-1 block text-[15px] font-semibold">{heading}</span>
        <span className="block text-[12.5px] leading-[1.4] font-normal text-ink-soft">{hint}</span>
      </div>
    </button>
  );
}

/** .picker-tile — category tile on the sell/buy category-picker screens. */
export function PickerTile({
  icon: Icon,
  name,
  count,
  ...props
}: BaseProps & { icon: TablerIcon; name: string; count: string }) {
  return (
    <button
      className="flex w-full items-center gap-3 rounded-md border border-line bg-paper px-4 py-[22px] text-left transition-[border-color,background-color] duration-150 hover:border-oxide hover:bg-paper-2"
      {...props}
    >
      <Icon size={22} className="text-oxide" stroke={1.75} />
      <div>
        <div className="text-sm font-semibold">{name}</div>
        <div className="text-[11px] text-ink-soft">{count}</div>
      </div>
    </button>
  );
}
