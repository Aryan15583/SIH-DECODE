"use client";

import { useState, useEffect } from "react";
import { Building2, Network, Cloud, Server, ChevronLeft, ChevronRight, Camera } from "lucide-react";
import type { NetworkNode } from "@/types";

const ICONS: Record<string, typeof Building2> = {
  office: Building2,
  network: Network,
  cloud: Cloud,
  datacenter: Server,
  servers: Server,
};

const DEFAULT_CONNECTIONS: [string, string][] = [
  ["office", "network"],
  ["network", "cloud"],
  ["network", "datacenter"],
  ["datacenter", "servers"],
  ["datacenter", "cloud"],
];

export function NetworkMap({
  nodes = [],
  connections = DEFAULT_CONNECTIONS,
  loading = false,
  error = false,
}: {
  nodes?: NetworkNode[];
  connections?: [string, string][];
  loading?: boolean;
  error?: boolean;
}) {
  const [active, setActive] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [width, setWidth] = useState(1024);

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

  if (error) {
    return (
      <div className="flex h-[480px] sm:h-[520px] w-full items-center justify-center text-sm text-text-2 border border-border-1 bg-bg-1/40 rounded-xl">
        Unable to load network map data
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex h-[480px] sm:h-[520px] w-full items-center justify-center text-sm text-text-2 border border-border-1 bg-bg-1/40 rounded-xl animate-pulse">
        Loading network map data...
      </div>
    );
  }

  if (nodes.length === 0) {
    return (
      <div className="flex h-[480px] sm:h-[520px] w-full items-center justify-center text-sm text-text-2 border border-border-1 bg-bg-1/40 rounded-xl">
        No network data available
      </div>
    );
  }

  const getCoords = (nodeId: string) => {
    const node = nodes.find((n) => n.id === nodeId);
    if (!node) return { x: 50, y: 50 };
    if (!mounted) return { x: node.x, y: node.y };

    const isDesktop = width >= 1024;
    if (isDesktop) return { x: node.x, y: node.y };

    const sidebarWidth = 0;
    const parentPadding = width >= 768 ? 48 : 32;
    const availableWidth = Math.max(300, width - sidebarWidth - parentPadding);
    const cardHalfWidth = width >= 640 ? 80 : 64;

    const minPct = (cardHalfWidth / availableWidth) * 100;
    const maxPct = ((availableWidth - cardHalfWidth) / availableWidth) * 100;

    const scaledX = minPct + (node.x / 100) * (maxPct - minPct);
    
    let scaledY = node.y;
    if (width < 640) {
      scaledY = 12 + (node.y / 100) * 76;
      
      if (node.id === "cloud") scaledY = 14;
      if (node.id === "network") scaledY = 32;
      if (node.id === "office") scaledY = 52;
      if (node.id === "datacenter") scaledY = 70;
      if (node.id === "servers") scaledY = 88;
    }

    return { x: scaledX, y: scaledY };
  };

  const responsiveNodes = nodes.map((n) => ({
    ...n,
    ...getCoords(n.id),
  }));

  const byId = new Map(responsiveNodes.map((n) => [n.id, n]));

  return (
    <div className="relative h-[480px] sm:h-[520px] w-full overflow-hidden rounded-xl border border-border-1 bg-[radial-gradient(circle_at_50%_30%,rgba(88,101,242,0.12),transparent_60%)]">
      <svg className="absolute inset-0 h-full w-full">
        {connections.map(([a, b], i) => {
          const from = byId.get(a)!;
          const to = byId.get(b)!;
          if (!from || !to) return null;
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

      {responsiveNodes.map((n) => {
        const Icon = ICONS[n.id] || Network;
        const isActive = active === n.id;
        return (
          <button
            key={n.id}
            onClick={() => setActive(n.id)}
            style={{ left: `${n.x}%`, top: `${n.y}%` }}
            className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300"
          >
            <div
              className={`w-32 sm:w-40 rounded-xl border p-2.5 sm:p-3.5 text-left shadow-lg backdrop-blur-md transition-transform hover:scale-[1.03] ${
                isActive ? "border-primary/60 bg-primary/10 glow-primary" : "border-border-1 bg-bg-1/85"
              }`}
            >
              <Icon className="h-4.5 w-4.5 text-cyber" />
              <p className="mt-1 sm:mt-2 text-xs sm:text-sm font-bold text-text-1 leading-tight">{n.label}</p>
              <p className="mt-0.5 text-[9px] sm:text-[11px] leading-tight text-text-2">{n.sub}</p>
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
