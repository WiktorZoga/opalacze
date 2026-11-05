import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import post from '../../generations/gen-003/post.json'
import metrics from '../../generations/gen-003/metrics.json'
import liveStoryboard from '../../generations/gen-live-001/media/storyboard.json'
import { LIVE_IMAGE } from '../data/lineage'
import { LIVE_RUN } from '../data/runs'
import { BRANDS, type BrandPreset } from '../data/brands'
import { MemeCard } from '../components/MemeCard'
import { Badge, Panel } from '../components/ui'

const RENDER_COMMIT = LIVE_RUN.spans[LIVE_RUN.spans.length - 1].commit?.hash ?? ''


const n = (v: number) => (v >= 1e6 ? `${(v / 1e6).toFixed(1)}M` : `${Math.round(v / 1e3)}K`)
const pct = (v: number) => `${Math.round(v * 100)}%`

function Artifact() {
  return (
    <Panel title="Artifact" meta={liveStoryboard.genomeId}>
      <div className="flex gap-5 p-5">
        <img src={LIVE_IMAGE} alt={liveStoryboard.genomeId} className="h-[480px] w-[270px] shrink-0 rounded-md border border-line object-cover" />
        <div className="flex min-w-0 flex-col gap-3">
          <div className="flex flex-wrap gap-1.5">
            <Badge tone="accent">{liveStoryboard.model}</Badge>
            <Badge>{liveStoryboard.aspectRatio}</Badge>
            <Badge>live run</Badge>
          </div>
          <div className="text-[13px] text-muted">
            Rendered by <span className="text-text">Mutator</span> after the Critic approved round 2. Committed as{' '}
            <span className="font-mono text-text">{RENDER_COMMIT}</span>.
          </div>
          <div className="text-[11px] font-medium uppercase tracking-wider text-faint">Prompt</div>
          <p className="text-[13px] leading-relaxed text-muted">{liveStoryboard.prompt}</p>
        </div>
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
              <span className="tabular font-mono text-[26px] text-accent">{metrics.fitness.toFixed(2)}</span>
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

function Brandrot({ autoPick = 'kebab' }: { autoPick?: string }) {
  const [brand, setBrand] = useState<BrandPreset | null>(null)
  const [input, setInput] = useState('')
  const [progress, setProgress] = useState(1)

  const pick = (b: BrandPreset) => {
    setBrand(b)
    setInput(b.name)
    setProgress(0)
  }

  useEffect(() => {
    const b = BRANDS.find((x) => x.id === autoPick)
    const id = setTimeout(() => b && pick(b), 1200)
    return () => clearTimeout(id)
  }, [autoPick])

  useEffect(() => {
    if (progress >= 1) return
    const id = setTimeout(() => setProgress((p) => Math.min(1, p + 0.05)), 60)
    return () => clearTimeout(id)
  }, [progress])

  return (
    <Panel title="BRANDROT" meta="brand → meme">
      <div className="p-5">
        <p className="text-[14px] text-muted">Run the same lineage on a brand. The genome stays, the hero and setting change.</p>
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
          <button className="rounded-md bg-accent px-4 text-[14px] font-medium text-black">Generate</button>
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
        <div className="mt-5 h-[340px]">
          {brand && progress < 1 && (
            <div className="pt-24">
              <div className="mb-2 font-mono text-[12px] text-muted">splicing {brand.name} into krasnal-ceo-series-a…</div>
              <div className="h-1 overflow-hidden rounded-full bg-line">
                <div className="h-full bg-accent" style={{ width: `${progress * 100}%` }} />
              </div>
            </div>
          )}
          {brand && progress >= 1 && (
            <div className="flex gap-4">
              {brand.memes.map((m, i) => (
                <motion.div key={m.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.12 }}>
                  <MemeCard meme={m} width={220} />
                  <div className="mt-2 text-[12px] text-muted">{m.name}</div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
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
              BRAND<span className="text-accent">ROT</span>
            </div>
            <div className="mt-5 text-[28px] text-muted">Turn any brand into brainrot.</div>
            <div className="mt-12 font-mono text-[13px] text-faint">ROT BOT · six Grok agents · one git repo · every step a commit</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
