import type { AgentId } from './agents'
import trend from '../../generations/gen-003/trend.json'
import mutation from '../../generations/gen-003/mutation.json'
import critique from '../../generations/gen-003/critique.json'
import metrics from '../../generations/gen-003/metrics.json'
import post from '../../generations/gen-003/post.json'
import storyboard from '../../generations/gen-003/media/storyboard.json'
import fatherGenome from '../../generations/gen-003/parents/why-would-i-deceive-you/genome.json'
import motherGenome from '../../generations/gen-003/parents/krasnal-ceo/genome.json'

export interface Commit {
  hash: string
  agent: AgentId
  message: string
  path: string
}

export interface Span {
  id: string
  agent: AgentId
  /** tool name (as in agents/bot/tools) or an llm step */
  name: string
  kind: 'tool' | 'llm'
  start: number
  end: number
  status: 'ok' | 'rejected'
  to: AgentId
  packet: string
  input: unknown
  output: unknown
  commit: Commit
}

const G = 'generations/gen-003'
const round1 = critique.rounds[0]
const round2 = critique.rounds[1]
const structure = mutation.mutations.find((m) => m.gene === 'structure')!

/** replay of the recorded gen-003 run; commit hashes are the agents' real commits on main */
export const SPANS: Span[] = [
  {
    id: 's1',
    agent: 'scout',
    name: 'x_trends',
    kind: 'tool',
    start: 0,
    end: 2200,
    status: 'ok',
    to: 'scout',
    packet: 'trends',
    input: { query: 'memes going viral in the last 72h', platform: 'both', limit: 6 },
    output: { run: trend.run, candidates: trend.candidates.slice(0, 3).map((c) => ({ id: c.id, platform: c.platform, velocity: c.velocity })) },
    commit: { hash: '1b41dfe', agent: 'scout', message: 'record run scout-2026-11-05: 10 real trends from TikTok + X', path: 'generations/sources.json' },
  },
  {
    id: 's2',
    agent: 'scout',
    name: 'pick_parents',
    kind: 'llm',
    start: 2200,
    end: 3400,
    status: 'ok',
    to: 'geneticist',
    packet: 'trend',
    input: { bloodline: 'krasnal-ceo', candidates: trend.candidates.length },
    output: { picked: trend.picked, why: trend.why },
    commit: { hash: '285219c', agent: 'scout', message: 'spot why-would-i-deceive-you for the krasnal-ceo bloodline', path: `${G}/trend.json` },
  },
  {
    id: 's3',
    agent: 'geneticist',
    name: 'save_genome',
    kind: 'tool',
    start: 3600,
    end: 5000,
    status: 'ok',
    to: 'geneticist',
    packet: 'genome',
    input: { kind: 'parent', genome: { id: fatherGenome.id, genes: Object.keys(fatherGenome.genes).length } },
    output: { saved: true, path: `${G}/parents/${fatherGenome.id}/genome.json`, hook: fatherGenome.genes.hook },
    commit: { hash: '6632a99', agent: 'geneticist', message: 'sequence why-would-i-deceive-you genome', path: `${G}/parents/${fatherGenome.id}/genome.json` },
  },
  {
    id: 's4',
    agent: 'geneticist',
    name: 'save_genome',
    kind: 'tool',
    start: 5000,
    end: 6300,
    status: 'ok',
    to: 'mutator',
    packet: 'genomes',
    input: { kind: 'parent', genome: { id: motherGenome.id, genes: Object.keys(motherGenome.genes).length } },
    output: { saved: true, path: `${G}/parents/${motherGenome.id}/genome.json`, hero: motherGenome.genes.hero },
    commit: { hash: '59d71d2', agent: 'geneticist', message: 'sequence krasnal-ceo genome', path: `${G}/parents/${motherGenome.id}/genome.json` },
  },
  {
    id: 's5',
    agent: 'mutator',
    name: 'crossover',
    kind: 'llm',
    start: 6500,
    end: 8600,
    status: 'ok',
    to: 'critic',
    packet: 'concept',
    input: { mother: mutation.parents[0], father: mutation.parents[1] },
    output: { id: mutation.id, name: mutation.name, mutations: mutation.mutations.slice(0, 2).map((m) => ({ gene: m.gene, to: m.to })) },
    commit: { hash: 'cc3eb78', agent: 'mutator', message: 'crossover krasnal-ceo × why-would-i-deceive-you → krasnal-ceo-series-a', path: `${G}/mutation.json` },
  },
  {
    id: 's6',
    agent: 'critic',
    name: 'review',
    kind: 'llm',
    start: 8800,
    end: 10000,
    status: 'rejected',
    to: 'mutator',
    packet: 'critique',
    input: { genome: round1.genome, round: 1 },
    output: { verdict: round1.verdict, scores: round1.scores, reroll: round1.reroll, note: round1.note },
    commit: { hash: '2fa11d6', agent: 'critic', message: 'absolutely not (structure)', path: `${G}/critique.json` },
  },
  {
    id: 's7',
    agent: 'mutator',
    name: 'reroll_gene',
    kind: 'llm',
    start: 10200,
    end: 11800,
    status: 'ok',
    to: 'critic',
    packet: 'concept v2',
    input: { gene: 'structure', from: structure.from },
    output: { to: structure.to, reason: structure.reason },
    commit: { hash: 'aafbcfe', agent: 'mutator', message: 'reroll structure gene after critique', path: `${G}/mutation.json` },
  },
  {
    id: 's8',
    agent: 'critic',
    name: 'review',
    kind: 'llm',
    start: 12000,
    end: 13000,
    status: 'ok',
    to: 'mutator',
    packet: 'approved',
    input: { genome: round2.genome, round: 2 },
    output: { verdict: round2.verdict, scores: round2.scores, note: round2.note },
    commit: { hash: 'cee5e9e', agent: 'critic', message: 'approve krasnal-ceo-series-a', path: `${G}/critique.json` },
  },
  {
    id: 's9',
    agent: 'mutator',
    name: 'generate_media',
    kind: 'tool',
    start: 13200,
    end: 15400,
    status: 'ok',
    to: 'publisher',
    packet: 'video',
    input: { generation: 3, genomeId: storyboard.genomeId, kind: storyboard.kind, durationSeconds: storyboard.durationSeconds },
    output: { model: storyboard.model, aspectRatio: storyboard.aspectRatio, storyboard: `${G}/media/storyboard.json` },
    commit: { hash: '4c382e7', agent: 'mutator', message: 'storyboard krasnal-ceo-series-a for grok-imagine-video', path: `${G}/media/storyboard.json` },
  },
  {
    id: 's10',
    agent: 'publisher',
    name: 'publish_post',
    kind: 'tool',
    start: 15600,
    end: 17400,
    status: 'ok',
    to: 'analyst',
    packet: 'posts',
    input: { platform: 'tiktok', genomeId: post.genome, caption: post.tiktok.caption, hashtags: post.tiktok.hashtags.slice(0, 3) },
    output: { status: post.status, approval: post.approval, slotCET: post.tiktok.slotCET },
    commit: { hash: '7cf1e44', agent: 'publisher', message: 'queue krasnal-ceo-series-a for tiktok + x', path: `${G}/post.json` },
  },
  {
    id: 's11',
    agent: 'analyst',
    name: 'commit_artifact',
    kind: 'tool',
    start: 17600,
    end: 19800,
    status: 'ok',
    to: 'scout',
    packet: 'fitness',
    input: { agent: 'analyst', generation: 3, message: 'fitness krasnal-ceo-series-a', files: ['metrics.json'] },
    output: { source: metrics.source, fitness: metrics.fitness, tiktok: metrics.platforms.tiktok.fitness, x: metrics.platforms.x.fitness, carriedBy: metrics.carriedBy, elite: metrics.elite },
    commit: { hash: 'adb9c54', agent: 'analyst', message: `fitness krasnal-ceo-series-a = ${metrics.fitness}`, path: `${G}/metrics.json` },
  },
]

export const RUN_MS = 21500
export const RUN_ID = 'gen-003'
export const RUN_GENOME = mutation.id
