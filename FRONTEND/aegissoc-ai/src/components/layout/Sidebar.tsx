"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Bot,
  Radar,
  FileSearch,
  Waypoints,
  ShieldAlert,
  Network,
  FileBarChart,
  Settings,
  ShieldHalf,
  ChevronsLeft,
  ChevronsRight,
  X,
} from "lucide-react";
import { useState } from "react";

const NAV = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/agents", label: "AI Agents", icon: Bot },
  { href: "/threats", label: "Live Threats", icon: Radar },
  { href: "/incidents", label: "Incident Investigation", icon: FileSearch },
  { href: "/prediction", label: "Threat Prediction", icon: Waypoints },
  { href: "/attack-graph", label: "Attack Graph", icon: ShieldAlert },
  { href: "/risk", label: "Risk Center", icon: ShieldHalf },
  { href: "/network", label: "Network Map", icon: Network },
  { href: "/reports", label: "Reports", icon: FileBarChart },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar({
  mobileOpen,
  onCloseMobile,
}: {
  mobileOpen: boolean;
  onCloseMobile: () => void;
}) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const content = (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between gap-2 px-4 py-5">
        <Link href="/dashboard" className="flex items-center gap-2.5 min-w-0">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary glow-primary">
            <ShieldHalf className="h-4.5 w-4.5 text-white" strokeWidth={2.2} />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="truncate text-[15px] font-bold leading-tight text-text-1">AegisSOC AI</p>
              <p className="truncate text-[10px] leading-tight text-text-2">Autonomous Security Ops</p>
            </div>
          )}
        </Link>
        <button
          onClick={onCloseMobile}
          className="text-text-2 hover:text-text-1 lg:hidden cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-2.5 py-2">
        <ul className="flex flex-col gap-1">
          {NAV.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onCloseMobile}
                  className={cn(
                    "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                    active
                      ? "bg-primary/15 text-text-1 border border-primary/30 glow-primary"
                      : "text-text-2 hover:bg-white/5 hover:text-text-1 border border-transparent"
                  )}
                >
                  <Icon className={cn("h-4.5 w-4.5 shrink-0", active ? "text-primary" : "text-text-2 group-hover:text-text-1")} />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="hidden lg:block border-t border-border-1 p-2.5">
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs text-text-2 hover:bg-white/5 hover:text-text-1 cursor-pointer"
        >
          {collapsed ? <ChevronsRight className="h-4 w-4" /> : <><ChevronsLeft className="h-4 w-4" /> Collapse</>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <aside
        className={cn(
          "hidden lg:flex sticky top-0 h-screen shrink-0 flex-col border-r border-border-1 bg-bg-1/80 backdrop-blur-xl transition-[width] duration-200",
          collapsed ? "w-[76px]" : "w-[248px]"
        )}
      >
        {content}
      </aside>

      {/* Mobile drawer */}
      <div
        className={cn(
          "fixed inset-0 z-[80] lg:hidden transition-opacity",
          mobileOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        )}
      >
        <div className="absolute inset-0 bg-black/60" onClick={onCloseMobile} />
        <aside
          className={cn(
            "absolute left-0 top-0 h-full w-[260px] border-r border-border-1 bg-bg-1 transition-transform duration-200",
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          {content}
        </aside>
      </div>
    </>
  );
}
