import { Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/Badge";
import { getAgentIcon } from "./agent-icons";
import type { Agent } from "@/types";
import { Clock, Activity } from "lucide-react";

export function AgentDetails({ agent }: { agent: Agent | null }) {
  if (!agent) {
    return (
      <Card className="flex h-full min-h-[420px] flex-col items-center justify-center p-8 text-center">
        <Activity className="h-8 w-8 text-text-2" />
        <p className="mt-3 text-sm text-text-2">Select an agent to view details</p>
      </Card>
    );
  }

  const Icon = getAgentIcon(agent.icon);

  return (
    <Card className="sticky top-20 p-5">
      <div className="flex items-center gap-3">
        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Icon className="h-6 w-6" />
        </span>
        <div>
          <p className="text-base font-semibold text-text-1">{agent.name}</p>
          <p className="text-xs text-text-2">{agent.role}</p>
        </div>
      </div>

      <div className="mt-4">
        <StatusBadge status={agent.status} />
      </div>

      <p className="mt-4 text-sm leading-relaxed text-text-2">{agent.description}</p>

      <div className="mt-4 rounded-lg border border-border-1 bg-bg-1/50 p-3">
        <p className="text-[11px] font-medium text-text-2">Current Task</p>
        <p className="mt-1 text-sm text-text-1">{agent.currentTask}</p>
      </div>

      <div className="mt-4">
        <div className="mb-1.5 flex items-center justify-between text-xs text-text-2">
          <span>Progress</span>
          <span>{agent.progress}%</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-2">
          <div className="h-full rounded-full bg-gradient-to-r from-primary to-secondary" style={{ width: `${agent.progress}%` }} />
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-lg border border-border-1 p-3 text-center">
          <p className="text-lg font-bold text-text-1">{agent.tasksCompleted}</p>
          <p className="text-[11px] text-text-2">Tasks Completed</p>
        </div>
        <div className="rounded-lg border border-border-1 p-3 text-center">
          <p className="text-lg font-bold text-text-1">{agent.incidentsInvestigated}</p>
          <p className="text-[11px] text-text-2">Incidents Investigated</p>
        </div>
        <div className="rounded-lg border border-border-1 p-3 text-center">
          <p className="text-lg font-bold text-success">{agent.accuracy}%</p>
          <p className="text-[11px] text-text-2">Accuracy</p>
        </div>
        <div className="flex flex-col items-center justify-center gap-1 rounded-lg border border-border-1 p-3 text-center">
          <Clock className="h-3.5 w-3.5 text-text-2" />
          <p className="text-[11px] text-text-2">{agent.lastActivity}</p>
        </div>
      </div>
    </Card>
  );
}
