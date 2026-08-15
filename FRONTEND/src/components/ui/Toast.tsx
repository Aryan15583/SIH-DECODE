"use client";

import { createContext, useCallback, useContext, useState } from "react";
import { CheckCircle2, Info, TriangleAlert, X } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastTone = "success" | "info" | "warning";
interface ToastItem {
  id: number;
  title: string;
  description?: string;
  tone: ToastTone;
}

interface ToastContextValue {
  push: (title: string, description?: string, tone?: ToastTone) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

const toneStyles: Record<ToastTone, { icon: React.ReactNode; border: string }> = {
  success: { icon: <CheckCircle2 className="h-4 w-4 text-success" />, border: "border-success/30" },
  info: { icon: <Info className="h-4 w-4 text-cyber" />, border: "border-cyber/30" },
  warning: { icon: <TriangleAlert className="h-4 w-4 text-warning" />, border: "border-warning/30" },
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const push = useCallback((title: string, description?: string, tone: ToastTone = "success") => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, title, description, tone }]);
    setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id));
    }, 4000);
  }, []);

  return (
    <ToastContext.Provider value={{ push }}>
      {children}
      <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2 w-80">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={cn(
              "card-surface animate-fade-up rounded-xl border p-3.5 shadow-2xl flex items-start gap-3",
              toneStyles[t.tone].border
            )}
          >
            {toneStyles[t.tone].icon}
            <div className="flex-1">
              <p className="text-sm font-medium text-text-1">{t.title}</p>
              {t.description && <p className="mt-0.5 text-xs text-text-2">{t.description}</p>}
            </div>
            <button
              onClick={() => setToasts((ts) => ts.filter((x) => x.id !== t.id))}
              className="text-text-2 hover:text-text-1 cursor-pointer"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
