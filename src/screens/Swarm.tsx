import { motion } from 'framer-motion'
import { AGENTS } from '../data/agents'
import { CAMPAIGNS, useCampaign } from '../data/campaigns'
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

export function Swarm({ runKey = 0, onOpen, embedded = false }: { runKey?: number; onOpen: (id: string) => void; embedded?: boolean }) {
  const { campaign: c } = useCampaign()
  const run = c.run
  const t = useClock(`${runKey}-${c.id}`, run.runMs)
  const shown = run.spans.filter((s) => t >= s.start)

  return (
    <div className={`flex flex-col px-16 pb-6 pt-5 ${embedded ? 'h-full gap-5 overflow-hidden' : 'h-full gap-8'}`}>
      <div className="flex items-end justify-between gap-10">
        <div>
          <div className="flex items-center gap-2 text-[14px] text-muted">
            <span className={`h-2 w-2 rounded-full ${c.live ? 'bg-accent' : 'bg-faint'}`} />
            {c.live ? `Live run · grok-4.7 · ${c.brand}` : `Replay · ${c.brand}`}
          </div>
          <h1 className="mt-4 text-[76px] font-semibold leading-[0.98] tracking-[-0.045em] text-text">
            Watch the swarm work.
          </h1>
        </div>
        <BriefPicker onOpen={onOpen} />
      </div>

      <div className="card">
        <div className="py-8">
          <Graph run={run} t={t} />
        </div>
      </div>

      <div className="mx-auto w-[1100px] flex-1 overflow-hidden">
        {shown.map((s, i) => {
          const done = t >= s.end
          const p = Math.min(1, (t - s.start) / (s.end - s.start))
          const a = AGENTS[s.agent]
          return (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              title={`${s.name}() · ${s.commit?.hash ? `commit ${s.commit.hash}` : fmtMs(s.end - s.start)}`}
              className="grid grid-cols-[28px_150px_1fr] items-center gap-5 py-2.5"
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
                {!done && (
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
