"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Building2,
  Network,
  Cloud,
  Database,
  Server,
  Monitor,
  Skull,
  ShieldAlert,
  Bug,
  User,
  RotateCcw,
  RotateCw,
  Camera,
  Layers,
  ZoomIn,
  ZoomOut,
  Info
} from "lucide-react";
import type { NetworkNode, NetworkConnection, Severity } from "@/types";
import { cn } from "@/lib/utils";

const ICONS: Record<string, typeof Building2> = {
  office: Building2,
  network: Network,
  cloud: Cloud,
  datacenter: Server,
  database: Database,
  server: Server,
  servers: Server,
  endpoint: Monitor,
  workstation: Monitor,
  attacker: Skull,
  firewall: ShieldAlert,
  malware: Bug,
  user: User,
};

const SEVERITY_COLORS: Record<Severity | "default", { line: string; glow: string; text: string }> = {
  Critical: { line: "#ff4d5a", glow: "rgba(255, 77, 90, 0.45)", text: "text-danger" },
  High: { line: "#f5b942", glow: "rgba(245, 185, 66, 0.45)", text: "text-warning" },
  Medium: { line: "#5865f2", glow: "rgba(88, 101, 242, 0.45)", text: "text-primary" },
  Low: { line: "#39d98a", glow: "rgba(57, 217, 138, 0.45)", text: "text-success" },
  Info: { line: "#22b8f0", glow: "rgba(34, 184, 240, 0.45)", text: "text-cyber" },
  default: { line: "#22b8f0", glow: "rgba(34, 184, 240, 0.3)", text: "text-cyber" }
};

interface NormalizedNode extends NetworkNode {
  xPct: number;
  yPct: number;
  nodeType: string;
}

interface ParsedConnection {
  from: string;
  to: string;
  severity?: Severity;
}

function normalizeCoordinates(nodes: NetworkNode[], isMobile: boolean): Map<string, NormalizedNode> {
  if (nodes.length === 0) return new Map();

  const xs = nodes.map((n) => n.x);
  const ys = nodes.map((n) => n.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const spanX = maxX - minX || 1;
  const spanY = maxY - minY || 1;

  const padX = isMobile ? 18 : 14;
  const padY = isMobile ? 20 : 16;

  const map = new Map<string, NormalizedNode>();
  nodes.forEach((n) => {
    let nodeType = (n as { type?: string }).type || "network";
    if (!nodeType || nodeType === "network") {
      const idLower = n.id.toLowerCase();
      const labelLower = (n.label || "").toLowerCase();
      if (idLower.includes("attacker") || labelLower.includes("attacker")) nodeType = "attacker";
      else if (idLower.includes("fw") || labelLower.includes("firewall")) nodeType = "firewall";
      else if (idLower.includes("workstation") || idLower.includes("endpoint") || labelLower.includes("workstation")) nodeType = "endpoint";
      else if (idLower.includes("db") || labelLower.includes("database")) nodeType = "database";
      else if (idLower.includes("cloud") || labelLower.includes("cloud") || labelLower.includes("vpc")) nodeType = "cloud";
      else if (idLower.includes("server") || labelLower.includes("server")) nodeType = "server";
      else if (idLower.includes("office") || labelLower.includes("hq")) nodeType = "office";
    }

    const xPct = padX + ((n.x - minX) / spanX) * (100 - padX * 2);
    const yPct = padY + ((n.y - minY) / spanY) * (100 - padY * 2);

    map.set(n.id, {
      ...n,
      xPct,
      yPct,
      nodeType,
    });
  });

  return map;
}

export function NetworkMap({
  nodes = [],
  connections = [],
  view = "2D",
  loading = false,
  error = false,
}: {
  nodes?: NetworkNode[];
  connections?: (NetworkConnection | [string, string])[];
  view?: "2D" | "3D" | "Map";
  loading?: boolean;
  error?: boolean;
}) {
  const [active, setActive] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [width, setWidth] = useState(1024);

  // 3D camera controls
  const [rotX, setRotX] = useState(55);
  const [rotZ, setRotZ] = useState(-20);
  const [zoom3D, setZoom3D] = useState(1);

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
  const normalizedNodesMap = useMemo(() => normalizeCoordinates(nodes, isMobile), [nodes, isMobile]);
  const normalizedNodes = useMemo(() => Array.from(normalizedNodesMap.values()), [normalizedNodesMap]);

  // Parse connections whether passed as objects { from, to, severity } or tuples [from, to]
  const parsedConnections: ParsedConnection[] = useMemo(() => {
    return connections.map((c) => {
      if (Array.isArray(c)) {
        return { from: c[0], to: c[1] };
      }
      return { from: c.from, to: c.to, severity: c.severity };
    });
  }, [connections]);

  const activeNode = active ? normalizedNodesMap.get(active) : null;

  if (error) {
    return (
      <div className="flex h-[480px] sm:h-[540px] w-full items-center justify-center text-sm text-text-2 border border-border-1 bg-bg-1/40 rounded-xl">
        Unable to load live infrastructure snapshot
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex h-[480px] sm:h-[540px] w-full items-center justify-center text-sm text-text-2 border border-border-1 bg-bg-1/40 rounded-xl animate-pulse">
        Loading live infrastructure topology...
      </div>
    );
  }

  if (nodes.length === 0) {
    return (
      <div className="flex h-[480px] sm:h-[540px] w-full items-center justify-center text-sm text-text-2 border border-border-1 bg-bg-1/40 rounded-xl">
        No active infrastructure nodes available
      </div>
    );
  }

  return (
    <div className="relative h-[480px] sm:h-[540px] w-full overflow-hidden rounded-xl border border-border-1 bg-[radial-gradient(circle_at_50%_35%,rgba(88,101,242,0.12),transparent_70%)] select-none">
      
      {/* Background Cyber Grid */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-25"
        style={{
          backgroundImage: "linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)",
          backgroundSize: view === "3D" ? "40px 40px" : "32px 32px"
        }}
      />

      {/* Mode 1: 3D Isometric View */}
      {view === "3D" ? (
        <div 
          className="relative w-full h-full flex items-center justify-center"
          style={{ perspective: "1000px" }}
        >
          <div 
            className="relative w-[90%] h-[85%] transition-transform duration-300 ease-out"
            style={{
              transformStyle: "preserve-3d",
              transform: `scale(${zoom3D}) rotateX(${rotX}deg) rotateZ(${rotZ}deg)`
            }}
          >
            {/* 3D Floor Grid Plane */}
            <div 
              className="absolute inset-0 rounded-2xl border-2 border-primary/20 bg-surface-1/60 shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
              style={{
                transform: "translateZ(0px)",
                backgroundImage: "radial-gradient(circle, rgba(88,101,242,0.2) 1px, transparent 1px)",
                backgroundSize: "24px 24px"
              }}
            />

            {/* 3D Connection Beams */}
            <svg className="absolute inset-0 h-full w-full pointer-events-none overflow-visible" style={{ transform: "translateZ(10px)" }}>
              {parsedConnections.map((conn, i) => {
                const from = normalizedNodesMap.get(conn.from);
                const to = normalizedNodesMap.get(conn.to);
                if (!from || !to) return null;
                const colors = SEVERITY_COLORS[conn.severity || "default"];
                const isConnActive = active === conn.from || active === conn.to;

                return (
                  <g key={i}>
                    {/* Shadow line on floor */}
                    <line
                      x1={`${from.xPct}%`}
                      y1={`${from.yPct}%`}
                      x2={`${to.xPct}%`}
                      y2={`${to.yPct}%`}
                      stroke="rgba(0,0,0,0.6)"
                      strokeWidth={3}
                    />
                    {/* Glowing elevated conduit */}
                    <line
                      x1={`${from.xPct}%`}
                      y1={`${from.yPct}%`}
                      x2={`${to.xPct}%`}
                      y2={`${to.yPct}%`}
                      stroke={colors.line}
                      strokeWidth={isConnActive ? 3 : 2}
                      strokeOpacity={isConnActive ? 0.95 : 0.6}
                      strokeDasharray={conn.severity === "Critical" ? "0" : "6 4"}
                    />
                  </g>
                );
              })}
            </svg>

            {/* 3D Nodes */}
            {normalizedNodes.map((n) => {
              const Icon = ICONS[n.nodeType] || ICONS[n.id] || Network;
              const isActive = active === n.id;
              const isAttacker = n.nodeType === "attacker";
              const isCritical = n.critical || isAttacker;
              const elevation = isCritical ? 40 : 25;

              return (
                <div
                  key={n.id}
                  style={{
                    left: `${n.xPct}%`,
                    top: `${n.yPct}%`,
                    transform: `translate(-50%, -50%) translateZ(${elevation}px)`,
                    transformStyle: "preserve-3d"
                  }}
                  className="absolute cursor-pointer group"
                  onClick={() => setActive(n.id)}
                >
                  {/* Drop Shadow on Plane */}
                  <div 
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/70 blur-md pointer-events-none"
                    style={{ transform: `translateZ(-${elevation}px)` }}
                  />

                  {/* 3D Node Card Pillar */}
                  <div
                    className={cn(
                      "flex flex-col items-center gap-1 p-2 sm:p-2.5 rounded-xl border backdrop-blur-md transition-all duration-300 shadow-xl",
                      isActive
                        ? "border-primary bg-primary/20 scale-110 shadow-[0_0_20px_rgba(88,101,242,0.6)]"
                        : isCritical
                        ? "border-danger/70 bg-danger/15 text-danger shadow-[0_0_15px_rgba(255,77,90,0.3)]"
                        : "border-border-1 bg-surface-1/90 hover:border-primary/50 text-text-1"
                    )}
                    style={{
                      transform: `rotateZ(${-rotZ}deg) rotateX(${-rotX}deg)`,
                      minWidth: "100px"
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        "flex h-7 w-7 items-center justify-center rounded-lg border",
                        isAttacker
                          ? "bg-danger/20 border-danger/60 text-danger"
                          : isCritical
                          ? "bg-warning/20 border-warning/60 text-warning"
                          : "bg-primary/20 border-primary/40 text-cyber"
                      )}>
                        <Icon className="h-4 w-4" />
                      </span>
                      <div className="flex flex-col">
                        <span className="text-[11px] font-bold text-text-1 whitespace-nowrap">{n.label}</span>
                        <span className="text-[9px] text-text-2 whitespace-nowrap">{n.sub || n.nodeType}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 3D Camera Controls Bar */}
          <div className="absolute bottom-4 right-4 flex items-center gap-1.5 rounded-lg border border-border-1 bg-surface-1/90 p-1 backdrop-blur-md">
            <button 
              title="Rotate Left"
              onClick={() => setRotZ(z => z + 15)} 
              className="rounded-md p-1.5 text-text-2 hover:text-text-1 hover:bg-surface-2 cursor-pointer transition-colors"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
            <button 
              title="Rotate Right"
              onClick={() => setRotZ(z => z - 15)} 
              className="rounded-md p-1.5 text-text-2 hover:text-text-1 hover:bg-surface-2 cursor-pointer transition-colors"
            >
              <RotateCw className="h-4 w-4" />
            </button>
            <button 
              title="Zoom In"
              onClick={() => setZoom3D(z => Math.min(z + 0.15, 1.6))} 
              className="rounded-md p-1.5 text-text-2 hover:text-text-1 hover:bg-surface-2 cursor-pointer transition-colors"
            >
              <ZoomIn className="h-4 w-4" />
            </button>
            <button 
              title="Zoom Out"
              onClick={() => setZoom3D(z => Math.max(z - 0.15, 0.7))} 
              className="rounded-md p-1.5 text-text-2 hover:text-text-1 hover:bg-surface-2 cursor-pointer transition-colors"
            >
              <ZoomOut className="h-4 w-4" />
            </button>
            <button 
              title="Reset View"
              onClick={() => { setRotX(55); setRotZ(-20); setZoom3D(1); }} 
              className="rounded-md p-1.5 text-cyber hover:bg-surface-2 cursor-pointer transition-colors"
            >
              <Camera className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : (
        /* Mode 2: 2D & Map Views */
        <div className="relative w-full h-full">
          {/* SVG Connection Beams */}
          <svg className="absolute inset-0 h-full w-full overflow-visible pointer-events-none">
            <defs>
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {parsedConnections.map((conn, i) => {
              const from = normalizedNodesMap.get(conn.from);
              const to = normalizedNodesMap.get(conn.to);
              if (!from || !to) return null;
              const colors = SEVERITY_COLORS[conn.severity || "default"];
              const isConnActive = active === conn.from || active === conn.to;

              return (
                <g key={i}>
                  {/* Outer glow track */}
                  <line
                    x1={`${from.xPct}%`}
                    y1={`${from.yPct}%`}
                    x2={`${to.xPct}%`}
                    y2={`${to.yPct}%`}
                    stroke={colors.line}
                    strokeOpacity={isConnActive ? 0.35 : 0.15}
                    strokeWidth={isConnActive ? 6 : 4}
                  />
                  {/* Solid/Dashed active vector */}
                  <line
                    x1={`${from.xPct}%`}
                    y1={`${from.yPct}%`}
                    x2={`${to.xPct}%`}
                    y2={`${to.yPct}%`}
                    stroke={colors.line}
                    strokeOpacity={isConnActive ? 0.95 : 0.65}
                    strokeWidth={isConnActive ? 2.5 : 1.5}
                    strokeDasharray={conn.severity === "Critical" ? "0" : "5 4"}
                  />
                </g>
              );
            })}
          </svg>

          {/* 2D Interactive Node Cards */}
          {normalizedNodes.map((n) => {
            const Icon = ICONS[n.nodeType] || ICONS[n.id] || Network;
            const isActive = active === n.id;
            const isAttacker = n.nodeType === "attacker";
            const isCritical = n.critical || isAttacker;

            return (
              <div
                key={n.id}
                style={{ left: `${n.xPct}%`, top: `${n.yPct}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10 transition-transform duration-200"
                onClick={() => setActive(n.id)}
              >
                <div
                  className={cn(
                    "flex flex-col gap-1 rounded-xl border p-2.5 sm:p-3.5 shadow-lg backdrop-blur-md transition-all hover:scale-105 min-w-[120px] sm:min-w-[150px]",
                    isActive
                      ? "border-primary bg-primary/20 shadow-[0_0_18px_rgba(88,101,242,0.5)] ring-2 ring-primary"
                      : isAttacker
                      ? "border-danger/70 bg-danger/15 shadow-[0_0_12px_rgba(255,77,90,0.3)] ring-1 ring-danger/40"
                      : isCritical
                      ? "border-warning/60 bg-warning/10 shadow-[0_0_12px_rgba(245,185,66,0.25)]"
                      : "border-border-1 bg-surface-1/90 hover:border-border-2"
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className={cn(
                      "flex h-7 w-7 items-center justify-center rounded-lg border",
                      isAttacker
                        ? "bg-danger/20 border-danger/50 text-danger"
                        : isCritical
                        ? "bg-warning/20 border-warning/50 text-warning"
                        : "bg-primary/15 border-primary/40 text-cyber"
                    )}>
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className={cn(
                      "text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded border",
                      isAttacker
                        ? "bg-danger/20 border-danger/40 text-danger"
                        : isCritical
                        ? "bg-warning/20 border-warning/40 text-warning"
                        : "bg-surface-2 border-border-1 text-text-2"
                    )}>
                      {isAttacker ? "Threat Origin" : n.nodeType}
                    </span>
                  </div>

                  <p className="mt-1 text-xs sm:text-sm font-bold text-text-1 leading-tight truncate">
                    {n.label}
                  </p>
                  <p className="text-[10px] sm:text-[11px] text-text-2 font-mono truncate leading-tight">
                    {n.sub || "Nominal telemetry"}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Selected Node Telemetry HUD Overlay */}
      {activeNode && (
        <div className="absolute top-3 left-3 z-20 flex flex-col gap-1 p-3.5 rounded-xl border border-border-1 bg-surface-1/95 shadow-2xl backdrop-blur-md min-w-[200px] sm:min-w-[240px] animate-fade-in text-xs">
          <div className="flex items-center justify-between border-b border-border-1 pb-2">
            <span className="font-bold text-text-1 flex items-center gap-1.5">
              <Info className="h-3.5 w-3.5 text-primary" /> Node Inspector
            </span>
            <button 
              onClick={() => setActive(null)} 
              className="text-text-2 hover:text-text-1 text-xs cursor-pointer px-1"
            >
              ✕
            </button>
          </div>
          <div className="flex flex-col gap-1.5 pt-1.5 text-[11px]">
            <div className="flex justify-between">
              <span className="text-text-2">Identifier:</span>
              <span className="font-mono text-text-1 font-semibold">{activeNode.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-2">Label:</span>
              <span className="text-text-1 font-semibold">{activeNode.label}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-2">Type / Subnet:</span>
              <span className="text-cyber font-mono">{activeNode.sub || activeNode.nodeType}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-2">Status:</span>
              <span className={cn(
                "font-semibold",
                activeNode.nodeType === "attacker" ? "text-danger" : activeNode.critical ? "text-warning" : "text-success"
              )}>
                {activeNode.nodeType === "attacker" ? "Active Ingress Vector" : activeNode.critical ? "Critical Exposure" : "Protected"}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Mode Indicator Badge */}
      <div className="absolute bottom-3 left-3 z-10 flex items-center gap-2 rounded-lg border border-border-1 bg-surface-1/80 px-2.5 py-1.5 text-[11px] text-text-2 backdrop-blur-md">
        <Layers className="h-3.5 w-3.5 text-primary" />
        <span>Mode: <strong className="text-text-1">{view} Topology</strong></span>
        <span className="text-border-2">|</span>
        <span>{nodes.length} Nodes</span>
      </div>
    </div>
  );
}
