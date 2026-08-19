"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "./Sidebar";
import { TopNavbar } from "./TopNavbar";

const TITLES: Record<string, { title: string; subtitle: string }> = {
  "/dashboard": { title: "Overview", subtitle: "Real-time SOC command center" },
  "/agents": { title: "AI Security Agents", subtitle: "Autonomous agents working together to investigate and respond to threats" },
  "/threats": { title: "Live Threats", subtitle: "Monitor and triage active threats across your environment" },
  "/incidents": { title: "Incident Investigation", subtitle: "Deep-dive into correlated security incidents" },
  "/prediction": { title: "Threat Prediction", subtitle: "Predict potential attack paths before they become incidents" },
  "/attack-graph": { title: "Attack Graph", subtitle: "Interactive relationship map across your environment" },
  "/risk": { title: "Risk Center", subtitle: "Overall interactive risk assessment" },
  "/network": { title: "Network Map", subtitle: "Live infrastructure and connectivity overview" },
  "/reports": { title: "Reports", subtitle: "Generate and review AI-powered security reports" },
  "/settings": { title: "Settings", subtitle: "Manage your account, organization and platform" },
  "/database": { title: "Database Console", subtitle: "Inspect active database tables, columns, and records in real-time" },
};

export function AppShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const match = Object.keys(TITLES).find((k) => pathname === k || pathname.startsWith(k + "/"));
  const meta = match ? TITLES[match] : undefined;

  return (
    <div className="flex min-h-screen bg-bg-0">
      <Sidebar mobileOpen={mobileOpen} onCloseMobile={() => setMobileOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopNavbar title={meta?.title} onOpenMobile={() => setMobileOpen(true)} />
        <main className="mx-auto w-full max-w-[1600px] flex-1 px-4 py-5 lg:px-6 lg:py-6">{children}</main>
      </div>
    </div>
  );
}
