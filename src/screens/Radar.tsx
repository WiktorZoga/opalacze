import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { MEMES } from '../data/memes'
import { TRENDS, type Platform, type Trend } from '../data/trends'
import { MemeCard } from '../components/MemeCard'
import { Mascot, SpeechBubble } from '../components/Mascot'
import { Sparkline } from '../components/Sparkline'
import { useElapsed } from '../components/AgentSwarm'

const STATUS_STYLE: Record<Trend['status'], string> = {
  'EARLY SIGNAL': 'bg-acid text-black shadow-[0_0_18px_#b6ff00aa]',
  PEAKING: 'bg-amber text-black',
  MAINSTREAM: 'bg-cyan/80 text-black',
  DYING: 'bg-blood/80 text-white',
}

function Counter({ base, rate }: { base: number; rate: number }) {
  const ms = useElapsed('counter', 60)
  return <>{Math.floor(base + (ms / 1000) * rate).toLocaleString('en-US')}</>
}

function RadarSweep() {
  const blips = [
    { x: 62, y: 30, c: '#b6ff00', s: 1.4 },
    { x: 35, y: 58, c: '#b6ff00', s: 1.1 },
    { x: 70, y: 68, c: '#ffb800', s: 0.9 },
    { x: 28, y: 32, c: '#ff2d3d', s: 0.7 },
    { x: 52, y: 80, c: '#ff2d3d', s: 0.7 },
  ]
  return (
    <div className="relative mx-auto h-[300px] w-[300px] rounded-full border border-acid/40 bg-[radial-gradient(circle,#b6ff0012,transparent_70%)]">
      {[0.33, 0.66].map((r) => (
        <div key={r} className="absolute rounded-full border border-acid/20" style={{ inset: `${(r * 100) / 2}%` }} />
      ))}
      <div className="absolute inset-x-0 top-1/2 h-px bg-acid/20" />
      <div className="absolute inset-y-0 left-1/2 w-px bg-acid/20" />
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{ background: 'conic-gradient(from 0deg, #b6ff0066, transparent 25%)' }}
        animate={{ rotate: 360 }}
        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
      />
      {blips.map((b, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{ left: `${b.x}%`, top: `${b.y}%`, width: 10 * b.s, height: 10 * b.s, background: b.c, boxShadow: `0 0 14px ${b.c}` }}
          animate={{ scale: [1, 1.8, 1], opacity: [1, 0.5, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }}
        />
      ))}
    </div>
  )
}

export function PlatformBadge({ platform }: { platform: Platform }) {
  return platform === 'tiktok' ? (
    <span className="rounded-md bg-black px-2 py-0.5 font-display text-[14px] font-bold text-white ring-1 ring-white/20" style={{ textShadow: '-1.5px 0 #00f2ea, 1.5px 0 #ff0050' }}>
      ♪ TikTok
    </span>
  ) : (
    <span className="rounded-md bg-white px-2 py-0.5 font-display text-[14px] font-bold text-black">𝕏 post</span>
  )
}

export function SampleTag({ label = 'SAMPLE DATA' }: { label?: string }) {
  return (
    <span className="rounded border border-amber/60 bg-amber/10 px-2 py-0.5 font-mono text-[11px] font-bold tracking-widest text-amber">
      ⚠ {label}
    </span>
  )
}

function TrendCard({ trend, spotted, index }: { trend: Trend; spotted: boolean; index: number }) {
  const up = trend.growth >= 0
  const color = up ? (trend.status === 'EARLY SIGNAL' ? '#b6ff00' : '#ffb800') : '#ff2d3d'
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0, scale: spotted ? 1.04 : 1 }}
      transition={{ delay: index * 0.08, type: 'spring', stiffness: 200, damping: 20 }}
      className={`relative flex flex-col gap-3 rounded-xl border bg-panel p-5 ${spotted ? 'z-10 border-acid box-glow-acid' : 'border-line'}`}
    >
      <div className="flex items-center justify-between">
        <PlatformBadge platform={trend.platform} />
        <a href={trend.url} target="_blank" rel="noreferrer" className="font-mono text-[12px] text-white/50 underline decoration-white/20 hover:text-acid">
          src · {trend.source} ↗
        </a>
      </div>
      <div className="flex items-start gap-4">
        <MemeCard meme={MEMES[trend.memeId]} width={92} />
        <div className="min-w-0 flex-1">
          <div className="font-mono text-[14px] font-bold text-white/50">{trend.ticker}</div>
          <div className="line-clamp-2 font-display text-[21px] font-bold leading-tight text-white">{trend.name}</div>
          <div className="mt-1 line-clamp-2 font-mono text-[12px] leading-snug text-white/55">{trend.caption}</div>
        </div>
      </div>
      <div className="flex justify-between font-mono text-[13px] text-white/70">
        <span>▶ {trend.views}</span>
        <span>{trend.stat}</span>
      </div>
      <div className="flex items-end justify-between">
        <div className="font-mono text-[40px] font-extrabold leading-none" style={{ color, textShadow: `0 0 18px ${color}88` }}>
          {up ? '▲' : '▼'} {Math.abs(trend.growth)}%
        </div>
        <span className={`rounded px-2 py-0.5 font-mono text-[12px] font-extrabold tracking-widest ${STATUS_STYLE[trend.status]}`}>
          {trend.status}
        </span>
      </div>
      <Sparkline data={trend.spark} width={290} height={44} color={color} />
      <AnimatePresence>
        {spotted && (
          <motion.div
            initial={{ opacity: 0, scale: 1.6 }}
            animate={{ opacity: 1, scale: 1 }}
            className="pointer-events-none absolute -inset-3 rounded-2xl"
          >
            {['left-0 top-0 border-l-4 border-t-4', 'right-0 top-0 border-r-4 border-t-4', 'left-0 bottom-0 border-l-4 border-b-4', 'right-0 bottom-0 border-r-4 border-b-4'].map((c) => (
              <div key={c} className={`absolute h-8 w-8 border-hot ${c}`} />
            ))}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded bg-hot px-3 py-0.5 font-mono text-[13px] font-extrabold tracking-widest text-black">
              ◎ TARGET ACQUIRED
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export function Radar() {
  const [spotted, setSpotted] = useState(false)
  useEffect(() => {
    const id = setTimeout(() => setSpotted(true), 1700)
    return () => clearTimeout(id)
  }, [])
  const cards = TRENDS.slice(0, 6)

  return (
    <div className="grid-bg relative flex h-full gap-8 p-8">
      <div className="flex w-[340px] shrink-0 flex-col gap-6">
        <div>
          <div className="font-mono text-[13px] tracking-[0.3em] text-hot glow-hot">SCREEN 01</div>
          <h1 className="font-display text-[54px] font-bold leading-none text-white">
            TREND <span className="text-acid glow-acid">RADAR</span>
          </h1>
          <p className="mt-2 font-mono text-[15px] text-white/55">Scout watches TikTok + X and catches memes before they're memes</p>
          <p className="mt-2 font-mono text-[12px] tracking-widest text-cyan">FEED · WEEK OF 2–5 NOV 2026</p>        </div>
        <RadarSweep />
        <div className="space-y-3 font-mono">
          {[
            ['POSTS SCANNED', <Counter key="a" base={14_203_118} rate={233} />, 'text-acid'],
            ['SIGNALS / HR', <Counter key="b" base={1_042} rate={1.3} />, 'text-cyan'],
            ["EARLY SIGNALS", "3", "text-hot"],
          ].map(([k, v, c]) => (
            <div key={k as string} className="flex items-baseline justify-between border-b border-line pb-2">
              <span className="text-[13px] tracking-widest text-white/45">{k}</span>
              <span className={`text-[26px] font-extrabold ${c}`}>{v}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="relative grid flex-1 grid-cols-3 content-start gap-6">
        {cards.map((t, i) => (
          <TrendCard key={t.id} trend={t} index={i} spotted={spotted && t.id === 't1'} />
        ))}
        <AnimatePresence>
          {spotted && (
            <motion.div
              initial={{ x: 700, y: -260, rotate: -30, opacity: 0 }}
              animate={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 90, damping: 14 }}
              className="absolute left-[250px] top-[300px] z-20 flex items-center gap-3"
            >
              <Mascot id="scout" size={104} active />
              <SpeechBubble id="scout" text="COO! EARLY SIGNAL. nobody's posted this yet 👀" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
