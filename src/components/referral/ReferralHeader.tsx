"use client";

import Link from "next/link";
import { ButtonGhost, ButtonSolid, BackButton } from "@/components/ui/Buttons";

/** Referral-page header — its own nav/actions, distinct from the main site header. */
export function ReferralHeader({
  isFlow,
  onLogoClick,
  onDashboard,
  onGetCode,
  onBack,
}: {
  isFlow: boolean;
  onLogoClick: () => void;
  onDashboard: () => void;
  onGetCode: () => void;
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
          <nav className="hidden gap-6 text-sm font-medium md:flex">
            <a href="#how-it-works" className="hover:text-oxide">How it works</a>
            <a href="#rewards" className="hover:text-oxide">Rewards</a>
            <a href="#faq" className="hover:text-oxide">FAQ</a>
          </nav>
        )}

        {!isFlow ? (
          <div className="flex flex-wrap items-center justify-end gap-2.5">
            <ButtonGhost onClick={onDashboard}>My dashboard</ButtonGhost>
            <ButtonSolid onClick={onGetCode}>Get my code</ButtonSolid>
            <Link href="/" className="px-0.5 py-[9px] text-[13px] font-semibold text-navyblue">
              Visit aglaowner
            </Link>
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
