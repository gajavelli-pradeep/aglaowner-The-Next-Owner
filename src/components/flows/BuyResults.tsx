"use client";

import { useMemo, useState } from "react";
import { IconSearch } from "@tabler/icons-react";
import { TypeToggle } from "@/components/ui/TypeToggle";
import { SuggestChip } from "@/components/ui/Misc";
import { ListingCard } from "@/components/ui/ListingCard";
import { getSampleListings } from "@/lib/data/listings";
import type { ListingType, SampleListing } from "@/types/listing";

const SUGGESTIONS = ["Café for sale in Bengaluru", "Playschool under ₹10L", "Salon for sale in Mumbai", "PG or hostel near college"];

function metaRightFor(type: ListingType, l: SampleListing): string {
  if (type === "equipment") return l.condition ?? "";
  if (type === "lease") return l.leaseLeft ?? "";
  if (type === "inventory") return l.lotSize ?? "";
  return l.legacy ?? "";
}

/** .resultshead + .rgrid — buy results screen with real search input and type toggle. */
export function BuyResults({
  type,
  categoryLabel,
  onTypeChange,
  onOpen,
}: {
  type: ListingType;
  categoryLabel: string;
  onTypeChange: (type: ListingType) => void;
  onOpen: (index: number) => void;
}) {
  const [search, setSearch] = useState("");
  const listings = getSampleListings(type);

  const filtered = useMemo(() => {
    if (!search.trim()) return listings;
    const q = search.toLowerCase();
    return listings.filter((l) => l.title.toLowerCase().includes(q) || l.loc.toLowerCase().includes(q));
  }, [listings, search]);

  return (
    <div className="mx-auto max-w-[1080px] px-6">
      <div className="pt-6.5 pb-4">
        <TypeToggle value={type} onChange={onTypeChange} className="mb-3.5" />
        <h2 className="mb-1 text-2xl">{categoryLabel}</h2>
        <div className="my-4 flex items-center gap-2.5 rounded-md border border-line bg-paper-2 p-3">
          <IconSearch size={18} className="text-ink-soft" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by locality, keyword, e.g. 'outdoor seating Koramangala'"
            className="flex-1 border-none bg-transparent text-sm text-ink outline-none"
          />
        </div>
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-ink-soft">Try:</span>
          {SUGGESTIONS.map((s) => (
            <SuggestChip key={s} onClick={() => setSearch(s)}>
              {s}
            </SuggestChip>
          ))}
        </div>
        <div className="mb-6 flex flex-wrap gap-2">
          <select className="rounded-[20px] border border-line bg-paper px-2.5 py-2 text-[13px]">
            <option>All cities</option><option>Bengaluru</option><option>Hyderabad</option><option>Pune</option>
          </select>
          <select className="rounded-[20px] border border-line bg-paper px-2.5 py-2 text-[13px]">
            <option>Any price band</option><option>Under ₹5L</option><option>₹5L–15L</option><option>₹15L+</option>
          </select>
          <select className="rounded-[20px] border border-line bg-paper px-2.5 py-2 text-[13px]">
            <option>Newest first</option><option>Price: low to high</option><option>Price: high to high</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 pb-12 sm:grid-cols-2 md:grid-cols-3">
        {filtered.map((l) => (
          <ListingCard
            key={l.title}
            icon={l.icon}
            tag={l.tag}
            warn={l.warn}
            title={l.title}
            loc={l.loc}
            price={l.price}
            metaRight={metaRightFor(type, l)}
            onView={() => onOpen(listings.indexOf(l))}
          />
        ))}
        {filtered.length === 0 && <p className="col-span-full py-10 text-center text-sm text-ink-soft">No listings match your search yet.</p>}
      </div>
    </div>
  );
}
