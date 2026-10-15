"use client";

import Link from "next/link";
import { BackButton } from "@/components/ui/Buttons";

export function Header({
  isFlow,
  onLogoClick,
  onBack,
}: {
  isFlow: boolean;
  onLogoClick: () => void;
  onBack: () => void;
}) {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/92 backdrop-blur-[6px]">
      <div className="mx-auto flex max-w-[1080px] flex-wrap items-center justify-between gap-x-2.5 gap-y-2 px-6 py-4 sm:flex-nowrap sm:gap-x-4">
        <div className="flex shrink-0 cursor-pointer flex-col max-sm:mr-auto" role="button" tabIndex={0} onClick={onLogoClick}>
          <div className="font-display text-[21px] tracking-[-0.01em]">
            agla
            <span className="ml-[3px] inline-block -rotate-3 rounded bg-oxide px-[7px] py-0.5 align-[2px] text-[0.72em] text-paper">owner</span>
          </div>
          <p className="mt-[3px] text-center text-[11px] font-semibold tracking-[0.06em] text-ink-soft uppercase">the next owner</p>
        </div>

        {!isFlow && (
          // Source hides the menu at <=820px (aglaowner-landing-page.html:61); below that it wraps.
          <nav className="hidden gap-[26px] text-sm font-medium whitespace-nowrap min-[821px]:flex">
            <a href="#how-it-works" className="hover:text-oxide">How it works</a>
            <a href="#archive" className="hover:text-oxide">Archive &amp; renewal</a>
            <a href="#pricing" className="hover:text-oxide">Pricing</a>
            <a href="#faq" className="hover:text-oxide">FAQ</a>
          </nav>
        )}

        {!isFlow ? (
          // Phone: `contents` lifts Sell/Buy beside the logo and drops the two text links to a full-width second row.
          <div className="flex flex-wrap items-center justify-end gap-2.5 max-sm:contents">
            <Link href="/sell" className="inline-flex items-center rounded-[5px] bg-oxide px-[18px] py-[9px] text-[13px] font-semibold text-paper transition-colors hover:bg-oxide-dark pointer-coarse:min-h-11">
              Sell
            </Link>
            <Link href="/buy" className="inline-flex items-center rounded-[5px] border border-ink px-4 py-[9px] text-[13px] font-semibold transition-colors hover:bg-ink hover:text-paper pointer-coarse:min-h-11">
              Buy
            </Link>
            <div className="flex flex-wrap items-center gap-x-2.5 max-sm:w-full max-sm:justify-between sm:contents">
              <Link href="/reactivate" className="inline-flex items-center px-0.5 py-[9px] text-[13px] font-semibold text-ink-soft transition-colors hover:text-oxide max-sm:text-xs pointer-coarse:min-h-11">
                Find &amp; reactivate
              </Link>
              <Link href="/referral" className="inline-flex items-center px-0.5 py-[9px] text-[13px] font-semibold text-stamp-green max-sm:text-xs pointer-coarse:min-h-11">
                Join our referral network &amp; earn
              </Link>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2.5">
            <BackButton onClick={onBack} />
          </div>
        )}
      </div>
    </header>
  );
}
