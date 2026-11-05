import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { BRANDS, type BrandPreset } from '../data/brands'
import { Helix } from '../components/Helix'
import { MemeCard } from '../components/MemeCard'
import { Mascot, SpeechBubble } from '../components/Mascot'

const GLYPHS = '█▓▒░#@%&$*+=?!'

function scramble(text: string, p: number) {
  return text
    .split('')
    .map((c, i) => (c === ' ' || i / text.length < p ? c : GLYPHS[(i * 7 + Math.floor(p * 40)) % GLYPHS.length]))
    .join('')
}

export function Logo({ big = false }: { big?: boolean }) {
  return (
    <div className="text-center">
      <div className={`font-meme uppercase leading-none ${big ? 'text-[220px]' : 'text-[90px]'}`}>
        <span className="text-white">BRAND</span>
        <span className="text-hot glow-hot">ROT</span>
      </div>
      <div className={`font-mono font-bold text-acid glow-acid ${big ? 'mt-4 text-[46px]' : 'text-[22px]'}`}>Turn any brand into brainrot.</div>
    </div>
  )
}

export function Brandrot({ autoPick = 'kebab', finaleAt }: { autoPick?: string; finaleAt?: number }) {
  const [brand, setBrand] = useState<BrandPreset | null>(null)
  const [input, setInput] = useState('')
  const [progress, setProgress] = useState(1)
  const [finale, setFinale] = useState(false)

  const pick = (b: BrandPreset) => {
    setBrand(b)
    setInput(b.name)
    setProgress(0)
  }

  useEffect(() => {
    const b = BRANDS.find((x) => x.id === autoPick)
    const id = setTimeout(() => b && pick(b), 500)
    return () => clearTimeout(id)
  }, [autoPick])

  useEffect(() => {
    if (progress >= 1) return
    const id = setTimeout(() => setProgress((p) => Math.min(1, p + 0.06)), 60)
    return () => clearTimeout(id)
  }, [progress])

  useEffect(() => {
    if (finaleAt === undefined) return
    const id = setTimeout(() => setFinale(true), finaleAt)
    return () => clearTimeout(id)
  }, [finaleAt])

  const mutating = brand && progress < 1

  return (
    <div className="grid-bg relative flex h-full flex-col px-12 py-6">
      <div className="flex items-end justify-between">
        <div>
          <div className="font-mono text-[13px] tracking-[0.3em] text-hot glow-hot">THE BUSINESS</div>
          <Logo />
        </div>
        <div className="w-[560px]">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              const custom = BRANDS.find((b) => b.name.toLowerCase() === input.toLowerCase()) ?? { ...BRANDS[2], name: input || 'your startup' }
              pick(custom)
            }}
            className="flex gap-2"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="type a brand…"
              className="flex-1 rounded-lg border-2 border-acid/60 bg-black px-4 py-3 font-mono text-[20px] text-acid outline-none focus:border-acid focus:shadow-[0_0_20px_#b6ff0066]"
            />
            <button className="rounded-lg bg-hot px-5 font-mono text-[18px] font-extrabold text-black shadow-[0_0_20px_#ff2bd688]">ROT IT</button>
          </form>
          <div className="mt-3 flex gap-2">
            {BRANDS.map((b) => (
              <button
                key={b.id}
                onClick={() => pick(b)}
                className={`rounded-full border px-3 py-1 font-mono text-[14px] ${brand?.id === b.id ? 'border-acid bg-acid text-black' : 'border-white/30 text-white/70 hover:border-acid'}`}
              >
                {b.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="relative mt-6 flex flex-1 items-center justify-center gap-12">
        {brand && (
          <div className="w-[300px] font-mono">
            <div className="text-[13px] tracking-widest text-white/45">CLIENT</div>
            <div className="font-display text-[38px] font-bold leading-tight text-white">{brand.name}</div>
            <div className="text-[15px] text-white/50">{brand.tagline}</div>
            <div className="mt-5 text-[13px] tracking-widest text-white/45">SPLICE</div>
            <div className="text-[16px] text-acid">brand DNA × Krasnal CEO line (Gen 7)</div>
            <div className="mt-4 h-2 w-full overflow-hidden rounded bg-white/10">
              <div className="h-full bg-gradient-to-r from-acid to-hot" style={{ width: `${progress * 100}%` }} />
            </div>
            <div className="mt-1 text-[12px] text-white/40">{mutating ? 'MUTATING…' : 'GEN 8 · BRANDED · READY TO POST'}</div>
          </div>
        )}
        <AnimatePresence mode="wait">
          {mutating ? (
            <motion.div key="helix" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 1.5 }}>
              <Helix height={420} width={160} speed={8} />
            </motion.div>
          ) : (
            brand && (
              <motion.div key={brand.id + brand.name} className="flex gap-8">
                {brand.memes.map((m, i) => (
                  <motion.div
                    key={m.id}
                    initial={{ scale: 0, rotate: i ? 12 : -12 }}
                    animate={{ scale: 1, rotate: i ? 3 : -3 }}
                    transition={{ delay: i * 0.15, type: 'spring', stiffness: 220, damping: 14 }}
                  >
                    <MemeCard meme={{ ...m, top: scramble(m.top, progress), bottom: scramble(m.bottom, progress) }} width={330} glow={i ? 'hot' : 'acid'} gen={8} />
                  </motion.div>
                ))}
              </motion.div>
            )
          )}
        </AnimatePresence>
      </div>

      <div className="absolute bottom-6 right-10 flex flex-row-reverse items-end gap-3">
        <Mascot id="critic" size={80} active={!mutating} />
        {brand && !mutating && <SpeechBubble id="critic" text="on-brand AND unhinged. approved." tone="approve" />}
      </div>

      <AnimatePresence>
        {finale && (
          <motion.div
            className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-black/95"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div initial={{ scale: 0.6 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 120, damping: 12 }}>
              <Logo big />
            </motion.div>
            <div className="mt-10 font-mono text-[22px] tracking-[0.4em] text-white/50">ROT BOT · MEME GENOME LAB</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
