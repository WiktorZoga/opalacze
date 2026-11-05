import type { AgentId } from './agents'

export interface Line {
  agent: AgentId
  text: string
  /** ms after the screen opens */
  at: number
}

export type ScreenId = 'workflow' | 'lineage' | 'output'

/** short agent notes shown in the status bar while a screen is open */
export const DIALOGUE: Record<ScreenId, Line[]> = {
  workflow: [
    { agent: 'scout', at: 200, text: 'pulling trends from TikTok + X' },
    { agent: 'scout', at: 2400, text: 'a CEO needs a pitch, a pitch needs a lie. coo.' },
    { agent: 'geneticist', at: 3800, text: 'sequencing both parents' },
    { agent: 'mutator', at: 6600, text: 'crossing krasnal-ceo × why-would-i-deceive-you' },
    { agent: 'critic', at: 8900, text: 'absolutely not. it ends. memes must not end.' },
    { agent: 'mutator', at: 10300, text: 'rerolling the structure gene into a seamless loop' },
    { agent: 'critic', at: 12100, text: 'fine. ship it.' },
    { agent: 'publisher', at: 15700, text: 'queued for TikTok + X, awaiting human approval' },
    { agent: 'analyst', at: 17700, text: 'fitness 0.81, carried by humor (simulated)' },
  ],
  lineage: [
    { agent: 'geneticist', at: 300, text: '3 generations, every step is a commit on main' },
    { agent: 'analyst', at: 3000, text: 'the loop gene added 0.11 fitness' },
  ],
  output: [
    { agent: 'publisher', at: 300, text: 'artifact ready: image, 9:16 storyboard, captions' },
    { agent: 'critic', at: 3000, text: 'i watched it four times. this changes nothing between us.' },
  ],
}
