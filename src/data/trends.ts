import sources from '../../generations/sources.json'

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
  caption: string
  views: string
  stat: string
  url: string
  source: string
  spark: number[]
}

interface SourceTrend {
  id: string
  title: string
  platform: string
  url: string
  views: number | null
  velocity: number
  description: string
}

const curve = (seed: number, up: boolean, n = 24) =>
  Array.from({ length: n }, (_, i) => {
    const t = i / (n - 1)
    const base = up ? Math.pow(t, 2.4) * 100 : 100 * Math.sin(t * Math.PI) * 0.9
    const noise = Math.sin(i * 1.7 + seed) * 6 + Math.cos(i * 0.9 + seed * 2) * 4
    return Math.max(2, base + noise + 8)
  })

/** card art + display overlay for the trends the Scout captured in generations/sources.json */
const OVERLAY: Record<string, { memeId: string; ticker: string; stat: string; growth?: number }> = {
  'closing-the-door-prank': { memeId: 'doorPrank', ticker: '$DOOR', stat: '199 creators/wk', growth: 522 },
  'ding-ding-ding-candy-match-3': { memeId: 'candyMatch', ticker: '$DING', stat: '263 creators/wk' },
  'permission-to-cry-soldier': { memeId: 'soldier', ticker: '$SOLDIER', stat: 'new · 4 Nov' },
  'data-centers-in-space': { memeId: 'dataCenter', ticker: '$DATACTR', stat: 'flooded X · 4 Nov' },
  'scientists-reveal-the-hi': { memeId: 'scientistsHi', ticker: '$HI', stat: 'KYM MotM #2' },
  malfoid: { memeId: 'malfoid', ticker: '$MALFOID', stat: 'KYM MotM #1' },
}

const fmtViews = (v: number | null) =>
  v == null ? '—' : v >= 1e6 ? `${(v / 1e6).toFixed(1).replace(/\.0$/, '')}M` : `${Math.round(v / 1e3)}K`

const statusOf = (velocity: number): TrendStatus =>
  velocity >= 4 ? 'EARLY SIGNAL' : velocity >= 2.5 ? 'PEAKING' : velocity >= 2 ? 'MAINSTREAM' : 'DYING'

const hostOf = (url: string) => new URL(url).hostname.replace(/^www\./, '')

const ALL = (sources.trends as SourceTrend[]).filter((s) => OVERLAY[s.id])

/** real trends (titles, links, public signals) — cards are our own renders, growth curves illustrative */
export const TRENDS: Trend[] = Object.keys(OVERLAY)
  .map((id) => ALL.find((s) => s.id === id))
  .filter((s): s is SourceTrend => Boolean(s))
  .map((s, i) => {
    const o = OVERLAY[s.id]
    const status = statusOf(s.velocity)
    return {
      id: `t${i + 1}`,
      memeId: o.memeId,
      ticker: o.ticker,
      name: s.title,
      growth: o.growth ?? (status === 'DYING' ? -Math.round((2 - s.velocity) * 60) : Math.round((s.velocity - 1) * 100)),
      status,
      platform: s.platform === 'x' ? 'x' : 'tiktok',
      caption: s.description,
      views: fmtViews(s.views),
      stat: o.stat,
      url: s.url,
      source: hostOf(s.url),
      spark: curve(i + 1, status !== 'DYING'),
    }
  })

export const SOURCES_CAPTURED_AT = sources.capturedAt

export const TICKER_EXTRA = [
  ...(sources.trends as SourceTrend[])
    .filter((s) => !OVERLAY[s.id])
    .map((s) => ({ ticker: `$${s.id.split('-')[0].toUpperCase()}`, growth: Math.round((s.velocity - 1) * 100) })),
  { ticker: '$KRASNAL', growth: 999 },
  { ticker: '$OHIO', growth: -41 },
  { ticker: '$SKIBIDI', growth: -68 },
  { ticker: '$ZAPIEKANKA', growth: 204 },
]
