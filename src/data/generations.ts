export interface TreeNode {
  id: string
  memeId: string
  gen: number
  parents: string[]
  status: 'alive' | 'extinct' | 'legend'
  score: number
}

/** gen → column; nodes laid out by the FamilyTree screen */
export const TREE: TreeNode[] = [
  { id: 'n1', memeId: 'ohio', gen: 1, parents: [], status: 'extinct', score: 41 },
  { id: 'n2', memeId: 'skibidi', gen: 1, parents: [], status: 'extinct', score: 38 },
  { id: 'n3', memeId: 'gigachad', gen: 2, parents: ['n1'], status: 'alive', score: 63 },
  { id: 'n4', memeId: 'tram', gen: 2, parents: ['n2'], status: 'alive', score: 70 },
  { id: 'n5', memeId: 'pigeon', gen: 4, parents: ['n3'], status: 'alive', score: 88 },
  { id: 'n6', memeId: 'pierogi', gen: 4, parents: ['n4'], status: 'alive', score: 74 },
  { id: 'n7', memeId: 'capybara', gen: 5, parents: ['n4', 'n6'], status: 'alive', score: 91 },
  { id: 'n8', memeId: 'mutant1', gen: 6, parents: ['n5', 'n7'], status: 'extinct', score: 12 },
  { id: 'n9', memeId: 'krasnal', gen: 7, parents: ['n5', 'n7'], status: 'legend', score: 99 },
]

export const HALL_OF_FAME = [
  { memeId: 'krasnal', gen: 7, title: 'Krasnal CEO', stat: '12.4M views · 48h' },
  { memeId: 'capybara', gen: 5, title: 'Sigma Capybara', stat: '8.1M views' },
  { memeId: 'pigeon', gen: 4, title: 'Corporate Pigeon', stat: '5.7M views' },
]
