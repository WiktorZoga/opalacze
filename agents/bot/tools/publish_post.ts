import { prompt } from "@grok/agent-sdk";
import { defineTool } from "@grok/agent-sdk/tools";
import * as z from "zod/v4";

export default defineTool({
  description: prompt`
    Post an approved meme to X. Parks for human approval every time: the swarm
    breeds autonomously, but a human presses the button. TikTok uploads go
    through the TikTok Content Posting API and are out of scope here, so the
    tool returns a ready-to-upload package for TikTok instead.
    Without X_USER_ACCESS_TOKEN the post is queued, not sent.
  `,
  inputSchema: z.object({
    platform: z.enum(["x", "tiktok"]),
    genomeId: z.string(),
    caption: z.string().max(280),
    hashtags: z.array(z.string()).max(6).default([]),
    mediaPath: z.string().optional(),
  }),
  effect: "write",
  needsApproval: true,
  dryRunResult: ({ platform, genomeId }) => ({ posted: false, platform, genomeId, status: "dry-run" }),
  async execute({ platform, genomeId, caption, hashtags, mediaPath }, ctx) {
    const text = [caption, hashtags.map((h) => `#${h.replace(/^#/, "")}`).join(" ")].filter(Boolean).join("\n\n");
    const token = process.env.X_USER_ACCESS_TOKEN;
    if (platform === "tiktok" || !token) {
      return {
        posted: false,
        status: "queued",
        platform,
        genomeId,
        text,
        mediaPath: mediaPath ?? null,
        reason: platform === "tiktok" ? "TikTok upload is manual for now" : "X_USER_ACCESS_TOKEN not set",
        approvedBy: ctx.approvedBy?.principalId ?? null,
      };
    }
    const res = await fetch("https://api.x.com/2/tweets", {
      method: "POST",
      headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
      body: JSON.stringify({ text }),
    });
    if (!res.ok) throw new Error(`X API ${res.status}: ${(await res.text()).slice(0, 300)}`);
    const body: any = await res.json();
    return {
      posted: true,
      status: "live",
      platform,
      genomeId,
      postId: body.data?.id,
      url: `https://x.com/i/status/${body.data?.id}`,
    };
  },
});
