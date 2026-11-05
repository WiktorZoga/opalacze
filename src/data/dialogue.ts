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
    { agent: 'scout', at: 200, text: 'x_trends (live): memes going viral in the last 72h' },
    { agent: 'scout', at: 2200, text: 'pick: Hitting Vape to Investigate Night Sound · 683K views on X' },
    { agent: 'geneticist', at: 4200, text: 'sequencing bronze-krasnal × midnight-vape-sound-check' },
    { agent: 'mutator', at: 5950, text: 'crossing the brand seed with the night-check trend' },
    { agent: 'critic', at: 7900, text: 'absolutely not. the hook still stops a thumb the statue does not have.' },
    { agent: 'mutator', at: 11300, text: 'rerolling only the hook gene' },
    { agent: 'critic', at: 13050, text: 'the thumb is gone. a hat tilt toward a dark doorway is a loop i will tolerate.' },
    { agent: 'mutator', at: 15650, text: 'rendering a 9:16 frame with grok-imagine-image-2.0' },
    { agent: 'mutator', at: 17100, text: 'caption: the smallest boss checks the bump' },
  ],
  lineage: [
    { agent: 'geneticist', at: 300, text: '4 generations, every gene traced to a parent or a mutation' },
    { agent: 'critic', at: 3000, text: 'round 1: absolutely not. round 2: fine. ship it.' },
  ],
  output: [
    { agent: 'mutator', at: 300, text: 'rendered with grok-imagine-image-2.0: the smallest boss checks the bump' },
    { agent: 'critic', at: 3000, text: 'a hat tilt toward a dark doorway is a loop i will tolerate.' },
  ],
}
