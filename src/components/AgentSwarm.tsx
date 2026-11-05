import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { AGENTS, AGENT_LIST } from '../data/agents'
import { DIALOGUE, type ScreenId } from '../data/dialogue'
import { Mascot } from './Mascot'

const TYPING_MS = 900

export function useElapsed(resetKey: unknown, tick = 100) {
  const [ms, setMs] = useState(0)
  useEffect(() => {
    const start = performance.now()
    setMs(0)
    const id = setInterval(() => setMs(performance.now() - start), tick)
    return () => clearInterval(id)
  }, [resetKey, tick])
  return ms
}

export function AgentSwarm({ screen, runKey }: { screen: ScreenId; runKey: number }) {
  const ms = useElapsed(`${screen}-${runKey}`)
  const lines = DIALOGUE[screen]
  const shown = lines.filter((l) => ms >= l.at)
  const typing = lines.find((l) => ms >= l.at - TYPING_MS && ms < l.at)
  const speaking = typing?.agent ?? shown[shown.length - 1]?.agent

  return (
    <aside className="flex h-full w-[440px] shrink-0 flex-col border-l border-line bg-panel/80">
      <div className="flex items-center justify-between border-b border-line px-5 py-3">
        <div className="font-mono text-[13px] font-bold tracking-[0.25em] text-acid glow-acid">AGENT SWARM</div>
        <div className="flex items-center gap-2 font-mono text-[12px] text-white/60">
          <span className="h-2 w-2 animate-pulse rounded-full bg-acid" /> 4 GROK BOTS LIVE
        </div>
      </div>
      <div className="flex justify-around border-b border-line px-3 py-4">
        {AGENT_LIST.map((a) => (
          <Mascot key={a.id} id={a.id} size={62} active={speaking === a.id} label />
        ))}
      </div>
      <div className="flex flex-1 flex-col justify-end gap-3 overflow-hidden px-4 py-4">
        <AnimatePresence initial={false}>
          {shown.slice(-7).map((l) => {
            const a = AGENTS[l.agent]
            const border = l.tone === 'reject' ? '#ff2d3d' : l.tone === 'approve' ? '#b6ff00' : `${a.color}66`
            return (
              <motion.div
                key={`${screen}-${l.at}`}
                layout
                initial={{ opacity: 0, x: 40, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                className="flex items-start gap-3"
              >
                <div className="text-[30px] leading-none">{a.emoji}</div>
                <div
                  className="flex-1 rounded-xl rounded-tl-none bg-black/70 px-3 py-2"
                  style={{ border: `1.5px solid ${border}`, boxShadow: l.tone ? `0 0 18px ${border}55` : undefined }}
                >
                  <div className="mb-0.5 font-mono text-[11px] font-bold tracking-widest" style={{ color: a.color }}>
                    {a.name} <span className="text-white/30">· {a.role}</span>
                  </div>
                  <div
                    className={`font-mono text-[16px] leading-snug ${
                      l.tone === 'reject' ? 'font-extrabold text-blood' : l.tone === 'approve' ? 'font-bold text-acid' : l.tone === 'handoff' ? 'text-cyan' : 'text-white/90'
                    }`}
                  >
                    {l.text}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
        <div className="h-8">
          {typing && (
            <div className="flex items-center gap-2 font-mono text-[13px]" style={{ color: AGENTS[typing.agent].color }}>
              <span className="text-[20px]">{AGENTS[typing.agent].emoji}</span>
              {AGENTS[typing.agent].name} is typing
              <span className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ background: AGENTS[typing.agent].color }}
                    animate={{ opacity: [0.2, 1, 0.2], y: [0, -3, 0] }}
                    transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
                  />
                ))}
              </span>
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}
