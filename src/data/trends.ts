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
  handle: string
  caption: string
  views: string
  likes: string
  shares: string
  spark: number[]
}

const curve = (seed: number, up: boolean, n = 24) =>
  Array.from({ length: n }, (_, i) => {
    const t = i / (n - 1)
    const base = up ? Math.pow(t, 2.4) * 100 : 100 * Math.sin(t * Math.PI) * 0.9
    const noise = Math.sin(i * 1.7 + seed) * 6 + Math.cos(i * 0.9 + seed * 2) * 4
    return Math.max(2, base + noise + 8)
  })

/** sample data — shaped like what the Scout pulls from TikTok + X */
export const TRENDS: Trend[] = [
  {
    id: 't1',
    memeId: 'pigeon',
    ticker: '$PIGEON',
    name: 'Corporate Pigeon',
    growth: 340,
    status: 'EARLY SIGNAL',
    platform: 'x',
    handle: '@pigeon_in_finance',
    caption: 'me at 9am standup pretending i read the ticket',
    views: '2.1M',
    likes: '184K',
    shares: '41K',
    spark: curve(1, true),
  },
  {
    id: 't2',
    memeId: 'capybara',
    ticker: '$CAPY',
    name: 'Sigma Capybara',
    growth: 212,
    status: 'EARLY SIGNAL',
    platform: 'tiktok',
    handle: '@capycore.daily',
    caption: 'everyone panicking. capybara: ok. #capycore',
    views: '8.4M',
    likes: '1.2M',
    shares: '96K',
    spark: curve(2, true),
  },
  {
    id: 't3',
    memeId: 'tram',
    ticker: '$TRAM33',
    name: 'Tram 33 Prophecy',
    growth: 128,
    status: 'PEAKING',
    platform: 'tiktok',
    handle: '@wroclove',
    caption: 'mpk said 3 minutes. it has been 3 business days',
    views: '640K',
    likes: '71K',
    shares: '12K',
    spark: curve(3, true),
  },
  {
    id: 't4',
    memeId: 'pierogi',
    ticker: '$PIEROGI',
    name: 'Pierogi Rizz',
    growth: 87,
    status: 'PEAKING',
    platform: 'x',
    handle: '@babcia_energy',
    caption: 'babcia when you say "i already ate"',
    views: '1.3M',
    likes: '98K',
    shares: '22K',
    spark: curve(4, true),
  },
  {
    id: 't5',
    memeId: 'ohio',
    ticker: '$OHIO',
    name: 'Only in Ohio',
    growth: -41,
    status: 'DYING',
    platform: 'tiktok',
    handle: '@ohio.lore',
    caption: 'normal day in ohio (part 412)',
    views: '22M',
    likes: '1.9M',
    shares: '300K',
    spark: curve(5, false),
  },
  {
    id: 't6',
    memeId: 'skibidi',
    ticker: '$TOILET',
    name: 'Toilet Lore',
    growth: -68,
    status: 'DYING',
    platform: 'x',
    handle: '@lore_keeper',
    caption: 'season 74. the lore deepens.',
    views: '18M',
    likes: '640K',
    shares: '88K',
    spark: curve(6, false),
  },
]

export const TICKER_EXTRA = [
  { ticker: '$RIZZ', growth: 12.4 },
  { ticker: '$SIGMA', growth: 33.1 },
  { ticker: '$KRASNAL', growth: 999 },
  { ticker: '$NPC', growth: -8.2 },
  { ticker: '$AURA', growth: 77.7 },
  { ticker: '$HONK', growth: 54 },
  { ticker: '$FANUM', growth: -22.5 },
  { ticker: '$MEWING', growth: -3.1 },
  { ticker: '$BABCIA', growth: 61.0 },
  { ticker: '$ZAPIEKANKA', growth: 204 },
]
