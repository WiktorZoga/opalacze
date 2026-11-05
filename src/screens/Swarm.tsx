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
    <div className="flex gap-3">
      {CAMPAIGNS.map((c) => {
        const on = c.id === campaign.id
        return (
          <button
            key={c.id}
            onClick={() => onOpen(c.id)}
            className={`flex w-[230px] items-center gap-3 rounded-2xl border px-4 py-3 text-left transition-all duration-300 ${on ? 'border-accent/60 bg-white shadow-[0_12px_30px_-16px_rgba(13,148,136,.55)]' : 'border-line bg-white/60 hover:bg-white'}`}
          >
            <BrandLogo id={c.id} size={36} />
            <div className="min-w-0">
              <div className="truncate text-[15px] font-medium text-text">{c.brand}</div>
              <div className="truncate text-[12px] text-muted">{c.product}</div>
            </div>
          </button>
        )
      })}
    </div>
  )
}

export function Swarm({ runKey = 0, onOpen }: { runKey?: number; onOpen: (id: string) => void }) {
  const { campaign: c } = useCampaign()
  const run = c.run
  const t = useClock(`${runKey}-${c.id}`, run.runMs)
  const shown = run.spans.filter((s) => t >= s.start)

  return (
    <div className="flex h-full flex-col gap-6 px-16 pb-8 pt-8">
      <div className="flex items-end justify-between gap-10">
        <div>
          <div className="flex items-center gap-2 text-[14px] text-muted">
            <span className={`h-2 w-2 rounded-full ${c.live ? 'bg-accent' : 'bg-faint'}`} />
            {c.live ? `${c.live.label} · ${c.brand} brief · ${Math.floor(c.live.realMs / 60000)}m ${Math.round((c.live.realMs % 60000) / 1000)}s` : `Simulated replay · ${c.brand} brief`}
          </div>
          <h1 className="mt-3 text-[60px] font-semibold leading-[1.02] tracking-[-0.035em] text-text">
            The AI ad agency
            <br />
            that rides virals.
          </h1>
          <p className="mt-4 max-w-[760px] text-[18px] leading-relaxed text-muted">
            {c.brand} wants <span className="text-text">{c.goal}</span> with {c.audience}. Six Grok Bot agents take it from brief to ad.
          </p>
        </div>
        <BriefPicker onOpen={onOpen} />
      </div>

      <div className="card">
        <div className="flex items-center justify-between px-8 pt-6">
          <h2 className="text-[20px] font-semibold tracking-[-0.02em] text-text">Watch the swarm work</h2>
          <span className="tabular font-mono text-[13px] text-faint">{t < run.runMs ? 'running' : 'done'} · {fmtMs(t)}</span>
        </div>
        <div className="-mt-2">
          <Graph run={run} t={t} />
        </div>
      </div>

      <div className="card flex-1 overflow-hidden px-8 py-5">
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
              className="grid grid-cols-[28px_190px_1fr_120px_90px] items-center gap-5 border-b border-line py-2.5 last:border-0"
            >
              <span className={`tabular flex h-7 w-7 items-center justify-center rounded-full text-[12px] ${done ? (s.status === 'rejected' ? 'bg-danger text-white' : 'bg-accent text-white') : 'border border-accent text-accent'}`}>
                {done ? (s.status === 'rejected' ? '✕' : '✓') : i + 1}
              </span>
              <span className="flex items-center gap-2.5">
                <Avatar id={s.agent} size={26} />
                <span className="text-[15px] font-medium text-text">{a.label}</span>
                <span className="text-faint">→</span>
                <span className="text-[13px] text-muted">{AGENTS[s.to].label}</span>
              </span>
              <span className="min-w-0">
                <span className={`block truncate text-[15px] ${s.status === 'rejected' ? 'text-danger' : 'text-text'}`}>{s.quote}</span>
                {!done && (
                  <span className="mt-1 block h-[3px] w-full overflow-hidden rounded-full bg-line">
                    <span className="block h-full bg-accent" style={{ width: `${p * 100}%` }} />
                  </span>
                )}
              </span>
              <span className="font-mono text-[12px] text-faint">{s.name}</span>
              <span className="text-right font-mono text-[12px] text-muted">{s.commit?.hash || (done ? fmtMs(s.end - s.start) : '')}</span>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
