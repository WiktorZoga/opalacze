import type { AgentId } from './agents'

export interface Line {
  agent: AgentId
  text: string
  /** ms after the screen opens */
  at: number
}

export type ScreenId = 'campaign' | 'creative' | 'history'

/** short agent notes shown in the status bar while a screen is open */
export const DIALOGUE: Record<ScreenId, Line[]> = {
  campaign: [
    { agent: 'scout', at: 300, text: 'matching the brief against rising TikTok + X trends' },
    { agent: 'geneticist', at: 3400, text: 'extracting trend DNA and the product insertion point' },
    { agent: 'mutator', at: 5400, text: 'casting an AI creator persona, writing A/B scripts' },
    { agent: 'critic', at: 7600, text: 'checking trend fidelity, brand safety, claims, disclosure' },
    { agent: 'publisher', at: 14500, text: 'scheduling TikTok, Reels and X (simulated)' },
    { agent: 'analyst', at: 16500, text: 'reading hook rate, watch time, CTR (simulated)' },
  ],
  creative: [
    { agent: 'mutator', at: 300, text: 'two variants per tone, 9:16, labelled #ad · AI-generated' },
    { agent: 'critic', at: 3000, text: 'every variant passed round 2' },
  ],
  history: [
    { agent: 'geneticist', at: 300, text: 'earlier R&D run: the swarm breeding memes before the agency pivot' },
  ],
}
