"use client";

import Link from "next/link";
import { AlertTriangle, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { SeverityBadge, StatusBadge } from "@/components/ui/Badge";
import { useApi } from "@/hooks/useApi";
import { getIncidents } from "@/lib/api/incidents";

export function IncidentsListClient() {
  const { data, loading, error } = useApi(getIncidents);
  const incidents = Array.isArray(data) ? data : [];

  return (
    <div className="flex flex-col gap-4">
      <Card className="p-5">
        <p className="text-sm text-text-2">
          {error ? (
            "Unable to load incidents"
          ) : loading ? (
            "Loading incidents..."
          ) : incidents.length > 0 ? (
            `${incidents.length} correlated incidents are currently tracked by the Correlation Agent. Select one to open the full investigation workspace.`
          ) : (
            "No incidents detected"
          )}
        </p>
      </Card>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {error ? (
          <p className="col-span-full py-8 text-center text-xs text-text-2">Unable to load incidents</p>
        ) : loading ? (
          <p className="col-span-full py-8 text-center text-xs text-text-2 animate-pulse">Loading incidents...</p>
        ) : incidents.length > 0 ? (
          incidents.map((inc) => (
            <Link key={inc.id} href={`/incidents/${inc.id}`}>
              <Card className="flex items-center gap-4 p-4 hover:border-primary/40">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-danger/10 text-danger">
                  <AlertTriangle className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-semibold text-text-1">{inc.title}</p>
                  </div>
                  <p className="text-xs text-text-2">{inc.id} · First seen {inc.firstSeen}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <SeverityBadge severity={inc.severity} />
                    <StatusBadge status={inc.status} />
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 shrink-0 text-text-2" />
              </Card>
            </Link>
          ))
        ) : (
          <p className="col-span-full py-8 text-center text-xs text-text-2">No incidents detected</p>
        )}
      </div>
    </div>
  );
}
