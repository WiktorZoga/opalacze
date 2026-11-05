import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { GENERATIONS_DIR } from "./paths.js";

export type TrendItem = {
  id: string;
  title: string;
  platform: "tiktok" | "x";
  alsoOn: string[];
  url: string;
  firstSeen: string;
  signal: string;
  views: number | null;
  velocity: number;
  description: string;
  tags: string[];
};

/** The Scout's recorded run over real trends, shared with the frontend. */
export function recordedTrends(): TrendItem[] {
  const raw = JSON.parse(readFileSync(resolve(GENERATIONS_DIR, "sources.json"), "utf8"));
  return raw.trends as TrendItem[];
}
