import { client } from "./client";
import type { Prediction } from "@/types";

export async function getPredictions(): Promise<Prediction[]> {
  return client.get<Prediction[]>("/predictions");
}
