"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { NetworkMap } from "@/components/network/NetworkMap";
import { useApi } from "@/hooks/useApi";
import { getNetwork } from "@/lib/api/network";

export default function NetworkMapPage() {
  const [view, setView] = useState<"2D" | "3D" | "Map">("2D");
  const { data, loading, error } = useApi(getNetwork);

  const nodes = data?.nodes || [];
  const connections = data?.connections ? data.connections.map(c => [c.from, c.to] as [string, string]) : undefined;

  const hasData = nodes.length > 0 && !error && !loading;

  return (
    <div className="flex flex-col gap-4">
      <Card className="flex flex-wrap items-center gap-2 p-3.5">
        {(["2D", "3D", "Map"] as const).map((v) => (
          <Button key={v} size="sm" variant={view === v ? "primary" : "outline"} onClick={() => setView(v)}>
            {v} View
          </Button>
        ))}
        <span className="ml-auto text-xs text-text-2">
          {hasData ? "Live infrastructure snapshot · Updated just now" : "Not available"}
        </span>
      </Card>
      <Card className="p-4">
        <NetworkMap nodes={nodes} connections={connections} loading={loading} error={!!error} />
      </Card>
    </div>
  );
}
