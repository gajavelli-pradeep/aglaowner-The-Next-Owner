"use client";

import { useState } from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { OverviewSection } from "@/components/admin/OverviewSection";
import { ReferrersSection } from "@/components/admin/ReferrersSection";
import { RewardRulesSection } from "@/components/admin/RewardRulesSection";
import { ListingSettingsSection } from "@/components/admin/ListingSettingsSection";
import { ProvidersSection } from "@/components/admin/ProvidersSection";
import { Toast } from "@/components/ui/Toast";
import { useToast } from "@/lib/useToast";
import type { AdminSection } from "@/types/admin";

/** Client orchestrator for /admin — sidebar click drives section state (no nested routes), matching the AglaownerApp/ReferralApp convention. */
export function AdminApp() {
  const [section, setSection] = useState<AdminSection>("overview");
  const { message, show, showToast } = useToast();

  return (
    <div className="flex min-h-screen">
      <AdminSidebar active={section} onNavigate={setSection} />
      <main className="max-w-[1180px] flex-1 px-10 py-8">
        {section === "overview" && <OverviewSection onNavigate={setSection} />}
        {section === "referrers" && <ReferrersSection onToast={showToast} />}
        {section === "rules" && <RewardRulesSection onToast={showToast} />}
        {section === "listing" && <ListingSettingsSection onToast={showToast} />}
        {section === "providers" && <ProvidersSection onToast={showToast} />}
      </main>
      <Toast message={message} show={show} />
    </div>
  );
}
