import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useEffect, useState } from 'react'
import { DIALOGUE, type ScreenId } from './data/dialogue'
import { AGENTS } from './data/agents'
import { Stage } from './components/Stage'
import { useElapsed } from './components/hooks'
import { Avatar } from './components/ui'
import { Workflow } from './screens/Workflow'
import { Lineage } from './screens/Lineage'
import { Output } from './screens/Output'
import { DEMO_STEPS } from './demo'

const TABS: { id: ScreenId; label: string; stage: number }[] = [
  { id: 'workflow', label: 'Workflow', stage: 0 },
  { id: 'lineage', label: 'Genome & Lineage', stage: 1 },
  { id: 'output', label: 'Output', stage: 4 },
]

function ScreenView({ id, demo, runKey }: { id: ScreenId; demo: boolean; runKey: number }) {
  switch (id) {
    case 'workflow':
      return <Workflow runKey={runKey} />
    case 'lineage':
      return <Lineage />
    case 'output':
      return <Output finaleAt={demo ? 9500 : undefined} />
  }
}

function AgentNotes({ screen, runKey }: { screen: ScreenId; runKey: number }) {
  const ms = useElapsed(`${screen}-${runKey}`, 200)
  const lines = DIALOGUE[screen] ?? []
  const line = [...lines].reverse().find((l) => ms >= l.at)
  if (!line) return <span />
  return (
    <AnimatePresence mode="wait">
      <motion.span
        key={line.at}
        className="flex items-center gap-2"
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <Avatar id={line.agent} size={18} />
        <span className="capitalize text-muted">{AGENTS[line.agent].id}</span>
        <span className="text-text">{line.text}</span>
      </motion.span>
    </AnimatePresence>
  )
}

const params = new URLSearchParams(window.location.search)
const initialDemo = params.has('demo')
const initialScreen = (TABS.find((t) => t.id === params.get('screen'))?.id ?? 'workflow') as ScreenId

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
    (i: number, force = false) => {
      const s = Math.max(0, Math.min(DEMO_STEPS.length - 1, i))
      setStep(s)
      setScreen((cur) => {
        if (force || cur !== DEMO_STEPS[s].screen) setRunKey((k) => k + 1)
        return DEMO_STEPS[s].screen
      })
    },
    [],
  )

  useEffect(() => {
    if (initialDemo) goStep(0, true)
  }, [goStep])

  useEffect(() => {
    if (!demo || step >= DEMO_STEPS.length - 1) return
    const id = setTimeout(() => goStep(step + 1), DEMO_STEPS[step].ms)
    return () => clearTimeout(id)
  }, [demo, step, goStep])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return
      const idx = TABS.findIndex((t) => t.id === screen)
      if (e.key === 'd' || e.key === 'D') {
        setDemo((d) => {
          if (!d) goStep(0, true)
          return !d
        })
      } else if (e.key === 'Escape') setDemo(false)
      else if (demo && (e.key === ' ' || e.key === 'ArrowRight')) {
        e.preventDefault()
        goStep(step + 1)
      } else if (demo && e.key === 'ArrowLeft') goStep(step - 1)
      else if (!demo && /^[1-9]$/.test(e.key) && TABS[Number(e.key) - 1]) go(TABS[Number(e.key) - 1].id)
      else if (!demo && e.key === 'ArrowRight') go(TABS[(idx + 1) % TABS.length].id)
      else if (!demo && e.key === 'ArrowLeft') go(TABS[(idx + TABS.length - 1) % TABS.length].id)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [demo, step, screen, go, goStep])

  const caption = demo ? DEMO_STEPS[step] : null

  return (
    <Stage>
      <div className="flex h-full flex-col">
        <header className="flex h-14 shrink-0 items-center gap-8 border-b border-line px-6">
          <div className="flex items-baseline gap-3">
            <span className="text-[16px] font-semibold tracking-tight text-text">ROT BOT</span>
            <span className="text-[13px] text-faint">Meme Genome Lab</span>
          </div>
          <nav className="flex h-full items-stretch gap-6">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => !demo && go(t.id)}
                className={`border-b-2 text-[14px] transition-colors ${screen === t.id ? 'border-accent text-text' : 'border-transparent text-muted hover:text-text'}`}
              >
                {t.label}
              </button>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-5 text-[13px] text-muted">
            <span className="flex items-center gap-1.5">
              {(['scout', 'geneticist', 'mutator', 'critic', 'publisher', 'analyst'] as const).map((a) => (
                <Avatar key={a} id={a} size={22} />
              ))}
            </span>
            {demo ? (
              <span className="tabular font-mono text-[12px] text-faint">
                walkthrough {step + 1}/{DEMO_STEPS.length}
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-faint">
                <kbd className="rounded border border-line-strong px-1.5 font-mono text-[11px] text-muted">D</kbd> walkthrough
              </span>
            )}
          </div>
        </header>

        <main className="relative min-h-0 flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${screen}-${screen === 'workflow' ? runKey : runKey}`}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <ScreenView id={screen} demo={demo} runKey={runKey} />
            </motion.div>
          </AnimatePresence>
          <AnimatePresence mode="wait">
            {caption && (
              <motion.div
                key={step}
                className="pointer-events-none absolute bottom-5 left-1/2 z-40 w-[980px] -translate-x-1/2 rounded-lg border border-line-strong bg-raised/95 px-6 py-3.5 shadow-2xl shadow-black/60"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.25 }}
              >
                <div className="flex items-baseline gap-4">
                  <span className="tabular font-mono text-[12px] text-accent">
                    {String(step + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <div className="text-[22px] font-medium leading-snug text-text">{caption.pl}</div>
                    <div className="mt-0.5 text-[14px] text-muted">{caption.en}</div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        <footer className="flex h-9 shrink-0 items-center justify-between border-t border-line px-6 text-[12px]">
          <AgentNotes screen={screen} runKey={runKey} />
          <span className="font-mono text-faint">replay of generations/gen-003 · real trends · metrics simulated · no API keys</span>
        </footer>
      </div>
    </Stage>
  )
}
