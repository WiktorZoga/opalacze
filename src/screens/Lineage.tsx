import { motion } from 'framer-motion'
import { CHILD, CRITIQUE, GENERATIONS, GENOME, LIVE_IMAGE, PARENTS } from '../data/lineage'
import { MEMES } from '../data/memes'
import { MemeCard } from '../components/MemeCard'
import { Badge, Panel } from '../components/ui'

const CHILD_MEME: Record<string, string> = {
  'scientists-reveal-the-clap': 'scientistsHi',
  'krasnal-ceo': 'krasnal',
  'krasnal-ceo-series-a': 'krasnalAlt',
}

function Thumb({ id, live }: { id: string; live?: boolean }) {
  if (live) return <img src={LIVE_IMAGE} alt={id} className="h-[72px] w-[40px] rounded object-cover" />
  return <MemeCard meme={MEMES[CHILD_MEME[id]]} width={64} />
}

function GenomeTable() {
  return (
    <Panel title={`Genome · ${CHILD.id}`} meta={`${GENOME.length} genes`}>
      <div className="flex items-center gap-6 border-b border-line px-5 py-2.5 text-[12px] text-muted">
        <span className="flex items-center gap-2"><Badge>M</Badge>{PARENTS.mother}</span>
        <span className="flex items-center gap-2"><Badge>F</Badge>{PARENTS.father}</span>
        <span className="flex items-center gap-2"><Badge tone="accent">mutation</Badge>rewritten this generation</span>
      </div>
      <div>
        {GENOME.map((g, i) => (
          <motion.div
            key={g.gene}
            className="grid grid-cols-[120px_1fr_180px_96px] items-center gap-5 border-b border-line px-5 py-3 last:border-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.05 * i }}
          >
            <span className="font-mono text-[13px] text-text">{g.gene}</span>
            <span className="truncate text-[13px] text-muted" title={g.allele}>{g.allele}</span>
            <div className="flex items-center gap-3">
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-line">
                <motion.div
                  className={`h-full rounded-full ${g.origin === 'mutation' ? 'bg-accent' : 'bg-muted'}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${g.dominance * 100}%` }}
                  transition={{ delay: 0.2 + 0.05 * i, duration: 0.6, ease: 'easeOut' }}
                />
              </div>
              <span className="tabular w-8 text-right font-mono text-[12px] text-muted">{g.dominance.toFixed(2)}</span>
            </div>
            <span>
              {g.origin === 'mutation' ? <Badge tone="accent">mutation</Badge> : <Badge>{g.origin === 'mother' ? 'M' : 'F'}</Badge>}
            </span>
          </motion.div>
        ))}
      </div>
    </Panel>
  )
}

function CritiqueTable() {
  return (
    <Panel title="Critic review" meta={`${CRITIQUE.length} rounds`}>
      <div className="grid grid-cols-[64px_150px_1fr_1.2fr] gap-4 border-b border-line px-5 py-2 text-[11px] font-medium uppercase tracking-wider text-faint">
        <span>Round</span>
        <span>Verdict</span>
        <span>Scores</span>
        <span>Note</span>
      </div>
      {CRITIQUE.map((r) => (
        <div key={r.round} className="grid grid-cols-[64px_150px_1fr_1.2fr] items-center gap-4 border-b border-line px-5 py-3 text-[13px] last:border-0">
          <span className="font-mono text-muted">{r.round}</span>
          <span>
            <Badge tone={r.round === 1 ? 'danger' : 'accent'}>{r.verdict}</Badge>
          </span>
          <span className="tabular font-mono text-[12px] text-muted">
            {Object.entries(r.scores)
              .map(([k, v]) => `${k} ${v}`)
              .join(' · ')}
          </span>
          <span className="text-muted">{r.note}</span>
        </div>
      ))}
    </Panel>
  )
}

function Tree() {
  return (
    <Panel title="Lineage" meta={`main · ${GENERATIONS.length} generations`}>
      <div className="flex flex-col gap-0 p-5">
        {GENERATIONS.map((g, i) => (
          <motion.div
            key={g.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.35 }}
            className="relative"
          >
            <div className="flex items-start gap-5">
              <div className="w-24 pt-2 font-mono text-[12px] text-faint">{g.gen}</div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  {g.parents.map((p, j) => (
                    <span key={p} className="flex items-center gap-2">
                      {j > 0 && <span className="text-faint">×</span>}
                      <span className={`rounded border px-2 py-1 font-mono text-[12px] ${GENERATIONS.some((x) => x.id === p) ? 'border-line-strong text-text' : 'border-line text-muted'}`}>
                        {p}
                      </span>
                    </span>
                  ))}
                </div>
                <div className="ml-3 h-3 w-px bg-line-strong" />
                <div className={`flex items-center gap-4 rounded-lg border p-3 ${i === GENERATIONS.length - 1 ? 'border-accent/50 bg-raised' : 'border-line bg-raised/60'}`}>
                  <Thumb id={g.id} live={g.live} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 text-[15px] font-medium text-text">{g.name}{g.live && <Badge tone="accent">live · grok-4.7</Badge>}</div>
                    <div className="font-mono text-[12px] text-faint">{g.id}</div>
                  </div>
                  <div className="text-right">
                    <div className="tabular font-mono text-[20px] text-text">{g.fitness === null ? '—' : g.fitness.toFixed(2)}</div>
                    <div className="text-[11px] text-faint">fitness · {g.carriedBy}</div>
                  </div>
                </div>
              </div>
            </div>
            {i < GENERATIONS.length - 1 && <div className="ml-[132px] h-4 w-px bg-line-strong" />}
          </motion.div>
        ))}
        <div className="mt-6 flex items-end gap-6 border-t border-line pt-5">
          <div className="text-[12px] text-muted">Fitness by generation<div className="text-faint">live run not scored yet</div></div>
          <div className="flex h-16 flex-1 items-end gap-3">
            {GENERATIONS.filter((g) => g.fitness !== null).map((g, i, arr) => (
              <div key={g.id} className="flex flex-1 flex-col items-center gap-1">
                <motion.div
                  className={`w-full rounded-sm ${i === arr.length - 1 ? 'bg-accent' : 'bg-line-strong'}`}
                  initial={{ height: 0 }}
                  animate={{ height: (g.fitness ?? 0) * 64 }}
                  transition={{ delay: 0.8 + i * 0.2, duration: 0.5 }}
                />
                <span className="font-mono text-[11px] text-faint">{g.gen}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Panel>
  )
}

export function Lineage() {
  return (
    <div className="flex h-full flex-col gap-4 p-6">
      <div className="flex items-baseline gap-4">
        <h1 className="text-[22px] font-semibold tracking-tight text-text">Genome & Lineage</h1>
        <span className="text-[13px] text-muted">How {CHILD.name} (live run) inherited its genes, and what the Critic said</span>
      </div>
      <div className="grid min-h-0 flex-1 grid-cols-[1fr_720px] gap-4">
        <div className="flex min-h-0 flex-col gap-4">
          <GenomeTable />
          <CritiqueTable />
        </div>
        <Tree />
      </div>
    </div>
  )
}
