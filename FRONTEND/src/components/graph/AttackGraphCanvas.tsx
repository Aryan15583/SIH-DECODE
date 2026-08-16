"use client";

import { useMemo, useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import type { GraphNode, GraphEdge, Severity } from "@/types";
import {
  User,
  Monitor,
  Server,
  Database,
  Cloud,
  Skull,
  Bug,
  ShieldAlert,
} from "lucide-react";

const ICONS: Record<GraphNode["type"], typeof User> = {
  user: User,
  endpoint: Monitor,
  server: Server,
  database: Database,
  cloud: Cloud,
  attacker: Skull,
  malware: Bug,
  firewall: ShieldAlert,
};

const NODE_COLOR: Record<GraphNode["type"], string> = {
  user: "border-cyber/50 text-cyber bg-cyber/10",
  endpoint: "border-primary/50 text-primary bg-primary/10",
  server: "border-secondary/50 text-secondary bg-secondary/10",
  database: "border-text-2/50 text-text-1 bg-surface-2",
  cloud: "border-cyber/50 text-cyber bg-cyber/10",
  attacker: "border-danger/60 text-danger bg-danger/15",
  malware: "border-danger/60 text-danger bg-danger/15",
  firewall: "border-warning/50 text-warning bg-warning/10",
};

const EDGE_COLOR: Record<Severity, string> = {
  Critical: "#ff4d5a",
  High: "#f5b942",
  Medium: "#5865f2",
  Low: "#39d98a",
  Info: "#22b8f0",
};

function normalize(nodes: GraphNode[], isMobile: boolean) {
  const xs = nodes.map((n) => n.x);
  const ys = nodes.map((n) => n.y);
  const minX = Math.min(...xs), maxX = Math.max(...xs);
  const minY = Math.min(...ys), maxY = Math.max(...ys);
  const spanX = maxX - minX || 1;
  const spanY = maxY - minY || 1;
  
  // Mobile needs a wider padding buffer to keep nodes away from edges
  const pad = isMobile ? 18 : 12;
  const map = new Map<string, { xPct: number; yPct: number }>();
  nodes.forEach((n) => {
    const xPct = pad + ((n.x - minX) / spanX) * (100 - pad * 2);
    const yPct = pad + ((n.y - minY) / spanY) * (100 - pad * 2);
    map.set(n.id, { xPct, yPct });
  });
  return map;
}

export function AttackGraphCanvas({
  nodes,
  edges,
  height = 260,
  onNodeClick,
  selectedId,
  className,
}: {
  nodes: GraphNode[];
  edges: GraphEdge[];
  height?: number;
  onNodeClick?: (node: GraphNode) => void;
  selectedId?: string | null;
  className?: string;
}) {
  const [width, setWidth] = useState(1024);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    const handleResize = () => setWidth(window.innerWidth);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const isMobile = mounted && width < 640;
  const positions = useMemo(() => normalize(nodes, isMobile), [nodes, isMobile]);
  const [hovered, setHovered] = useState<string | null>(null);
  const byId = useMemo(() => new Map(nodes.map((n) => [n.id, n])), [nodes]);

  return (
    <div className={cn("relative w-full select-none", className)} style={{ height }}>
      <svg className="absolute inset-0 h-full w-full overflow-visible" preserveAspectRatio="none">
        <defs>
          <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <path d="M0,0 L0,6 L6,3 z" fill="#3a5170" />
          </marker>
        </defs>
        {edges.map((e, i) => {
          const from = positions.get(e.from);
          const to = positions.get(e.to);
          if (!from || !to) return null;
          const active = hovered === e.from || hovered === e.to || selectedId === e.from || selectedId === e.to;
          const color = e.severity ? EDGE_COLOR[e.severity] : "#3a5170";
          return (
            <line
              key={i}
              x1={`${from.xPct}%`}
              y1={`${from.yPct}%`}
              x2={`${to.xPct}%`}
              y2={`${to.yPct}%`}
              stroke={color}
              strokeWidth={active ? 2 : 1.4}
              strokeOpacity={active ? 0.95 : 0.45}
              strokeDasharray={e.severity === "Critical" ? "0" : "4 3"}
            />
          );
        })}
      </svg>

      {nodes.map((n) => {
        const pos = positions.get(n.id)!;
        if (!pos) return null;
        const Icon = ICONS[n.type];
        const isSelected = selectedId === n.id;
        return (
          <button
            key={n.id}
            onClick={() => onNodeClick?.(n)}
            onMouseEnter={() => setHovered(n.id)}
            onMouseLeave={() => setHovered(null)}
            style={{ left: `${pos.xPct}%`, top: `${pos.yPct}%` }}
            className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1 sm:gap-1.5 cursor-pointer group"
          >
            <span
              className={cn(
                "flex h-7 w-7 sm:h-9 sm:w-9 items-center justify-center rounded-full border-2 transition-transform group-hover:scale-110",
                NODE_COLOR[n.type],
                (n.critical || isSelected) && "ring-2 ring-offset-2 ring-offset-bg-1",
                n.critical ? "ring-danger/50" : isSelected ? "ring-primary/60" : ""
              )}
            >
              <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" strokeWidth={2} />
            </span>
            <span className="max-w-[70px] sm:max-w-none truncate sm:whitespace-nowrap rounded-md bg-bg-1/90 px-1 sm:px-1.5 py-0.5 text-[8px] sm:text-[10px] font-medium text-text-2 border border-border-1 group-hover:text-text-1">
              {n.label}
            </span>
          </button>
        );
      })}

      {hovered && byId.get(hovered) && (
        <div className="pointer-events-none absolute left-2 top-2 rounded-md border border-border-1 bg-bg-1/95 px-2 py-1 text-[10px] text-text-2">
          {byId.get(hovered)!.label} · {byId.get(hovered)!.type}
        </div>
      )}
    </div>
  );
}
