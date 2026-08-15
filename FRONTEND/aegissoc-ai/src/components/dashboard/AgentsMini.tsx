import { agents } from "@/lib/mock-data";
import { getAgentIcon } from "@/components/agents/agent-icons";
import { StatusBadge } from "@/components/ui/Badge";

export function AgentsMini() {
  return (
    <div className="flex flex-col gap-2.5">
      {agents.slice(0, 5).map((a) => {
        const Icon = getAgentIcon(a.icon);
        return (
          <div key={a.id} className="flex items-center gap-3 rounded-lg border border-border-1 bg-bg-1/40 p-2.5">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Icon className="h-4 w-4" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm text-text-1">{a.name}</p>
              <p className="truncate text-xs text-text-2">{a.currentTask}</p>
            </div>
            <StatusBadge status={a.status} />
          </div>
        );
      })}
    </div>
  );
}
