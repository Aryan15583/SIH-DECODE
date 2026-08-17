import { client } from "./client";
import type { Agent } from "@/types";

export async function getAgents(): Promise<Agent[]> {
  return client.get<Agent[]>("/agents");
}
