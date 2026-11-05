import m1 from '../../generations/gen-001/mutation.json'
import m2 from '../../generations/gen-002/mutation.json'
import m3 from '../../generations/gen-003/mutation.json'
import f1 from '../../generations/gen-001/metrics.json'
import f2 from '../../generations/gen-002/metrics.json'
import f3 from '../../generations/gen-003/metrics.json'
import live from '../../generations/gen-live-001/mutation.json'
import liveCritique from '../../generations/gen-live-001/critique.json'
import mother from '../../generations/gen-live-001/parents/bronze-krasnal/genome.json'
import father from '../../generations/gen-live-001/parents/midnight-vape-sound-check/genome.json'
import liveImage from '../../generations/gen-live-001/media/krasnal-night-check.jpg'

export interface GenerationRow {
  gen: string
  id: string
  name: string
  parents: string[]
  fitness: number | null
  carriedBy: string
  live?: boolean
}

export const GENERATIONS: GenerationRow[] = [
  { gen: 'gen-001', id: m1.id, name: m1.name, parents: m1.parents, fitness: f1.fitness, carriedBy: f1.carriedBy },
  { gen: 'gen-002', id: m2.id, name: m2.name, parents: m2.parents, fitness: f2.fitness, carriedBy: f2.carriedBy },
  { gen: 'gen-003', id: m3.id, name: m3.name, parents: m3.parents, fitness: f3.fitness, carriedBy: f3.carriedBy },
  { gen: 'gen-live-001', id: live.id, name: live.name, parents: live.parents, fitness: null, carriedBy: 'not scored yet', live: true },
]

type GeneMap = Record<string, { allele: string; dominance: number }>

export interface GeneRow {
  gene: string
  allele: string
  dominance: number
  origin: 'mother' | 'father' | 'mutation'
}

const mg = mother.genes as GeneMap
const fg = father.genes as GeneMap
const mutated = new Set(live.mutations.map((m) => m.gene))

export const GENOME: GeneRow[] = Object.entries(live.genes as GeneMap).map(([gene, g]) => ({
  gene,
  allele: g.allele,
  dominance: g.dominance ?? 0,
  origin: mutated.has(gene) ? 'mutation' : mg[gene]?.allele === g.allele ? 'mother' : fg[gene]?.allele === g.allele ? 'father' : g.dominance >= 0.9 ? 'mother' : 'father',
}))

export const PARENTS = { mother: mother.id, father: father.id }
export const CRITIQUE = liveCritique.rounds
export const CHILD = { id: live.id, name: live.name }
export const LIVE_IMAGE = liveImage as string
