export type TrendStatus = 'EARLY SIGNAL' | 'PEAKING' | 'MAINSTREAM' | 'DYING'
export type Platform = 'tiktok' | 'x'

export interface Trend {
  id: string
  memeId: string
  ticker: string
  name: string
  growth: number
  status: TrendStatus
  platform: Platform
  /** short human description of the format */
  caption: string
  views: string
  stat: string
  url: string
  source: string
  spark: number[]
}

const curve = (seed: number, up: boolean, n = 24) =>
  Array.from({ length: n }, (_, i) => {
    const t = i / (n - 1)
    const base = up ? Math.pow(t, 2.4) * 100 : 100 * Math.sin(t * Math.PI) * 0.9
    const noise = Math.sin(i * 1.7 + seed) * 6 + Math.cos(i * 0.9 + seed * 2) * 4
    return Math.max(2, base + noise + 8)
  })

/**
 * Real trends from the week of 2–5 Nov 2026 (titles, approx. views, links).
 * Cards are our own renders — no creator media is embedded. Growth curves are illustrative.
 */
export const TRENDS: Trend[] = [
  {
    id: 't1',
    memeId: 'doorPrank',
    ticker: '$DOOR',
    name: 'Closing the Door Prank',
    growth: 522,
    status: 'EARLY SIGNAL',
    platform: 'tiktok',
    caption: 'tell them to sprint through the doorway, fake-slam the door',
    views: '7M',
    stat: '199 creators/wk',
    url: 'https://virlo.ai/trends/',
    source: 'virlo.ai',
    spark: curve(1, true),
  },
  {
    id: 't2',
    memeId: 'never25',
    ticker: '$NEVER25',
    name: "You'll Never Look 25 Again",
    growth: 7400,
    status: 'EARLY SIGNAL',
    platform: 'tiktok',
    caption: '"you\'ll never look 25 again" → glow-up → "thank god"',
    views: '1.7M',
    stat: '150 creators/wk',
    url: 'https://virlo.ai/trends/',
    source: 'virlo.ai',
    spark: curve(2, true),
  },
  {
    id: 't3',
    memeId: 'scientistsHi',
    ticker: '$HI',
    name: 'Scientists Reveal the Hi',
    growth: 186,
    status: 'PEAKING',
    platform: 'x',
    caption: 'an orange cat, captioned "scientists reveal the hi"',
    views: '#2 MotM',
    stat: 'Oct 2026 · KYM',
    url: 'https://knowyourmeme.com/editorials/poll/see-the-winner-of-october-2026s-meme-of-the-month',
    source: 'Know Your Meme',
    spark: curve(3, true),
  },
  {
    id: 't4',
    memeId: 'candyMatch',
    ticker: '$DING',
    name: 'Ding Ding Ding Match-3',
    growth: 263,
    status: 'EARLY SIGNAL',
    platform: 'tiktok',
    caption: 'move candy in a grid to phonk like a match-3 game',
    views: '3.9M',
    stat: '263 creators/wk',
    url: 'https://virlo.ai/trends/',
    source: 'virlo.ai',
    spark: curve(4, true),
  },
  {
    id: 't5',
    memeId: 'memeWar',
    ticker: '$TWW1',
    name: 'First Twitter World War',
    growth: 94,
    status: 'MAINSTREAM',
    platform: 'x',
    caption: 'a cat meme sparks a China–Türkiye meme war on X',
    views: '17.4M',
    stat: '167K likes',
    url: 'https://ccs.tw/life/x-china-turkey-meme-war?lang=en',
    source: 'CCS',
    spark: curve(5, true),
  },
  {
    id: 't6',
    memeId: 'blackCat',
    ticker: '$CLAP',
    name: 'Black Cat Clapping',
    growth: -24,
    status: 'DYING',
    platform: 'x',
    caption: 'AI black cat smiling and clapping with human hands',
    views: '#4 MotM',
    stat: 'Oct 2026 · KYM',
    url: 'https://knowyourmeme.com/editorials/poll/see-the-winner-of-october-2026s-meme-of-the-month',
    source: 'Know Your Meme',
    spark: curve(6, false),
  },
]

export const TICKER_EXTRA = [
  { ticker: '$MALFOID', growth: 28 },
  { ticker: '$STARK', growth: 33.1 },
  { ticker: '$SOLDIER', growth: 145 },
  { ticker: '$FANCYCAFE', growth: 78 },
  { ticker: '$SPONGEBOB', growth: 12.4 },
  { ticker: '$HOMBRO', growth: 61 },
  { ticker: '$KRASNAL', growth: 999 },
  { ticker: '$OHIO', growth: -41 },
  { ticker: '$SKIBIDI', growth: -68 },
  { ticker: '$ZAPIEKANKA', growth: 204 },
]
