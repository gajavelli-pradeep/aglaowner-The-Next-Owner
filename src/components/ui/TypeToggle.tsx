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
    // Below sm the 4 tabs share the row (flex-1); on <340px screens the bar scrolls itself rather than widening the page.
    <div className={`flex w-full overflow-x-auto rounded-[9px] border border-line bg-paper-2 p-[3px] sm:inline-flex sm:w-auto ${className}`}>
      {ORDER.map((type) => (
        <button
          key={type}
          type="button"
          onClick={() => onChange(type)}
          className={`flex-1 rounded-md px-2 py-[9px] text-[13px] font-semibold transition-colors sm:flex-none sm:px-[18px] ${
            value === type ? "bg-ink text-paper" : "bg-transparent text-ink-soft"
          }`}
        >
          {typeLabels[type]}
        </button>
      ))}
    </div>
  );
}
