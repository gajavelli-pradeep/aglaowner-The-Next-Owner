"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { IconLogout } from "@tabler/icons-react";
import { iconFor } from "@/lib/tablerIconMap";
import { createClient } from "@/lib/supabase/client";
import type { AdminSection } from "@/types/admin";

const NAV_ITEMS: { section: AdminSection; label: string; icon: string }[] = [
  { section: "overview", label: "Overview", icon: "ti-layout-dashboard" },
  { section: "referrers", label: "Referrers", icon: "ti-users" },
  { section: "rules", label: "Reward Rules", icon: "ti-settings" },
  { section: "listing", label: "Listing Settings", icon: "ti-adjustments" },
  { section: "providers", label: "Voucher Providers", icon: "ti-plug-connected" },
];

/** .sidebar — admin console left nav; sidebar click drives section state, no nested routes. */
export function AdminSidebar({
  active,
  onNavigate,
  adminEmail,
}: {
  active: AdminSection;
  onNavigate: (section: AdminSection) => void;
  adminEmail: string;
}) {
  const router = useRouter();
  const [confirmingLogout, setConfirmingLogout] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

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

      {adminEmail && (
        <div className="mt-auto border-t border-[#3a4235] px-[22px] pt-[14px]">
          <div className="mb-2.5 flex items-center gap-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-oxide text-[13px] font-bold text-paper">
              {adminEmail[0]?.toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="truncate text-[12.5px] font-semibold">{adminEmail}</p>
              <p className="text-[10.5px] tracking-[0.05em] text-[#a8b39c] uppercase">Admin</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setConfirmingLogout(true)}
            className="flex w-full items-center justify-center gap-1.5 rounded-md border border-[#3a4235] bg-[#2c3327] px-3 py-2 text-[12.5px] font-semibold text-paper transition-colors hover:bg-[#3a4235]"
          >
            <IconLogout size={15} /> Log out
          </button>
        </div>
      )}

      {confirmingLogout && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-ink/45 p-5">
          <div className="w-full max-w-[320px] rounded-lg bg-paper p-6 text-center text-ink">
            <h3 className="mb-1.5 text-[15px] font-semibold">Log out of admin?</h3>
            <p className="mb-5 text-[12.5px] text-ink-soft">You&apos;ll need to sign in again to make changes to referrals, pricing, or providers.</p>
            <div className="flex gap-2.5">
              <button
                type="button"
                onClick={() => setConfirmingLogout(false)}
                className="flex-1 rounded-md border border-line bg-paper py-2.5 text-[13px] font-semibold hover:bg-paper-2"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={loggingOut}
                onClick={handleLogout}
                className="flex-1 rounded-md border border-oxide bg-oxide py-2.5 text-[13px] font-semibold text-paper hover:bg-oxide-dark disabled:opacity-60"
              >
                {loggingOut ? "Logging out…" : "Log out"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
