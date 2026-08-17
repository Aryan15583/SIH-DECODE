import { client } from "./client";
import type { DashboardData } from "@/types";

export async function getDashboard(): Promise<DashboardData> {
  return client.get<DashboardData>("/dashboard");
}
