import m1 from '../../generations/gen-001/mutation.json'
import m2 from '../../generations/gen-002/mutation.json'
import m3 from '../../generations/gen-003/mutation.json'
import f1 from '../../generations/gen-001/metrics.json'
import f2 from '../../generations/gen-002/metrics.json'
import f3 from '../../generations/gen-003/metrics.json'
import c3 from '../../generations/gen-003/critique.json'
import mother from '../../generations/gen-003/parents/krasnal-ceo/genome.json'
import father from '../../generations/gen-003/parents/why-would-i-deceive-you/genome.json'

export interface GenerationRow {
  gen: number
  id: string
  name: string
  parents: string[]
  fitness: number
  carriedBy: string
}

export const GENERATIONS: GenerationRow[] = [
  { gen: 1, id: m1.id, name: m1.name, parents: m1.parents, fitness: f1.fitness, carriedBy: f1.carriedBy },
  { gen: 2, id: m2.id, name: m2.name, parents: m2.parents, fitness: f2.fitness, carriedBy: f2.carriedBy },
  { gen: 3, id: m3.id, name: m3.name, parents: m3.parents, fitness: f3.fitness, carriedBy: f3.carriedBy },
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
const mutated = new Set(m3.mutations.map((m) => m.gene))

export const GENOME: GeneRow[] = Object.entries(m3.genes as GeneMap).map(([gene, g]) => ({
  gene,
  allele: g.allele,
  dominance: g.dominance,
  origin: mutated.has(gene) ? 'mutation' : mg[gene]?.allele === g.allele ? 'mother' : fg[gene]?.allele === g.allele ? 'father' : g.dominance >= 0.9 ? 'mother' : 'father',
}))

export const PARENTS = { mother: mother.id, father: father.id }
export const CRITIQUE = c3.rounds
export const CHILD = { id: m3.id, name: m3.name }
