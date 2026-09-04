"use client";

import { TypeToggle } from "@/components/ui/TypeToggle";
import { PickerTile } from "@/components/ui/Tiles";
import { getCategories, getCategoryIconName, getSellPickerHint, getBuyListedCount, getSellTypeHint, getBuyTypeHint } from "@/lib/data/categories";
import type { ListingType } from "@/types/listing";

/** Shared picker grid for both sell-category and buy-category screens (.picker-head + .type-toggle + .picker-grid). */
export function SellBuyPicker({
  mode,
  type,
  onTypeChange,
  heading,
  onSelect,
}: {
  mode: "sell" | "buy";
  type: ListingType;
  onTypeChange: (type: ListingType) => void;
  heading: string;
  onSelect: (categoryName: string, iconName: string) => void;
}) {
  const categories = getCategories();
  const hint = mode === "sell" ? getSellTypeHint(type) : getBuyTypeHint(type);
  const hintMatch = /^<strong>(.*?)<\/strong>\s*(.*)$/.exec(hint);

  return (
    <div className="mx-auto max-w-[1080px] px-6">
      <div className="py-8 pb-2">
        <h2 className="mb-1.5 text-[22px] sm:text-[26px]">{heading}</h2>
        <p className="mb-0.5 max-w-[600px] text-[14.5px] leading-[1.6] text-ink-soft">
          {hintMatch ? (
            <>
              <strong className="font-semibold text-ink">{hintMatch[1]}</strong> {hintMatch[2]}
            </>
          ) : (
            hint
          )}
        </p>
      </div>
      <TypeToggle value={type} onChange={onTypeChange} className="mb-1.5" />
      <div className="grid grid-cols-1 gap-3.5 py-6 pb-12 sm:grid-cols-2 md:grid-cols-3">
        {categories.map((c) => {
          const count = mode === "buy" ? `${getBuyListedCount(c.slug, type)} listed` : getSellPickerHint(c.slug, type);
          return <PickerTile key={c.slug} icon={c.icon} name={c.name} count={count} onClick={() => onSelect(c.name, getCategoryIconName(c.slug))} />;
        })}
      </div>
    </div>
  );
}
