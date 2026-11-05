import type { AgentId } from './agents'

export interface Line {
  agent: AgentId
  text: string
  /** ms after the screen opens */
  at: number
  tone?: 'normal' | 'reject' | 'approve' | 'handoff'
}

export type ScreenId = 'radar' | 'genome' | 'breed' | 'studio' | 'publish' | 'tree' | 'brand'

export const DIALOGUE: Record<ScreenId, Line[]> = {
  radar: [
    { agent: 'scout', at: 300, text: 'scanning TikTok + X… 14,000 posts/min. coo.' },
    { agent: 'scout', at: 1700, text: '🚨 Closing the Door Prank +522% this week on TikTok.' },
    { agent: 'critic', at: 3000, text: 'a door. groundbreaking.' },
    { agent: 'scout', at: 4200, text: 'Permission to Cry Soldier: brand new. Malfoid is fading.' },
    { agent: 'scout', at: 5200, text: '→ @geneticist 📦 trend DNA incoming', tone: 'handoff' },
  ],
  genome: [
    { agent: 'geneticist', at: 300, text: 'received. putting the pigeon in the centrifuge.' },
    { agent: 'geneticist', at: 1600, text: 'HOOK 91. REMIXABILITY 95. very fertile meme.' },
    { agent: 'mutator', at: 2700, text: 'fertile you say 🧪😈' },
    { agent: 'geneticist', at: 3600, text: 'capybara: pure aura. payoff gene dominant.' },
    { agent: 'geneticist', at: 4400, text: '→ @mutator 📦 both genomes are yours', tone: 'handoff' },
  ],
  breed: [
    { agent: 'mutator', at: 300, text: "IT'S BREEDING TIME. stand back." },
    { agent: 'mutator', at: 1900, text: 'splicing HOOK(pigeon) × PAYOFF(capybara)…' },
    { agent: 'critic', at: 5200, text: 'absolutely not.', tone: 'reject' },
    { agent: 'critic', at: 5900, text: 'that is a blob. it has no lore.' },
    { agent: 'mutator', at: 6700, text: 'fine. injecting LOCAL gene: 🇵🇱 Wrocław krasnal' },
    { agent: 'geneticist', at: 7900, text: 'absurdity 99. this is… beautiful.' },
    { agent: 'critic', at: 8600, text: '…ok. approved. i hate that i love it.', tone: 'approve' },
    { agent: 'critic', at: 9600, text: '→ @mutator render it 📦', tone: 'handoff' },
  ],
  studio: [
    { agent: 'mutator', at: 300, text: 'rendering 3 vertical cuts, 9:16…' },
    { agent: 'geneticist', at: 1700, text: 'caption timing matches HOOK gene. good.' },
    { agent: 'critic', at: 3000, text: 'cut 1 is a banger. ship it.', tone: 'approve' },
    { agent: 'mutator', at: 3900, text: '→ @publisher 📦 3 videos', tone: 'handoff' },
  ],
  publish: [
    { agent: 'publisher', at: 300, text: 'posting to TikTok + X at peak scroll hour 📣' },
    { agent: 'publisher', at: 1500, text: 'live on 2 platforms.' },
    { agent: 'analyst', at: 2600, text: 'hoo. 1M views in the first hour (simulated).' },
    { agent: 'analyst', at: 4200, text: 'absurdity gene converts 3×. local hero +31% remix.' },
    { agent: 'analyst', at: 5400, text: '→ @scout 📦 metrics. hunt for more of THIS.', tone: 'handoff' },
  ],
  tree: [
    { agent: 'geneticist', at: 300, text: '7 generations. 41 offspring. 3 extinct.' },
    { agent: 'critic', at: 1600, text: 'Krasnal CEO enters the Hall of Fame.' },
    { agent: 'mutator', at: 2800, text: 'gen 8 already incubating 🥚' },
  ],
  brand: [
    { agent: 'scout', at: 300, text: 'new client detected. they want "viral".' },
    { agent: 'mutator', at: 1200, text: 'splicing brand DNA into the krasnal line…' },
    { agent: 'critic', at: 2200, text: 'on-brand AND unhinged. approved.', tone: 'approve' },
  ],
}
