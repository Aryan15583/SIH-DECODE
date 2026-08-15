"use client";

import { useState } from "react";
import { agents } from "@/lib/mock-data";
import { AgentCard } from "./AgentCard";
import { AgentDetails } from "./AgentDetails";
import type { Agent } from "@/types";

export function AgentsPageClient() {
  const [selected, setSelected] = useState<Agent | null>(agents[0]);

  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_340px]">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-3">
        {agents.map((a) => (
          <AgentCard key={a.id} agent={a} active={selected?.id === a.id} onClick={() => setSelected(a)} />
        ))}
      </div>
      <AgentDetails agent={selected} />
    </div>
  );
}
