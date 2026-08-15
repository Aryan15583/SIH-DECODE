import Link from "next/link";
import { AlertTriangle, ChevronRight } from "lucide-react";
import { SeverityBadge } from "@/components/ui/Badge";
import { incidents } from "@/lib/mock-data";

export function RecentIncidents() {
  return (
    <div className="flex flex-col divide-y divide-border-1">
      {incidents.map((inc) => (
        <Link
          key={inc.id}
          href={`/incidents/${inc.id}`}
          className="flex items-center gap-3 py-3 first:pt-0 last:pb-0 hover:opacity-80"
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-danger/10 text-danger">
            <AlertTriangle className="h-4 w-4" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm text-text-1">{inc.title}</p>
            <p className="text-xs text-text-2">{inc.id}</p>
          </div>
          <SeverityBadge severity={inc.severity} />
          <ChevronRight className="h-4 w-4 text-text-2" />
        </Link>
      ))}
    </div>
  );
}
