import { AnimatePresence, motion } from 'framer-motion'
import { MEMES } from '../data/memes'
import { useElapsed } from '../components/AgentSwarm'
import { Helix } from '../components/Helix'
import { MemeCard } from '../components/MemeCard'
import { Mascot, SpeechBubble } from '../components/Mascot'

export const BREED_T = {
  slide: 500,
  merge: 1700,
  flash: 2900,
  egg: 3100,
  crack: 4000,
  hatch1: 4400,
  reject: 5200,
  mutate: 6400,
  hatch2: 7600,
  approve: 8500,
  cert: 9000,
}

function Stamp({ text, color, rotate, top = '50%' }: { text: string; color: string; rotate: number; top?: string }) {
  return (
    <motion.div
      initial={{ scale: 3, opacity: 0, rotate: rotate - 20 }}
      animate={{ scale: 1, opacity: 1, rotate }}
      transition={{ type: 'spring', stiffness: 500, damping: 18 }}
      className="pointer-events-none absolute left-1/2 z-30 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-lg border-[6px] px-5 py-2 font-meme text-[54px] uppercase leading-none"
      style={{ top, color, borderColor: color, textShadow: `0 0 20px ${color}`, boxShadow: `0 0 30px ${color}88, inset 0 0 20px ${color}55`, background: '#000a' }}
    >
      {text}
    </motion.div>
  )
}

function Certificate() {
  const rows: [string, string][] = [
    ['NAME', 'Krasnal CEO'],
    ['GENERATION', 'Gen 7'],
    ['MOTHER', 'Corporate Pigeon'],
    ['FATHER', 'Sigma Capybara'],
    ['MUTATION', '+ Wrocław krasnal gene'],
    ['TREND DNA', 'door-prank hook (TikTok)'],
    ['VIRALITY FORECAST', '97 / 100'],
  ]
  return (
    <motion.div
      initial={{ x: 300, opacity: 0, rotate: 6 }}
      animate={{ x: 0, opacity: 1, rotate: -2 }}
      transition={{ type: 'spring', stiffness: 120, damping: 16 }}
      className="w-[420px] rounded-xl border-2 border-acid bg-[#07110a] p-6 box-glow-acid"
    >
      <div className="text-center font-mono text-[12px] tracking-[0.35em] text-acid/70">ROT BOT GENOME REGISTRY</div>
      <div className="mt-1 text-center font-display text-[30px] font-bold leading-tight text-white">Certificate of Meme Birth</div>
      <div className="my-3 h-px bg-acid/40" />
      <div className="space-y-2 font-mono">
        {rows.map(([k, v]) => (
          <div key={k} className="flex justify-between gap-4 text-[15px]">
            <span className="tracking-widest text-white/45">{k}</span>
            <span className="text-right font-bold text-acid">{v}</span>
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-between">
        <div className="font-mono text-[12px] text-white/40">
          #KRSNL-0007
          <br />
          born 05.11.2026 · Wrocław
        </div>
        <div className="rotate-[-8deg] rounded border-2 border-acid px-2 py-1 font-mono text-[13px] font-extrabold text-acid">😼 APPROVED</div>
      </div>
    </motion.div>
  )
}

export function Breeding({ runKey = 0 }: { runKey?: number }) {
  const ms = useElapsed(`breed-${runKey}`, 50)
  const T = BREED_T
  const merged = ms >= T.merge
  const showEgg = ms >= T.egg && ms < T.hatch1
  const cracked = ms >= T.crack
  const showMutant = ms >= T.hatch1 && ms < T.hatch2
  const mutating = ms >= T.mutate && ms < T.hatch2
  const final = ms >= T.hatch2
  const cert = ms >= T.cert

  return (
    <div className="grid-bg relative h-full overflow-hidden">
      <div className="absolute left-12 top-6 z-10">
        <div className="font-mono text-[13px] tracking-[0.3em] text-hot glow-hot">STEP 03 · MUTATOR × CRITIC</div>
        <h1 className="font-display text-[50px] font-bold leading-none text-white">
          MEME <span className="text-hot glow-hot">BREEDING</span>
        </h1>
      </div>

      {/* parents */}
      {!merged &&
        (['pigeon', 'capybara'] as const).map((id, i) => {
          const dir = i === 0 ? -1 : 1
          return (
            <motion.div
              key={id}
              className="absolute top-[150px] flex flex-col items-center gap-3"
              style={{ left: '50%' }}
              initial={{ x: dir * 620 - 140, opacity: 0 }}
              animate={ms >= T.slide ? { x: dir * 200 - 140, opacity: 1, rotate: dir * -6 } : { x: dir * 520 - 140, opacity: 1 }}
              exit={{ scale: 0 }}
              transition={{ type: 'spring', stiffness: 60, damping: 14 }}
            >
              <div className="font-mono text-[14px] font-bold tracking-widest" style={{ color: i === 0 ? '#00f0ff' : '#ffb800' }}>
                {i === 0 ? 'MOTHER' : 'FATHER'}
              </div>
              <MemeCard meme={MEMES[id]} width={280} glow={i === 0 ? 'acid' : 'hot'} />
            </motion.div>
          )
        })}

      {/* merging helix */}
      <AnimatePresence>
        {ms >= T.slide + 300 && ms < T.flash + 200 && (
          <motion.div
            className="absolute left-1/2 top-[110px] -translate-x-1/2"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: merged ? 1.25 : 0.8, rotate: merged ? 180 : 0 }}
            exit={{ opacity: 0, scale: 2 }}
            transition={{ duration: 1.1 }}
          >
            <Helix height={520} width={180} speed={merged ? 7 : 3} strandA="#00f0ff" strandB="#ffb800" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* flash */}
      <AnimatePresence>
        {ms >= T.flash && ms < T.flash + 500 && (
          <motion.div className="absolute inset-0 z-40 bg-white" initial={{ opacity: 1 }} animate={{ opacity: 0 }} transition={{ duration: 0.5 }} />
        )}
      </AnimatePresence>

      {/* egg */}
      <AnimatePresence>
        {showEgg && (
          <motion.div
            className="absolute left-1/2 top-[230px] -translate-x-1/2 text-[240px] leading-none"
            initial={{ scale: 0 }}
            animate={{ scale: 1, rotate: cracked ? [0, -12, 12, -12, 0] : [0, -4, 4, 0] }}
            exit={{ scale: 1.6, opacity: 0 }}
            transition={{ rotate: { duration: 0.4, repeat: Infinity }, scale: { type: 'spring' } }}
          >
            🥚
            {cracked && (
              <svg viewBox="0 0 100 40" className="absolute left-[15%] top-[40%] w-[70%]">
                <path d="M0 20 L15 8 L28 26 L42 6 L56 28 L70 8 L84 24 L100 12" stroke="#000" strokeWidth="3" fill="none" />
              </svg>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* candidates */}
      <div className="absolute inset-0 flex items-center justify-center gap-14 pt-16">
        <AnimatePresence mode="wait">
          {showMutant && (
            <motion.div
              key="mutant"
              className="relative"
              initial={{ scale: 0, y: 80 }}
              animate={
                mutating
                  ? { scale: [1, 1.05, 0.95, 1], x: [0, -10, 10, -6, 0], filter: ['hue-rotate(0deg)', 'hue-rotate(180deg)', 'hue-rotate(360deg)'] }
                  : { scale: 1, y: 0 }
              }
              exit={{ scale: 0, rotate: 30, opacity: 0, transition: { duration: 0.25 } }}
              transition={mutating ? { duration: 0.35, repeat: Infinity } : { type: 'spring', stiffness: 220, damping: 14 }}
            >
              <MemeCard meme={MEMES.mutant1} width={340} gen={7} />
              {ms >= T.reject && <Stamp text="absolutely not" color="#ff2d3d" rotate={-12} />}
            </motion.div>
          )}
          {final && (
            <motion.div
              key="final"
              layout
              className="relative"
              initial={{ scale: 0, y: 120, rotate: -10 }}
              animate={{ scale: 1, y: 0, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 180, damping: 12 }}
            >
              <motion.div
                className="absolute -inset-10 -z-10 rounded-full"
                style={{ background: 'radial-gradient(circle,#b6ff0055,transparent 70%)' }}
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 1.6, repeat: Infinity }}
              />
              <MemeCard meme={MEMES.krasnal} width={380} gen={7} glow="acid" />
              {ms >= T.approve && <Stamp text="approved" color="#b6ff00" rotate={-8} top="72%" />}
            </motion.div>
          )}
        </AnimatePresence>
        {cert && <Certificate />}
      </div>

      {/* confetti */}
      {final &&
        Array.from({ length: 18 }, (_, i) => (
          <motion.div
            key={i}
            className="pointer-events-none absolute left-1/2 top-1/2 text-[34px]"
            initial={{ x: 0, y: 0, opacity: 1 }}
            animate={{ x: Math.cos(i * 0.35) * (380 + (i % 3) * 120), y: Math.sin(i * 0.35) * 320 - 80, opacity: 0, rotate: 360 }}
            transition={{ duration: 1.6, ease: 'easeOut' }}
          >
            {['🧬', '✨', '💸', '🍄', '⭐', '🔥'][i % 6]}
          </motion.div>
        ))}

      {/* mascots */}
      <div className="absolute bottom-6 left-10 flex items-end gap-3">
        <Mascot id="mutator" size={92} active={!final || mutating} />
        {ms >= T.mutate && ms < T.hatch2 + 400 && <SpeechBubble id="mutator" text="FINE. injecting a LOCAL gene 🧪 krasnal z Wrocławia" />}
        {ms < T.flash && <SpeechBubble id="mutator" text="IT'S BREEDING TIME 😈" />}
      </div>
      <div className="absolute bottom-6 right-10 flex flex-row-reverse items-end gap-3">
        <Mascot id="critic" size={92} active={ms >= T.reject} />
        {ms >= T.reject && ms < T.mutate && <SpeechBubble id="critic" text="absolutely not. that's a blob." tone="reject" />}
        {ms >= T.approve && <SpeechBubble id="critic" text="…ok. i hate that i love it." tone="approve" />}
      </div>
    </div>
  )
}
