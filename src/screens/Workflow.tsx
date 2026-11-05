import { useState } from 'react'
import { AGENTS, PIPELINE, type AgentId } from '../data/agents'
import type { Run, Span } from '../data/run'
import { LIVE_META, RUNS } from '../data/runs'
import { TIKTOK_SOURCES } from '../data/tiktokSources'
import { TikTokEmbed } from '../components/TikTokEmbed'
import { useClock } from '../components/hooks'
import { AgentName, Avatar, Badge, Json, Panel, StatusDot, fmtMs } from '../components/ui'

const GRAPH_W = 1872
const NODE_W = 216
const NODE_H = 92
const NODE_Y = 56
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

function Graph({ run, t }: { run: Run; t: number }) {
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
      y: transit.back ? NODE_Y - Math.sin(e * Math.PI) * 40 : NODE_Y - 14,
      label: transit.label,
    }
  } else if (hasLoop && t >= last.end - 100 && t < last.end + 1400) {
    const e = ease(Math.min(1, (t - (last.end - 100)) / 1500))
    packet = { x: xs[xs.length - 1] + (xs[0] - xs[xs.length - 1]) * e, y: mid + NODE_H / 2 + Math.sin(e * Math.PI) * 40, label: last.packet }
  }

  return (
    <div className="relative" style={{ width: GRAPH_W, height: 216 }}>
      <svg width={GRAPH_W} height={216} className="absolute inset-0">
        {xs.slice(0, -1).map((x, i) => (
          <line key={i} x1={x + NODE_W / 2} x2={xs[i + 1] - NODE_W / 2} y1={mid} y2={mid} stroke="#2e2e33" strokeWidth={1.5} />
        ))}
        <path
          d={`M${xc - 40},${NODE_Y} C${xc - 60},${NODE_Y - 44} ${xm + 60},${NODE_Y - 44} ${xm + 40},${NODE_Y}`}
          fill="none"
          stroke={rerollSeen ? '#f0605d' : '#2e2e33'}
          strokeOpacity={rerollSeen ? 0.6 : 1}
          strokeDasharray="4 4"
          strokeWidth={1.5}
        />
        <path
          d={`M${xs[xs.length - 1]},${NODE_Y + NODE_H} C${xs[xs.length - 1]},${NODE_Y + NODE_H + 60} ${xs[0]},${NODE_Y + NODE_H + 60} ${xs[0]},${NODE_Y + NODE_H}`}
          fill="none"
          stroke={loopSeen ? '#c8f04a' : '#2e2e33'}
          strokeOpacity={loopSeen ? 0.5 : 1}
          strokeDasharray="4 4"
          strokeWidth={1.5}
        />
      </svg>
      <div className="absolute font-mono text-[11px] text-faint" style={{ left: (xm + xc) / 2 - 50, top: 4 }}>
        <span className={rerollSeen ? 'text-danger' : ''}>reroll · {reject?.packet.replace('reroll: ', '') ?? 'gene'}</span>
      </div>
      <div className="absolute font-mono text-[11px] text-faint" style={{ left: GRAPH_W / 2 - 110, top: 196 }}>
        <span className={loopSeen ? 'text-accent' : ''}>fitness → next generation</span>
      </div>

      {PIPELINE.map((p, i) => {
        const { state, span } = nodeState(run, p.agent, t)
        const border = state === 'running' ? 'border-accent/70' : state === 'rejected' ? 'border-danger/70' : 'border-line-strong'
        return (
          <div
            key={p.agent}
            className={`absolute rounded-lg border bg-raised px-4 py-3 transition-colors duration-300 ${border} ${state === 'skipped' ? 'opacity-45' : ''}`}
            style={{ left: xs[i] - NODE_W / 2, top: NODE_Y, width: NODE_W, height: NODE_H }}
          >
            <div className="flex items-center gap-2.5">
              <Avatar id={p.agent} size={28} />
              <div>
                <div className="text-[14px] font-medium capitalize text-text">{p.agent}</div>
                <div className="text-[12px] text-muted">{AGENTS[p.agent].role}</div>
              </div>
            </div>
            <div className="mt-2.5 flex items-center gap-2 font-mono text-[11px] text-muted">
              <StatusDot state={state === 'skipped' ? 'idle' : state} />
              {state === 'idle' || state === 'skipped'
                ? state === 'skipped' ? 'not in this run' : 'idle'
                : state === 'done'
                  ? `done · ${span!.name}`
                  : `${state === 'rejected' ? 'rejecting' : 'running'} · ${span!.name}`}
            </div>
          </div>
        )
      })}

      {packet && (
        <div
          className="pointer-events-none absolute z-10 flex -translate-x-1/2 -translate-y-1/2 items-center gap-1.5 rounded-full border border-accent/50 bg-bg px-2.5 py-1 font-mono text-[11px] text-accent"
          style={{ left: packet.x, top: packet.y }}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          {packet.label}
        </div>
      )}
    </div>
  )
}

function Trace({ run, t, selected, onSelect }: { run: Run; t: number; selected?: Span; onSelect: (s: Span) => void }) {
  const LABEL_W = 290
  const TRACK_W = 860 - LABEL_W - 90
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
          const bar = s.status === 'rejected' ? 'bg-danger/80' : done ? 'bg-accent/80' : 'bg-accent/40'
          return (
            <button
              key={s.id}
              onClick={() => onSelect(s)}
              className={`flex h-[46px] w-full items-center rounded text-left ${sel ? 'bg-raised' : 'hover:bg-raised/60'}`}
            >
              <div className="flex shrink-0 items-center gap-2.5 pl-2" style={{ width: LABEL_W }}>
                <Avatar id={s.agent} size={20} />
                <span className="w-[82px] text-[13px] capitalize text-muted">{s.agent}</span>
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
              </div>
            </button>
          )
        })}
      </div>
    </Panel>
  )
}

function ScoutFeed({ span }: { span: Span }) {
  const picked = span.quote?.match(/Pick:\s*(\S+)\s*—\s*([^—]+)—\s*(https:\/\/x\.com\/\S+)\s*—\s*@(\S+)\s*—\s*(\d+) views/)
  return (
    <div className="flex flex-col gap-3">
      <div className="text-[11px] font-medium uppercase tracking-wider text-faint">Scanned · TikTok</div>
      <div className="flex gap-4">
        {TIKTOK_SOURCES.slice(0, 2).map((s) => (
          <div key={s.id} className="w-[196px]">
            <TikTokEmbed source={s} width={196} showMeta={false} loadTimeoutMs={6000} />
            <div className="mt-1.5 truncate text-[12px] text-text">{s.trendName}</div>
            <div className="font-mono text-[11px] text-faint">
              @{s.author} · {Intl.NumberFormat('en', { notation: 'compact' }).format(s.views)} views
            </div>
          </div>
        ))}
      </div>
      <div className="text-[11px] font-medium uppercase tracking-wider text-faint">Picked · X via x_trends (live)</div>
      <div className="rounded-md border border-accent/40 bg-bg p-3">
        <div className="text-[14px] text-text">{picked ? picked[2].trim() : 'midnight-vape-sound-check'}</div>
        <div className="mt-0.5 font-mono text-[11px] text-muted">
          {picked ? `@${picked[4]} · ${Intl.NumberFormat('en', { notation: 'compact' }).format(Number(picked[5]))} views · ` : ''}velocity 3.4
        </div>
      </div>
    </div>
  )
}

function Handoff({ span }: { span?: Span }) {
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
        {span.tools ? (
          span.agent === 'scout' ? (
            <ScoutFeed span={span} />
          ) : (
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
          <div key={c.key} className={`flex gap-3 border-b border-line px-4 py-3 ${i === 0 ? 'bg-raised/50' : ''}`}>
            <Avatar id={c.agent} size={22} />
            <div className="min-w-0 flex-1">
              <div className="truncate text-[13px] text-text">
                <span className="text-muted">{c.agent}:</span> {c.message}
              </div>
              <div className="mt-0.5 flex gap-2 font-mono text-[11px] text-faint">
                <span className="text-muted">{c.hash}</span>
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
  const [runIdx, setRunIdx] = useState(0)
  const [replay, setReplay] = useState(0)
  const run = RUNS[runIdx]
  const t = useClock(`${runKey}-${replay}-${runIdx}`, run.runMs)
  const [pinned, setPinned] = useState<string | null>(null)
  const active = [...run.spans].reverse().find((s) => t >= s.start)
  const selected = (pinned && run.spans.find((s) => s.id === pinned && t >= s.start)) || active
  const running = t < run.runMs
  const isLive = run.id.startsWith('gen-live')

  return (
    <div className="flex h-full flex-col gap-4 p-6">
      <div className="flex items-center gap-4">
        <h1 className="text-[22px] font-semibold tracking-tight text-text">{run.label}</h1>
        <span className="font-mono text-[13px] text-muted">{run.genome}</span>
        <span className="flex items-center gap-2 rounded-full border border-line-strong px-2.5 py-0.5 text-[12px] text-muted">
          <StatusDot state={running ? 'running' : 'done'} />
          {running ? 'Replaying' : 'Completed'}
          <span className="tabular font-mono text-faint">{fmtMs(t)}</span>
        </span>
        {isLive && (
          <span className="font-mono text-[12px] text-faint">
            {LIVE_META.session} · {LIVE_META.events.toLocaleString('en')} SDK events · {fmtMs(LIVE_META.realMs)} real
          </span>
        )}
        <div className="ml-auto flex items-center gap-2">
          <div className="flex rounded-md border border-line-strong p-0.5">
            {RUNS.map((r, i) => (
              <button
                key={r.id}
                onClick={() => {
                  setPinned(null)
                  setRunIdx(i)
                }}
                className={`rounded px-2.5 py-1 font-mono text-[12px] ${i === runIdx ? 'bg-raised text-text' : 'text-muted hover:text-text'}`}
              >
                {r.id}
              </button>
            ))}
          </div>
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
      </div>
      <div className="rounded-lg border border-line bg-surface">
        <Graph run={run} t={t} />
      </div>
      <div className="grid min-h-0 flex-1 grid-cols-[860px_1fr_420px] gap-4">
        <Trace run={run} t={t} selected={selected} onSelect={(s) => setPinned(s.id)} />
        <Handoff span={selected} />
        <Commits run={run} t={t} />
      </div>
    </div>
  )
}
