import type { ScreenId } from './data/dialogue'

export interface DemoStep {
  screen: ScreenId
  ms: number
  pl: string
  en: string
}

/** guided walkthrough of the live run gen-live-001, 45 s */
export const DEMO_STEPS: DemoStep[] = [
  {
    screen: 'workflow',
    ms: 4000,
    pl: 'Scout pobiera prawdziwe trendy z TikToka i X.',
    en: 'Scout pulls real trends from TikTok and X.',
  },
  {
    screen: 'workflow',
    ms: 1900,
    pl: 'Geneticist rozkłada je na geny i zapisuje genomy.',
    en: 'Geneticist sequences each trend into a genome.',
  },
  {
    screen: 'workflow',
    ms: 9300,
    pl: 'Mutator krzyżuje rodziców. Critic odrzuca, Mutator poprawia gen.',
    en: 'Mutator crosses the parents. Critic rejects; Mutator rerolls one gene.',
  },
  {
    screen: 'workflow',
    ms: 3300,
    pl: 'Mutator renderuje klatkę w grok-imagine. Każdy krok to commit agenta.',
    en: 'Mutator renders a frame with grok-imagine. Every step is an agent commit.',
  },
  {
    screen: 'lineage',
    ms: 11000,
    pl: 'Geny dziecka pochodzą od matki, ojca albo mutacji. Repozytorium jest drzewem genealogicznym.',
    en: 'Each gene comes from the mother, the father, or a mutation. The repo is the family tree.',
  },
  {
    screen: 'output',
    ms: 15500,
    pl: 'Na końcu: gotowy mem wyrenderowany przez grok-imagine. Turn any brand into brainrot.',
    en: 'The output: a finished meme rendered by grok-imagine. Turn any brand into brainrot.',
  },
]
