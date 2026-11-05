import * as z from "zod/v4";

/** One heritable trait of a meme. Dominance decides who wins a crossover. */
export const Gene = z.object({
  allele: z.string().min(1).describe("The concrete expression of this gene, e.g. 'pigeon in a suit'."),
  dominance: z.number().min(0).max(1).describe("0 = recessive, 1 = always inherited."),
});

export const Source = z.object({
  platform: z.enum(["tiktok", "x"]),
  url: z.string(),
  handle: z.string().optional(),
  views: z.number().int().nonnegative().nullable().optional(),
  signal: z.string().describe("Why we believe it is viral, e.g. 'KYM Meme of the Month #2'."),
});

export const Mutation = z.object({
  gene: z.string(),
  from: z.string(),
  to: z.string(),
  reason: z.string(),
});

/** The viral DNA of a meme. Every generation in generations/ is one of these. */
export const Genome = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/).describe("kebab-case, e.g. 'corporate-pigeon'."),
  name: z.string(),
  generation: z.number().int().min(0),
  parents: z.array(z.string()).max(2).describe("Parent genome ids. Empty for wild-caught memes."),
  sources: z.array(Source),
  genes: z.object({
    hook: Gene.describe("First 1.5 seconds. Why the thumb stops."),
    hero: Gene.describe("The protagonist."),
    setting: Gene,
    humor: Gene.describe("The comedic mechanic: irony, escalation, deadpan, cringe..."),
    audio: Gene,
    visual: Gene,
    catchphrase: Gene,
    structure: Gene.describe("Beat structure / loop shape."),
  }),
  absurdity: z.number().min(0).max(10),
  brandSafety: z.number().min(0).max(10),
  mutations: z.array(Mutation).default([]),
  fitness: z.number().min(0).max(1).nullable().default(null).describe("Filled in by the Analyst."),
});

export type Genome = z.infer<typeof Genome>;
export const GENE_KEYS = Object.keys(Genome.shape.genes.shape) as (keyof Genome["genes"])[];
