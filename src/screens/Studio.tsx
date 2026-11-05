import { motion } from 'framer-motion'
import { MEMES } from '../data/memes'
import { useElapsed } from '../components/AgentSwarm'
import { Mascot, SpeechBubble } from '../components/Mascot'
import { Phone } from '../components/Phone'
const CUTS = [
  { meme: MEMES.krasnal, caption: 'pov: the krasnal just raised $40M', stats: ['2.4M', '19K', '88K'] as [string, string, string] },
  { meme: MEMES.krasnalAlt, caption: 'our ai is 300 krasnale in a trenchcoat', stats: ['1.1M', '7.2K', '40K'] as [string, string, string] },
  { meme: { ...MEMES.pigeon, accent: '🧔' }, caption: 'corporate pigeon meets the new ceo', stats: ['640K', '3.1K', '12K'] as [string, string, string] },
]

export function Studio() {
  const ms = useElapsed('studio', 80)
  return (
    <div className="grid-bg relative flex h-full flex-col px-12 py-6">
      <div className="flex items-end justify-between">
        <div>
          <div className="font-mono text-[13px] tracking-[0.3em] text-hot glow-hot">STEP 04 · MUTATOR → VIDEO</div>
          <h1 className="font-display text-[50px] font-bold leading-none text-white">
            SHORT-VIDEO <span className="text-acid glow-acid">STUDIO</span>
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <SpeechBubble id="mutator" text={ms < 2000 ? 'rendering 3 cuts, 9:16, captions burned in…' : 'all cuts ready → publisher 📦'} />
          <Mascot id="mutator" size={76} active />
        </div>
      </div>
      <div className="mt-4 flex flex-1 items-start justify-center gap-12">
        {CUTS.map((c, i) => {
          const ready = ms > 500 + i * 450
          return (
            <motion.div
              key={i}
              className="relative"
              initial={{ y: 60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: i * 0.15, type: 'spring', stiffness: 140, damping: 16 }}
            >
              <Phone meme={c.meme} caption={c.caption} width={290} delay={600 + i * 450} stats={c.stats} />
              {!ready && (
                <div className="absolute inset-2 flex flex-col items-center justify-center rounded-[30px] bg-black/85 font-mono text-acid">
                  <div className="text-[15px] font-bold tracking-widest">RENDERING 9:16</div>
                  <div className="mt-3 h-1.5 w-40 overflow-hidden rounded bg-white/10">
                    <motion.div className="h-full bg-acid" initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: 0.5 + i * 0.45 }} />
                  </div>
                </div>
              )}
              <div className="mt-2 text-center font-mono text-[13px] text-white/50">
                CUT {i + 1} · 0:{String(7 + i * 2).padStart(2, '0')} · <span className="text-acid">{ready ? 'READY' : '…'}</span>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
