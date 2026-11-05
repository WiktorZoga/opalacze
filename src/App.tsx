import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useEffect, useState } from 'react'
import { DIALOGUE, type ScreenId } from './data/dialogue'
import { AGENTS } from './data/agents'
import { Stage } from './components/Stage'
import { useElapsed } from './components/hooks'
import { Avatar } from './components/ui'
import { Logo, WaveMark } from './components/Logo'
import { Workflow } from './screens/Workflow'
import { Lineage } from './screens/Lineage'
import { Creative } from './screens/Creative'
import { Sidebar } from './screens/Sidebar'
import { CAMPAIGNS, CampaignContext, type Tone } from './data/campaigns'
import { DEMO_STEPS } from './demo'

const TABS: { id: ScreenId; label: string; stage: number }[] = [
  { id: 'campaign', label: 'Campaign', stage: 0 },
  { id: 'creative', label: 'Creative', stage: 2 },
  { id: 'history', label: 'History', stage: 1 },
]

function ScreenView({ id, runKey }: { id: ScreenId; demo?: boolean; runKey: number }) {
  switch (id) {
    case 'campaign':
      return <Workflow runKey={runKey} />
    case 'creative':
      return <Creative />
    case 'history':
      return <Lineage />
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
        <span className="text-muted">{AGENTS[line.agent].label}</span>
        <span className="text-text">{line.text}</span>
      </motion.span>
    </AnimatePresence>
  )
}

const params = new URLSearchParams(window.location.search)
const initialDemo = params.has('demo')
const initialScreen = (TABS.find((t) => t.id === params.get('screen'))?.id ?? 'campaign') as ScreenId
const initialCampaign = CAMPAIGNS.find((c) => c.id === params.get('campaign')) ?? CAMPAIGNS[0]

export default function App() {
  const [screen, setScreen] = useState<ScreenId>(initialScreen)
  const [runKey, setRunKey] = useState(0)
  const [demo, setDemo] = useState(initialDemo)
  const [step, setStep] = useState(0)
  const [campaign, setCampaign] = useState(initialCampaign)
  const [tone, setTone] = useState<Tone>((params.get('tone') as Tone) || initialCampaign.tone)
  const openCampaign = useCallback((id: string) => {
    const c = CAMPAIGNS.find((x) => x.id === id)
    if (!c) return
    setCampaign(c)
    setTone(c.tone)
    setScreen('campaign')
    setRunKey((k) => k + 1)
  }, [])

  const go = useCallback((id: ScreenId) => {
    setScreen(id)
    setRunKey((k) => k + 1)
  }, [])

  const goStep = useCallback(
    (i: number, force = false) => {
      const s = Math.max(0, Math.min(DEMO_STEPS.length - 1, i))
      setStep(s)
      const st = DEMO_STEPS[s]
      if (st.campaign) setCampaign(CAMPAIGNS.find((c) => c.id === st.campaign) ?? CAMPAIGNS[0])
      if (st.tone) setTone(st.tone)
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
  const [finale, setFinale] = useState(false)
  useEffect(() => {
    setFinale(false)
    if (!demo || step !== DEMO_STEPS.length - 1) return
    const id = setTimeout(() => setFinale(true), DEMO_STEPS[step].ms - 5000)
    return () => clearTimeout(id)
  }, [demo, step])

  return (
    <Stage>
      <CampaignContext.Provider value={{ campaign, tone, setTone }}>
      <div className="flex h-full flex-col">
        <header className="flex h-14 shrink-0 items-center gap-8 border-b border-line px-6">
          <Logo />
          <nav className="flex h-full items-stretch gap-6">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => !demo && go(t.id)}
                className={`border-b-2 text-[14px] transition-colors ${screen === t.id ? 'border-accent text-text [text-shadow:0_0_12px_#2dd4bf55]' : 'border-transparent text-muted hover:text-text'}`}
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

        <div className="flex min-h-0 flex-1">
        <Sidebar selected={campaign.id} onOpen={(id) => !demo && openCampaign(id)} />
        <main className="relative min-h-0 flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${screen}-${runKey}-${campaign.id}`}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <ScreenView id={screen} demo={demo} runKey={runKey} />
            </motion.div>
          </AnimatePresence>
          <AnimatePresence>
            {finale && (
              <motion.div
                className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-bg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
              >
                <div className="absolute inset-0 bg-[radial-gradient(600px_300px_at_50%_45%,#2dd4bf14,transparent_70%),radial-gradient(700px_300px_at_55%_60%,#3b82f612,transparent_70%)]" />
                <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 120, damping: 14 }} className="relative text-center">
                  <div className="flex items-center justify-center gap-6">
                    <WaveMark size={104} />
                    <div className="text-[120px] font-semibold leading-none tracking-[-0.04em] text-text">Riptide</div>
                  </div>
                  <div className="mt-6 text-[32px] text-muted">The AI ad agency that rides virals.</div>
                  <div className="mt-10 flex items-center justify-center gap-2">
                    {(['scout', 'geneticist', 'mutator', 'critic', 'publisher', 'analyst'] as const).map((a) => (
                      <Avatar key={a} id={a} size={40} />
                    ))}
                  </div>
                  <div className="mt-6 font-mono text-[14px] text-faint">brief → trend → DNA → AI creator → critic → publish → metrics · run by a Grok Bot swarm</div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
          <AnimatePresence mode="wait">
            {caption && !finale && (
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
        </div>

        <footer className="flex h-9 shrink-0 items-center justify-between border-t border-line px-6 text-[12px]">
          <AgentNotes screen={screen} runKey={runKey} />
          <span className="font-mono text-faint">AI-generated creators · metrics simulated · no API keys needed</span>
        </footer>
      </div>
      </CampaignContext.Provider>
    </Stage>
  )
}
