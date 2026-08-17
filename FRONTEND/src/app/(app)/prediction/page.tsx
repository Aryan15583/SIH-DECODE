"use client";

import { Card, CardHeader } from "@/components/ui/Card";
import { AttackGraphCanvas } from "@/components/graph/AttackGraphCanvas";
import { useApi } from "@/hooks/useApi";
import { getPredictions } from "@/lib/api/predictions";
import { getAttackGraph } from "@/lib/api/attack-graph";
import { getAgentIcon } from "@/components/agents/agent-icons";
import { cn } from "@/lib/utils";

const predictionFactors = [
  { id: "f-1", label: "Threat Intel Match", detail: "Overlap with known target lists", icon: "search" },
  { id: "f-2", label: "Lateral Velocity", detail: "Internal hops per minute exceeds normal baseline", icon: "network" },
  { id: "f-3", label: "Credential Anomaly", detail: "Privileged accounts accessing non-standard targets", icon: "user" },
  { id: "f-4", label: "Egress Volume", detail: "Outbound payload sizes spikes from critical node", icon: "datacenter" },
];

function tone(p: number) {
  if (p >= 70) return { bar: "bg-danger", text: "text-danger", label: "High" };
  if (p >= 45) return { bar: "bg-warning", text: "text-warning", label: "Medium" };
  return { bar: "bg-success", text: "text-success", label: "Low" };
}

export default function PredictionPage() {
  const { data, loading: predLoading, error: predError } = useApi(getPredictions);
  const predictions = Array.isArray(data) ? data : [];
  const { data: attackGraph, loading: graphLoading, error: graphError } = useApi(getAttackGraph);

  const displayNodes = attackGraph?.nodes || [];
  const displayEdges = attackGraph?.edges || [];

  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-[340px_1fr]">
      <Card className="h-fit">
        <CardHeader title="Top Predictions" subtitle="Likelihood ranked by AI risk model" />
        <div className="flex flex-col gap-5 p-5 pt-4">
          {predError ? (
            <p className="text-center text-xs text-text-2 py-4">Unable to load predictions</p>
          ) : predLoading ? (
            <p className="text-center text-xs text-text-2 py-4 animate-pulse">Loading predictions...</p>
          ) : predictions.length === 0 ? (
            <p className="text-center text-xs text-text-2 py-4">No predictions available</p>
          ) : (
            predictions.map((p) => {
              const t = tone(p.probability);
              return (
                <div key={p.label} className="rounded-xl border border-border-1 p-3.5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-text-1">{p.label}</span>
                    <span className={cn("text-base font-bold", t.text)}>{p.probability}%</span>
                  </div>
                  <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-surface-2">
                    <div className={cn("h-full rounded-full", t.bar)} style={{ width: `${p.probability}%` }} />
                  </div>
                  <p className={cn("mt-1.5 text-[11px] font-medium", t.text)}>{t.label} likelihood</p>
                </div>
              );
            })
          )}
        </div>
      </Card>

      <div className="flex flex-col gap-5">
        <Card>
          <CardHeader title="Predicted Attack Path" subtitle="Most probable next steps if unaddressed" />
          <div className="p-5">
            <AttackGraphCanvas 
              nodes={displayNodes} 
              edges={displayEdges} 
              height={280} 
              loading={graphLoading} 
              error={!!graphError} 
            />
          </div>
        </Card>

        <Card>
          <CardHeader title="Prediction Factors" subtitle="Signals driving this forecast" />
          <div className="grid grid-cols-1 gap-3 p-5 pt-4 sm:grid-cols-2">
            {predictionFactors.map((f) => {
              const Icon = getAgentIcon(f.icon);
              return (
                <div key={f.id} className="flex items-start gap-3 rounded-lg border border-border-1 p-3.5">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-sm font-medium text-text-1">{f.label}</p>
                    <p className="mt-0.5 text-xs text-text-2">{f.detail}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}
