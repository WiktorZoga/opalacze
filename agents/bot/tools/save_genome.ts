import { prompt } from "@grok/agent-sdk";
import { defineTool } from "@grok/agent-sdk/tools";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, relative, resolve } from "node:path";
import * as z from "zod/v4";
import { Genome } from "../lib/genome.js";
import { generationDir, REPO_ROOT } from "../lib/paths.js";

export default defineTool({
  description: prompt`
    Validate a meme genome against the ROT BOT genome schema and write it into
    generations/gen-NNN/. Use kind "parent" for a sequenced wild or elite meme
    (written to parents/<id>/genome.json) and kind "mutation" for the Mutator's
    crossover child (written to mutation.json). Fails loudly on a bad genome:
    fix the genes, do not drop them. Commit the file afterwards with commit_artifact.
  `,
  inputSchema: z.object({
    kind: z.enum(["parent", "mutation"]),
    genome: Genome,
  }),
  effect: "idempotent",
  dryRunResult: ({ kind, genome }) => ({ saved: false, kind, id: genome.id }),
  async execute({ kind, genome }) {
    if (kind === "mutation" && genome.parents.length !== 2) {
      throw new Error("A mutation must have exactly two parents. Crossover needs a mother and a father.");
    }
    const dir = generationDir(genome.generation);
    const file =
      kind === "parent" ? resolve(dir, "parents", genome.id, "genome.json") : resolve(dir, "mutation.json");
    await mkdir(dirname(file), { recursive: true });
    await writeFile(file, JSON.stringify(genome, null, 2) + "\n");
    return {
      saved: true,
      kind,
      id: genome.id,
      path: relative(REPO_ROOT, file),
      genes: Object.fromEntries(Object.entries(genome.genes).map(([k, g]) => [k, g.allele])),
    };
  },
});
