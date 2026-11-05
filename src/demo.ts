import type { ScreenId } from './data/dialogue'

export interface DemoStep {
  screen: ScreenId
  ms: number
  pl: string
  en: string
}

/** guided walkthrough of one recorded run, 45 s */
export const DEMO_STEPS: DemoStep[] = [
  {
    screen: 'workflow',
    ms: 3500,
    pl: 'Scout pobiera prawdziwe trendy z TikToka i X.',
    en: 'Scout pulls real trends from TikTok and X.',
  },
  {
    screen: 'workflow',
    ms: 3000,
    pl: 'Geneticist rozkłada je na geny i zapisuje genomy.',
    en: 'Geneticist sequences each trend into a genome.',
  },
  {
    screen: 'workflow',
    ms: 6500,
    pl: 'Mutator krzyżuje rodziców. Critic odrzuca, Mutator poprawia gen.',
    en: 'Mutator crosses the parents. Critic rejects; Mutator rerolls one gene.',
  },
  {
    screen: 'workflow',
    ms: 9000,
    pl: 'Publisher kolejkuje posty, Analyst liczy fitness i zasila kolejne pokolenie.',
    en: 'Publisher queues the posts; Analyst scores fitness and feeds the next generation.',
  },
  {
    screen: 'lineage',
    ms: 10000,
    pl: 'Każdy krok to commit agenta. Repozytorium jest drzewem genealogicznym.',
    en: 'Every step is an agent commit. The repo is the family tree.',
  },
  {
    screen: 'output',
    ms: 13000,
    pl: 'Na końcu: gotowy mem i wideo. Turn any brand into brainrot.',
    en: 'The output: a ready meme and video. Turn any brand into brainrot.',
  },
]
