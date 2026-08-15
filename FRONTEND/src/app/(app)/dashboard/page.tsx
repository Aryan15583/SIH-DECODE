import { Card, CardHeader } from "@/components/ui/Card";
import { StatCard } from "@/components/dashboard/StatCard";
import { ThreatChart } from "@/components/dashboard/ThreatChart";
import { PredictionList } from "@/components/dashboard/PredictionList";
import { RecentIncidents } from "@/components/dashboard/RecentIncidents";
import { AgentsMini } from "@/components/dashboard/AgentsMini";
import { AttackGraphCanvas } from "@/components/graph/AttackGraphCanvas";
import { kpis, predictions, dashboardGraph } from "@/lib/mock-data";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        {kpis.map((k) => (
          <StatCard key={k.label} {...k} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader title="Live Threat Activity" subtitle="Security events observed across the last 24 hours" />
          <div className="px-2 pb-4 pt-2">
            <ThreatChart />
          </div>
        </Card>

        <Card>
          <CardHeader
            title="Attack Graph"
            subtitle="Relationship map"
            action={
              <Link href="/attack-graph" className="flex items-center gap-1 text-xs text-primary hover:underline">
                View Full Graph <ArrowUpRight className="h-3 w-3" />
              </Link>
            }
          />
          <div className="p-4">
            <AttackGraphCanvas nodes={dashboardGraph.nodes} edges={dashboardGraph.edges} height={230} />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <Card>
          <CardHeader title="AI Predictions" subtitle="Likelihood of next attacker action" />
          <div className="p-5 pt-4">
            <PredictionList predictions={predictions} />
          </div>
        </Card>

        <Card>
          <CardHeader
            title="Recent Incidents"
            subtitle="Latest correlated incidents"
            action={
              <Link href="/incidents" className="flex items-center gap-1 text-xs text-primary hover:underline">
                View all <ArrowUpRight className="h-3 w-3" />
              </Link>
            }
          />
          <div className="p-5 pt-2">
            <RecentIncidents />
          </div>
        </Card>

        <Card>
          <CardHeader
            title="AI Agents"
            subtitle="Autonomous agent activity"
            action={
              <Link href="/agents" className="flex items-center gap-1 text-xs text-primary hover:underline">
                View all <ArrowUpRight className="h-3 w-3" />
              </Link>
            }
          />
          <div className="p-5 pt-2">
            <AgentsMini />
          </div>
        </Card>
      </div>
    </div>
  );
}
