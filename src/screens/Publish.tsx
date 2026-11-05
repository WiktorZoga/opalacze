import { motion } from 'framer-motion'
import { MEMES } from '../data/memes'
import { useElapsed } from '../components/AgentSwarm'
import { Mascot, SpeechBubble } from '../components/Mascot'
import { MemeCard } from '../components/MemeCard'
import { Phone } from '../components/Phone'
import { Sparkline } from '../components/Sparkline'
import { PlatformBadge } from './Radar'

const ease = (x: number) => 1 - Math.pow(1 - Math.min(1, Math.max(0, x)), 3)

function Metric({ label, to, ms, start, fmt, color }: { label: string; to: number; ms: number; start: number; fmt: (n: number) => string; color: string }) {
  const v = to * ease((ms - start) / 3200)
  return (
    <div className="rounded-lg border border-line bg-black/50 p-3">
      <div className="font-mono text-[11px] tracking-widest text-white/45">{label}</div>
      <div className="font-mono text-[32px] font-extrabold leading-tight" style={{ color, textShadow: `0 0 14px ${color}66` }}>
        {fmt(v)}
      </div>
    </div>
  )
}

const k = (n: number) => (n >= 1e6 ? `${(n / 1e6).toFixed(2)}M` : n >= 1e3 ? `${(n / 1e3).toFixed(1)}K` : n.toFixed(0))

export function Publish() {
  const ms = useElapsed('publish', 60)
  const posted = ms > 900
  const curve = Array.from({ length: 28 }, (_, i) => Math.pow(i / 27, 2.2) * 100 + Math.sin(i) * 3 + 4)
  const visible = curve.slice(0, Math.max(2, Math.floor(28 * ease((ms - 1200) / 3600))))

  return (
    <div className="grid-bg relative flex h-full gap-10 px-12 py-6">
      <div className="flex w-[720px] shrink-0 flex-col">
        <div className="font-mono text-[13px] tracking-[0.3em] text-hot glow-hot">STEP 05 · PUBLISHER</div>
        <h1 className="font-display text-[50px] font-bold leading-none text-white">
          POST TO <span className="text-acid glow-acid">TIKTOK + X</span>
        </h1>
        <div className="mt-5 flex items-start gap-6">
          <motion.div initial={{ x: -80, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="relative">
            <Phone meme={MEMES.krasnal} caption="pov: the krasnal just raised $40M" width={250} stats={['2.4M', '19K', '88K']} />
            {posted && <PostedBadge />}
          </motion.div>
          <motion.div
            initial={{ x: 80, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="relative w-[420px] rounded-2xl border border-white/15 bg-black p-5"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-acid text-[22px]">🧬</div>
              <div className="font-display">
                <div className="text-[17px] font-bold text-white">ROT BOT Lab</div>
                <div className="text-[14px] text-white/50">@rotbot_lab · 1m</div>
              </div>
              <div className="ml-auto">
                <PlatformBadge platform="x" />
              </div>
            </div>
            <div className="mt-3 font-display text-[18px] leading-snug text-white">
              BREAKING: Wrocław krasnal appointed CEO of AI startup. Product: vibes. Valuation: yes. 🧔📈
            </div>
            <div className="mt-3 flex justify-center rounded-xl bg-white/5 py-3">
              <MemeCard meme={MEMES.krasnal} width={220} gen={7} />
            </div>
            <div className="mt-3 flex justify-between font-mono text-[14px] text-white/60">
              <span>💬 {k(3100 * ease((ms - 1000) / 3000))}</span>
              <span>↻ {k(12400 * ease((ms - 1000) / 3000))}</span>
              <span>♥ {k(88000 * ease((ms - 1000) / 3000))}</span>
              <span>📊 {k(1_400_000 * ease((ms - 1000) / 3000))}</span>
            </div>
            {posted && <PostedBadge />}
          </motion.div>
        </div>
        <div className="mt-auto flex items-end gap-3">
          <Mascot id="publisher" size={84} active={ms < 3000} />
          <SpeechBubble id="publisher" text={posted ? 'POSTED. 2 platforms. 0 humans involved 📣' : 'scheduling for peak scroll hour…'} />
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="font-mono text-[13px] tracking-[0.3em] text-hot glow-hot">STEP 06 · ANALYST</div>
          <span className="font-mono text-[11px] tracking-widest text-white/40">SIMULATED</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Metric label="VIEWS · 48H" to={12_400_000} ms={ms} start={1200} fmt={k} color="#b6ff00" />
          <Metric label="SHARES" to={412_000} ms={ms} start={1300} fmt={k} color="#ff2bd6" />
          <Metric label="AVG WATCH" to={94} ms={ms} start={1400} fmt={(n) => `${n.toFixed(0)}%`} color="#00f0ff" />
          <Metric label="REMIX RATE" to={31} ms={ms} start={1500} fmt={(n) => `+${n.toFixed(0)}%`} color="#ffb800" />
        </div>
        <div className="rounded-lg border border-line bg-black/50 p-4">
          <div className="mb-2 font-mono text-[11px] tracking-widest text-white/45">ENGAGEMENT CURVE · GEN 7</div>
          <Sparkline data={visible} width={560} height={130} color="#b6ff00" />
        </div>
        {ms > 4200 && (
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="rounded-xl border-2 border-[#8b5cff] bg-[#8b5cff14] p-4 shadow-[0_0_30px_#8b5cff55]"
          >
            <div className="font-mono text-[13px] font-extrabold tracking-widest text-[#b9a0ff]">↺ FEEDBACK → GEN 8</div>
            <div className="mt-2 grid grid-cols-3 gap-2 font-mono text-[14px] text-white">
              <span className="text-acid">▲ ABSURDITY</span>
              <span className="text-acid">▲ LOCAL HERO</span>
              <span className="text-blood">▼ BLOB ENERGY</span>
            </div>
          </motion.div>
        )}
        <div className="mt-auto flex items-end gap-3">
          <Mascot id="analyst" size={84} active={ms > 1500} />
          <SpeechBubble id="analyst" text={ms > 4200 ? 'absurdity gene converts 3×. breed more of it.' : 'hoo. numbers going up.'} />
        </div>
      </div>
    </div>
  )
}

function PostedBadge() {
  return (
    <motion.div
      initial={{ scale: 2.5, opacity: 0, rotate: -20 }}
      animate={{ scale: 1, opacity: 1, rotate: -10 }}
      transition={{ type: 'spring', stiffness: 400, damping: 16 }}
      className="absolute -right-4 -top-4 z-20 rounded-lg border-4 border-acid bg-black px-3 py-1 font-meme text-[28px] uppercase text-acid shadow-[0_0_24px_#b6ff00]"
    >
      ✓ posted
    </motion.div>
  )
}
