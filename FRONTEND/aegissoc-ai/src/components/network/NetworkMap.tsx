"use client";

import { useState } from "react";
import { Building2, Network, Cloud, Server, ChevronLeft, ChevronRight, Camera } from "lucide-react";
import { networkNodes } from "@/lib/mock-data";

const ICONS: Record<string, typeof Building2> = {
  office: Building2,
  network: Network,
  cloud: Cloud,
  datacenter: Server,
  servers: Server,
};

const CONNECTIONS: [string, string][] = [
  ["office", "network"],
  ["network", "cloud"],
  ["network", "datacenter"],
  ["datacenter", "servers"],
  ["datacenter", "cloud"],
];

export function NetworkMap() {
  const [active, setActive] = useState<string | null>(null);
  const byId = new Map(networkNodes.map((n) => [n.id, n]));

  return (
    <div className="relative h-[520px] w-full overflow-hidden rounded-xl border border-border-1 bg-[radial-gradient(circle_at_50%_30%,rgba(88,101,242,0.12),transparent_60%)]">
      <svg className="absolute inset-0 h-full w-full">
        {CONNECTIONS.map(([a, b], i) => {
          const from = byId.get(a)!;
          const to = byId.get(b)!;
          return (
            <line
              key={i}
              x1={`${from.x}%`}
              y1={`${from.y}%`}
              x2={`${to.x}%`}
              y2={`${to.y}%`}
              stroke="#22b8f0"
              strokeOpacity={0.45}
              strokeWidth={1.5}
              strokeDasharray="5 4"
            />
          );
        })}
      </svg>

      {networkNodes.map((n) => {
        const Icon = ICONS[n.id];
        const isActive = active === n.id;
        return (
          <button
            key={n.id}
            onClick={() => setActive(n.id)}
            style={{ left: `${n.x}%`, top: `${n.y}%` }}
            className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer"
          >
            <div
              className={`w-40 rounded-xl border p-3.5 text-left shadow-lg backdrop-blur-md transition-transform hover:scale-[1.03] ${
                isActive ? "border-primary/60 bg-primary/10 glow-primary" : "border-border-1 bg-bg-1/85"
              }`}
            >
              <Icon className="h-5 w-5 text-cyber" />
              <p className="mt-2 text-sm font-bold text-text-1">{n.label}</p>
              <p className="mt-0.5 text-[11px] text-text-2">{n.sub}</p>
            </div>
          </button>
        );
      })}

      <div className="absolute bottom-4 left-4 flex items-center gap-1.5 rounded-lg border border-border-1 bg-bg-1/80 p-1">
        <button className="rounded-md bg-primary/20 p-2 text-primary cursor-pointer"><ChevronLeft className="h-3.5 w-3.5" /></button>
        <button className="rounded-md p-2 text-text-2 hover:text-text-1 cursor-pointer"><ChevronRight className="h-3.5 w-3.5" /></button>
        <button className="rounded-md p-2 text-text-2 hover:text-text-1 cursor-pointer"><Camera className="h-3.5 w-3.5" /></button>
      </div>
    </div>
  );
}
