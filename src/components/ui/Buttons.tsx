import type { ButtonHTMLAttributes } from "react";
import { IconArrowLeft } from "@tabler/icons-react";

type BaseProps = ButtonHTMLAttributes<HTMLButtonElement>;

/** .btn-solid — filled oxide button used in header/CTA bands. */
export function ButtonSolid({ className = "", ...props }: BaseProps) {
  return (
    <button
      className={`rounded-[5px] bg-oxide px-[18px] py-[9px] text-[13px] font-semibold text-paper transition-colors hover:bg-oxide-dark ${className}`}
      {...props}
    />
  );
}

/** .btn-ghost — outlined ink button. */
export function ButtonGhost({ className = "", ...props }: BaseProps) {
  return (
    <button
      className={`rounded-[5px] border border-ink px-4 py-[9px] text-[13px] font-semibold transition-colors hover:bg-ink hover:text-paper ${className}`}
      {...props}
    />
  );
}

/** .btn-text — plain-text link-style button. */
export function ButtonText({ className = "", ...props }: BaseProps) {
  return (
    <button
      className={`px-0.5 py-[9px] text-[13px] font-semibold text-ink-soft transition-colors hover:text-oxide ${className}`}
      {...props}
    />
  );
}

/** .backbtn — header back-navigation button used in flow screens. */
export function BackButton({ className = "", ...props }: BaseProps) {
  return (
    <button
      className={`flex items-center gap-1.5 px-1 py-[9px] text-[13px] font-semibold text-ink-soft transition-colors hover:text-oxide ${className}`}
      {...props}
    >
      <IconArrowLeft size={16} /> Back
    </button>
  );
}

/** .cta-big.cta-sell — large filled hero CTA. */
export function CtaSell({ className = "", children, ...props }: BaseProps) {
  return (
    <button
      className={`inline-flex items-center gap-2 rounded-md border-2 border-transparent bg-oxide px-[30px] py-[15px] text-[15px] font-semibold text-paper transition-colors hover:bg-oxide-dark ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

/** .cta-big.cta-buy — large outlined hero CTA. */
export function CtaBuy({ className = "", children, ...props }: BaseProps) {
  return (
    <button
      className={`inline-flex items-center gap-2 rounded-md border-2 border-ink bg-transparent px-[30px] py-[15px] text-[15px] font-semibold text-ink transition-colors hover:bg-ink hover:text-paper ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

/** .price-cta — pricing card CTA; visual depends on the featured/plain card variant. */
export function PriceCta({ featured, className = "", ...props }: BaseProps & { featured: boolean }) {
  return (
    <button
      className={`mt-1.5 block w-full rounded-md py-3 text-center text-sm font-semibold transition-colors ${
        featured ? "bg-oxide text-paper hover:bg-oxide-dark" : "border border-ink bg-transparent text-ink hover:bg-ink hover:text-paper"
      } ${className}`}
      {...props}
    />
  );
}

/** .submitbtn — filled oxide submit button used across forms. */
export function SubmitButton({ className = "", ...props }: BaseProps) {
  return (
    <button
      className={`rounded-md bg-oxide px-[26px] py-3.5 text-sm font-semibold text-paper transition-colors hover:bg-oxide-dark ${className}`}
      {...props}
    />
  );
}

/** .btn-outline-sm — the small ink-outline button used on listing cards ("Edit"). */
export function ButtonOutlineSm({ className = "", ...props }: BaseProps) {
  return (
    <button
      className={`rounded-[4px] border border-ink bg-transparent px-3.5 py-2 text-xs font-semibold text-ink transition-colors hover:bg-ink hover:text-paper ${className}`}
      {...props}
    />
  );
}
