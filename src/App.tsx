import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useEffect, useState } from 'react'
import type { ScreenId } from './data/dialogue'
import { AgentSwarm } from './components/AgentSwarm'
import { Pipeline } from './components/Pipeline'
import { Stage } from './components/Stage'
import { Ticker } from './components/Ticker'
import { Radar } from './screens/Radar'
import { GenomeLab } from './screens/GenomeLab'
import { Breeding } from './screens/Breeding'
import { Studio } from './screens/Studio'
import { Publish } from './screens/Publish'
import { FamilyTree } from './screens/FamilyTree'
import { Brandrot } from './screens/Brandrot'
import { DEMO_STEPS } from './demo'

const TABS: { id: ScreenId; label: string; stage: number }[] = [
  { id: 'radar', label: 'RADAR', stage: 0 },
  { id: 'genome', label: 'GENOME', stage: 1 },
  { id: 'breed', label: 'BREED', stage: 2 },
  { id: 'studio', label: 'STUDIO', stage: 3 },
  { id: 'publish', label: 'PUBLISH', stage: 4 },
  { id: 'tree', label: 'TREE', stage: 5 },
  { id: 'brand', label: 'BRANDROT', stage: 2 },
]

function ScreenView({ id, demo }: { id: ScreenId; demo: boolean }) {
  switch (id) {
    case 'radar':
      return <Radar />
    case 'genome':
      return <GenomeLab />
    case 'breed':
      return <Breeding />
    case 'studio':
      return <Studio />
    case 'publish':
      return <Publish />
    case 'tree':
      return <FamilyTree />
    case 'brand':
      return <Brandrot finaleAt={demo ? 2600 : undefined} />
  }
}

const initialDemo = new URLSearchParams(window.location.search).has('demo')
const initialScreen = (new URLSearchParams(window.location.search).get('screen') as ScreenId) || 'radar'

export default function App() {
  const [screen, setScreen] = useState<ScreenId>(initialScreen)
  const [runKey, setRunKey] = useState(0)
  const [demo, setDemo] = useState(initialDemo)
  const [step, setStep] = useState(0)

  const go = useCallback((id: ScreenId) => {
    setScreen(id)
    setRunKey((k) => k + 1)
  }, [])

  const goStep = useCallback(
    (i: number) => {
      const s = Math.max(0, Math.min(DEMO_STEPS.length - 1, i))
      setStep(s)
      go(DEMO_STEPS[s].screen)
    },
    [go],
  )

  useEffect(() => {
    if (initialDemo) goStep(0)
  }, [goStep])

  useEffect(() => {
    if (!demo || step >= DEMO_STEPS.length - 1) return
    const id = setTimeout(() => goStep(step + 1), DEMO_STEPS[step].ms)
    return () => clearTimeout(id)
  }, [demo, step, runKey, goStep])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return
      if (e.key === 'd' || e.key === 'D') {
        setDemo((d) => {
          if (!d) goStep(0)
          return !d
        })
      } else if (e.key === 'Escape') setDemo(false)
      else if (demo && (e.key === ' ' || e.key === 'ArrowRight')) {
        e.preventDefault()
        goStep(step + 1)
      } else if (demo && e.key === 'ArrowLeft') goStep(step - 1)
      else if (!demo && /^[1-7]$/.test(e.key)) go(TABS[Number(e.key) - 1].id)
      else if (!demo && e.key === 'ArrowRight') go(TABS[(TABS.findIndex((t) => t.id === screen) + 1) % TABS.length].id)
      else if (!demo && e.key === 'ArrowLeft') go(TABS[(TABS.findIndex((t) => t.id === screen) + TABS.length - 1) % TABS.length].id)
      else if (!demo && (e.key === 'r' || e.key === 'R')) setRunKey((k) => k + 1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [demo, step, screen, go, goStep])

  const tab = TABS.find((t) => t.id === screen)!
  const caption = demo ? DEMO_STEPS[step] : null
  const totalMs = DEMO_STEPS.reduce((s, x) => s + x.ms, 0)
  const doneMs = DEMO_STEPS.slice(0, step).reduce((s, x) => s + x.ms, 0)

  return (
    <Stage>
      <div className="flex h-full flex-col">
        <header className="flex h-[76px] shrink-0 items-center gap-8 border-b border-line bg-black px-8">
          <div className="flex items-baseline gap-3">
            <span className="animate-flicker font-meme text-[44px] leading-none text-acid glow-acid">ROT BOT</span>
            <span className="font-mono text-[13px] tracking-[0.35em] text-hot">MEME GENOME LAB</span>
          </div>
          {!demo ? (
            <nav className="flex gap-1">
              {TABS.map((t, i) => (
                <button
                  key={t.id}
                  onClick={() => go(t.id)}
                  className={`rounded-md px-3 py-2 font-mono text-[14px] font-bold tracking-widest transition ${
                    screen === t.id ? 'bg-acid text-black shadow-[0_0_18px_#b6ff0088]' : 'text-white/55 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <span className="opacity-50">{i + 1}</span> {t.label}
                </button>
              ))}
            </nav>
          ) : (
            <div className="flex flex-1 items-center gap-4">
              <div className="h-2 flex-1 overflow-hidden rounded bg-white/10">
                <motion.div
                  key={step}
                  className="h-full bg-gradient-to-r from-acid to-hot"
                  initial={{ width: `${(doneMs / totalMs) * 100}%` }}
                  animate={{ width: `${((doneMs + DEMO_STEPS[step].ms) / totalMs) * 100}%` }}
                  transition={{ duration: DEMO_STEPS[step].ms / 1000, ease: 'linear' }}
                />
              </div>
              <span className="font-mono text-[14px] text-white/50">
                {step + 1}/{DEMO_STEPS.length}
              </span>
            </div>
          )}
          <div className="ml-auto flex items-center gap-4 font-mono text-[13px] text-white/50">
            <span className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-blood shadow-[0_0_10px_#ff2d3d]" /> LIVE
            </span>
            {!demo && <span className="rounded border border-white/20 px-2 py-1">D = DEMO</span>}
          </div>
        </header>
        <Ticker fast={demo && screen === 'radar'} />
        <div className="flex min-h-0 flex-1">
          <div className="flex min-w-0 flex-1 flex-col">
            <Pipeline stage={tab.stage} />
            <main className="relative min-h-0 flex-1 overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${screen}-${runKey}`}
                  className="absolute inset-0"
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.25 }}
                >
                  <ScreenView id={screen} demo={demo} />
                </motion.div>
              </AnimatePresence>
              <AnimatePresence mode="wait">
                {caption && (
                  <motion.div
                    key={step}
                    className="pointer-events-none absolute inset-x-24 bottom-3 z-40 rounded-2xl border border-white/15 bg-black/80 px-6 py-2.5 text-center backdrop-blur"
                    initial={{ y: 40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                  >
                    <div className="font-display text-[32px] font-bold leading-tight text-white">{caption.pl}</div>
                    <div className="font-mono text-[17px] text-acid">{caption.en}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </main>
          </div>
          <AgentSwarm screen={screen} runKey={runKey} />
        </div>
        <footer className="flex h-[26px] shrink-0 items-center justify-between border-t border-line bg-black px-6 font-mono text-[11px] tracking-widest text-white/35">
          <span>ROT BOT · 6 GROK BOTS · TIKTOK + X</span>
          <span>sample data · metrics simulated · no API keys</span>
          <span>{demo ? 'SPACE/→ NEXT · ← BACK · ESC EXIT' : '1-7 SCREENS · ←/→ · R REPLAY · D DEMO'}</span>
        </footer>
      </div>
    </Stage>
  )
}
