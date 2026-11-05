import { createContext, useContext } from 'react'
import type { AgentId } from './agents'
import type { Run, Span } from './run'
import { TIKTOK_SOURCES, type TikTokSource } from './tiktokSources'
import live2 from './liveRun002.json'
import liveTrend from '../../generations/gen-live-002/trend.json'
import liveCritique from '../../generations/gen-live-002/critique.json'
import liveMutation from '../../generations/gen-live-002/mutation.json'
import liveScript from '../../generations/gen-live-002/script.json'
import liveClip from '../../generations/gen-live-002/media/noir-05-deceive.mp4'

export type Tone = 'ugc' | 'polished' | 'brainrot'
export const TONES: { id: Tone; label: string }[] = [
  { id: 'ugc', label: 'UGC' },
  { id: 'polished', label: 'Polished ad' },
  { id: 'brainrot', label: 'Brainrot' },
]

export interface Campaign {
  id: 'perfume' | 'cafe' | 'brainrot'
  brand: string
  product: string
  audience: string
  goal: string
  tone: Tone
  received: string
  trend: TikTokSource
  fit: number
  runnersUp: { name: string; fit: number; platform: string }[]
  dna: { gene: string; value: string; insert?: boolean }[]
  persona: { name: string; handle: string; style: string; voice: string }
  scripts: Record<Tone, { hook: string; beats: string[]; caption: string }>
  checks: { label: string; result: string; ok: boolean }[]
  reject?: { check: string; note: string; fix: string }
  /** real agent run backing this campaign */
  live?: { label: string; clip: string; persona: string; trendName: string; trendFormat: string; whyItFits: string; session: string; events: number; realMs: number }
  metrics: { variant: string; hookRate: number; watch: number; ctr: number }[]
  /** fallback media ids from public/memes/grok/index.json, per tone */
  fallback: Partial<Record<Tone, string[]>>
  run: Run
}

const src = (id: string) => TIKTOK_SOURCES.find((s) => s.id === id) ?? TIKTOK_SOURCES[0]

type Draft = Omit<Campaign, 'run'>

function buildRun(c: Draft): Run {
  const reject = c.reject ?? { check: 'claims', note: '', fix: '' }
  const steps: { agent: AgentId; name: string; kind: 'tool' | 'llm'; dur: number; packet: string; to: AgentId; say: string; input: unknown; output: unknown; status?: 'rejected'; commit: string }[] = [
    {
      agent: 'scout', name: 'x_trends', kind: 'tool', dur: 2600, packet: 'trend match', to: 'geneticist',
      say: `${c.trend.trendName}: ${c.fit}% brand fit`,
      input: { brief: c.id, audience: c.audience, platform: 'both', limit: 6 },
      output: { pick: c.trend.trendName, views: c.trend.views, fit: c.fit / 100, runnersUp: c.runnersUp.map((r) => `${r.name} (${r.fit}%)`) },
      commit: `spot ${c.trend.trendName.toLowerCase()} for ${c.brand}`,
    },
    {
      agent: 'geneticist', name: 'save_genome', kind: 'tool', dur: 1700, packet: 'creative DNA', to: 'mutator',
      say: `product goes in at: ${c.dna.find((d) => d.insert)?.value ?? 'beat 2'}`,
      input: { kind: 'parent', trend: c.trend.id },
      output: Object.fromEntries(c.dna.map((d) => [d.gene, d.value])),
      commit: `sequence ${c.trend.id} creative DNA`,
    },
    {
      agent: 'mutator', name: 'write_script', kind: 'llm', dur: 2000, packet: 'script A/B', to: 'critic',
      say: `persona ${c.persona.name}, hook: “${c.scripts[c.tone].hook}”`,
      input: { persona: c.persona.handle, tone: c.tone, product: c.product },
      output: { hook: c.scripts[c.tone].hook, beats: c.scripts[c.tone].beats, variants: ['A', 'B'] },
      commit: `script ${c.id} variants A/B`,
    },
    {
      agent: 'critic', name: 'review', kind: 'llm', dur: 1600, packet: `fix: ${reject.check}`, to: 'mutator', status: 'rejected',
      say: `absolutely not. ${reject.note}`,
      input: { variants: ['A', 'B'], checks: ['trend fidelity', 'brand safety', 'claims', 'disclosure'] },
      output: { verdict: 'absolutely not', failed: reject.check, note: reject.note },
      commit: `reject ${c.id} script (${reject.check})`,
    },
    {
      agent: 'mutator', name: 'generate_media', kind: 'tool', dur: 2400, packet: 'variants A/B', to: 'critic',
      say: reject.fix,
      input: { kind: 'video', aspectRatio: '9:16', durationSeconds: 8, variants: 2, fix: reject.check },
      output: { rendered: 2, model: 'grok-imagine-video', label: '#ad · AI-generated' },
      commit: `render ${c.id} A/B (9:16)`,
    },
    {
      agent: 'critic', name: 'review', kind: 'llm', dur: 1300, packet: 'approved', to: 'publisher',
      say: 'fine. ship it. disclosure is on screen.',
      input: { round: 2 },
      output: Object.fromEntries(c.checks.map((k) => [k.label, k.result])),
      commit: `approve ${c.id} A/B`,
    },
    {
      agent: 'publisher', name: 'publish_post', kind: 'tool', dur: 1500, packet: 'scheduled', to: 'analyst',
      say: 'scheduled: TikTok 19:00, Reels 19:30, X 20:00 (simulated)',
      input: { platforms: ['tiktok', 'reels', 'x'], dryRun: true },
      output: { status: 'scheduled (simulated)', disclosure: '#ad · AI-generated' },
      commit: `schedule ${c.id} posts (dry-run)`,
    },
    {
      agent: 'analyst', name: 'read_metrics', kind: 'tool', dur: 1800, packet: 'next variant', to: 'scout',
      say: `variant ${c.metrics[0].ctr >= c.metrics[1].ctr ? 'A' : 'B'} wins on CTR (simulated)`,
      input: { window: '24h', source: 'simulated' },
      output: Object.fromEntries(c.metrics.map((m) => [`variant ${m.variant}`, { hookRate: m.hookRate, watch: m.watch, ctr: m.ctr }])),
      commit: `score ${c.id} A/B → next variant`,
    },
  ]
  let t = 300
  const spans: Span[] = steps.map((s, i) => {
    const span: Span = {
      id: `${c.id}-${i + 1}`,
      agent: s.agent,
      name: s.name,
      kind: s.kind,
      start: t,
      end: t + s.dur,
      status: s.status ?? 'ok',
      to: s.to,
      packet: s.packet,
      input: s.input,
      output: s.output,
      commit: { hash: '', agent: s.agent, message: s.commit, path: `campaigns/${c.id}/` },
      quote: s.say,
    }
    t += s.dur + 400
    return span
  })
  return { id: `campaign-${c.id}`, label: `${c.brand} · campaign`, genome: `${c.id}-ugc-v1`, spans, runMs: t + 400, skipped: [] }
}

const LIVE_SAY = [
  `${liveTrend.name}: ${liveTrend.brandFitPercent}% brand fit (recorded trend snapshot)`,
  'both genomes sequenced: trend + NOIR/05 brand seed',
  `persona ${liveScript.persona.name} (AI) · ${liveScript.durationSeconds}s script`,
  `${liveCritique.verdict} ${liveCritique.trendFidelity} · ${liveCritique.brandSafe} · ${liveCritique.claimsCheck} · ${liveCritique.disclosure}`,
  'rendered noir-05-deceive.mp4 · 9:16 · grok-imagine',
]
const LIVE_PACKETS = ['trend match', 'creative DNA', 'script + persona', 'approved', 'UGC clip']

function liveRun(): Run {
  let t = 300
  const spans: Span[] = live2.spans.map((s, i) => {
    const agent = s.agent as AgentId
    const dur = Math.min(3400, Math.max(1300, (s.end - s.start) / 14))
    const primary = s.tools.find((x) => x.name !== 'commit_artifact') ?? s.tools[0]
    const commits = s.commits
      .filter((c, j, arr) => arr.findIndex((x) => x.hash === c.hash) === j)
      .map((c) => ({ hash: c.hash, agent, message: c.message, path: '' }))
    const span: Span = {
      id: `live2-${i + 1}`,
      agent,
      name: agent === 'critic' ? 'review' : primary?.name ?? s.description,
      kind: agent === 'critic' ? 'llm' : 'tool',
      start: t,
      end: t + dur,
      status: 'ok',
      to: (live2.spans[i + 1]?.agent ?? agent) as AgentId,
      packet: LIVE_PACKETS[i] ?? 'artifact',
      input: { from: 'overlord', task: s.description },
      output: primary?.result ?? null,
      commit: commits[commits.length - 1],
      commits,
      realMs: s.end - s.start,
      task: s.description,
      tools: s.tools,
      quote: LIVE_SAY[i] ?? s.final,
    }
    t += dur + 450
    return span
  })
  return { id: 'gen-live-002', label: 'Live run · grok-4.7', genome: liveMutation.id, spans, runMs: t + 600, skipped: ['publisher', 'analyst'] }
}

const DRAFTS: Draft[] = [
  {
    id: 'perfume',
    brand: 'NOIR/05',
    product: 'eau de parfum, 50 ml',
    audience: 'women 18–30 · TikTok, Reels',
    goal: 'launch awareness · CTR to shop',
    tone: 'ugc',
    received: '18:42',
    trend: src('read-faster-bestie'),
    fit: liveTrend.brandFitPercent,
    runnersUp: [
      { name: 'The Last Dance', fit: 64, platform: 'tiktok' },
      { name: 'Your First Time in a Fancy Cafe', fit: 41, platform: 'tiktok' },
    ],
    dna: [
      { gene: 'hook', value: 'on-screen text dare in the first second' },
      { gene: 'format', value: 'selfie cam, talking to camera' },
      { gene: 'pacing', value: '3 cuts in 8 s, beat drop at 0:04' },
      { gene: 'audio', value: 'trending sound, voice-over on top' },
      { gene: 'caption', value: 'lowercase, one emoji' },
      { gene: 'insertion', value: 'beat 2: spray on wrist, close-up', insert: true },
    ],
    persona: { name: 'Maja', handle: '@maja.smells.things', style: 'GRWM, soft daylight, deadpan', voice: 'dry, quick, honest' },
    scripts: {
      ugc: { hook: 'okay this smells expensive', beats: ['unbox on the bed', 'spray on wrist, close-up', 'deadpan look to camera'], caption: 'okay this smells expensive #ad' },
      polished: { hook: 'Night, bottled.', beats: ['macro bottle on black glass', 'mist in backlight', 'logo lock-up'], caption: 'NOIR/05. Night, bottled. #ad' },
      brainrot: { hook: 'pov: you smell like a 3am decision', beats: ['spray', 'zoom on face', 'bass boost'], caption: 'my aura is now NOIR #ad' },
    },
    checks: [
      { label: 'trend fidelity', result: `${liveCritique.trendFidelity}/10`, ok: true },
      { label: 'brand safety', result: `${liveCritique.brandSafe}/10`, ok: true },
      { label: 'claims', result: `${liveCritique.claimsCheck}/10 · scent notes only`, ok: true },
      { label: 'disclosure', result: `${liveCritique.disclosure}/10 · #ad · AI-generated`, ok: true },
    ],

    metrics: [
      { variant: 'A', hookRate: 0.41, watch: 0.68, ctr: 0.031 },
      { variant: 'B', hookRate: 0.36, watch: 0.61, ctr: 0.024 },
    ],
    live: {
      label: 'Live run · grok-4.7',
      clip: liveClip,
      persona: liveScript.persona.name,
      trendName: liveTrend.name,
      trendFormat: liveTrend.format,
      whyItFits: liveTrend.whyItFits,
      session: live2.session,
      events: live2.eventCount,
      realMs: live2.durationMs,
    },
    fallback: { brainrot: ['noir05-brainrot-capybara', 'brandrot-your-startup'] },
  },
  {
    id: 'cafe',
    brand: 'Kawiarnia Rynek 13',
    product: 'specialty coffee · Wrocław',
    audience: 'students + tourists in Wrocław',
    goal: 'foot traffic this weekend',
    tone: 'ugc',
    received: '18:31',
    trend: src('fancy-cafe-original'),
    fit: 94,
    runnersUp: [
      { name: 'Read Faster, Bestie', fit: 52, platform: 'tiktok' },
      { name: 'The Last Dance', fit: 38, platform: 'tiktok' },
    ],
    dna: [
      { gene: 'hook', value: '“POV: your first time in a fancy cafe”' },
      { gene: 'format', value: 'static wide shot, one awkward action' },
      { gene: 'pacing', value: 'single take, 9 s' },
      { gene: 'audio', value: 'original sound, quiet room tone' },
      { gene: 'caption', value: 'POV text, top third' },
      { gene: 'insertion', value: 'the cup on the table is ours', insert: true },
    ],
    persona: { name: 'Kuba', handle: '@kuba.tries.wroclaw', style: 'student, oversized hoodie, earnest', voice: 'polite, confused' },
    scripts: {
      ugc: { hook: 'POV: your first time in a fancy cafe', beats: ['sits on the table, not the chair', 'barista slides the flat white over', 'he nods like it is normal'], caption: 'pov: first time at Rynek 13 #ad' },
      polished: { hook: 'Slow mornings on the Rynek.', beats: ['latte art top-down', 'window seat, square outside', 'logo'], caption: 'Rynek 13. Slow mornings. #ad' },
      brainrot: { hook: 'flat white. flat face. bronze energy.', beats: ['stare', 'sip', 'zoom'], caption: 'bronze energy only #ad' },
    },
    checks: [
      { label: 'trend fidelity', result: '96%', ok: true },
      { label: 'brand safety', result: 'pass', ok: true },
      { label: 'claims', result: 'none', ok: true },
      { label: 'disclosure', result: '#ad · AI-generated', ok: true },
    ],
    reject: { check: 'trend fidelity', note: 'he sits on the chair. the trend is the table.', fix: 'reblock: he sits on the table, cup in frame' },
    metrics: [
      { variant: 'A', hookRate: 0.47, watch: 0.74, ctr: 0.022 },
      { variant: 'B', hookRate: 0.39, watch: 0.66, ctr: 0.019 },
    ],
    fallback: { brainrot: ['brandrot-wroclaw-cafe'], ugc: [], polished: [] },
  },
  {
    id: 'brainrot',
    brand: 'Kebab u Mustafy',
    product: 'late-night kebab · Wrocław',
    audience: 'Gen Z, after midnight',
    goal: 'range demo: same pipeline, Tone = Brainrot',
    tone: 'brainrot',
    received: '18:20',
    trend: src('monkey-eating-apple'),
    fit: 71,
    runnersUp: [
      { name: 'The Last Dance', fit: 58, platform: 'tiktok' },
      { name: 'Beth Cast Nightwing', fit: 33, platform: 'tiktok' },
    ],
    dna: [
      { gene: 'hook', value: 'AI animal doing a human thing, deadpan' },
      { gene: 'format', value: 'single absurd image + caption' },
      { gene: 'pacing', value: 'loop, 6 s' },
      { gene: 'audio', value: 'crunch ASMR' },
      { gene: 'caption', value: 'ALL CAPS, Impact' },
      { gene: 'insertion', value: 'the kebab is the prophecy', insert: true },
    ],
    persona: { name: 'Mustafa (AI)', handle: '@kebab.prophecy', style: 'mythic, fluorescent light', voice: 'oracle' },
    scripts: {
      ugc: { hook: 'rating every kebab at 3am', beats: ['wrap', 'bite', 'score: 11/10'], caption: '3am review #ad' },
      polished: { hook: 'Since 2003. Open till 4.', beats: ['grill', 'wrap', 'logo'], caption: 'Kebab u Mustafy #ad' },
      brainrot: { hook: '3 AM. THE PROPHECY WAS GARLIC SAUCE.', beats: ['glowing kebab', 'choir', 'cut'], caption: 'the prophecy #ad' },
    },
    checks: [
      { label: 'trend fidelity', result: '81%', ok: true },
      { label: 'brand safety', result: 'pass (no real people)', ok: true },
      { label: 'claims', result: 'none', ok: true },
      { label: 'disclosure', result: '#ad · AI-generated', ok: true },
    ],
    reject: { check: 'brand safety', note: 'no real person’s face as the joke.', fix: 'make the kebab the hero, no faces' },
    metrics: [
      { variant: 'A', hookRate: 0.52, watch: 0.71, ctr: 0.014 },
      { variant: 'B', hookRate: 0.44, watch: 0.63, ctr: 0.012 },
    ],
    fallback: { brainrot: ['brandrot-kebab-u-mustafy', 'brandrot-your-startup'], ugc: ['brandrot-kebab-u-mustafy'], polished: ['brandrot-kebab-u-mustafy'] },
  },
]

export const CAMPAIGNS: Campaign[] = DRAFTS.map((d) => ({ ...d, run: d.live ? liveRun() : buildRun(d) }))

export const CampaignContext = createContext<{ campaign: Campaign; tone: Tone; setTone: (t: Tone) => void }>({
  campaign: CAMPAIGNS[0],
  tone: CAMPAIGNS[0].tone,
  setTone: () => {},
})
export const useCampaign = () => useContext(CampaignContext)
