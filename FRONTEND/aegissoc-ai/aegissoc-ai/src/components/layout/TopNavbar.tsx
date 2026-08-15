"use client";

import { Bell, Menu, Search, Settings, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";

const notifications = [
  { id: 1, title: "Ransomware behavior detected on PC-104", time: "2 min ago", tone: "danger" as const },
  { id: 2, title: "Response Agent isolated Server-22", time: "12 min ago", tone: "success" as const },
  { id: 3, title: "Weekly Security Report generated", time: "1 hr ago", tone: "info" as const },
];

export function TopNavbar({ title, subtitle, onOpenMobile }: { title?: string; subtitle?: string; onOpenMobile: () => void }) {
  const [notifOpen, setNotifOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
      if (userRef.current && !userRef.current.contains(e.target as Node)) setUserOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <header className="sticky top-0 z-40 flex items-center gap-3 border-b border-border-1 bg-bg-1/80 px-4 py-3.5 backdrop-blur-xl lg:px-6">
      <button onClick={onOpenMobile} className="text-text-2 hover:text-text-1 lg:hidden cursor-pointer">
        <Menu className="h-5 w-5" />
      </button>

      {title ? (
        <div className="min-w-0">
          <h1 className="truncate text-base font-semibold text-text-1 lg:text-lg">{title}</h1>
          {subtitle && <p className="hidden truncate text-xs text-text-2 sm:block">{subtitle}</p>}
        </div>
      ) : (
        <div className="relative hidden max-w-md flex-1 sm:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-2" />
          <input
            placeholder="Search threats, incidents, assets..."
            className="w-full rounded-lg border border-border-1 bg-surface-1 py-2 pl-9 pr-3 text-sm text-text-1 placeholder:text-text-2 outline-none focus:border-primary/50"
          />
        </div>
      )}

      <div className="ml-auto flex items-center gap-1.5 sm:gap-2.5">
        <div className="relative hidden sm:block w-56 md:w-72">
          {title && (
            <>
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-2" />
              <input
                placeholder="Search..."
                className="w-full rounded-lg border border-border-1 bg-surface-1 py-2 pl-9 pr-3 text-sm text-text-1 placeholder:text-text-2 outline-none focus:border-primary/50"
              />
            </>
          )}
        </div>

        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifOpen((v) => !v)}
            className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-border-1 bg-surface-1 text-text-2 hover:text-text-1 cursor-pointer"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-danger" />
          </button>
          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 card-surface rounded-xl p-2 shadow-2xl animate-fade-up">
              <p className="px-2 py-1.5 text-xs font-semibold text-text-2">Notifications</p>
              {notifications.map((n) => (
                <div key={n.id} className="flex items-start gap-2.5 rounded-lg px-2 py-2 hover:bg-white/5">
                  <span
                    className={cn("mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full", {
                      "bg-danger": n.tone === "danger",
                      "bg-success": n.tone === "success",
                      "bg-cyber": n.tone === "info",
                    })}
                  />
                  <div>
                    <p className="text-xs text-text-1">{n.title}</p>
                    <p className="mt-0.5 text-[11px] text-text-2">{n.time}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <Link
          href="/settings"
          className="hidden h-9 w-9 items-center justify-center rounded-lg border border-border-1 bg-surface-1 text-text-2 hover:text-text-1 sm:flex"
        >
          <Settings className="h-4 w-4" />
        </Link>

        <div className="relative" ref={userRef}>
          <button onClick={() => setUserOpen((v) => !v)} className="flex items-center gap-2 rounded-lg pl-1 pr-2 py-1 hover:bg-white/5 cursor-pointer">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-xs font-semibold text-white">
              JD
            </div>
            <ChevronDown className="hidden h-3.5 w-3.5 text-text-2 sm:block" />
          </button>
          {userOpen && (
            <div className="absolute right-0 mt-2 w-52 card-surface rounded-xl p-2 shadow-2xl animate-fade-up">
              <div className="px-2 py-1.5">
                <p className="text-sm font-medium text-text-1">John Doe</p>
                <p className="text-xs text-text-2">Security Admin</p>
              </div>
              <div className="my-1 h-px bg-border-1" />
              <Link href="/settings" className="block rounded-lg px-2 py-1.5 text-sm text-text-2 hover:bg-white/5 hover:text-text-1">Profile Settings</Link>
              <Link href="/login" className="block rounded-lg px-2 py-1.5 text-sm text-text-2 hover:bg-white/5 hover:text-text-1">Sign out</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
