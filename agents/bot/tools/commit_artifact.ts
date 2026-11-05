import { prompt } from "@grok/agent-sdk";
import { defineTool } from "@grok/agent-sdk/tools";
import { execFile } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, relative } from "node:path";
import { promisify } from "node:util";
import * as z from "zod/v4";
import { AGENT_IDS, CAST } from "../lib/cast.js";
import { REPO_ROOT, safeArtifactPath } from "../lib/paths.js";

const run = promisify(execFile);

async function git(args: string[], author?: { name: string; email: string }) {
  const id = author
    ? ["-c", `user.name=${author.name}`, "-c", `user.email=${author.email}`]
    : [];
  const { stdout } = await run("git", [...id, ...args], { cwd: REPO_ROOT });
  return stdout.trim();
}

export default defineTool({
  description: prompt`
    Commit swarm output into generations/ as the agent that produced it, so the
    git history is the meme family tree. Each agent has its own git author.
    - files: JSON or Markdown artifacts to write first (paths under generations/).
    - branch: create or switch to a lineage branch before committing (one per parent meme).
    - mergeFrom: crossover. Merge that lineage branch into the current branch with
      --no-ff and record the files in the merge commit. Only the mutator merges.
  `,
  inputSchema: z.object({
    agent: z.enum(AGENT_IDS),
    message: z.string().min(5).max(120).describe("Subject line, e.g. 'sequence corporate-pigeon genome'."),
    generation: z.number().int().min(0),
    files: z
      .array(z.object({ path: z.string(), content: z.union([z.string(), z.record(z.string(), z.unknown())]) }))
      .default([]),
    paths: z.array(z.string()).default([]).describe("Already-written files to include, e.g. from save_genome."),
    branch: z.string().regex(/^(main|lineage\/[a-z0-9-]+)$/).optional().describe("'main' is the bloodline."),
    base: z.string().optional().describe("Start point when creating the branch. Defaults to HEAD."),
    mergeFrom: z.string().regex(/^lineage\/[a-z0-9-]+$/).optional(),
  }),
  effect: "write",
  dryRunResult: ({ agent, message }) => ({ committed: false, agent, message }),
  async execute({ agent, message, generation, files, paths, branch, base, mergeFrom }) {
    if (mergeFrom && agent !== "mutator") throw new Error("Only the mutator performs crossover merges.");
    const author = CAST[agent];

    if (branch) {
      const exists = await git(["branch", "--list", branch]);
      await git(exists ? ["switch", branch] : ["switch", "-c", branch, ...(base ? [base] : [])]);
    }
    if (mergeFrom) {
      await git(["merge", "--no-ff", "--no-commit", mergeFrom], author);
    }

    const staged: string[] = [];
    for (const f of files) {
      const abs = safeArtifactPath(f.path);
      await mkdir(dirname(abs), { recursive: true });
      await writeFile(abs, typeof f.content === "string" ? f.content : JSON.stringify(f.content, null, 2) + "\n");
      staged.push(relative(REPO_ROOT, abs));
    }
    for (const p of paths) staged.push(relative(REPO_ROOT, safeArtifactPath(p)));
    if (staged.length) await git(["add", "--", ...staged]);

    const subject = `${author.name.split(" ").pop()} ${agent}: ${message}`;
    const body = [`Rotbot-Agent: ${agent}`, `Rotbot-Generation: ${generation}`].join("\n");
    await git(["commit", "--no-verify", "-m", subject, "-m", body], author);
    const sha = await git(["rev-parse", "--short", "HEAD"]);
    const onBranch = await git(["branch", "--show-current"]);
    return { committed: true, sha, branch: onBranch, author: `${author.name} <${author.email}>`, files: staged };
  },
});
