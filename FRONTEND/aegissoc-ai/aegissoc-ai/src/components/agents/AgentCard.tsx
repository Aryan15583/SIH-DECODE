"use client";

import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/Badge";
import { getAgentIcon } from "./agent-icons";
import type { Agent } from "@/types";

export function AgentCard({
  agent,
  active,
  onClick,
}: {
  agent: Agent;
  active?: boolean;
  onClick?: () => void;
}) {
  const Icon = getAgentIcon(agent.icon);
  return (
    <Card
      onClick={onClick}
      className={cn(
        "cursor-pointer p-4 transition-all hover:border-primary/40",
        active && "border-primary/60 glow-primary"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Icon className="h-5 w-5" />
          </span>
          <div>
            <p className="text-sm font-semibold text-text-1">{agent.name}</p>
            <p className="text-xs text-text-2">{agent.role}</p>
          </div>
        </div>
        <StatusBadge status={agent.status} />
      </div>

      <p className="mt-3 line-clamp-2 text-xs text-text-2">{agent.description}</p>

      <div className="mt-3">
        <div className="mb-1 flex items-center justify-between text-[11px] text-text-2">
          <span>Progress</span>
          <span>{agent.progress}%</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-2">
          <div className="h-full rounded-full bg-gradient-to-r from-primary to-secondary" style={{ width: `${agent.progress}%` }} />
        </div>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2 border-t border-border-1 pt-3 text-center">
        <div>
          <p className="text-sm font-semibold text-text-1">{agent.tasksCompleted}</p>
          <p className="text-[10px] text-text-2">Tasks</p>
        </div>
        <div>
          <p className="text-sm font-semibold text-text-1">{agent.incidentsInvestigated}</p>
          <p className="text-[10px] text-text-2">Incidents</p>
        </div>
        <div>
          <p className="text-sm font-semibold text-success">{agent.accuracy}%</p>
          <p className="text-[10px] text-text-2">Accuracy</p>
        </div>
      </div>
    </Card>
  );
}
