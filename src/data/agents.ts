export type AgentId = 'scout' | 'geneticist' | 'mutator' | 'critic' | 'publisher' | 'analyst'

export interface Agent {
  id: AgentId
  name: string
  species: string
  role: string
  emoji: string
  /** display name in the agency console */
  label: string
  mono: string
  prop: string
  color: string
}

export const AGENTS: Record<AgentId, Agent> = {
  scout: {
    id: 'scout',
    label: 'Scout',
    mono: 'Sc',
    name: 'SCOUT',
    species: 'Pigeon w/ binoculars',
    role: 'trend match',
    emoji: '🐦',
    prop: '🔭',
    color: '#0d9488',
  },
  geneticist: {
    id: 'geneticist',
    label: 'Geneticist',
    mono: 'Ge',
    name: 'GENETICIST',
    species: 'Capybara in a lab coat',
    role: 'creative DNA',
    emoji: '🦫',
    prop: '🥼',
    color: '#2563eb',
  },
  mutator: {
    id: 'mutator',
    label: 'Creator',
    mono: 'Cr',
    name: 'MUTATOR',
    species: 'Mad-scientist crocodile',
    role: 'persona + script + render',
    emoji: '🐊',
    prop: '🧪',
    color: '#7c3aed',
  },
  critic: {
    id: 'critic',
    label: 'Critic',
    mono: 'Cq',
    name: 'CRITIC',
    species: 'Judge cat',
    role: 'fidelity · safety · claims',
    emoji: '🐱',
    prop: '⚖️',
    color: '#d97706',
  },
  publisher: {
    id: 'publisher',
    label: 'Publisher',
    mono: 'Pu',
    name: 'PUBLISHER',
    species: 'Hype parrot',
    role: 'TikTok · X · Reels',
    emoji: '🦜',
    prop: '📣',
    color: '#e11d48',
  },
  analyst: {
    id: 'analyst',
    label: 'Analyst',
    mono: 'An',
    name: 'ANALYST',
    species: 'Spreadsheet owl',
    role: 'hook rate · CTR',
    emoji: '🦉',
    prop: '📊',
    color: '#4f46e5',
  },
}

/** order of the evolution loop: metrics feed back into the scout */
export const PIPELINE: { agent: AgentId; packet: string }[] = [
  { agent: 'scout', packet: 'trend' },
  { agent: 'geneticist', packet: 'genome' },
  { agent: 'mutator', packet: 'concept' },
  { agent: 'critic', packet: 'approved' },
  { agent: 'publisher', packet: 'video' },
  { agent: 'analyst', packet: 'metrics' },
]

export const AGENT_LIST = Object.values(AGENTS)
