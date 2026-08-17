"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
  X,
  PanelLeft,
  ChevronsUpDown,
  User,
  LifeBuoy,
  LogOut,
  Sun,
  Moon,
} from "lucide-react";
import { useState, useEffect } from "react";

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
];

export function Sidebar({
  mobileOpen,
  onCloseMobile,
}: {
  mobileOpen: boolean;
  onCloseMobile: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [isHeaderHovered, setIsHeaderHovered] = useState(false);
  const [theme, setTheme] = useState("dark");
  const [menuOpen, setMenuOpen] = useState(false);

  // Sync theme icon state with active setting
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedTheme = localStorage.getItem("aegis_theme") || "dark";
      setTimeout(() => {
        setTheme(storedTheme);
      }, 0);
    }
  }, [menuOpen]);

  // Keyboard shortcuts (Ctrl+P, Ctrl+S, Ctrl+Q)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey) {
        const key = e.key.toLowerCase();
        if (key === "p" || key === "s") {
          e.preventDefault();
          router.push("/settings");
        } else if (key === "q") {
          e.preventDefault();
          localStorage.removeItem("aegis_auth");
          router.push("/login");
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [router]);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("aegis_theme", nextTheme);
    if (nextTheme === "light") {
      document.documentElement.classList.add("light");
      document.documentElement.style.colorScheme = "light";
    } else {
      document.documentElement.classList.remove("light");
      document.documentElement.style.colorScheme = "dark";
    }
  };

  const handleProfileClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuOpen((o) => !o);
  };

  const handleHeaderClick = () => {
    if (typeof window !== "undefined") {
      if (window.innerWidth < 1024) {
        onCloseMobile();
      } else {
        setCollapsed((c) => !c);
      }
    }
  };

  const content = (
    <div className="flex h-full flex-col">
      <div className={cn("flex items-center py-5 transition-all duration-300", collapsed ? "px-[22px] justify-center" : "px-4 justify-between gap-2")}>
        <div
          onClick={handleHeaderClick}
          onMouseEnter={() => setIsHeaderHovered(true)}
          onMouseLeave={() => setIsHeaderHovered(false)}
          className="flex items-center min-w-0 cursor-pointer select-none group/logo"
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary glow-primary transition-all duration-300">
            {isHeaderHovered ? (
              <PanelLeft className="h-4.5 w-4.5 text-white animate-pulse" strokeWidth={2.2} />
            ) : (
              <ShieldHalf className="h-4.5 w-4.5 text-white" strokeWidth={2.2} />
            )}
          </div>
          <div
            className={cn(
              "min-w-0 transition-all duration-300 ease-in-out overflow-hidden flex flex-col justify-center",
              collapsed ? "max-w-0 opacity-0 ml-0 pointer-events-none" : "max-w-[160px] opacity-100 ml-2.5"
            )}
          >
            <p className="truncate text-[15px] font-bold leading-tight text-text-1">AegisSOC AI</p>
            <p className="truncate text-[10px] leading-tight text-text-2">Autonomous Security Ops</p>
          </div>
        </div>
        <button
          onClick={onCloseMobile}
          className={cn("text-text-2 hover:text-text-1 lg:hidden cursor-pointer", collapsed && "hidden")}
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
                    "group flex items-center rounded-lg px-3 py-2.5 text-sm transition-colors",
                    active
                      ? "bg-primary/15 text-text-1 border border-primary/30 glow-primary"
                      : "text-text-2 hover:bg-white/5 hover:text-text-1 border border-transparent",
                    collapsed ? "justify-center" : "justify-start gap-3"
                  )}
                >
                  <Icon className={cn("h-4.5 w-4.5 shrink-0", active ? "text-primary" : "text-text-2 group-hover:text-text-1")} />
                  <span
                    className={cn(
                      "truncate transition-all duration-300 ease-in-out inline-block",
                      collapsed ? "max-w-0 opacity-0 ml-0 pointer-events-none" : "max-w-[200px] opacity-100"
                    )}
                  >
                    {item.label}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Profile Section at the Bottom */}
      <div className="relative border-t border-border-1 p-2.5">
        {menuOpen && (
          <>
            {/* Transparent click-shield backdrop overlay */}
            <div
              className="fixed inset-0 z-40 cursor-default"
              onClick={() => setMenuOpen(false)}
            />
            {/* Popover */}
            <div
              onClick={(e) => e.stopPropagation()}
              style={{ backgroundColor: theme === "light" ? "#EEE9DF" : "#11111A" }}
              className="absolute bottom-14 left-2.5 w-56 border border-border-2 rounded-xl p-2.5 shadow-2xl animate-fade-up z-50 select-none"
            >
              {/* Header info */}
              <div className="px-3 py-2 min-w-0">
                <p className="truncate text-sm font-bold text-text-1">User</p>
                <p className="truncate text-xs text-text-2 mt-0.5">—</p>
              </div>
              
              <div className="my-1.5 h-px bg-border-2" />
              
              {/* Action Items */}
              <Link
                href="/settings"
                onClick={() => setMenuOpen(false)}
                className="group flex items-center justify-start gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium text-text-1/90 hover:text-text-1 hover:bg-white/5 transition-colors"
              >
                <User className="h-4 w-4 text-text-2 group-hover:text-primary transition-colors" />
                <span>Profile</span>
              </Link>

              <Link
                href="/settings"
                onClick={() => setMenuOpen(false)}
                className="group flex items-center justify-start gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium text-text-1/90 hover:text-text-1 hover:bg-white/5 transition-colors"
              >
                <Settings className="h-4 w-4 text-text-2 group-hover:text-primary transition-colors" />
                <span>Settings</span>
              </Link>

              <div className="my-1.5 h-px bg-border-2" />

              <button
                onClick={() => {
                  toggleTheme();
                  setMenuOpen(false);
                }}
                className="group flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium text-text-1/90 hover:text-text-1 hover:bg-white/5 transition-colors cursor-pointer"
              >
                {theme === "light" ? (
                  <Moon className="h-4 w-4 text-text-2 group-hover:text-primary transition-colors" />
                ) : (
                  <Sun className="h-4 w-4 text-text-2 group-hover:text-primary transition-colors" />
                )}
                <span>{theme === "light" ? "Dark Mode" : "Light Mode"}</span>
              </button>

              <button
                onClick={() => setMenuOpen(false)}
                className="group flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium text-text-1/90 hover:text-text-1 hover:bg-white/5 transition-colors cursor-pointer"
              >
                <LifeBuoy className="h-4 w-4 text-text-2 group-hover:text-primary transition-colors" />
                <span>Support</span>
              </button>

              <div className="my-1.5 h-px bg-border-2" />

              <button
                onClick={() => {
                  localStorage.removeItem("aegis_auth");
                  router.push("/login");
                }}
                className="group flex w-full items-center justify-start gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium text-danger hover:bg-danger/10 transition-colors cursor-pointer"
              >
                <LogOut className="h-4 w-4 text-danger/80 group-hover:text-danger transition-colors" />
                <span>Log out</span>
              </button>
            </div>
          </>
        )}

        <div
          onClick={handleProfileClick}
          className={cn(
            "relative z-30 flex w-full items-center rounded-lg px-2 py-2 text-sm transition-all duration-300 hover:bg-white/5 cursor-pointer",
            collapsed ? "justify-center" : "justify-between"
          )}
        >
          <div className="flex items-center min-w-0">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-xs font-semibold text-white border border-primary/30 shadow-md">
              U
            </div>
            <div
              className={cn(
                "min-w-0 transition-all duration-300 ease-in-out overflow-hidden flex flex-col justify-center",
                collapsed ? "max-w-0 opacity-0 ml-0 pointer-events-none" : "max-w-[140px] opacity-100 ml-2.5"
              )}
            >
              <p className="truncate text-xs font-bold leading-tight text-text-1">User</p>
              <p className="truncate text-[10px] leading-tight text-text-2">—</p>
            </div>
          </div>
          <ChevronsUpDown
            className={cn(
              "h-3.5 w-3.5 text-text-2 shrink-0 transition-all duration-300",
              collapsed ? "w-0 opacity-0 pointer-events-none" : "w-3.5 opacity-100 ml-1.5"
            )}
          />
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <aside
        className={cn(
          "hidden lg:flex sticky top-0 h-screen z-30 shrink-0 flex-col border-r border-border-1 bg-bg-1/80 backdrop-blur-xl transition-[width] duration-300 ease-in-out",
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
