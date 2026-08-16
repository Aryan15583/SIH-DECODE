"use client";

import { Menu, ChevronRight } from "lucide-react";

export function TopNavbar({ title, onOpenMobile }: { title?: string; onOpenMobile: () => void }) {
  return (
    <header className="sticky top-0 z-40 flex items-center gap-3 border-b border-border-1 bg-bg-1/80 px-4 py-3.5 backdrop-blur-xl lg:px-6">
      <button onClick={onOpenMobile} className="text-text-2 hover:text-text-1 lg:hidden cursor-pointer">
        <Menu className="h-5 w-5" />
      </button>

      {title && (
        <div className="flex items-center gap-2 text-sm font-medium lg:text-base select-none">
          <span className="font-bold text-text-1">Workspace</span>
          <ChevronRight className="h-3.5 w-3.5 text-text-2/50" strokeWidth={2.5} />
          <span className="font-semibold text-primary">{title}</span>
        </div>
      )}
    </header>
  );
}
