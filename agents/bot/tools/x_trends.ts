import { prompt } from "@grok/agent-sdk";
import { defineTool } from "@grok/agent-sdk/tools";
import * as z from "zod/v4";
import { recordedTrends, type TrendItem } from "../lib/recorded.js";
import { xaiKey, xaiPost } from "../lib/xai.js";

const LiveTrend = z.object({
  id: z.string(),
  title: z.string(),
  url: z.string(),
  views: z.number().nullable(),
  velocity: z.number(),
  description: z.string(),
  tags: z.array(z.string()),
});

export default defineTool({
  description: prompt`
    Find memes that are going viral right now on X and TikTok.
    X goes through xAI live search (x_search) when XAI_API_KEY is set.
    Otherwise it replays the Scout's last recorded run (generations/sources.json),
    which tracks real trends with links and view signals. Sorted by velocity.
  `,
  inputSchema: z.object({
    query: z.string().default("memes going viral in the last 72h").describe("What to hunt for."),
    platform: z.enum(["x", "tiktok", "both"]).default("both"),
    limit: z.number().int().min(1).max(20).default(6),
  }),
  effect: "read",
  async execute({ query, platform, limit }) {
    const keep = (t: TrendItem) => platform === "both" || t.platform === platform;
    let items: TrendItem[] = [];
    let mode: "live" | "recorded" = "recorded";

    if (platform !== "tiktok" && xaiKey()) {
      try {
        const res = await xaiPost("/responses", {
          model: process.env.ROTBOT_SEARCH_MODEL ?? "grok-4.7",
          tools: [{ type: "x_search" }],
          input: [
            {
              role: "user",
              content: prompt`
                Search X for: ${query}.
                Return ONLY a JSON array (max ${limit}) of objects with keys
                id (kebab-case), title, url, views (int or null),
                velocity (growth multiple per day, float), description (one sentence), tags (string[]).
              `,
            },
          ],
        });
        const text: string =
          res.output_text ??
          res.output?.flatMap((o: any) => o.content ?? []).find((c: any) => c.type === "output_text")?.text ??
          "[]";
        const live = z.array(LiveTrend).parse(JSON.parse(text.slice(text.indexOf("["), text.lastIndexOf("]") + 1)));
        items = live.map((t) => ({
          ...t,
          platform: "x" as const,
          alsoOn: [],
          firstSeen: new Date().toISOString().slice(0, 10),
          signal: "xAI x_search",
        }));
        mode = "live";
      } catch {
        items = [];
      }
    }

    if (!items.length) items = recordedTrends().filter(keep);
    items = items.sort((a, b) => b.velocity - a.velocity).slice(0, limit);
    return { query, mode, fetchedAt: new Date().toISOString(), items };
  },
});
