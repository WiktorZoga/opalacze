import { useState } from 'react'
import { AGENTS, PIPELINE, type AgentId } from '../data/agents'
import { RUN_GENOME, RUN_ID, RUN_MS, SPANS, type Span } from '../data/run'
import { useClock } from '../components/hooks'
import { AgentName, Avatar, Badge, Json, Panel, StatusDot, fmtMs } from '../components/ui'

const GRAPH_W = 1872
const NODE_W = 216
const NODE_H = 92
const NODE_Y = 56
const xs = PIPELINE.map((_, i) => 40 + NODE_W / 2 + i * ((GRAPH_W - 80 - NODE_W) / (PIPELINE.length - 1)))
const xOf = (a: AgentId) => xs[PIPELINE.findIndex((p) => p.agent === a)]

type NodeState = 'idle' | 'running' | 'done' | 'rejected'

function nodeState(agent: AgentId, t: number): { state: NodeState; span?: Span } {
  const mine = SPANS.filter((s) => s.agent === agent)
  const active = mine.find((s) => t >= s.start && t < s.end)
  if (active) return { state: active.status === 'rejected' ? 'rejected' : 'running', span: active }
  const done = mine.filter((s) => t >= s.end)
  if (done.length) return { state: 'done', span: done[done.length - 1] }
  return { state: 'idle' }
}

function Graph({ t }: { t: number }) {
  const mid = NODE_Y + NODE_H / 2
  const xm = xOf('mutator')
  const xc = xOf('critic')
  const rerollSeen = t >= SPANS.find((s) => s.status === 'rejected')!.end
  const loopSeen = t >= SPANS[SPANS.length - 1].end

  const transit = SPANS.map((s, i) => ({ s, prev: SPANS[i - 1] }))
    .filter(({ s, prev }) => prev && prev.agent !== s.agent)
    .map(({ s, prev }) => ({ from: prev.agent, to: s.agent, label: prev.packet, t0: prev.end - 150, t1: s.start + 450, back: xOf(s.agent) < xOf(prev.agent) }))
    .find((x) => t >= x.t0 && t < x.t1)
  const last = SPANS[SPANS.length - 1]
  const loopTransit = t >= last.end - 100 && t < last.end + 1400

  let packet: { x: number; y: number; label: string } | null = null
  if (transit) {
    const p = Math.min(1, Math.max(0, (t - transit.t0) / (transit.t1 - transit.t0)))
    const e = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2
    const x = xOf(transit.from) + (xOf(transit.to) - xOf(transit.from)) * e
    const y = transit.back ? mid - Math.sin(e * Math.PI) * 56 : mid
    packet = { x, y, label: transit.label }
  } else if (loopTransit) {
    const p = Math.min(1, (t - (last.end - 100)) / 1500)
    const e = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2
    packet = { x: xs[xs.length - 1] + (xs[0] - xs[xs.length - 1]) * e, y: mid + Math.sin(e * Math.PI) * 74, label: last.packet }
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
      <div className="absolute font-mono text-[11px] text-faint" style={{ left: (xm + xc) / 2 - 60, top: 4 }}>
        <span className={rerollSeen ? 'text-danger' : ''}>reroll · structure</span>
      </div>
      <div className="absolute font-mono text-[11px] text-faint" style={{ left: GRAPH_W / 2 - 110, top: 196 }}>
        <span className={loopSeen ? 'text-accent' : ''}>fitness → next generation</span>
      </div>

      {PIPELINE.map((p, i) => {
        const { state, span } = nodeState(p.agent, t)
        const border = state === 'running' ? 'border-accent/70' : state === 'rejected' ? 'border-danger/70' : 'border-line-strong'
        return (
          <div
            key={p.agent}
            className={`absolute rounded-lg border bg-raised px-4 py-3 transition-colors duration-300 ${border}`}
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
              <StatusDot state={state} />
              {state === 'idle' ? 'idle' : state === 'done' ? `done · ${span!.name}` : `${state === 'rejected' ? 'rejecting' : 'running'} · ${span!.name}`}
            </div>
          </div>
        )
      })}

      {packet && (
        <div
          className="pointer-events-none absolute flex -translate-x-1/2 -translate-y-1/2 items-center gap-1.5 rounded-full border border-accent/50 bg-bg px-2.5 py-1 font-mono text-[11px] text-accent"
          style={{ left: packet.x, top: packet.y }}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          {packet.label}
        </div>
      )}
    </div>
  )
}

function Trace({ t, selected, onSelect }: { t: number; selected?: Span; onSelect: (s: Span) => void }) {
  const LABEL_W = 300
  const TRACK_W = 1010 - LABEL_W - 40
  const scale = (ms: number) => (ms / RUN_MS) * TRACK_W
  const rows = SPANS.filter((s) => t >= s.start)
  return (
    <Panel title="Trace" meta={`${rows.length} / ${SPANS.length} spans`} className="h-full">
      <div className="relative px-4 pt-2">
        <div className="flex h-7 items-center font-mono text-[11px] text-faint" style={{ paddingLeft: LABEL_W }}>
          {[0, 5000, 10000, 15000, 20000].map((ms) => (
            <span key={ms} className="absolute" style={{ left: 16 + LABEL_W + scale(ms) }}>
              {ms / 1000}s
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
              className={`flex h-[42px] w-full items-center rounded text-left ${sel ? 'bg-raised' : 'hover:bg-raised/60'}`}
            >
              <div className="flex shrink-0 items-center gap-2.5 pl-2" style={{ width: LABEL_W }}>
                <Avatar id={s.agent} size={20} />
                <span className="w-[86px] text-[13px] capitalize text-muted">{s.agent}</span>
                <span className="font-mono text-[12px] text-text">{s.name}</span>
                {s.status === 'rejected' && done && <Badge tone="danger">rejected</Badge>}
              </div>
              <div className="relative h-full flex-1">
                <div
                  className={`absolute top-1/2 h-2 -translate-y-1/2 rounded-sm ${bar}`}
                  style={{ left: scale(s.start), width: Math.max(2, scale(Math.min(t, s.end) - s.start)) }}
                />
                {done && (
                  <span className="absolute top-1/2 -translate-y-1/2 font-mono text-[11px] text-faint" style={{ left: scale(s.end) + 8 }}>
                    {fmtMs(s.end - s.start)}
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

function Handoff({ span }: { span?: Span }) {
  if (!span) return <Panel title="Handoff" className="h-full"><div className="p-4 text-[13px] text-faint">Waiting for the first span…</div></Panel>
  return (
    <Panel title="Handoff" meta={span.commit.hash} className="h-full">
      <div className="flex h-full flex-col gap-4 overflow-hidden p-4">
        <div className="flex items-center gap-3">
          <AgentName id={span.agent} />
          <span className="text-faint">→</span>
          <AgentName id={span.to} />
          <span className="ml-auto">
            <Badge tone={span.status === 'rejected' ? 'danger' : 'accent'}>{span.packet}</Badge>
          </span>
        </div>
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
      </div>
    </Panel>
  )
}

function Commits({ t }: { t: number }) {
  const done = SPANS.filter((s) => t >= s.end).reverse()
  return (
    <Panel title="Commits" meta="main" className="h-full">
      <div className="flex flex-col overflow-hidden">
        {done.map((s, i) => (
          <div key={s.id} className={`flex gap-3 border-b border-line px-4 py-3 ${i === 0 ? 'bg-raised/50' : ''}`}>
            <Avatar id={s.agent} size={22} />
            <div className="min-w-0 flex-1">
              <div className="truncate text-[13px] text-text">
                <span className="text-muted">{s.agent}:</span> {s.commit.message}
              </div>
              <div className="mt-0.5 flex gap-2 font-mono text-[11px] text-faint">
                <span className="text-muted">{s.commit.hash}</span>
                <span className="truncate">{s.commit.path}</span>
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
  const [replay, setReplay] = useState(0)
  const t = useClock(`${runKey}-${replay}`, RUN_MS)
  const [pinned, setPinned] = useState<string | null>(null)
  const active = [...SPANS].reverse().find((s) => t >= s.start)
  const selected = (pinned && SPANS.find((s) => s.id === pinned && t >= s.start)) || active
  const running = t < RUN_MS

  return (
    <div className="flex h-full flex-col gap-4 p-6">
      <div className="flex items-center gap-4">
        <h1 className="text-[22px] font-semibold tracking-tight text-text">Run {RUN_ID}</h1>
        <span className="font-mono text-[13px] text-muted">{RUN_GENOME}</span>
        <span className="flex items-center gap-2 rounded-full border border-line-strong px-2.5 py-0.5 text-[12px] text-muted">
          <StatusDot state={running ? 'running' : 'done'} />
          {running ? 'Running' : 'Completed'}
          <span className="tabular font-mono text-faint">{fmtMs(t)}</span>
        </span>
        <button
          onClick={() => {
            setPinned(null)
            setReplay((r) => r + 1)
          }}
          className="ml-auto rounded-md border border-line-strong px-3 py-1 text-[13px] text-muted hover:border-faint hover:text-text"
        >
          Replay run
        </button>
      </div>
      <div className="rounded-lg border border-line bg-surface">
        <Graph t={t} />
      </div>
      <div className="grid min-h-0 flex-1 grid-cols-[1010px_1fr_420px] gap-4">
        <Trace t={t} selected={selected} onSelect={(s) => setPinned(s.id)} />
        <Handoff span={selected} />
        <Commits t={t} />
      </div>
    </div>
  )
}
