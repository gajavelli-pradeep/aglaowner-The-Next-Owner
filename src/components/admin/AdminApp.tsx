"use client";

import { useState } from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { OverviewSection } from "@/components/admin/OverviewSection";
import { ReferrersSection } from "@/components/admin/ReferrersSection";
import { RewardRulesSection } from "@/components/admin/RewardRulesSection";
import { ListingSettingsSection } from "@/components/admin/ListingSettingsSection";
import { ProvidersSection } from "@/components/admin/ProvidersSection";
import { AdminsSection } from "@/components/admin/AdminsSection";
import { Toast } from "@/components/ui/Toast";
import { useToast } from "@/lib/useToast";
import type {
  AdminSection,
  ListingTypeSetting,
  AdminCreditRule,
  AdminRewardTier,
  AdminPromotion,
  AdminStat,
  AdminActivityItem,
  AdminReferrer,
} from "@/types/admin";

/** Client orchestrator for /admin — sidebar click drives section state (no nested routes), matching the AglaownerApp/ReferralApp convention. */
export function AdminApp({
  adminEmail,
  listingTypeSettings,
  creditRules,
  rewardTiers,
  promotion,
  overviewStats,
  overviewActivity,
  referrers,
}: {
  adminEmail: string;
  listingTypeSettings: ListingTypeSetting[];
  creditRules: AdminCreditRule[];
  rewardTiers: AdminRewardTier[];
  promotion: AdminPromotion;
  overviewStats: AdminStat[];
  overviewActivity: AdminActivityItem[];
  referrers: AdminReferrer[];
}) {
  const [section, setSection] = useState<AdminSection>("overview");
  const { message, show, showToast } = useToast();

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <AdminSidebar active={section} onNavigate={setSection} adminEmail={adminEmail} />
      <main className="max-w-[1180px] flex-1 px-5 py-6 md:px-10 md:py-8">
        {section === "overview" && <OverviewSection onNavigate={setSection} stats={overviewStats} activity={overviewActivity} promotion={promotion} />}
        {section === "referrers" && <ReferrersSection onToast={showToast} referrers={referrers} />}
        {section === "rules" && (
          <RewardRulesSection onToast={showToast} initialCreditRules={creditRules} initialRewardTiers={rewardTiers} initialPromotion={promotion} />
        )}
        {section === "listing" && <ListingSettingsSection onToast={showToast} initialSettings={listingTypeSettings} />}
        {section === "providers" && <ProvidersSection onToast={showToast} />}
        {section === "admins" && <AdminsSection />}
      </main>
      <Toast message={message} show={show} />
    </div>
  );
}
