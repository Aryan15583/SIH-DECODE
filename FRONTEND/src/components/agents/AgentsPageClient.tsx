"use client";

import { useState } from "react";
import { AgentCard } from "./AgentCard";
import { AgentDetails } from "./AgentDetails";
import type { Agent } from "@/types";
import { useApi } from "@/hooks/useApi";
import { getAgents } from "@/lib/api/agents";

export function AgentsPageClient() {
  const { data, loading, error } = useApi(getAgents);
  const agents = Array.isArray(data) ? data : [];
  const [selected, setSelected] = useState<Agent | null>(null);

  const selectedAgent = selected || agents[0] || null;

  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_340px]">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-3">
        {error ? (
          <p className="col-span-full py-8 text-center text-xs text-text-2">Unable to load agents</p>
        ) : loading ? (
          <p className="col-span-full py-8 text-center text-xs text-text-2 animate-pulse">Loading agents...</p>
        ) : agents.length > 0 ? (
          agents.map((a) => (
            <AgentCard key={a.id} agent={a} active={selectedAgent?.id === a.id} onClick={() => setSelected(a)} />
          ))
        ) : (
          <p className="col-span-full py-8 text-center text-xs text-text-2">No agent activity</p>
        )}
      </div>
      <AgentDetails agent={selectedAgent} />
    </div>
  );
}
