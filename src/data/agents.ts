export type AgentId = 'scout' | 'geneticist' | 'mutator' | 'critic' | 'publisher' | 'analyst'

export interface Agent {
  id: AgentId
  name: string
  species: string
  role: string
  emoji: string
  prop: string
  color: string
}

export const AGENTS: Record<AgentId, Agent> = {
  scout: {
    id: 'scout',
    name: 'SCOUT',
    species: 'Pigeon w/ binoculars',
    role: 'trend hunter',
    emoji: '🐦',
    prop: '🔭',
    color: '#00f0ff',
  },
  geneticist: {
    id: 'geneticist',
    name: 'GENETICIST',
    species: 'Capybara in a lab coat',
    role: 'DNA sequencing',
    emoji: '🦫',
    prop: '🥼',
    color: '#b6ff00',
  },
  mutator: {
    id: 'mutator',
    name: 'MUTATOR',
    species: 'Mad-scientist crocodile',
    role: 'crossbreeding',
    emoji: '🐊',
    prop: '🧪',
    color: '#ff2bd6',
  },
  critic: {
    id: 'critic',
    name: 'CRITIC',
    species: 'Judge cat',
    role: 'quality control',
    emoji: '😼',
    prop: '⚖️',
    color: '#ffb800',
  },
  publisher: {
    id: 'publisher',
    name: 'PUBLISHER',
    species: 'Hype parrot',
    role: 'posts to TikTok + X',
    emoji: '🦜',
    prop: '📣',
    color: '#ff5a36',
  },
  analyst: {
    id: 'analyst',
    name: 'ANALYST',
    species: 'Spreadsheet owl',
    role: 'reads metrics',
    emoji: '🦉',
    prop: '📊',
    color: '#8b5cff',
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
