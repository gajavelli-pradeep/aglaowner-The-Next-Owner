"use client";

import { ButtonSolid, ButtonGhost, ButtonText, BackButton } from "@/components/ui/Buttons";
import type { Screen } from "@/lib/screens";

export function Header({
  isFlow,
  onLogoClick,
  onNavigate,
  onBack,
}: {
  isFlow: boolean;
  onLogoClick: () => void;
  onNavigate: (screen: Screen) => void;
  onBack: () => void;
}) {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/92 backdrop-blur-[6px]">
      <div className="mx-auto flex max-w-[1080px] items-center justify-between gap-4 px-6 py-4">
        <div className="flex shrink-0 cursor-pointer flex-col" role="button" tabIndex={0} onClick={onLogoClick}>
          <div className="font-display text-[21px] tracking-[-0.01em]">
            agla
            <span className="ml-[3px] inline-block -rotate-3 rounded bg-oxide px-[7px] py-0.5 align-[2px] text-[0.72em] text-paper">owner</span>
          </div>
          <p className="mt-[3px] text-center text-[11px] font-semibold tracking-[0.06em] text-ink-soft uppercase">the next owner</p>
        </div>

        {!isFlow && (
          <nav className="hidden gap-[26px] text-sm font-medium md:flex">
            <a href="#how-it-works" className="hover:text-oxide">How it works</a>
            <a href="#archive" className="hover:text-oxide">Archive &amp; renewal</a>
            <a href="#pricing" className="hover:text-oxide">Pricing</a>
            <a href="#faq" className="hover:text-oxide">FAQ</a>
          </nav>
        )}

        {!isFlow ? (
          <div className="flex flex-wrap items-center justify-end gap-2.5">
            <ButtonSolid onClick={() => onNavigate("sell-category")}>Sell</ButtonSolid>
            <ButtonGhost onClick={() => onNavigate("buy-category")}>Buy</ButtonGhost>
            <ButtonText onClick={() => onNavigate("reactivate-lookup")}>Find &amp; reactivate</ButtonText>
            <a href="/referral" className="px-0.5 py-[9px] text-[13px] font-semibold text-stamp-green">
              Join our referral network &amp; earn
            </a>
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
