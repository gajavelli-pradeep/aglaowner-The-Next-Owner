"use client";

import { IconBrandWhatsapp, IconBadge } from "@tabler/icons-react";
import { getCategories } from "@/lib/data/categories";

export function Footer({ onCategory, onAllCategories }: { onCategory: (name: string) => void; onAllCategories: () => void }) {
  const categories = getCategories().slice(0, 4);

  return (
    <footer className="border-t border-line bg-paper-2 pt-12">
      <div className="mx-auto grid max-w-[1080px] grid-cols-2 gap-8 px-6 pb-9 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <div className="inline-flex flex-col">
            <div className="font-display text-[19px]">
              agla
              <span className="ml-[3px] inline-block -rotate-3 rounded bg-oxide px-[7px] py-0.5 align-[2px] text-[0.72em] text-paper">owner</span>
            </div>
            <p className="mt-[3px] mb-3 text-center text-[11px] font-semibold tracking-[0.06em] text-ink-soft uppercase">the next owner</p>
          </div>
          <p className="mb-4 max-w-[260px] text-[13px] text-ink-soft">
            A self-serve listing platform for small businesses across India — cafés, playschools, salons and more. We connect buyers and sellers
            directly and never take a commission.
          </p>
          <div className="flex flex-col items-start gap-2.5">
            <a href="#" className="inline-flex items-center gap-1.5 rounded-md border border-line bg-paper px-3.5 py-2 text-[13px] font-semibold">
              <IconBrandWhatsapp size={16} className="text-stamp-green" /> Chat with us
            </a>
            <a
              href="/referral"
              className="inline-flex items-center gap-1.5 rounded-md border border-stamp-green bg-paper px-3.5 py-2 text-[13px] font-semibold text-stamp-green"
            >
              <IconBadge size={16} /> Join our referral network &amp; earn
            </a>
          </div>
        </div>
        <div>
          <h5 className="mb-3.5 text-xs tracking-[0.06em] text-ink-soft uppercase">Categories</h5>
          <ul className="space-y-2">
            {categories.map((c) => (
              <li key={c.slug} className="text-[13.5px]">
                <button type="button" onClick={() => onCategory(c.name)} className="hover:text-oxide">
                  {c.name}
                </button>
              </li>
            ))}
            <li className="text-[13.5px]">
              <button type="button" onClick={onAllCategories} className="hover:text-oxide">
                All categories
              </button>
            </li>
          </ul>
        </div>
        <div>
          <h5 className="mb-3.5 text-xs tracking-[0.06em] text-ink-soft uppercase">Company</h5>
          <ul className="space-y-2">
            <li className="text-[13.5px]"><a href="#how-it-works" className="hover:text-oxide">How it works</a></li>
            <li className="text-[13.5px]"><a href="#archive" className="hover:text-oxide">Archive &amp; renewal</a></li>
            <li className="text-[13.5px]"><a href="#pricing" className="hover:text-oxide">Pricing</a></li>
            <li className="text-[13.5px]"><a href="#faq" className="hover:text-oxide">FAQ</a></li>
          </ul>
        </div>
        <div>
          <h5 className="mb-3.5 text-xs tracking-[0.06em] text-ink-soft uppercase">Legal</h5>
          <ul className="space-y-2">
            <li className="text-[13.5px]"><a href="#" className="hover:text-oxide">Terms of use</a></li>
            <li className="text-[13.5px]"><a href="#" className="hover:text-oxide">Privacy policy</a></li>
            <li className="text-[13.5px]"><a href="#" className="hover:text-oxide">Grievance redressal</a></li>
          </ul>
        </div>
      </div>
      <div className="mx-auto flex max-w-[1080px] flex-wrap justify-between gap-2.5 border-t border-line px-6 py-[18px] text-xs text-ink-soft">
        <span>© 2026 aglaowner. A listing platform only — we do not broker, value or guarantee any transaction.</span>
        <span><a href="#" className="hover:text-oxide">contact@aglaowner.in</a></span>
      </div>
    </footer>
  );
}
