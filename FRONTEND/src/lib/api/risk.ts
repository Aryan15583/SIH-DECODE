import { client } from "./client";
import type { RiskData } from "@/types";

export async function getRisk(): Promise<RiskData> {
  return client.get<RiskData>("/risk");
}
