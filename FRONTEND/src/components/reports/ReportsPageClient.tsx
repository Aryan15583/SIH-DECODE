"use client";

import { useToast } from "@/components/ui/Toast";
import { Card, CardHeader } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/Badge";
import { FileText, Download, Share2 } from "lucide-react";
import { useApi } from "@/hooks/useApi";
import { getReports } from "@/lib/api/reports";

const topCards = [
  { title: "Daily Security Report", metric: "—", label: "Active Threats", tone: "from-primary to-secondary" },
  { title: "Weekly Security Report", metric: "—", label: "Incidents", tone: "from-secondary to-primary" },
  { title: "Incident Report", metric: "—", label: "High Risk Assets", tone: "from-warning to-danger" },
  { title: "Executive Summary", metric: "—", label: "Compliance", tone: "from-cyber to-primary" },
];

export function ReportsPageClient() {
  const { push } = useToast();
  const { data, loading, error } = useApi(getReports);
  const reports = Array.isArray(data) ? data : [];

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {topCards.map((c) => (
          <div
            key={c.title}
            className={`rounded-xl border border-border-1 bg-gradient-to-br ${c.tone} bg-opacity-5 p-4.5`}
          >
            <p className="text-xs font-medium text-text-2">{c.title}</p>
            <p className="mt-2 text-2xl font-bold text-text-1">{c.metric}</p>
            <p className="text-[10px] text-text-2">{c.label}</p>
          </div>
        ))}
      </div>

      <Card className="overflow-hidden p-0">
        <CardHeader title="Generated Reports" subtitle="Historical snapshots for review and audit" />
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left text-sm">
            <thead>
              <tr className="border-b border-border-1 text-xs text-text-2">
                <th className="px-5 py-3 font-medium">Report Name</th>
                <th className="px-5 py-3 font-medium">Type</th>
                <th className="px-5 py-3 font-medium">Generated At</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {error ? (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-sm text-text-2">
                    Unable to load reports
                  </td>
                </tr>
              ) : loading ? (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-sm text-text-2 animate-pulse">
                    Loading reports...
                  </td>
                </tr>
              ) : reports.length > 0 ? (
                reports.map((r) => (
                  <tr key={r.id} className="border-b border-border-1 last:border-0 hover:bg-white/[0.03]">
                    <td className="py-3 whitespace-nowrap px-5">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-text-2" />
                        <span className="text-text-1">{r.name}</span>
                      </div>
                    </td>
                    <td className="py-3 text-text-2 whitespace-nowrap px-5">{r.type}</td>
                    <td className="py-3 text-text-2 tabular-nums whitespace-nowrap px-5">{r.timestamp}</td>
                    <td className="py-3 whitespace-nowrap px-5"><StatusBadge status={r.status} /></td>
                    <td className="py-3 whitespace-nowrap px-5">
                      <div className="flex justify-end gap-1.5">
                        <button
                          onClick={() => push("Download started", `${r.name}.pdf`, "success")}
                          className="rounded-md p-1.5 text-text-2 hover:bg-white/5 hover:text-text-1 cursor-pointer"
                        >
                          <Download className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => push("Share link copied", "Anyone in your org with the link can view.", "info")}
                          className="rounded-md p-1.5 text-text-2 hover:bg-white/5 hover:text-text-1 cursor-pointer"
                        >
                          <Share2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-sm text-text-2">
                    No reports available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
