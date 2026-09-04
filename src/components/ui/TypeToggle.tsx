"use client";

import type { ListingType } from "@/types/listing";
import { typeLabels } from "@/data/categories";

const ORDER: ListingType[] = ["business", "equipment", "lease", "inventory"];

export function TypeToggle({
  value,
  onChange,
  className = "",
}: {
  value: ListingType;
  onChange: (type: ListingType) => void;
  className?: string;
}) {
  return (
    <div className={`inline-flex rounded-[9px] border border-line bg-paper-2 p-[3px] ${className}`}>
      {ORDER.map((type) => (
        <button
          key={type}
          type="button"
          onClick={() => onChange(type)}
          className={`rounded-md px-[18px] py-[9px] text-[13px] font-semibold transition-colors ${
            value === type ? "bg-ink text-paper" : "bg-transparent text-ink-soft"
          }`}
        >
          {typeLabels[type]}
        </button>
      ))}
    </div>
  );
}
