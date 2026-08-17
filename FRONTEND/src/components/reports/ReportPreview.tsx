import { ShieldHalf } from "lucide-react";
import type { Report } from "@/types";

const breakdown = [
  { label: "Ransomware Behavior", pct: 28, color: "bg-danger" },
  { label: "Credential Theft", pct: 22, color: "bg-warning" },
  { label: "Lateral Movement", pct: 18, color: "bg-primary" },
  { label: "Port Scanning", pct: 14, color: "bg-cyber" },
  { label: "Data Exfiltration", pct: 11, color: "bg-secondary" },
  { label: "Other", pct: 7, color: "bg-text-2" },
];

export function ReportPreview({
  reports = [],
  loading = false,
  error = false,
}: {
  reports?: Report[];
  loading?: boolean;
  error?: boolean;
}) {
  const hasReports = reports.length > 0;

  if (error) {
    return (
      <div className="rounded-xl border border-border-1 bg-bg-1/60 p-8 flex flex-col items-center justify-center min-h-[280px] text-center">
        <ShieldHalf className="h-6 w-6 text-text-2 opacity-50" strokeWidth={1.5} />
        <p className="mt-3 text-xs text-text-2">Unable to load reports</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="rounded-xl border border-border-1 bg-bg-1/60 p-8 flex flex-col items-center justify-center min-h-[280px] text-center animate-pulse">
        <ShieldHalf className="h-6 w-6 text-text-2 opacity-50" strokeWidth={1.5} />
        <p className="mt-3 text-xs text-text-2">Loading reports...</p>
      </div>
    );
  }

  if (!hasReports) {
    return (
      <div className="rounded-xl border border-border-1 bg-bg-1/60 p-8 flex flex-col items-center justify-center min-h-[280px] text-center">
        <ShieldHalf className="h-6 w-6 text-text-2 opacity-50" strokeWidth={1.5} />
        <p className="mt-3 text-xs text-text-2">No reports available</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border-1 bg-bg-1/60 p-4">
      <div className="flex items-center gap-2 border-b border-border-1 pb-3">
        <ShieldHalf className="h-4 w-4 text-primary" />
        <span className="text-xs font-semibold text-text-1">AegisSOC AI · Security Report</span>
      </div>
      <p className="mt-3 text-sm font-semibold text-text-1">Daily Security Report</p>
      <p className="text-[11px] text-text-2">Generated Aug 15, 2026 · 06:00 UTC</p>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-lg border border-border-1 p-3 text-center">
          <p className="text-xl font-bold text-text-1">87</p>
          <p className="text-[10px] text-text-2">Security Score</p>
        </div>
        <div className="rounded-lg border border-border-1 p-3 text-center">
          <p className="text-xl font-bold text-text-1">12</p>
          <p className="text-[10px] text-text-2">Active Threats</p>
        </div>
      </div>

      <p className="mt-4 text-xs font-medium text-text-2">Top Threat Breakdown</p>
      <div className="mt-2 flex flex-col gap-2">
        {breakdown.map((b) => (
          <div key={b.label} className="flex items-center gap-2">
            <span className={`h-2 w-2 shrink-0 rounded-full ${b.color}`} />
            <span className="flex-1 truncate text-[11px] text-text-2">{b.label}</span>
            <span className="text-[11px] text-text-1">{b.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
