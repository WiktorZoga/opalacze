import { prompt } from "@grok/agent-sdk";
import { defineTool } from "@grok/agent-sdk/tools";
import { mkdir, writeFile } from "node:fs/promises";
import { relative, resolve } from "node:path";
import * as z from "zod/v4";
import { generationDir, REPO_ROOT } from "../lib/paths.js";
import { xaiKey, xaiPost } from "../lib/xai.js";

const IMAGE_MODEL = process.env.ROTBOT_IMAGE_MODEL ?? "grok-imagine-image";
const VIDEO_MODEL = process.env.ROTBOT_VIDEO_MODEL ?? "grok-imagine-video";

async function pollVideo(requestId: string): Promise<string> {
  const base = process.env.XAI_BASE_URL ?? "https://api.x.ai/v1";
  for (let i = 0; i < 60; i++) {
    const res = await fetch(`${base}/videos/${requestId}`, {
      headers: { authorization: `Bearer ${xaiKey()}` },
    });
    const body: any = await res.json();
    const url = body?.video?.url ?? body?.url;
    if (url) return url;
    if (body?.status === "failed") throw new Error(`video generation failed: ${JSON.stringify(body)}`);
    await new Promise((r) => setTimeout(r, 5_000));
  }
  throw new Error("video generation timed out after 5 minutes");
}

export default defineTool({
  description: prompt`
    Render a mutated meme with Grok Imagine. kind "image" makes a 9:16 key frame,
    kind "video" makes a short vertical clip for TikTok / X. Always writes a
    storyboard.json next to the media so the render is reproducible.
    Without XAI_API_KEY it writes only the storyboard and returns rendered: false.
  `,
  inputSchema: z.object({
    generation: z.number().int().min(0),
    genomeId: z.string(),
    kind: z.enum(["image", "video"]).default("video"),
    prompt: z.string().min(20).describe("Shot-level prompt: hero, setting, action, camera, caption text."),
    durationSeconds: z.number().int().min(3).max(15).default(8),
  }),
  effect: "write",
  dryRunResult: ({ genomeId, kind }) => ({ rendered: false, genomeId, kind, reason: "dry run" }),
  async execute({ generation, genomeId, kind, prompt: shot, durationSeconds }) {
    const dir = resolve(generationDir(generation), "media");
    await mkdir(dir, { recursive: true });
    const storyboard = {
      genomeId,
      kind,
      model: kind === "image" ? IMAGE_MODEL : VIDEO_MODEL,
      aspectRatio: "9:16",
      durationSeconds: kind === "video" ? durationSeconds : null,
      prompt: shot,
    };
    await writeFile(resolve(dir, "storyboard.json"), JSON.stringify(storyboard, null, 2) + "\n");

    if (!xaiKey()) {
      return { rendered: false, reason: "XAI_API_KEY not set", storyboard: relative(REPO_ROOT, resolve(dir, "storyboard.json")) };
    }

    let url: string;
    if (kind === "image") {
      const res = await xaiPost("/images/generations", { model: IMAGE_MODEL, prompt: shot, n: 1, response_format: "url" });
      url = res.data?.[0]?.url;
    } else {
      const res = await xaiPost("/videos/generations", {
        model: VIDEO_MODEL,
        prompt: shot,
        duration: durationSeconds,
        aspect_ratio: "9:16",
      });
      url = res.video?.url ?? (await pollVideo(res.request_id ?? res.id));
    }
    if (!url) throw new Error("Grok Imagine returned no media url");

    const bytes = Buffer.from(await (await fetch(url)).arrayBuffer());
    const file = resolve(dir, `${genomeId}.${kind === "image" ? "jpg" : "mp4"}`);
    await writeFile(file, bytes);
    return { rendered: true, kind, path: relative(REPO_ROOT, file), bytes: bytes.length, sourceUrl: url };
  },
});
