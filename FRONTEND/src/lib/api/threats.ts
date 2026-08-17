import { client } from "./client";
import type { Threat } from "@/types";

export async function getThreats(): Promise<Threat[]> {
  return client.get<Threat[]>("/threats");
}

export async function getThreat(id: string): Promise<Threat> {
  return client.get<Threat>(`/threats/${id}`);
}
