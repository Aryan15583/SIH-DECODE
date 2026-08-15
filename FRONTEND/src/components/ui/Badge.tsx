import { cn } from "@/lib/utils";
import type { Severity, ThreatStatus, AgentStatus } from "@/types";

const severityStyles: Record<Severity, string> = {
  Critical: "bg-danger/12 text-danger border-danger/30",
  High: "bg-warning/12 text-warning border-warning/30",
  Medium: "bg-warning/10 text-warning border-warning/25",
  Low: "bg-success/12 text-success border-success/30",
  Info: "bg-cyber/12 text-cyber border-cyber/30",
};

const statusStyles: Record<string, string> = {
  Active: "bg-danger/12 text-danger border-danger/30",
  Investigating: "bg-warning/12 text-warning border-warning/30",
  Contained: "bg-cyber/12 text-cyber border-cyber/30",
  Resolved: "bg-success/12 text-success border-success/30",
  Monitoring: "bg-primary/12 text-primary border-primary/30",
  Standby: "bg-text-2/10 text-text-2 border-border-2",
  Completed: "bg-success/12 text-success border-success/30",
  Ready: "bg-success/12 text-success border-success/30",
  Generating: "bg-warning/12 text-warning border-warning/30",
  Scheduled: "bg-cyber/12 text-cyber border-cyber/30",
};

export function SeverityBadge({ severity }: { severity: Severity }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-xs font-medium",
        severityStyles[severity]
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", {
        "bg-danger": severity === "Critical",
        "bg-warning": severity === "High" || severity === "Medium",
        "bg-success": severity === "Low",
        "bg-cyber": severity === "Info",
      })} />
      {severity}
    </span>
  );
}

export function StatusBadge({ status }: { status: ThreatStatus | AgentStatus | string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-xs font-medium whitespace-nowrap",
        statusStyles[status] ?? "bg-text-2/10 text-text-2 border-border-2"
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", status === "Active" ? "bg-danger pulse-danger" : "bg-current")} />
      {status}
    </span>
  );
}
