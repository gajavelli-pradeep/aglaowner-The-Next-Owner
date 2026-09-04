"use client";

import { IconGridDots } from "@tabler/icons-react";
import { CatTile } from "@/components/ui/Tiles";
import { getCategories } from "@/lib/data/categories";

export function CategoryGrid({ onCategory, onAll }: { onCategory: (name: string) => void; onAll: () => void }) {
  const categories = getCategories();
  return (
    <section className="px-6 py-11 sm:py-16">
      <div className="mx-auto max-w-[1080px]">
        <p className="mb-2.5 text-xs font-semibold tracking-[0.1em] text-oxide uppercase">Explore</p>
        <div className="mb-9">
          <h2 className="mb-3 max-w-[560px] text-[26px] sm:text-[30px]">Browse by category</h2>
          <p className="max-w-[520px] text-[15px] text-ink-soft">Browse verified listings from real sellers across every category.</p>
        </div>
        <div className="grid grid-cols-1 gap-3.5 md:grid-cols-2">
          {categories.map((c) => (
            <CatTile key={c.slug} icon={c.icon} heading={c.name} hint={c.hint} onClick={() => onCategory(c.name)} />
          ))}
          <CatTile icon={IconGridDots} heading="All categories" hint="Browse everything, 811 listings" onClick={onAll} />
        </div>
      </div>
    </section>
  );
}
