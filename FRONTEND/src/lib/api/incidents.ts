import { client } from "./client";
import type { Incident } from "@/types";

export async function getIncidents(): Promise<Incident[]> {
  return client.get<Incident[]>("/incidents");
}

export async function getIncident(id: string): Promise<Incident> {
  return client.get<Incident>(`/incidents/${id}`);
}
