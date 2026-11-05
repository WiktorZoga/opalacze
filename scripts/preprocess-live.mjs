// node scripts/preprocess-live.mjs [genDir] → src/data/liveRun.json (compact replay of a real agent-sdk trace)
import { readFileSync, writeFileSync } from 'node:fs'
import { execSync } from 'node:child_process'

const dir = process.argv[2] ?? 'generations/gen-live-001'
const events = readFileSync(`${dir}/trace.ndjson`, 'utf8')
  .split('\n')
  .filter(Boolean)
  .map((l) => JSON.parse(l))

const t0 = Date.parse(events[0].at)
const off = (e) => Date.parse(e.at) - t0
const J = (x) => {
  if (typeof x !== 'string') return x
  try {
    return JSON.parse(x)
  } catch {
    return x
  }
}
const shrink = (v, depth = 0) => {
  if (typeof v === 'string') return v.length > 140 ? `${v.slice(0, 140)}…` : v
  if (Array.isArray(v)) return v.length > 3 ? [...v.slice(0, 3).map((x) => shrink(x, depth + 1)), `+${v.length - 3} more`] : v.map((x) => shrink(x, depth + 1))
  if (v && typeof v === 'object') {
    if (depth > 2) return '{…}'
    const entries = Object.entries(v)
    const kept = entries.slice(0, 6).map(([k, x]) => [k, shrink(x, depth + 1)])
    if (entries.length > 6) kept.push(['…', `${entries.length - 6} more`])
    return Object.fromEntries(kept)
  }
  return v
}
const stripMd = (s) => s.replace(/\*\*/g, '').replace(/`/g, '').trim()

const results = new Map()
for (const e of events) if (e.type === 'action.result') results.set(e.data.callId, e.data)

const log = execSync(`git log --reverse --format='%h|%an|%s' -- ${dir}`, { encoding: 'utf8' })
  .trim()
  .split('\n')
  .filter(Boolean)
  .map((l) => {
    const [hash, author, ...rest] = l.split('|')
    return { hash, author, message: rest.join('|').replace(/^\S+\s\w+:\s/, '') }
  })

const spans = events
  .filter((e) => e.type === 'subagent.called')
  .map((c) => {
    const done = events.find((e) => e.type === 'subagent.completed' && e.data.callId === c.data.callId)
    const steps = results.get(c.data.callId)?.output?.conversationSteps ?? []
    const tools = steps
      .map((s) => s.toolCall && J(s.toolCall)?.mcpToolCall)
      .filter(Boolean)
      .map((m) => {
        const raw = m.result?.success?.content?.[0]?.text?.text
        return { name: String(m.args.name).replace(/^custom-user-tools-/, ''), args: shrink(m.args.args), result: shrink(J(raw) ?? null) }
      })
    const finals = steps.filter((s) => s.assistantMessage).map((s) => J(s.assistantMessage)?.text ?? '')
    const commits = tools
      .filter((t) => t.name === 'commit_artifact')
      .map((t) => log.find((l) => l.message === t.args.message))
      .filter(Boolean)
    return {
      agent: c.data.name,
      description: c.data.description,
      start: off(c),
      end: done ? off(done) : off(c),
      tools,
      final: stripMd(finals[finals.length - 1] ?? '').slice(0, 420),
      commits,
    }
  })

const turn = events.find((e) => e.type === 'turn.completed')
const out = {
  session: events[0].sessionId,
  startedAt: events[0].at,
  durationMs: off(turn ?? events[events.length - 1]),
  eventCount: events.length,
  spans,
  overlordCommit: log.find((l) => l.author.startsWith('Overlord')) ?? null,
}
writeFileSync('src/data/liveRun.json', JSON.stringify(out, null, 1))
for (const s of spans) console.log(s.agent, s.start, s.end, s.tools.map((t) => t.name).join(','), s.commits.map((c) => c.hash).join(','))
