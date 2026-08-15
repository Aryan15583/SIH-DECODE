"use client";

import { Download, Share2, Sparkles, FileText } from "lucide-react";
import { Card, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/Badge";
import { useToast } from "@/components/ui/Toast";
import { ReportPreview } from "@/components/reports/ReportPreview";
import { reports } from "@/lib/mock-data";

const topCards = [
  { title: "Daily Security Report", metric: "12", label: "Active Threats", tone: "from-primary to-secondary" },
  { title: "Weekly Security Report", metric: "3", label: "Incidents", tone: "from-secondary to-primary" },
  { title: "Incident Report", metric: "8", label: "High Risk Assets", tone: "from-warning to-danger" },
  { title: "Executive Summary", metric: "84%", label: "Compliance", tone: "from-cyber to-primary" },
];

export function ReportsPageClient() {
  const { push } = useToast();

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {topCards.map((c) => (
          <button
            key={c.title}
            onClick={() => push(`${c.title} generated`, "The Report Agent compiled the latest data.", "success")}
            className={`rounded-2xl bg-gradient-to-br ${c.tone} p-4 text-left text-white shadow-lg transition-transform hover:scale-[1.02] cursor-pointer`}
          >
            <p className="text-sm font-medium opacity-90">{c.title}</p>
            <p className="mt-3 text-3xl font-extrabold">{c.metric}</p>
            <p className="text-xs opacity-80">{c.label}</p>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_320px]">
        <Card className="overflow-hidden p-0">
          <CardHeader
            title="Recent Reports"
            subtitle="AI-generated reports across your organization"
            action={
              <Button size="sm" variant="primary" onClick={() => push("Generating report", "This may take a few moments.", "info")}>
                <Sparkles className="h-3.5 w-3.5" /> Generate Report
              </Button>
            }
          />
          <div className="overflow-x-auto p-5 pt-3">
            <table className="w-full min-w-[600px] text-left text-sm">
              <thead>
                <tr className="border-b border-border-1 text-xs text-text-2">
                  <th className="py-2.5 font-medium">Name</th>
                  <th className="py-2.5 font-medium">Type</th>
                  <th className="py-2.5 font-medium">Timestamp</th>
                  <th className="py-2.5 font-medium">Status</th>
                  <th className="py-2.5 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((r) => (
                  <tr key={r.id} className="border-b border-border-1 last:border-0 hover:bg-white/[0.03]">
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-text-2" />
                        <span className="text-text-1">{r.name}</span>
                      </div>
                    </td>
                    <td className="py-3 text-text-2">{r.type}</td>
                    <td className="py-3 text-text-2 tabular-nums">{r.timestamp}</td>
                    <td className="py-3"><StatusBadge status={r.status} /></td>
                    <td className="py-3">
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
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card>
          <CardHeader title="Report Preview" />
          <div className="p-5 pt-3">
            <ReportPreview />
          </div>
        </Card>
      </div>
    </div>
  );
}
