"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { ChevronLeft, Lock, Ban, ChevronDown, Sparkles } from "lucide-react";
import { Card, CardHeader } from "@/components/ui/Card";
import { SeverityBadge, StatusBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { AttackGraphCanvas } from "@/components/graph/AttackGraphCanvas";
// incidentGraph is loaded dynamically from the incident details object.

import { useApi } from "@/hooks/useApi";
import { getIncident } from "@/lib/api/incidents";

const TABS = ["Overview", "Attack Path", "Timeline", "AI Investigation", "MITRE ATT&CK", "Evidence"] as const;

export function IncidentDetailClient({ incidentId }: { incidentId: string }) {
  const { data: incident, loading, error } = useApi(
    useCallback(() => getIncident(incidentId), [incidentId])
  );
  const [tab, setTab] = useState<(typeof TABS)[number]>("Overview");
  const [moreOpen, setMoreOpen] = useState(false);
  const { push } = useToast();

  function act(label: string) {
    if (incident) {
      push(`${label} executed`, `Response Agent applied "${label}" to ${incident.id}. Awaiting confirmation.`, "success");
    }
    setMoreOpen(false);
  }

  if (error) {
    return (
      <div className="flex flex-col gap-4">
        <Link href="/incidents" className="flex w-fit items-center gap-1 text-xs text-text-2 hover:text-text-1">
          <ChevronLeft className="h-3.5 w-3.5" /> Back to Incidents
        </Link>
        <Card className="p-8 text-center text-sm text-text-2">
          Unable to load incident details
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col gap-4">
        <Link href="/incidents" className="flex w-fit items-center gap-1 text-xs text-text-2 hover:text-text-1">
          <ChevronLeft className="h-3.5 w-3.5" /> Back to Incidents
        </Link>
        <Card className="p-8 text-center text-sm text-text-2 animate-pulse">
          Loading incident details...
        </Card>
      </div>
    );
  }

  if (!incident) {
    return (
      <div className="flex flex-col gap-4">
        <Link href="/incidents" className="flex w-fit items-center gap-1 text-xs text-text-2 hover:text-text-1">
          <ChevronLeft className="h-3.5 w-3.5" /> Back to Incidents
        </Link>
        <Card className="p-8 text-center text-sm text-text-2">
          No details available for this incident
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <Link href="/incidents" className="flex w-fit items-center gap-1 text-xs text-text-2 hover:text-text-1">
        <ChevronLeft className="h-3.5 w-3.5" /> Back to Incidents
      </Link>

      <Card className="p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium text-text-2">{incident.id}</p>
            <div className="mt-1 flex items-center gap-2.5">
              <h2 className="text-xl font-bold text-text-1">{incident.title}</h2>
              <SeverityBadge severity={incident.severity} />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="primary" size="sm" onClick={() => act("Isolate Device")}>
              <Lock className="h-3.5 w-3.5" /> Isolate
            </Button>
            <Button variant="outline" size="sm" onClick={() => act("Block IP")}>
              <Ban className="h-3.5 w-3.5" /> Block IP
            </Button>
            <div className="relative">
              <Button variant="outline" size="sm" onClick={() => setMoreOpen((v) => !v)}>
                More Actions <ChevronDown className="h-3.5 w-3.5" />
              </Button>
              {moreOpen && (
                <div className="absolute right-0 z-20 mt-1 w-52 card-surface rounded-xl p-1.5 shadow-2xl">
                  {incident.recommendedActions && incident.recommendedActions.length > 0 ? (
                    incident.recommendedActions.map((a) => (
                      <button
                        key={a}
                        onClick={() => act(a)}
                        className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs text-text-2 hover:bg-white/5 hover:text-text-1 cursor-pointer"
                      >
                        {a}
                      </button>
                    ))
                  ) : (
                    <p className="px-2.5 py-2 text-xs text-text-2">No actions available</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-lg border border-border-1 p-3">
            <p className="text-[11px] text-text-2">AI Confidence</p>
            <p className="mt-1 text-lg font-bold text-text-1">{incident.aiConfidence}%</p>
          </div>
          <div className="rounded-lg border border-border-1 p-3">
            <p className="text-[11px] text-text-2">First Seen</p>
            <p className="mt-1 text-lg font-bold text-text-1">{incident.firstSeen}</p>
          </div>
          <div className="rounded-lg border border-border-1 p-3">
            <p className="text-[11px] text-text-2">Attacker</p>
            <p className="mt-1 truncate text-lg font-bold text-text-1">{incident.attacker}</p>
          </div>
          <div className="rounded-lg border border-border-1 p-3">
            <p className="text-[11px] text-text-2">Status</p>
            <div className="mt-1.5"><StatusBadge status={incident.status} /></div>
          </div>
        </div>
      </Card>

      <div className="flex gap-1 overflow-x-auto border-b border-border-1">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`whitespace-nowrap border-b-2 px-4 py-2.5 text-sm transition-colors cursor-pointer ${
              tab === t ? "border-primary text-text-1" : "border-transparent text-text-2 hover:text-text-1"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "Overview" && (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader title="Interactive Node Map" subtitle="Attacker path from initial access to impact" />
            <div className="p-4">
              <AttackGraphCanvas
                nodes={incident.incidentGraph?.nodes || []}
                edges={incident.incidentGraph?.edges || []}
                height={220}
              />
            </div>
          </Card>
          <div className="flex flex-col gap-5">
            <Card>
              <CardHeader title="AI Summary" action={<Sparkles className="h-4 w-4 text-primary" />} />
              <p className="p-5 pt-3 text-sm leading-relaxed text-text-2">{incident.aiSummary || "No AI summary available"}</p>
            </Card>
            <Card>
              <CardHeader title="Affected Entities" />
              <div className="flex flex-col divide-y divide-border-1 px-5 pb-4 pt-2">
                {incident.affectedAssets && incident.affectedAssets.length > 0 ? (
                  incident.affectedAssets.map((a) => (
                    <div key={a.id} className="flex items-center justify-between py-2.5 text-sm">
                      <span className="text-text-1">{a.name}</span>
                      <span className="text-xs text-text-2 capitalize">{a.type}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-text-2 py-4 text-center">No affected assets detected</p>
                )}
              </div>
            </Card>
          </div>
        </div>
      )}

      {tab === "Attack Path" && (
        <Card>
          <CardHeader title="Full Attack Path" subtitle={`Origin: ${incident.attackerLocation}`} />
          <div className="p-4">
            <AttackGraphCanvas
              nodes={incident.incidentGraph?.nodes || []}
              edges={incident.incidentGraph?.edges || []}
              height={280}
            />
          </div>
        </Card>
      )}

      {tab === "Timeline" && (
        <Card>
          <CardHeader title="Timeline" />
          <div className="p-5 pt-4">
            {incident.timeline && incident.timeline.length > 0 ? (
              <ol className="relative flex flex-col gap-6 border-l border-border-2 pl-5">
                {incident.timeline.map((e, i) => (
                  <li key={i} className="relative">
                    <span className="absolute -left-[26px] top-1 h-2.5 w-2.5 rounded-full bg-danger ring-4 ring-danger/15" />
                    <p className="text-xs text-text-2">{e.time}</p>
                    <p className="text-sm text-text-1">{e.event}</p>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="text-sm text-text-2 text-center py-4">No timeline data available</p>
            )}
          </div>
        </Card>
      )}

      {tab === "AI Investigation" && (
        <Card>
          <CardHeader title="AI Investigation Summary" action={<Sparkles className="h-4 w-4 text-primary" />} />
          <p className="p-5 pt-3 text-sm leading-relaxed text-text-2">{incident.aiSummary || "No AI summary available"}</p>
          {incident.recommendedActions && incident.recommendedActions.length > 0 && (
            <div className="grid grid-cols-1 gap-3 px-5 pb-5 sm:grid-cols-2">
              {incident.recommendedActions.map((a) => (
                <div key={a} className="rounded-lg border border-border-1 p-3 text-sm text-text-1">
                  Recommended: {a}
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {tab === "MITRE ATT&CK" && (
        <Card>
          <CardHeader title="MITRE ATT&CK Techniques" />
          <div className="grid grid-cols-1 gap-3 p-5 pt-4 sm:grid-cols-2">
            {incident.mitreTechniques && incident.mitreTechniques.length > 0 ? (
              incident.mitreTechniques.map((m) => (
                <div key={m.id} className="flex items-center justify-between rounded-lg border border-border-1 p-3">
                  <span className="text-sm text-text-1">{m.name}</span>
                  <span className="rounded-md bg-surface-2 px-2 py-0.5 text-xs text-text-2">{m.id}</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-text-2 col-span-full text-center py-4">No MITRE ATT&CK techniques mapped</p>
            )}
          </div>
        </Card>
      )}

      {tab === "Evidence" && (
        <Card>
          <CardHeader title="Evidence" />
          <div className="p-5 pt-4 text-sm text-text-2">
            {incident.evidence ?? "No evidence available"}
          </div>
        </Card>
      )}
    </div>
  );
}
