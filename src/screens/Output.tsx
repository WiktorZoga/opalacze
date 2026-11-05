import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import post from '../../generations/gen-003/post.json'
import metrics from '../../generations/gen-003/metrics.json'
import liveStoryboard from '../../generations/gen-live-001/media/storyboard.json'
import { LIVE_IMAGE } from '../data/lineage'
import { LIVE_RUN } from '../data/runs'
import { BRANDS, type BrandPreset } from '../data/brands'
import { MemeCard } from '../components/MemeCard'
import { useElapsed } from '../components/hooks'
import { Badge, Panel } from '../components/ui'

const RENDER_COMMIT = LIVE_RUN.spans[LIVE_RUN.spans.length - 1].commit?.hash ?? ''


const n = (v: number) => (v >= 1e6 ? `${(v / 1e6).toFixed(1)}M` : `${Math.round(v / 1e3)}K`)
const pct = (v: number) => `${Math.round(v * 100)}%`

function Certificate() {
  const rows: [string, string][] = [
    ['Name', 'Krasnal Night Check'],
    ['Generation', 'gen-live-001 (4)'],
    ['Mother', 'bronze-krasnal'],
    ['Father', 'midnight-vape-sound-check'],
    ['Mutated', 'hook · audio · visual · catchphrase'],
    ['Critic', 'round 2 · fine. ship it.'],
    ['Rendered', liveStoryboard.model],
    ['Commit', RENDER_COMMIT],
  ]
  return (
    <motion.div
      initial={{ x: 40, opacity: 0, rotate: 3 }}
      animate={{ x: 0, opacity: 1, rotate: -1 }}
      transition={{ type: 'spring', stiffness: 160, damping: 18 }}
      className="glow-acid w-[300px] rounded-xl border border-accent/50 bg-[radial-gradient(circle_at_30%_0%,#b6ff0014,transparent_60%)] p-5"
    >
      <div className="text-center font-mono text-[10px] tracking-[0.3em] text-accent/80">ROT BOT GENOME REGISTRY</div>
      <div className="mt-1 text-center text-[20px] font-semibold leading-tight text-text">Certificate of Meme Birth</div>
      <div className="my-3 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent" />
      <div className="space-y-1.5">
        {rows.map(([k, v]) => (
          <div key={k} className="flex justify-between gap-3 text-[12px]">
            <span className="text-faint">{k}</span>
            <span className="truncate text-right font-mono text-text">{v}</span>
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-between">
        <span className="font-mono text-[10px] text-faint">born 05.11.2026 · Wrocław</span>
        <span className="-rotate-6 rounded border-2 border-accent px-2 py-0.5 font-meme text-[14px] uppercase text-accent">🐱 approved</span>
      </div>
    </motion.div>
  )
}

function Artifact() {
  const ms = useElapsed('hatch', 50)
  const cracked = ms > 1300
  const hatched = ms > 1900
  return (
    <Panel title="Artifact" meta={liveStoryboard.genomeId}>
      <div className="flex items-start gap-5 p-5">
        <div className="relative h-[480px] w-[270px] shrink-0">
          <AnimatePresence>
            {!hatched && (
              <motion.div
                key="egg"
                className="absolute inset-0 flex items-center justify-center rounded-md border border-line bg-[radial-gradient(circle,#b6ff0022,transparent_65%)]"
                exit={{ opacity: 0, scale: 1.3 }}
                transition={{ duration: 0.25 }}
              >
                <motion.span
                  className="relative text-[150px] leading-none"
                  animate={{ rotate: cracked ? [0, -14, 14, -10, 0] : [0, -5, 5, 0] }}
                  transition={{ duration: cracked ? 0.3 : 0.6, repeat: Infinity }}
                >
                  🥚
                  {cracked && (
                    <svg viewBox="0 0 100 40" className="absolute left-[18%] top-[42%] w-[64%]">
                      <path d="M0 20 L15 8 L28 26 L42 6 L56 28 L70 8 L84 24 L100 12" stroke="#111" strokeWidth="4" fill="none" />
                    </svg>
                  )}
                </motion.span>
                <span className="absolute bottom-4 font-mono text-[11px] text-muted">{cracked ? 'hatching…' : 'incubating krasnal-night-check'}</span>
              </motion.div>
            )}
          </AnimatePresence>
          {hatched && (
            <motion.img
              src={LIVE_IMAGE}
              alt={liveStoryboard.genomeId}
              className="glow-acid absolute inset-0 h-full w-full rounded-md border border-accent/40 object-cover"
              initial={{ scale: 0.6, opacity: 0, rotate: -4 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            />
          )}
          <AnimatePresence>
            {ms > 1800 && ms < 2400 && (
              <motion.div key="flash" className="absolute -inset-4 z-10 rounded-xl bg-white" initial={{ opacity: 0.9 }} animate={{ opacity: 0 }} transition={{ duration: 0.5 }} />
            )}
          </AnimatePresence>
          {hatched &&
            ['🧬', '✨', '🍄', '⭐', '🧬', '✨', '🔥', '💸'].map((e, i) => (
              <motion.span
                key={i}
                className="pointer-events-none absolute left-1/2 top-1/2 z-20 text-[26px]"
                initial={{ x: 0, y: 0, opacity: 1 }}
                animate={{ x: Math.cos(i * 0.8) * 190, y: Math.sin(i * 0.8) * 230, opacity: 0, rotate: 200 }}
                transition={{ duration: 1.3, ease: 'easeOut' }}
              >
                {e}
              </motion.span>
            ))}
        </div>
        {ms > 2300 ? (
          <Certificate />
        ) : (
          <div className="w-[300px] pt-40 text-center font-mono text-[12px] text-faint">Mutator · generate_media()</div>
        )}
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
        <div className="mt-5 h-[340px]">
          {brand && progress < 1 && (
            <div className="pt-24">
              <div className="mb-2 font-mono text-[12px] text-muted">splicing {brand.name} into krasnal-ceo-series-a…</div>
              <div className="h-1 overflow-hidden rounded-full bg-line">
                <div className="h-full bg-gradient-to-r from-accent to-hot" style={{ width: `${progress * 100}%` }} />
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
