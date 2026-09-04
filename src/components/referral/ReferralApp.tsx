"use client";

import { useCallback, useState } from "react";
import { ReferralHeader } from "@/components/referral/ReferralHeader";
import { ReferralHomeScreen } from "@/components/referral/ReferralHomeScreen";
import { GetCodeForm } from "@/components/referral/GetCodeForm";
import { CodeConfirm } from "@/components/referral/CodeConfirm";
import { DashboardLookup } from "@/components/referral/DashboardLookup";
import { Dashboard } from "@/components/referral/Dashboard";
import { Toast } from "@/components/ui/Toast";
import { useToast } from "@/lib/useToast";
import type { ReferralScreen } from "@/components/referral/referralScreens";

/** Client orchestrator for /referral — mirrors AglaownerApp's history-stack screen router. */
export function ReferralApp() {
  const [history, setHistory] = useState<ReferralScreen[]>(["home"]);
  const { message, show, showToast } = useToast();

  const screen = history[history.length - 1];
  const isFlow = screen !== "home";

  const goTo = useCallback((next: ReferralScreen) => {
    setHistory((prev) => (prev[prev.length - 1] === next ? prev : [...prev, next]));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const goBack = useCallback(() => {
    setHistory((prev) => (prev.length > 1 ? prev.slice(0, -1) : prev));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const goHome = useCallback(() => {
    setHistory((prev) => (prev[prev.length - 1] === "home" ? prev : [...prev, "home"]));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <>
      <ReferralHeader isFlow={isFlow} onLogoClick={goHome} onDashboard={() => goTo("dashboard-lookup")} onGetCode={() => goTo("get-code-form")} onBack={goBack} />

      <main className="flex-1">
        {screen === "home" && <ReferralHomeScreen onGetCode={() => goTo("get-code-form")} onDashboard={() => goTo("dashboard-lookup")} />}
        {screen === "get-code-form" && <GetCodeForm onSubmit={() => goTo("code-confirm")} />}
        {screen === "code-confirm" && <CodeConfirm onToast={showToast} onDashboard={() => goTo("dashboard")} />}
        {screen === "dashboard-lookup" && <DashboardLookup onSubmit={() => goTo("dashboard")} />}
        {screen === "dashboard" && <Dashboard onToast={showToast} />}
      </main>

      <Toast message={message} show={show} />
    </>
  );
}
