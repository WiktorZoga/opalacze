import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import post from '../../generations/gen-003/post.json'
import metrics from '../../generations/gen-003/metrics.json'
import liveStoryboard from '../../generations/gen-live-001/media/storyboard.json'
import { LIVE_IMAGE } from '../data/lineage'
import { LIVE_RUN } from '../data/runs'
import { BRANDS, type BrandPreset } from '../data/brands'
import { MediaFrame } from '../components/MediaFrame'
import { useGrokMedia } from '../data/grokMedia'
import { useElapsed } from '../components/hooks'
import { Badge, Panel } from '../components/ui'

const RENDER_COMMIT = LIVE_RUN.spans[LIVE_RUN.spans.length - 1].commit?.hash ?? ''


const n = (v: number) => (v >= 1e6 ? `${(v / 1e6).toFixed(1)}M` : `${Math.round(v / 1e3)}K`)
const pct = (v: number) => `${Math.round(v * 100)}%`

const STEPS = [
  { label: 'save_genome · krasnal-night-check', at: 0 },
  { label: 'critic review · fine. ship it.', at: 450 },
  { label: `generate_media · ${liveStoryboard.model}`, at: 900, until: 1700 },
  { label: `commit_artifact · ${RENDER_COMMIT}`, at: 1800 },
]
export const REVEAL_AT = 1900

function Steps({ ms, steps }: { ms: number; steps: { label: string; at: number; until?: number }[] }) {
  return (
    <ol className="space-y-1.5">
      {steps.map((st) => {
        const started = ms >= st.at
        const done = st.until ? ms >= st.until : started
        const p = st.until ? Math.min(1, Math.max(0, (ms - st.at) / (st.until - st.at))) : 1
        return (
          <li key={st.label} className={`flex items-center gap-2.5 font-mono text-[12px] ${started ? 'text-text' : 'text-faint'}`}>
            <span className={`flex h-4 w-4 items-center justify-center rounded-full border text-[9px] ${done ? 'border-accent bg-accent text-black' : started ? 'border-accent text-accent' : 'border-line-strong'}`}>
              {done ? '✓' : ''}
            </span>
            <span className="truncate">{st.label}</span>
            {st.until && started && !done && (
              <span className="ml-auto h-1 w-16 overflow-hidden rounded-full bg-line">
                <span className="block h-full bg-gradient-to-r from-accent to-hot" style={{ width: `${p * 100}%` }} />
              </span>
            )}
          </li>
        )
      })}
    </ol>
  )
}

function Row({ k, children }: { k: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[96px_1fr] gap-3 border-b border-line py-2 text-[12px] last:border-0">
      <span className="text-faint">{k}</span>
      <span className="min-w-0 text-text">{children}</span>
    </div>
  )
}

function Artifact() {
  const ms = useElapsed('artifact', 50)
  const ready = ms >= REVEAL_AT
  return (
    <Panel title="Artifact" meta={ready ? 'ready' : 'rendering…'}>
      <div className="flex items-start gap-5 p-5">
        <div className="relative shrink-0">
          {ready ? (
            <MediaFrame src={LIVE_IMAGE} alt={liveStoryboard.genomeId} width={270} height={480} className="glow-acid" />
          ) : (
            <div className="flex h-[480px] w-[270px] flex-col items-center justify-center gap-3 rounded-md border border-line-strong bg-[linear-gradient(110deg,#141416_30%,#1c1c20_50%,#141416_70%)] bg-[length:200%_100%]">
              <span className="font-mono text-[11px] text-muted">9:16 · {liveStoryboard.model}</span>
              <span className="h-1 w-32 overflow-hidden rounded-full bg-line">
                <span className="block h-full bg-gradient-to-r from-accent to-hot" style={{ width: `${Math.min(100, (ms / REVEAL_AT) * 100)}%` }} />
              </span>
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="mb-2 text-[11px] font-medium uppercase tracking-wider text-faint">Pipeline</div>
          <Steps ms={ms} steps={STEPS} />
          <div className="mb-1 mt-5 flex items-center justify-between">
            <span className="text-[11px] font-medium uppercase tracking-wider text-faint">Provenance</span>
            {ready && <Badge tone="accent">published · main</Badge>}
          </div>
          <Row k="Genome">
            <span className="font-mono">{liveStoryboard.genomeId}</span>
          </Row>
          <Row k="Parents">
            <span className="font-mono text-[11px]">bronze-krasnal × midnight-vape-sound-check</span>
          </Row>
          <Row k="Mutated">
            <span className="flex flex-wrap gap-1">
              {['hook', 'audio', 'visual', 'catchphrase'].map((g) => (
                <Badge key={g} tone="accent">{g}</Badge>
              ))}
            </span>
          </Row>
          <Row k="Critic">
            <span className="text-danger">absolutely not</span> <span className="text-faint">→</span> <span className="text-accent">fine. ship it.</span>
          </Row>
          <Row k="Model">
            <span className="font-mono">{liveStoryboard.model} · {liveStoryboard.aspectRatio}</span>
          </Row>
          <Row k="Commit">
            <span className="font-mono">{RENDER_COMMIT}</span> <span className="text-faint">· Mutator 🐊</span>
          </Row>
        </div>
      </div>
      <div className="border-t border-line px-5 py-3">
        <p className="line-clamp-2 text-[12px] leading-relaxed text-faint">
          <span className="text-muted">prompt · </span>
          {liveStoryboard.prompt}
        </p>
      </div>
    </Panel>
  )
}

function Distribution() {
  const rows = (['tiktok', 'x'] as const).map((p) => ({ p, m: metrics.platforms[p] }))
  return (
    <Panel title="Distribution" meta={`gen-003 · ${post.status}`}>
      <div className="divide-y divide-line">
        <div className="px-5 py-3 text-[12px] text-faint">Publishing and analytics were not part of the live run. Shown: the last distributed generation, gen-003.</div>
        <div className="px-5 py-4">
          <div className="flex items-center gap-2">
            <span className="text-[14px] font-medium text-text">TikTok</span>
            <span className="font-mono text-[12px] text-faint">slot {post.tiktok.slotCET} CET</span>
            <span className="ml-auto">
              <Badge>awaiting approval</Badge>
            </span>
          </div>
          <p className="mt-2 text-[14px] text-text">{post.tiktok.caption}</p>
          <p className="mt-1 font-mono text-[12px] text-muted">{post.tiktok.hashtags.map((h) => `#${h}`).join(' ')}</p>
          <p className="mt-1 text-[12px] text-faint">audio: {post.tiktok.audio}</p>
        </div>
        <div className="px-5 py-4">
          <div className="flex items-center gap-2">
            <span className="text-[14px] font-medium text-text">X</span>
            <span className="ml-auto">
              <Badge>awaiting approval</Badge>
            </span>
          </div>
          <p className="mt-2 text-[14px] text-text">{post.x.text}</p>
          <p className="mt-1 text-[12px] text-faint">{post.x.replyCredit}</p>
        </div>
        <div className="px-5 py-4">
          <div className="mb-3 flex items-center gap-2">
            <span className="text-[14px] font-medium text-text">Metrics</span>
            <Badge>{metrics.source}</Badge>
            <span className="ml-auto text-right">
              <span className="tabular font-mono text-[26px] text-accent [text-shadow:0_0_14px_#b6ff0066]">{metrics.fitness.toFixed(2)}</span>
              <span className="ml-2 text-[12px] text-faint">fitness</span>
            </span>
          </div>
          <table className="tabular w-full font-mono text-[13px]">
            <thead className="text-[11px] uppercase tracking-wider text-faint">
              <tr className="text-left">
                <th className="pb-2 font-medium">Platform</th>
                <th className="pb-2 text-right font-medium">Views</th>
                <th className="pb-2 text-right font-medium">Shares</th>
                <th className="pb-2 text-right font-medium">Watch-through</th>
                <th className="pb-2 text-right font-medium">Fitness</th>
              </tr>
            </thead>
            <tbody className="text-muted">
              {rows.map(({ p, m }) => (
                <tr key={p} className="border-t border-line">
                  <td className="py-2 text-text">{p === 'x' ? 'X' : 'TikTok'}</td>
                  <td className="py-2 text-right">{n(m.views)}</td>
                  <td className="py-2 text-right">{n(m.shares)}</td>
                  <td className="py-2 text-right">{pct(m.watchThrough)}</td>
                  <td className="py-2 text-right text-text">{m.fitness.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-3 font-mono text-[11px] text-faint">{metrics.formula}</p>
        </div>
      </div>
    </Panel>
  )
}

const BRAND_STEPS = (_id: string) => [
  { label: 'splice brand seed → krasnal line', at: 0 },
  { label: 'critic review · on-brand', at: 400 },
  { label: 'generate_media · grok-imagine', at: 800, until: 1500 },
]

function Brandrot({ autoPick = 'kebab' }: { autoPick?: string }) {
  const media = useGrokMedia()
  const [brand, setBrand] = useState<BrandPreset | null>(null)
  const [input, setInput] = useState('')
  const [runKey, setRunKey] = useState(0)
  const ms = useElapsed(`brand-${runKey}`, 50)

  const pick = (b: BrandPreset) => {
    setBrand(b)
    setInput(b.name)
    setRunKey((k) => k + 1)
  }

  useEffect(() => {
    const b = BRANDS.find((x) => x.id === autoPick)
    const id = setTimeout(() => b && pick(b), 1200)
    return () => clearTimeout(id)
  }, [autoPick])

  const m = brand ? media[`brandrot-${brand.id}`] : undefined
  const ready = brand && ms >= 1600

  return (
    <Panel title="BRANDROT" meta="brand → meme">
      <div className="p-5">
        <p className="text-[13px] text-muted">Same lineage, your brand. The genome stays; the hero and setting change.</p>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            pick(BRANDS.find((b) => b.name.toLowerCase() === input.toLowerCase()) ?? { ...BRANDS[2], name: input || 'your startup' })
          }}
          className="mt-4 flex gap-2"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Brand name"
            className="flex-1 rounded-md border border-line-strong bg-bg px-3 py-2 text-[14px] text-text outline-none placeholder:text-faint focus:border-muted"
          />
          <button className="rounded-md bg-gradient-to-r from-accent to-hot px-4 text-[14px] font-semibold text-black">Generate</button>
        </form>
        <div className="mt-3 flex flex-wrap gap-2">
          {BRANDS.map((b) => (
            <button
              key={b.id}
              onClick={() => pick(b)}
              className={`rounded-md border px-2.5 py-1 text-[12px] ${brand?.id === b.id ? 'border-muted text-text' : 'border-line text-muted hover:text-text'}`}
            >
              {b.name}
            </button>
          ))}
        </div>
        {brand && (
          <div className="mt-5 flex gap-4">
            {ready ? (
              <MediaFrame key={brand.id + runKey} src={m?.url} kind={m?.kind} alt={brand.name} width={200} height={356} pendingLabel={`grok-imagine render queued · brandrot-${brand.id}`} />
            ) : (
              <div className="flex h-[356px] w-[200px] items-center justify-center rounded-md border border-line-strong bg-raised/60">
                <span className="h-1 w-24 overflow-hidden rounded-full bg-line">
                  <span className="block h-full bg-gradient-to-r from-accent to-hot" style={{ width: `${Math.min(100, (ms / 1600) * 100)}%` }} />
                </span>
              </div>
            )}
            <div className="min-w-0 flex-1">
              <div className="text-[15px] font-medium text-text">{brand.name}</div>
              <div className="mb-3 text-[12px] text-faint">{brand.tagline}</div>
              <Steps ms={ms} steps={BRAND_STEPS(brand.id)} />
              {ready && (
                <div className="mt-4 space-y-1">
                  <Badge tone={m ? 'accent' : 'neutral'}>{m ? 'ready' : 'queued'}</Badge>
                  {m?.prompt && <p className="line-clamp-4 pt-1 text-[12px] leading-relaxed text-muted">{m.prompt}</p>}
                  {m?.model && <p className="font-mono text-[11px] text-faint">{m.model}</p>}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Panel>
  )
}

export function Output({ finaleAt }: { finaleAt?: number }) {
  const [finale, setFinale] = useState(false)
  useEffect(() => {
    if (finaleAt === undefined) return
    const id = setTimeout(() => setFinale(true), finaleAt)
    return () => clearTimeout(id)
  }, [finaleAt])

  return (
    <div className="relative flex h-full flex-col gap-4 p-6">
      <div className="flex items-baseline gap-4">
        <h1 className="text-[22px] font-semibold tracking-tight text-text">Output</h1>
        <span className="text-[13px] text-muted">The meme is the artifact at the end of the run. This one was rendered live by grok-imagine.</span>
      </div>
      <div className="grid min-h-0 flex-1 grid-cols-[640px_1fr_480px] gap-4">
        <Artifact />
        <Distribution />
        <Brandrot />
      </div>
      <AnimatePresence>
        {finale && (
          <motion.div
            className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-bg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-[96px] font-semibold leading-none tracking-tight text-text">
              BRAND<span className="wordmark">ROT</span>
            </div>
            <div className="mt-5 text-[28px] text-muted">Turn any brand into brainrot.</div>
            <div className="mt-12 font-mono text-[13px] text-faint">ROT BOT · six Grok agents · one git repo · every step a commit</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
