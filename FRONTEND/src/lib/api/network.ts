import { client } from "./client";
import type { NetworkData } from "@/types";

export async function getNetwork(): Promise<NetworkData> {
  return client.get<NetworkData>("/network");
}
