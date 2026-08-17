import { client } from "./client";
import type { Report } from "@/types";

export async function getReports(): Promise<Report[]> {
  return client.get<Report[]>("/reports");
}

export async function getReport(id: string): Promise<Report> {
  return client.get<Report>(`/reports/${id}`);
}
