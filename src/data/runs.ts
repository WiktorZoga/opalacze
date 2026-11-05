import type { AgentId } from './agents'
import live from './liveRun.json'
import { GEN3_RUN, type Run, type Span } from './run'

const PACKETS = ['trend', 'genomes', 'child genome', 'reroll: hook', 'hook v2', 'approved', 'image']
const GAP = 450
const replayMs = (real: number) => Math.min(3400, Math.max(1300, real / 14))

const liveSpans: Span[] = []
let cursor = 300
live.spans.forEach((s, i) => {
  const agent = s.agent as AgentId
  const next = live.spans[i + 1]
  const dur = replayMs(s.end - s.start)
  const rejected = agent === 'critic' && s.final.startsWith('absolutely not')
  const last = s.tools[s.tools.length - 1]
  const primary = s.tools.find((t) => t.name !== 'commit_artifact') ?? last
  const commits = s.commits.map((c) => ({ hash: c.hash, agent, message: c.message, path: '' }))
  liveSpans.push({
    id: `live-${i + 1}`,
    agent,
    name: agent === 'critic' ? 'review' : primary?.name ?? s.description,
    kind: primary?.name && agent !== 'critic' ? 'tool' : 'llm',
    start: cursor,
    end: cursor + dur,
    status: rejected ? 'rejected' : 'ok',
    to: (next?.agent ?? agent) as AgentId,
    packet: PACKETS[i] ?? 'artifact',
    input: { from: 'overlord', task: s.description },
    output: primary?.result ?? null,
    commit: commits[commits.length - 1],
    commits,
    realMs: s.end - s.start,
    task: s.description,
    tools: s.tools,
    quote: s.final,
  })
  cursor += dur + GAP
})

export const LIVE_RUN: Run = {
  id: 'gen-live-001',
  label: 'Live run · grok-4.7 · 2026-11-05',
  genome: 'krasnal-night-check',
  spans: liveSpans,
  runMs: cursor + 600,
  skipped: ['publisher', 'analyst'],
}

export const LIVE_META = {
  session: live.session,
  events: live.eventCount,
  realMs: live.durationMs,
  overlordCommit: live.overlordCommit,
}

export const RUNS: Run[] = [LIVE_RUN, GEN3_RUN]
