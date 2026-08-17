"use client";

import { Card, CardHeader } from "@/components/ui/Card";
import { StatCard } from "@/components/dashboard/StatCard";
import { PredictionList } from "@/components/dashboard/PredictionList";
import { ThreatChart } from "@/components/dashboard/ThreatChart";
import { RecentIncidents } from "@/components/dashboard/RecentIncidents";
import { AgentsMini } from "@/components/dashboard/AgentsMini";
import { AttackGraphCanvas } from "@/components/graph/AttackGraphCanvas";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useApi } from "@/hooks/useApi";
import { getDashboard } from "@/lib/api/dashboard";

const DEFAULT_KPIS = [
  { label: "Security Score", value: null, suffix: "/100", tone: "success" },
  { label: "Active Threats", value: null, tone: "danger" },
  { label: "Critical Incidents", value: null, tone: "danger" },
  { label: "At-Risk Users", value: null, tone: "warning" },
  { label: "Compromised Devices", value: null, tone: "primary" }
] as const;

export default function Dashboard() {
  const { data, loading, error } = useApi(getDashboard);

  const displayKpis = data?.kpis || DEFAULT_KPIS;
  const displayPredictions = data?.predictions || [];
  const displayThreatActivity = data?.liveThreatActivity || [];
  const displayIncidents = data?.incidents || [];
  const displayAgents = data?.agents || [];
  const displayNodes = data?.dashboardGraph?.nodes || [];
  const displayEdges = data?.dashboardGraph?.edges || [];

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        {displayKpis.map((k) => (
          <StatCard key={k.label} {...k} />
        ))}
      </div>

      <div className="card-surface p-5 rounded-xl border border-border-1 flex flex-col gap-1 select-none animate-fade-up">
        <h2 className="text-lg font-bold text-text-1 lg:text-xl">
          Welcome Back, <span className="text-primary">User</span>
        </h2>
        <p className="text-xs text-text-2 lg:text-sm leading-relaxed">
          Your autonomous security operations center is active. Monitor threat streams, AI containment timelines, and multi-agent operations.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader title="Live Threat Activity" subtitle="Security events observed across the last 24 hours" />
          <div className="px-2 pb-4 pt-2">
            <ThreatChart data={displayThreatActivity} loading={loading} error={!!error} />
          </div>
        </Card>

        <Card>
          <CardHeader title="AI Predictions" subtitle="Likelihood of next attacker action" />
          <div className="p-5 pt-4">
            <PredictionList predictions={displayPredictions} loading={loading} error={!!error} />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <Card className="flex flex-col">
          <CardHeader title="Recent Incidents" action={<Link href="/incidents"><ArrowUpRight className="h-4 w-4 text-text-2 hover:text-text-1" /></Link>} />
          <div className="flex-1 p-5 pt-3">
            <RecentIncidents incidents={displayIncidents} loading={loading} error={!!error} />
          </div>
        </Card>

        <Card className="flex flex-col">
          <CardHeader title="AI Agents" action={<Link href="/agents"><ArrowUpRight className="h-4 w-4 text-text-2 hover:text-text-1" /></Link>} />
          <div className="flex-1 p-5 pt-3">
            <AgentsMini agents={displayAgents} loading={loading} error={!!error} />
          </div>
        </Card>

        <Card className="xl:col-span-3">
          <CardHeader title="Attack Graph" action={<Link href="/attack-graph"><ArrowUpRight className="h-4 w-4 text-text-2 hover:text-text-1" /></Link>} />
          <div className="p-4">
            <AttackGraphCanvas nodes={displayNodes} edges={displayEdges} loading={loading} error={!!error} />
          </div>
        </Card>
      </div>
    </div>
  );
}
