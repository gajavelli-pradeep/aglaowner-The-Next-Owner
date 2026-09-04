"use client";

import { iconFor } from "@/lib/tablerIconMap";
import type { AdminSection } from "@/types/admin";

const NAV_ITEMS: { section: AdminSection; label: string; icon: string }[] = [
  { section: "overview", label: "Overview", icon: "ti-layout-dashboard" },
  { section: "referrers", label: "Referrers", icon: "ti-users" },
  { section: "rules", label: "Reward Rules", icon: "ti-settings" },
  { section: "listing", label: "Listing Settings", icon: "ti-adjustments" },
  { section: "providers", label: "Voucher Providers", icon: "ti-plug-connected" },
];

/** .sidebar — admin console left nav; sidebar click drives section state, no nested routes. */
export function AdminSidebar({ active, onNavigate }: { active: AdminSection; onNavigate: (section: AdminSection) => void }) {
  return (
    <div className="flex w-[230px] shrink-0 flex-col bg-ink py-[22px] text-paper">
      <div className="border-b border-[#3a4235] px-[22px] pb-[22px]">
        <div className="inline-flex flex-col">
          <div className="font-display text-[19px] tracking-[-0.01em]">
            agla
            <span className="ml-[3px] inline-block -rotate-3 rounded bg-oxide px-[7px] py-0.5 align-[2px] text-[0.72em] text-paper">owner</span>
          </div>
          <p className="mt-[5px] text-center text-[11px] font-semibold tracking-[0.06em] text-[#a8b39c] uppercase">the next owner</p>
        </div>
      </div>
      <div className="px-[22px] pt-4 pb-1.5 text-[10.5px] tracking-[0.06em] text-[#8f9a83] uppercase">Referral Admin</div>
      <nav>
        {NAV_ITEMS.map(({ section, label, icon }) => {
          const Icon = iconFor(icon);
          const isActive = section === active;
          return (
            <div
              key={section}
              role="button"
              tabIndex={0}
              onClick={() => onNavigate(section)}
              onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onNavigate(section)}
              className={`flex cursor-pointer items-center gap-[11px] border-l-[3px] px-[22px] py-[11px] text-[13.5px] font-medium transition-colors ${
                isActive ? "border-oxide bg-[#2c3327] font-semibold text-paper" : "border-transparent text-[#c9cfc0] hover:bg-[#2c3327] hover:text-paper"
              }`}
            >
              <Icon size={17} stroke={1.75} />
              {label}
            </div>
          );
        })}
      </nav>
    </div>
  );
}
