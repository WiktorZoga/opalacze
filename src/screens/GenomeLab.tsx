import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { GENOMES } from '../data/genomes'
import { MEMES } from '../data/memes'
import { Helix } from '../components/Helix'
import { MemeCard } from '../components/MemeCard'
import { Mascot, SpeechBubble } from '../components/Mascot'

const NARRATION: Record<string, string> = {
  pigeon: 'Hook 91. Remixability 95. Extremely fertile specimen.',
  capybara: 'Pure aura. Payoff gene is dominant. Mmm.',
}

export function GenomeLab({ switchAt = 2600 }: { switchAt?: number }) {
  const [specimen, setSpecimen] = useState<'pigeon' | 'capybara'>('pigeon')
  useEffect(() => {
    const id = setTimeout(() => setSpecimen('capybara'), switchAt)
    return () => clearTimeout(id)
  }, [switchAt])
  const genes = GENOMES[specimen]
  const meme = MEMES[specimen]

  return (
    <div className="grid-bg relative flex h-full items-center gap-10 px-12 py-6">
      <div className="flex w-[340px] shrink-0 flex-col gap-4">
        <div>
          <div className="font-mono text-[13px] tracking-[0.3em] text-hot glow-hot">STEP 02 · GENETICIST</div>
          <h1 className="font-display text-[50px] font-bold leading-none text-white">
            GENOME <span className="text-acid glow-acid">LAB</span>
          </h1>
          <p className="mt-2 font-mono text-[14px] text-white/55">extracting the viral DNA of each post</p>
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={specimen}
            initial={{ rotateY: 90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            exit={{ rotateY: -90, opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            <MemeCard meme={meme} width={300} glow="acid" />
            <div className="mt-3 font-mono text-[13px] text-white/60">
              SPECIMEN #{specimen === 'pigeon' ? '4471' : '4472'} · <span className="text-acid">{meme.name}</span>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="relative flex shrink-0 flex-col items-center">
        <Helix height={560} width={170} speed={2.2} />
        <motion.div
          className="pointer-events-none absolute inset-x-0 h-1 bg-acid/80 shadow-[0_0_20px_#b6ff00]"
          animate={{ top: ['0%', '100%', '0%'] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'linear' }}
        />
      </div>

      <div className="flex flex-1 flex-col gap-4">
        <div className="flex items-center justify-between font-mono text-[13px] tracking-widest text-white/50">
          <span>SEQUENCE · 7 GENES</span>
          <span className="text-acid">VIRALITY INDEX {Math.round(genes.reduce((s, g) => s + g.value, 0) / genes.length)}</span>
        </div>
        {genes.map((g, i) => (
          <div key={g.key}>
            <div className="mb-1 flex items-baseline justify-between font-mono">
              <span className="text-[16px] font-extrabold tracking-widest" style={{ color: g.color }}>
                {g.label}
              </span>
              <span className="text-[14px] text-white/60">{g.trait}</span>
            </div>
            <div className="relative h-7 overflow-hidden rounded bg-white/5">
              <motion.div
                key={specimen + g.key}
                className="h-full rounded"
                style={{
                  background: `repeating-linear-gradient(90deg, ${g.color} 0 14px, ${g.color}bb 14px 18px)`,
                  boxShadow: `0 0 16px ${g.color}88`,
                }}
                initial={{ width: 0 }}
                animate={{ width: `${g.value}%` }}
                transition={{ delay: 0.15 + i * 0.12, duration: 0.7, ease: 'easeOut' }}
              />
              <span className="absolute right-2 top-1/2 -translate-y-1/2 font-mono text-[15px] font-extrabold text-white">{g.value}</span>
            </div>
          </div>
        ))}
        <div className="mt-2 flex items-center gap-4">
          <Mascot id="geneticist" size={84} active />
          <AnimatePresence mode="wait">
            <SpeechBubble key={specimen} id="geneticist" text={NARRATION[specimen]} />
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
