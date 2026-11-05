import { motion } from 'framer-motion'
import { AGENTS, PIPELINE, type AgentId } from '../data/agents'
import { CAMPAIGNS, TONES, useCampaign } from '../data/campaigns'
import type { Run } from '../data/run'
import { useClock } from '../components/hooks'
import { Avatar, fmtMs } from '../components/ui'
import { BrandLogo } from '../components/Logo'
import { Graph } from './Workflow'

export function BriefPicker({ onOpen }: { onOpen: (id: string) => void }) {
  const { campaign } = useCampaign()
  return (
    <div className="flex gap-1 rounded-full border border-line bg-white/70 p-1 shadow-[0_8px_24px_-16px_rgba(16,24,40,.25)]">
      {CAMPAIGNS.map((c) => {
        const on = c.id === campaign.id
        return (
          <button
            key={c.id}
            onClick={() => onOpen(c.id)}
            className={`flex items-center gap-2 rounded-full px-4 py-2 text-[14px] transition-colors duration-300 ${on ? 'bg-text text-white' : 'text-muted hover:text-text'}`}
          >
            <BrandLogo id={c.id} size={20} />
            {c.brand}
          </button>
        )
      })}
    </div>
  )
}

function agentStatus(run: Run, agent: AgentId, t: number): 'working' | 'handed off' | 'waiting' {
  const mine = run.spans.filter((s) => s.agent === agent)
  if (mine.some((s) => t >= s.start && t < s.end)) return 'working'
  if (mine.some((s) => t >= s.end)) return 'handed off'
  return 'waiting'
}

export function Swarm({ runKey = 0, onOpen, embedded = false }: { runKey?: number; onOpen: (id: string) => void; embedded?: boolean }) {
  const { campaign: c, tone } = useCampaign()
  const run = c.run
  const raw = useClock(`${runKey}-${c.id}`)
  const t = raw % Math.max(run.runMs, 1)
  const liveIdx = run.spans.findIndex((s) => t >= s.start && t < s.end)
  const idx = liveIdx >= 0 ? liveIdx : Math.max(0, run.spans.findLastIndex((s) => t >= s.start))
  const span = run.spans[idx]
  const receiver = AGENTS[span.to]
  const toneLabel = TONES.find((x) => x.id === tone)?.label ?? tone

  return (
    <div className={`flex flex-col px-12 pb-4 pt-3 ${embedded ? 'h-full gap-3 overflow-hidden' : 'h-full gap-5'}`}>
      <div className="flex shrink-0 items-end justify-between gap-10">
        <div>
          <div className="flex items-center gap-2 text-[14px] text-muted">
            <span className={`h-2 w-2 rounded-full ${c.live ? 'bg-accent' : 'bg-faint'}`} />
            {c.live ? `Live run · grok-4.7 · ${c.brand}` : `Replay · ${c.brand}`}
          </div>
          <h1 className="mt-1 text-[56px] font-semibold leading-[0.98] tracking-[-0.045em] text-text">
            Watch the swarm work.
          </h1>
        </div>
        <BriefPicker onOpen={onOpen} />
      </div>

      <div className="flex shrink-0 items-center gap-3 rounded-full border border-line bg-white/80 px-4 py-2 text-[14px] shadow-[0_8px_24px_-18px_rgba(16,24,40,.35)]">
        <BrandLogo id={c.id} size={22} />
        <span className="font-medium text-text">{c.brand}</span>
        <span className="text-faint">·</span>
        <span className="truncate text-muted">{c.audience}</span>
        <span className="text-faint">·</span>
        <span className="text-muted">{toneLabel}</span>
      </div>

      <div className="flex shrink-0 flex-wrap gap-2">
        {PIPELINE.map((p) => {
          const st = agentStatus(run, p.agent, t)
          const a = AGENTS[p.agent]
          const dot = st === 'working' ? 'bg-accent' : st === 'handed off' ? 'bg-[#94a3b8]' : 'bg-line-strong'
          return (
            <span key={p.agent} className="flex items-center gap-1.5 rounded-full border border-line bg-white px-3 py-1 text-[13px]">
              <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
              <span className="font-medium text-text">{a.label}</span>
              <span className="text-muted">{st}</span>
            </span>
          )
        })}
      </div>

      <div className="card shrink-0 py-1">
        <Graph run={run} t={t} />
      </div>

      <div className="card flex shrink-0 items-center gap-6 px-5 py-3">
        <div className="shrink-0">
          <div className="text-[12px] text-muted">Handoff</div>
          <div className="text-[16px] font-medium text-text">
            {AGENTS[span.agent].label} → {receiver.label}
          </div>
        </div>
        <div className="min-w-0 flex-1">
          <div className="font-mono text-[12px] text-accent">{span.name}()</div>
          <div className="truncate text-[15px] text-text">{span.quote}</div>
        </div>
        <div className="shrink-0 text-[13px] text-muted">
          {receiver.label} received <span className="text-text">{span.packet}</span>
        </div>
      </div>

      <div className="mx-auto flex w-[1180px] min-h-0 flex-1 flex-col justify-evenly">
        {run.spans.map((s, i) => {
          const started = t >= s.start
          const done = t >= s.end
          const p = started ? Math.min(1, (t - s.start) / (s.end - s.start)) : 0
          const a = AGENTS[s.agent]
          return (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              title={`${s.name}() · ${s.commit?.hash ? `commit ${s.commit.hash}` : fmtMs(s.end - s.start)}`}
              className={`grid grid-cols-[28px_150px_1fr] items-center gap-5 py-2 ${started ? '' : 'opacity-40'}`}
            >
              <span className={`tabular flex h-7 w-7 items-center justify-center rounded-full text-[12px] ${done ? (s.status === 'rejected' ? 'bg-danger text-white' : 'bg-accent text-white') : 'border border-accent text-accent'}`}>
                {done ? (s.status === 'rejected' ? '✕' : '✓') : i + 1}
              </span>
              <span className="flex items-center gap-2.5">
                <Avatar id={s.agent} size={26} />
                <span className="text-[15px] font-medium text-text">{a.label}</span>
              </span>
              <span className="min-w-0">
                <span className={`block truncate text-[17px] ${s.status === 'rejected' ? 'text-danger' : 'text-text'}`}>{s.quote}</span>
                {started && !done && (
                  <span className="mt-1 block h-[3px] w-full overflow-hidden rounded-full bg-line">
                    <span className="block h-full bg-accent" style={{ width: `${p * 100}%` }} />
                  </span>
                )}
              </span>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
