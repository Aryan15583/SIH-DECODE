import { ArrowDown, ArrowUp, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/Card";

type Tone = "success" | "danger" | "warning" | "primary";

const toneRing: Record<Tone, string> = {
  success: "bg-success/10 text-success",
  danger: "bg-danger/10 text-danger",
  warning: "bg-warning/10 text-warning",
  primary: "bg-primary/10 text-primary",
};

export function StatCard({
  label,
  value,
  suffix,
  trend,
  trendDir,
  tone,
}: {
  label: string;
  value: string;
  suffix?: string;
  trend: string;
  trendDir: "up" | "down" | "flat";
  tone: Tone;
}) {
  const Icon = trendDir === "up" ? ArrowUp : trendDir === "down" ? ArrowDown : Minus;
  const trendGood = tone === "danger" || tone === "warning" ? trendDir === "down" : trendDir !== "down";

  return (
    <Card className="p-4">
      <p className="text-xs font-medium text-text-2">{label}</p>
      <div className="mt-2 flex items-end justify-between">
        <div className="flex items-baseline gap-1">
          <span className="text-[26px] font-bold leading-none text-text-1">{value}</span>
          {suffix && <span className="text-sm text-text-2">{suffix}</span>}
        </div>
        <span
          className={cn(
            "flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-[11px] font-semibold",
            trendGood ? toneRing.success : toneRing.danger
          )}
        >
          <Icon className="h-3 w-3" />
          {trend}
        </span>
      </div>
      <div className={cn("mt-3 h-1 w-full rounded-full", toneRing[tone])} />
    </Card>
  );
}
