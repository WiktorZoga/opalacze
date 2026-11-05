import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { useCampaign, type Campaign } from '../data/campaigns'
import { AGENTS, PIPELINE, type AgentId } from '../data/agents'
import type { Run, Span } from '../data/run'
import { TikTokEmbed } from '../components/TikTokEmbed'
import { useClock, useElapsed } from '../components/hooks'
import { AgentName, Avatar, Badge, CountUp, Json, Panel, StatusDot, fmtMs } from '../components/ui'
import { BrandLogo } from '../components/Logo'

export const GRAPH_W = 1792
const NODE_W = 250
const NODE_H = 104
const NODE_Y = 132
const GRAPH_H = 360
const xs = PIPELINE.map((_, i) => 40 + NODE_W / 2 + i * ((GRAPH_W - 80 - NODE_W) / (PIPELINE.length - 1)))
const xOf = (a: AgentId) => xs[PIPELINE.findIndex((p) => p.agent === a)]
const ease = (p: number) => (p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2)

type NodeState = 'idle' | 'running' | 'done' | 'rejected' | 'skipped'

function nodeState(run: Run, agent: AgentId, t: number): { state: NodeState; span?: Span } {
  if (run.skipped.includes(agent)) return { state: 'skipped' }
  const mine = run.spans.filter((s) => s.agent === agent)
  const active = mine.find((s) => t >= s.start && t < s.end)
  if (active) return { state: active.status === 'rejected' ? 'rejected' : 'running', span: active }
  const done = mine.filter((s) => t >= s.end)
  if (done.length) return { state: 'done', span: done[done.length - 1] }
  return { state: 'idle' }
}

const HOP_MS = 900
const HOP_LABELS = ['trend match', 'creative DNA', 'script + persona', 'approved', 'scheduled', 'next variant']

export function Graph({ run, t }: { run: Run; t: number }) {
  const ambient = useElapsed(run.id, 40)
  const { spans } = run
  const mid = NODE_Y + NODE_H / 2
  const xm = xOf('mutator')
  const xc = xOf('critic')
  const reject = spans.find((s) => s.status === 'rejected')
  const rerollSeen = !!reject && t >= reject.end
  const last = spans[spans.length - 1]
  const hasLoop = run.skipped.length === 0
  const loopSeen = hasLoop && t >= last.end

  const transit = spans
    .map((s, i) => ({ s, prev: spans[i - 1] }))
    .filter(({ s, prev }) => prev && prev.agent !== s.agent)
    .map(({ s, prev }) => ({ from: prev.agent, to: s.agent, label: prev.packet, t0: prev.end - 150, t1: s.start + 450, back: xOf(s.agent) < xOf(prev.agent) }))
    .find((x) => t >= x.t0 && t < x.t1)

  let packet: { x: number; y: number; label: string } | null = null
  if (transit) {
    const e = ease(Math.min(1, Math.max(0, (t - transit.t0) / (transit.t1 - transit.t0))))
    packet = {
      x: xOf(transit.from) + (xOf(transit.to) - xOf(transit.from)) * e,
      y: transit.back ? NODE_Y - Math.sin(e * Math.PI) * 40 : mid,
      label: transit.label,
    }
  } else if (hasLoop && t >= last.end - 100 && t < last.end + 1400) {
    const e = ease(Math.min(1, (t - (last.end - 100)) / 1500))
    packet = { x: xs[xs.length - 1] + (xs[0] - xs[xs.length - 1]) * e, y: mid + NODE_H / 2 + Math.sin(e * Math.PI) * 40, label: last.packet }
  }
  if (!packet) {
    const n = PIPELINE.length
    const hop = Math.floor(ambient / HOP_MS) % n
    const e = ease((ambient % HOP_MS) / HOP_MS)
    const from = PIPELINE[hop].agent
    const to = PIPELINE[(hop + 1) % n].agent
    const back = hop === n - 1
    packet = {
      x: xOf(from) + (xOf(to) - xOf(from)) * e,
      y: back ? mid + Math.sin(e * Math.PI) * 46 : mid,
      label: HOP_LABELS[hop],
    }
  }

  return (
    <div className="relative" style={{ width: GRAPH_W, height: GRAPH_H }}>
      <svg width={GRAPH_W} height={GRAPH_H} className="absolute inset-0">
        <defs>
          <linearGradient id="edge-live" x1="0" x2="1">
            <stop offset="0" stopColor="#2dd4bf" />
            <stop offset="1" stopColor="#3b82f6" />
          </linearGradient>
        </defs>
        {xs.slice(0, -1).map((x, i) => {
          const lit = spans.some((s) => t >= s.start && PIPELINE.findIndex((p) => p.agent === s.agent) > i && !run.skipped.includes(PIPELINE[i + 1].agent))
          return <line key={i} x1={x + NODE_W / 2} x2={xs[i + 1] - NODE_W / 2} y1={mid} y2={mid} stroke={lit ? 'url(#edge-live)' : '#d5dae1'} strokeOpacity={lit ? 0.7 : 1} strokeWidth={lit ? 2 : 1.5} />
        })}
        <path
          d={`M${xc - 60},${NODE_Y} C${xc - 80},${NODE_Y - 44} ${xm + 80},${NODE_Y - 44} ${xm + 60},${NODE_Y}`}
          fill="none"
          stroke={rerollSeen ? '#3b82f6' : '#d5dae1'}
          strokeOpacity={rerollSeen ? 0.8 : 1}
          strokeDasharray="4 4"
          strokeWidth={1.5}
        />
        <path
          d={`M${xs[xs.length - 1]},${NODE_Y + NODE_H} C${xs[xs.length - 1]},${NODE_Y + NODE_H + 54} ${xs[0]},${NODE_Y + NODE_H + 54} ${xs[0]},${NODE_Y + NODE_H}`}
          fill="none"
          stroke={loopSeen ? '#2dd4bf' : '#d5dae1'}
          strokeOpacity={loopSeen ? 0.5 : 1}
          strokeDasharray="4 4"
          strokeWidth={1.5}
        />
      </svg>
      <div className="absolute font-mono text-[11px] text-faint" style={{ left: (xm + xc) / 2 - 50, top: NODE_Y - 50 }}>
        <span className={rerollSeen ? 'text-hot' : 'hidden'}>↺ reroll</span>
      </div>
      <div className="absolute font-mono text-[11px] text-faint" style={{ left: GRAPH_W / 2 - 110, top: GRAPH_H - 22 }}>
        <span className="hidden">metrics → next variant</span>
      </div>

      {PIPELINE.map((p, i) => {
        const { state } = nodeState(run, p.agent, t)
        const a = AGENTS[p.agent]
        const live = state === 'running' || state === 'rejected'
        const ring = state === 'rejected' ? 'glow-danger border-danger/70' : state === 'running' ? 'glow-acid border-accent/70' : state === 'done' ? 'border-accent/30' : 'border-line-strong'
        const said = [...run.spans].reverse().find((sp) => sp.agent === p.agent && t >= sp.start && t < sp.end + 900)
        const line = said?.quote ? { at: said.start, text: said.quote } : undefined
        return (
          <div key={p.agent}>
            <AnimatePresence>
              {line && !run.skipped.includes(p.agent) && (
                <motion.div
                  key={line.at}
                  className="absolute z-20 w-[270px] -translate-x-1/2 rounded-xl border bg-white px-3 py-2 text-[14px] leading-snug text-text shadow-[0_12px_30px_-12px_rgba(16,24,40,.35)]"
                  style={{ left: xs[i], top: 6, borderColor: p.agent === 'critic' && line.text.startsWith('absolutely') ? '#ff3d5a' : `${a.color}99` }}
                  initial={{ opacity: 0, y: 8, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ type: 'spring', stiffness: 420, damping: 26 }}
                >
                  <span className="line-clamp-3">{line.text}</span>
                  <span className="absolute -bottom-[7px] left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 border-b border-r bg-white" style={{ borderColor: 'inherit' }} />
                </motion.div>
              )}
            </AnimatePresence>
            <div
              className={`absolute rounded-2xl border bg-white px-4 py-3 shadow-[0_1px_2px_rgba(16,24,40,.05),0_12px_28px_-18px_rgba(16,24,40,.25)] transition-all duration-300 ${ring}`}
              style={{ left: xs[i] - NODE_W / 2, top: NODE_Y, width: NODE_W, height: NODE_H }}
            >
              <div className="flex items-center gap-3">
                <motion.span
                  className="flex shrink-0 items-center justify-center rounded-lg font-semibold"
                  style={{
                    width: 48,
                    height: 48,
                    fontSize: 18,
                    color: a.color,
                    background: `linear-gradient(135deg, ${a.color}22, #ffffff 80%)`,
                    boxShadow: live ? `0 0 0 2px ${state === 'rejected' ? '#ff3d5a' : a.color}, 0 0 22px ${state === 'rejected' ? '#ff3d5a' : a.color}88` : `0 0 0 1px ${a.color}44`,
                  }}
                  animate={live ? { scale: [1, 1.04, 1] } : { scale: 1 }}
                  transition={{ duration: 1.4, repeat: live ? Infinity : 0, ease: 'easeInOut' }}
                >
                  {a.mono}
                </motion.span>
                <div className="min-w-0">
                  <div className="text-[16px] font-medium text-text">{a.label}</div>

                </div>
              </div>

            </div>
          </div>
        )
      })}

      {packet && (
        <div
          className={`pointer-events-none absolute z-10 flex -translate-x-1/2 -translate-y-1/2 items-center gap-1.5 rounded-full px-3 py-1 font-mono text-[12px] font-medium text-white ${packet.label.startsWith('reroll') || packet.label.startsWith('fix') ? 'glow-hot bg-hot' : 'glow-acid bg-gradient-to-r from-accent to-[#14b8a6]'}`}
          style={{ left: packet.x, top: packet.y }}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-white/80" />
          {packet.label}
        </div>
      )}
    </div>
  )
}

function Trace({ run, t, selected, onSelect }: { run: Run; t: number; selected?: Span; onSelect: (s: Span) => void }) {
  const LABEL_W = 270
  const TRACK_W = 720 - LABEL_W - 150
  const scale = (ms: number) => (ms / run.runMs) * TRACK_W
  const rows = run.spans.filter((s) => t >= s.start)
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((f) => f * run.runMs)
  const realTotal = run.spans.reduce((m, s) => Math.max(m, s.realMs ? s.end : 0), 0)
  return (
    <Panel title="Trace" meta={`${rows.length} / ${run.spans.length} spans${realTotal ? ' · replay compressed' : ''}`} className="h-full">
      <div className="relative px-4 pt-2">
        <div className="relative h-7 font-mono text-[11px] text-faint">
          {ticks.map((ms, i) => (
            <span key={i} className="absolute" style={{ left: LABEL_W + scale(ms) - 4 }}>
              {i === 0 ? 'start' : i === 4 ? 'end' : ''}
            </span>
          ))}
        </div>
        <div className="absolute bottom-0 top-9 w-px bg-accent/50" style={{ left: 16 + LABEL_W + scale(t) }} />
        {rows.map((s) => {
          const done = t >= s.end
          const sel = selected?.id === s.id
          const bar = s.status === 'rejected' ? (done ? 'bg-danger glow-danger' : 'bg-danger/60') : done ? 'bg-gradient-to-r from-accent to-[#5eead4]' : 'bar-running'
          return (
            <button
              key={s.id}
              onClick={() => onSelect(s)}
              className={`flex h-[46px] w-full items-center rounded text-left ${sel ? 'bg-raised' : 'hover:bg-raised/60'}`}
            >
              <div className="flex shrink-0 items-center gap-2.5 pl-2" style={{ width: LABEL_W }}>
                <Avatar id={s.agent} size={20} />
                <span className="w-[78px] text-[13px] text-muted">{AGENTS[s.agent].label}</span>
                <span className="truncate font-mono text-[12px] text-text">{s.name}</span>
                {s.status === 'rejected' && done && <Badge tone="danger">rejected</Badge>}
              </div>
              <div className="relative h-full flex-1">
                <div
                  className={`absolute top-1/2 h-2 -translate-y-1/2 rounded-sm ${bar}`}
                  style={{ left: scale(s.start), width: Math.max(2, scale(Math.min(t, s.end) - s.start)) }}
                />
                {done && (
                  <span className="absolute top-1/2 -translate-y-1/2 font-mono text-[11px] text-faint" style={{ left: scale(s.end) + 8 }}>
                    {fmtMs(s.realMs ?? s.end - s.start)}
                  </span>
                )}
                {done && s.status === 'rejected' && (
                  <motion.span
                    className="glow-danger pointer-events-none absolute top-1/2 z-10 whitespace-nowrap rounded border border-danger bg-danger/15 px-2 py-0.5 text-[12px] font-semibold uppercase tracking-wider text-danger"
                    style={{ left: scale(s.end) + 56 }}
                    initial={{ opacity: 0, scale: 1.25, y: '-50%' }}
                    animate={{ opacity: 1, scale: 1, y: '-50%' }}
                    transition={{ type: 'spring', stiffness: 520, damping: 26 }}
                  >
                    absolutely not
                  </motion.span>
                )}
              </div>
            </button>
          )
        })}
      </div>
    </Panel>
  )
}

function ScoutFeed({ campaign }: { campaign: Campaign }) {
  const tr = campaign.trend
  if (campaign.live) {
    const lv = campaign.live
    return (
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-medium uppercase tracking-wider text-faint">Trend match</span>
          <Badge>recorded trend snapshot</Badge>
        </div>
        <div className="text-[18px] font-medium text-text">{lv.trendName}</div>
        <div className="flex items-baseline gap-2">
          <span className="tabular font-mono text-[34px] leading-none text-accent">{campaign.fit}%</span>
          <span className="text-[12px] text-muted">brand fit · TikTok · velocity 3.6</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-line">
          <div className="h-full bg-gradient-to-r from-accent to-hot" style={{ width: `${campaign.fit}%` }} />
        </div>
        <p className="text-[13px] leading-relaxed text-muted">{lv.trendFormat}</p>
        <p className="line-clamp-4 text-[12px] leading-relaxed text-faint">{lv.whyItFits}</p>
      </div>
    )
  }
  return (
    <div className="flex gap-4">
      <TikTokEmbed source={tr} width={196} showMeta={false} loadTimeoutMs={6000} />
      <div className="min-w-0 flex-1">
        <div className="text-[11px] font-medium uppercase tracking-wider text-faint">Trend match</div>
        <div className="mt-1 text-[15px] font-medium text-text">{tr.trendName}</div>
        <div className="font-mono text-[11px] text-muted">
          @{tr.author} · {Intl.NumberFormat('en', { notation: 'compact' }).format(tr.views)} views · TikTok
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="tabular font-mono text-[34px] leading-none text-accent [text-shadow:0_0_16px_#2dd4bf66]">{campaign.fit}%</span>
          <span className="text-[12px] text-muted">brand fit</span>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-line">
          <div className="h-full bg-gradient-to-r from-accent to-hot" style={{ width: `${campaign.fit}%` }} />
        </div>
        <div className="mt-4 text-[11px] font-medium uppercase tracking-wider text-faint">Runners-up</div>
        {campaign.runnersUp.map((r) => (
          <div key={r.name} className="mt-1.5 flex justify-between text-[12px]">
            <span className="truncate text-muted">{r.name}</span>
            <span className="tabular font-mono text-faint">{r.fit}%</span>
          </div>
        ))}
        <p className="mt-4 line-clamp-4 text-[12px] leading-relaxed text-faint">{tr.whyViral}</p>
      </div>
    </div>
  )
}

function Handoff({ span, campaign }: { span?: Span; campaign: Campaign }) {
  if (!span)
    return (
      <Panel title="Handoff" className="h-full">
        <div className="p-4 text-[13px] text-faint">Waiting for the first span…</div>
      </Panel>
    )
  const commits = span.commits ?? [span.commit]
  return (
    <Panel title="Handoff" meta={commits.map((c) => c?.hash).filter(Boolean).join(' ')} className="h-full">
      <div className="flex h-full flex-col gap-3.5 overflow-hidden p-4">
        <div className="flex items-center gap-3">
          <AgentName id={span.agent} />
          <span className="text-faint">→</span>
          <AgentName id={span.to} />
          <span className="ml-auto">
            <Badge tone={span.status === 'rejected' ? 'danger' : 'accent'}>{span.packet}</Badge>
          </span>
        </div>
        {span.task && (
          <div className="text-[13px] text-muted">
            <span className="text-faint">overlord →</span> “{span.task}”
            <span className="ml-2 font-mono text-[12px] text-faint">{fmtMs(span.realMs ?? 0)}</span>
          </div>
        )}
        {span.agent === 'scout' ? (
          <ScoutFeed campaign={campaign} />
        ) : span.tools ? (
          (
            <>
              <div className="space-y-2">
                {span.tools.slice(0, 3).map((tc, i) => (
                  <div key={i} className="rounded-md border border-line bg-bg px-3 py-2">
                    <div className="mb-1 font-mono text-[12px] text-text">
                      {tc.name}
                      <span className="text-faint">()</span>
                    </div>
                    <Json value={tc.name === 'commit_artifact' ? tc.result : { args: tc.args, result: tc.result }} maxLines={tc.name === 'commit_artifact' ? 3 : 6} />
                  </div>
                ))}
              </div>
              {span.quote && (
                <div className={`rounded-md border-l-2 bg-bg px-4 py-3 text-[14px] leading-relaxed ${span.status === 'rejected' ? 'border-danger text-text' : 'border-accent/60 text-text'}`}>
                  <div className="mb-1 text-[11px] font-medium uppercase tracking-wider text-faint">{span.agent} said</div>
                  <div className="line-clamp-5 whitespace-pre-line">{span.quote.replace(/\n{2,}/g, '\n').replace(/\n\w{7}$/, '')}</div>
                </div>
              )}
            </>
          )
        ) : (
          <>
            <div className="flex items-center gap-2 text-[13px] text-muted">
              <Badge>{span.kind === 'tool' ? 'tool call' : 'llm step'}</Badge>
              <span className="font-mono text-text">{span.name}()</span>
              <span className="ml-auto font-mono text-[12px] text-faint">{fmtMs(span.end - span.start)}</span>
            </div>
            <div>
              <div className="mb-1.5 text-[11px] font-medium uppercase tracking-wider text-faint">Input</div>
              <div className="rounded-md border border-line bg-bg p-3">
                <Json value={span.input} maxLines={8} />
              </div>
            </div>
            <div className="min-h-0 flex-1">
              <div className="mb-1.5 text-[11px] font-medium uppercase tracking-wider text-faint">Output</div>
              <div className={`rounded-md border bg-bg p-3 ${span.status === 'rejected' ? 'border-danger/40' : 'border-line'}`}>
                <Json value={span.output} maxLines={13} />
              </div>
            </div>
          </>
        )}
      </div>
    </Panel>
  )
}

function Commits({ run, t }: { run: Run; t: number }) {
  const done = run.spans
    .filter((s) => t >= s.end)
    .flatMap((s) => (s.commits ?? [s.commit]).map((c) => ({ ...c, agent: s.agent, key: `${s.id}-${c.hash}` })))
    .reverse()
  return (
    <Panel title="Commits" meta="main" className="h-full">
      <div className="flex flex-col overflow-hidden">
        {done.map((c, i) => (
          <div key={c.key} className={`flex gap-3 border-b border-l-2 border-b-line px-4 py-3 ${i === 0 ? 'border-l-accent bg-accent/5' : 'border-l-transparent'}`}>
            <Avatar id={c.agent} size={22} />
            <div className="min-w-0 flex-1">
              <div className="truncate text-[13px] text-text">
                <span className="text-muted">{c.agent}:</span> {c.message}
              </div>
              <div className="mt-0.5 flex gap-2 font-mono text-[11px] text-faint">
                <span className="text-muted">{c.hash || 'sim'}</span>
                <span className="truncate">{c.path}</span>
              </div>
            </div>
          </div>
        ))}
        {!done.length && <div className="p-4 text-[13px] text-faint">No commits yet.</div>}
      </div>
    </Panel>
  )
}

export function Workflow({ runKey = 0 }: { runKey?: number }) {
  const { campaign } = useCampaign()
  const [replay, setReplay] = useState(0)
  const run = campaign.run
  const t = useClock(`${runKey}-${replay}-${campaign.id}`, run.runMs)
  const [pinned, setPinned] = useState<string | null>(null)
  const active = [...run.spans].reverse().find((s) => t >= s.start)
  const selected = (pinned && run.spans.find((s) => s.id === pinned && t >= s.start)) || active
  const running = t < run.runMs

  return (
    <div className="flex h-full flex-col gap-4 p-6">
      <div className="flex items-center gap-4">
        <BrandLogo id={campaign.id} size={40} />
        <h1 className="text-[24px] font-semibold tracking-[-0.02em] text-text">{campaign.brand}</h1>
        <span className="text-[14px] text-muted">{campaign.product}</span>
        {campaign.live ? (
          <span className="rounded-full border border-accent/50 bg-accent/10 px-2.5 py-0.5 text-[12px] text-accent">{campaign.live.label} · {fmtMs(campaign.live.realMs)} real · {campaign.live.events.toLocaleString('en')} events</span>
        ) : (
          <span className="rounded-full border border-line-strong px-2.5 py-0.5 text-[12px] text-faint">simulated replay</span>
        )}
        <span className="flex items-center gap-2 rounded-full border border-line-strong px-2.5 py-0.5 text-[12px] text-muted">
          <StatusDot state={running ? 'running' : 'done'} />
          {running ? 'Agents working' : 'Campaign ready'}
          <span className="tabular font-mono text-faint">{fmtMs(t)}</span>
        </span>
        <span className="ml-auto" />
        <button
          disabled
          title="Roadmap: TikTok Ads API"
          className="cursor-not-allowed rounded-md border border-line-strong px-3 py-1 text-[13px] text-faint"
        >
          Export to TikTok Ads · roadmap
        </button>
        <button
          onClick={() => {
            setPinned(null)
            setReplay((r) => r + 1)
          }}
          className="rounded-md border border-line-strong px-3 py-1 text-[13px] text-muted hover:border-faint hover:text-text"
        >
          Replay
        </button>
      </div>
      <div className="grid grid-cols-5 gap-4">
        {[
          { k: 'Projected reach', v: <CountUp to={campaign.kpis.reach} format={(n) => Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 }).format(n)} />, sim: true },
          { k: 'CTR (best variant)', v: <CountUp to={campaign.kpis.ctr * 100} format={(n) => `${n.toFixed(1)}%`} delay={80} />, sim: true },
          { k: 'Cost per variant', v: <CountUp to={campaign.kpis.costPerVariant} format={(n) => `$${n.toFixed(2)}`} delay={160} />, sim: true },
          { k: 'Variants', v: <CountUp to={campaign.kpis.variants + (campaign.live ? 1 : 0)} format={(n) => `${Math.round(n)}`} delay={240} />, sim: false },
          { k: 'Brief → first cut', v: campaign.live ? `${Math.floor(campaign.live.realMs / 60000)}m ${Math.round((campaign.live.realMs % 60000) / 1000)}s` : '≈ 7 min', sim: !campaign.live },
        ].map((x, i) => (
          <motion.div
            key={x.k}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.3 }}
            className="rounded-lg border border-line bg-surface px-4 py-3"
          >
            <div className="flex items-center justify-between text-[12px] text-faint">
              {x.k}
              {x.sim ? <span className="text-[10px] uppercase tracking-wider">sim</span> : <span className="text-[10px] uppercase tracking-wider text-accent">live</span>}
            </div>
            <div className="tabular mt-1 text-[24px] font-semibold tracking-[-0.02em] text-text">{x.v}</div>
          </motion.div>
        ))}
      </div>
      <div className="panel-sheen rounded-lg border border-line">
        <Graph run={run} t={t} />
      </div>
      <div className="grid min-h-0 flex-1 grid-cols-[720px_1fr_340px] gap-4">
        <Trace run={run} t={t} selected={selected} onSelect={(s) => setPinned(s.id)} />
        <Handoff span={selected} campaign={campaign} />
        <Commits run={run} t={t} />
      </div>
    </div>
  )
}
