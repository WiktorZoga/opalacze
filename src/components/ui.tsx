import type { ReactNode } from 'react'
import { AGENTS, type AgentId } from '../data/agents'

export function Panel({ title, meta, children, className = '' }: { title: string; meta?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={`flex min-h-0 flex-col rounded-lg border border-line bg-surface ${className}`}>
      <header className="flex h-11 shrink-0 items-center justify-between border-b border-line px-4">
        <h2 className="text-[13px] font-medium text-text">{title}</h2>
        {meta && <div className="font-mono text-[12px] text-muted">{meta}</div>}
      </header>
      <div className="min-h-0 flex-1">{children}</div>
    </section>
  )
}

export function Avatar({ id, size = 24 }: { id: AgentId; size?: number }) {
  return (
    <span
      className="inline-flex shrink-0 items-center justify-center rounded-full border border-line-strong bg-raised"
      style={{ width: size, height: size, fontSize: size * 0.55 }}
      title={AGENTS[id].name}
    >
      {AGENTS[id].emoji}
    </span>
  )
}

export function AgentName({ id }: { id: AgentId }) {
  return (
    <span className="inline-flex items-center gap-2">
      <Avatar id={id} size={20} />
      <span className="text-[13px] font-medium capitalize text-text">{id}</span>
    </span>
  )
}

type Tone = 'neutral' | 'accent' | 'danger'

export function Badge({ children, tone = 'neutral' }: { children: ReactNode; tone?: Tone }) {
  const cls =
    tone === 'accent'
      ? 'border-accent/40 text-accent'
      : tone === 'danger'
        ? 'border-danger/40 text-danger'
        : 'border-line-strong text-muted'
  return <span className={`inline-flex items-center rounded border px-1.5 py-px font-mono text-[11px] ${cls}`}>{children}</span>
}

export function StatusDot({ state }: { state: 'idle' | 'running' | 'done' | 'rejected' }) {
  const cls = state === 'running' ? 'bg-accent animate-pulse' : state === 'done' ? 'bg-accent' : state === 'rejected' ? 'bg-danger' : 'bg-faint'
  return <span className={`inline-block h-1.5 w-1.5 rounded-full ${cls}`} />
}

/** small JSON renderer: keys muted, strings in text color, numbers in accent */
export function Json({ value, maxLines = 14 }: { value: unknown; maxLines?: number }) {
  const lines = JSON.stringify(value, null, 2).split('\n')
  const shown = lines.length > maxLines ? [...lines.slice(0, maxLines - 1), '  …'] : lines
  return (
    <pre className="overflow-hidden whitespace-pre-wrap break-words font-mono text-[12px] leading-[1.6] text-muted">
      {shown.map((l, i) => {
        const m = l.match(/^(\s*)"([^"]+)":\s(.*)$/)
        if (!m) return <div key={i}>{l}</div>
        const [, ind, key, rest] = m
        const valCls = /^"/.test(rest) ? 'text-text' : /^-?\d/.test(rest) ? 'text-accent' : 'text-muted'
        return (
          <div key={i}>
            {ind}
            <span className="text-faint">"{key}"</span>: <span className={valCls}>{rest}</span>
          </div>
        )
      })}
    </pre>
  )
}

export const fmtMs = (ms: number) => `${(ms / 1000).toFixed(1)}s`
