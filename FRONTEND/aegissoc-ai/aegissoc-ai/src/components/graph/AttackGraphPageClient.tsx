"use client";

import { useState } from "react";
import { ZoomIn, ZoomOut, RotateCcw, Filter, Box, Map } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { AttackGraphCanvas } from "@/components/graph/AttackGraphCanvas";
import { fullAttackGraph } from "@/lib/mock-data";
import type { GraphNode } from "@/types";

export function AttackGraphPageClient() {
  const [zoom, setZoom] = useState(1);
  const [selected, setSelected] = useState<GraphNode | null>(null);
  const [showCriticalOnly, setShowCriticalOnly] = useState(false);

  const nodes = showCriticalOnly ? fullAttackGraph.nodes.filter((n) => n.critical) : fullAttackGraph.nodes;
  const nodeIds = new Set(nodes.map((n) => n.id));
  const edges = fullAttackGraph.edges.filter((e) => nodeIds.has(e.from) && nodeIds.has(e.to));

  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_300px]">
      <Card className="relative overflow-hidden p-4">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <Button size="sm" variant="outline" onClick={() => setZoom((z) => Math.min(z + 0.15, 1.6))}>
            <ZoomIn className="h-3.5 w-3.5" /> Zoom In
          </Button>
          <Button size="sm" variant="outline" onClick={() => setZoom((z) => Math.max(z - 0.15, 0.7))}>
            <ZoomOut className="h-3.5 w-3.5" /> Zoom Out
          </Button>
          <Button size="sm" variant="outline" onClick={() => setZoom(1)}>
            <RotateCcw className="h-3.5 w-3.5" /> Reset
          </Button>
          <Button size="sm" variant={showCriticalOnly ? "primary" : "outline"} onClick={() => setShowCriticalOnly((v) => !v)}>
            <Filter className="h-3.5 w-3.5" /> Critical Only
          </Button>
          <div className="ml-auto flex gap-2">
            <Button size="sm" variant="outline"><Map className="h-3.5 w-3.5" /> Map View</Button>
            <Button size="sm" variant="outline"><Box className="h-3.5 w-3.5" /> 3D View</Button>
          </div>
        </div>
        <div className="overflow-hidden rounded-xl border border-border-1 bg-bg-1/40" style={{ transform: `scale(${zoom})`, transformOrigin: "top left", transition: "transform 0.2s" }}>
          <AttackGraphCanvas
            nodes={nodes}
            edges={edges}
            height={520}
            onNodeClick={setSelected}
            selectedId={selected?.id}
          />
        </div>
      </Card>

      <Card className="h-fit p-5">
        <h3 className="text-sm font-semibold text-text-1">Node Details</h3>
        {selected ? (
          <div className="mt-4 flex flex-col gap-3">
            <div>
              <p className="text-xs text-text-2">Name</p>
              <p className="text-sm font-medium text-text-1">{selected.label}</p>
            </div>
            <div>
              <p className="text-xs text-text-2">Type</p>
              <p className="text-sm font-medium capitalize text-text-1">{selected.type}</p>
            </div>
            <div>
              <p className="text-xs text-text-2">Status</p>
              <p className={`text-sm font-medium ${selected.critical ? "text-danger" : "text-success"}`}>
                {selected.critical ? "Critical exposure" : "Nominal"}
              </p>
            </div>
          </div>
        ) : (
          <p className="mt-4 text-sm text-text-2">Select a node in the graph to inspect its relationships and risk status.</p>
        )}

        <div className="mt-5 border-t border-border-1 pt-4">
          <p className="text-xs font-medium text-text-2">Legend</p>
          <div className="mt-2 flex flex-col gap-1.5 text-xs text-text-2">
            <span className="flex items-center gap-2"><span className="h-2 w-4 rounded bg-danger" /> Critical path</span>
            <span className="flex items-center gap-2"><span className="h-2 w-4 rounded bg-warning" /> High severity</span>
            <span className="flex items-center gap-2"><span className="h-2 w-4 rounded bg-primary" /> Medium severity</span>
            <span className="flex items-center gap-2"><span className="h-2 w-4 rounded bg-success" /> Low severity</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
