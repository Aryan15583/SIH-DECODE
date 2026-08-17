import { client } from "./client";
import type { GraphNode, GraphEdge } from "@/types";

export interface AttackGraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export async function getAttackGraph(): Promise<AttackGraphData> {
  return client.get<AttackGraphData>("/attack-graph");
}
