import liveClip from '../../generations/gen-live-002/media/noir-05-deceive.mp4'
import { assetUrl } from './memes'
import { useGrokMedia, type GrokMedia } from './grokMedia'

const BANNED = new Set([
  'cafe-first-time-fancy',
  'brandrot-kebab-u-mustafy',
  'brandrot-your-startup',
  'brandrot-wroclaw-cafe',
])

/** left-to-right, top row then bottom: mix brands so the wall isn't one face */
export const WALL_ORDER = [
  'noir-05-deceive',
  'stride-sneaker-drop',
  'noir05-unboxing',
  'cafe-first-time-fancy-notext',
  'noir05-pigeon-pitch',
  'noir05-mirror-check',
  'noir05-tram-sniff',
  'noir05-grwm',
  'noir05-cafe-unbox',
  'noir05-brainrot-capybara',
]

const PREFER: Record<string, string> = {
  perfume: 'noir05-unboxing',
  sneaker: 'stride-sneaker-drop',
  cafe: 'cafe-first-time-fancy-notext',
  brainrot: 'noir05-pigeon-pitch',
}

const LINES: Record<string, { brand: string; line: string }> = {
  perfume: { brand: 'NOIR/05', line: '84% fit. Critic shipped it.' },
  sneaker: { brand: 'STRIDE', line: 'Leo unboxes the drop.' },
  cafe: { brand: 'Kawiarnia Rynek 13', line: 'Riding Fancy Cafe, 10.8M views.' },
  brainrot: { brand: 'Range', line: 'Brainrot, on purpose.' },
}

function seed(id: string, node: string, extra: Partial<GrokMedia> = {}): GrokMedia {
  return {
    id,
    file: `/memes/grok/ugc/${id}.mp4`,
    kind: 'video',
    node,
    captionBaked: false,
    ugc: true,
    url: assetUrl(`/memes/grok/ugc/${id}.mp4`),
    poster: assetUrl(`/memes/grok/ugc/${id}.poster.jpg`),
    ...extra,
  }
}

const SEEDS: GrokMedia[] = [
  {
    id: 'noir-05-deceive',
    file: liveClip,
    kind: 'video',
    node: 'perfume',
    captionBaked: false,
    ugc: true,
    url: liveClip,
    persona: 'Ren Hale',
    brand: 'NOIR/05',
  },
  seed('noir05-unboxing', 'perfume', { brand: 'NOIR/05' }),
  seed('noir05-grwm', 'perfume', { brand: 'NOIR/05' }),
  seed('noir05-mirror-check', 'perfume', { brand: 'NOIR/05' }),
  seed('noir05-tram-sniff', 'perfume', { brand: 'NOIR/05' }),
  seed('noir05-cafe-unbox', 'perfume', { brand: 'NOIR/05' }),
  seed('stride-sneaker-drop', 'sneaker', { brand: 'STRIDE' }),
  seed('cafe-first-time-fancy-notext', 'cafe', { brand: 'Kawiarnia Rynek 13' }),
  seed('noir05-brainrot-capybara', 'brainrot', { brand: 'NOIR/05', tone: 'brainrot' }),
  seed('noir05-pigeon-pitch', 'brainrot', { brand: 'NOIR/05', tone: 'brainrot' }),
]

function clean(m: GrokMedia) {
  return m.ugc === true && m.kind === 'video' && m.captionBaked !== true && !BANNED.has(m.id) && !/krasnal|scientists-reveal|brandrot/i.test(`${m.id} ${m.file}`)
}

/** Textless UGC videos. Seeds show immediately; index.json replaces them and adds new clips. */
export function useCleanClips(): GrokMedia[] {
  const lib = useGrokMedia()
  const map = new Map<string, GrokMedia>(SEEDS.map((m) => [m.id, m]))
  for (const m of lib.items) {
    if (clean(m)) map.set(m.id, m)
    else map.delete(m.id)
  }
  const clips = [...map.values()]
  const byId = new Map(clips.map((c) => [c.id, c]))
  const used = new Set<string>()
  const ordered: GrokMedia[] = []
  for (const id of WALL_ORDER) {
    const m = byId.get(id)
    if (!m) continue
    ordered.push(m)
    used.add(id)
  }
  const extras = clips.filter((c) => !used.has(c.id))
  ordered.splice(Math.min(3, ordered.length), 0, ...extras)
  return ordered
}

export interface WorkCard {
  node: string
  brand: string
  line: string
  fun: boolean
  video: GrokMedia
}

const NODE_ORDER = ['perfume', 'sneaker', 'cafe', 'brainrot']

export function workCards(clips: GrokMedia[]): WorkCard[] {
  const byNode = new Map<string, GrokMedia[]>()
  for (const c of clips) {
    const list = byNode.get(c.node) ?? []
    list.push(c)
    byNode.set(c.node, list)
  }
  const nodes = [...NODE_ORDER.filter((n) => byNode.has(n)), ...[...byNode.keys()].filter((n) => !NODE_ORDER.includes(n))]
  return nodes.map((node) => {
    const list = byNode.get(node) ?? []
    const video = list.find((v) => v.id === PREFER[node]) ?? list[0]
    const meta = LINES[node] ?? { brand: video.brand || node, line: video.hook || video.persona || '' }
    return { node, brand: meta.brand, line: meta.line, fun: node === 'brainrot' || video.tone === 'brainrot', video }
  })
}
