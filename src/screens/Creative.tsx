import { motion } from 'framer-motion'
import { TONES, useCampaign, type Campaign, type Tone } from '../data/campaigns'
import { useGrokMedia, type GrokLibrary, type GrokMedia } from '../data/grokMedia'
import { MediaFrame } from '../components/MediaFrame'
import { Avatar, Badge, Panel } from '../components/ui'

function pickVariants(lib: GrokLibrary, c: Campaign, tone: Tone): (GrokMedia | undefined)[] {
  const mine = lib.items.filter((m) => m.ugc && m.node === c.id && m.hook !== 'persona card')
  const toned = mine.filter((m) => (m.tone ?? 'ugc').toLowerCase().startsWith(tone === 'polished' ? 'pol' : tone))
  const pool = toned.length ? toned : tone === 'brainrot' ? [] : mine
  const fallback = (c.fallback[tone] ?? []).map((id) => lib.byId(id)).filter(Boolean) as GrokMedia[]
  const list = [...pool.filter((m) => m.kind === 'video'), ...pool.filter((m) => m.kind !== 'video'), ...fallback]
  return [list[0], list[1] ?? list[0]]
}

function Phone({ media, label, caption, tone, width = 232 }: { media?: GrokMedia; label: string; caption?: string; tone: Tone; width?: number }) {
  return (
    <div className="relative rounded-[30px] border border-line-strong bg-black p-2 shadow-2xl shadow-black/60">
      <div className="absolute left-1/2 top-3.5 z-10 h-4 w-20 -translate-x-1/2 rounded-full bg-black" />
      <MediaFrame
        key={media?.url ?? label}
        src={media?.url}
        kind={media?.kind}
        alt={label}
        width={width}
        height={Math.round((width * 16) / 9)}
        className="!rounded-[22px]"
        caption={media && !media.captionBaked ? caption : undefined}
        captionStyle={tone === 'brainrot' ? 'meme' : 'tiktok'}
        pendingLabel="UGC render queued · grok-imagine-video"
      />
      <span className="absolute bottom-5 left-5 z-10 rounded bg-black/70 px-1.5 py-0.5 font-mono text-[10px] text-white/85">#ad · AI-generated</span>
    </div>
  )
}

export function Creative() {
  const { campaign: c, tone, setTone } = useCampaign()
  const lib = useGrokMedia()
  const variants = pickVariants(lib, c, tone)
  const script = c.scripts[tone]
  const showC = !!c.live && tone === 'ugc'
  const liveMedia: GrokMedia | undefined = c.live ? { id: 'noir-05-deceive', file: c.live.clip, kind: 'video', node: c.id, url: c.live.clip, captionBaked: true } : undefined
  const personaImg = lib.items.find((m) => m.node === c.id && m.hook === 'persona card')
  const winner = c.metrics[0].ctr >= c.metrics[1].ctr ? 'A' : 'B'

  return (
    <div className="flex h-full flex-col gap-4 p-6">
      <div className="flex items-center gap-4">
        <h1 className="text-[22px] font-semibold tracking-tight text-text">{c.brand}</h1>
        <span className="text-[14px] text-muted">creative · {c.live?.trendName ?? c.trend.trendName}</span>
        <div className="ml-auto flex items-center gap-3">
          <span className="text-[12px] text-faint">Tone</span>
          <div className="flex rounded-md border border-line-strong p-0.5">
            {TONES.map((t) => (
              <button
                key={t.id}
                onClick={() => setTone(t.id)}
                className={`rounded px-3 py-1 text-[13px] ${tone === t.id ? (t.id === 'brainrot' ? 'bg-hot text-black' : 'bg-accent text-black') : 'text-muted hover:text-text'}`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-[400px_1fr_420px] gap-4">
        <div className="flex min-h-0 flex-col gap-4">
          <Panel title="AI creator persona" meta="AI-generated">
            <div className="flex gap-4 p-4">
              {personaImg ? (
                <img src={personaImg.url} alt={c.persona.name} className="h-24 w-[54px] shrink-0 rounded-md border border-line-strong object-cover" />
              ) : (
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-accent/40 to-hot/40 text-[20px] font-semibold text-text">
                  {c.persona.name[0]}
                </div>
              )}
              <div className="min-w-0">
                <div className="text-[15px] font-medium text-text">{c.persona.name}</div>
                <div className="font-mono text-[12px] text-muted">{c.persona.handle}</div>
                <div className="mt-2 text-[12px] text-muted">{c.persona.style}</div>
                <div className="text-[12px] text-faint">voice · {c.persona.voice}</div>
                {c.live && <div className="mt-1 text-[12px] text-faint">live run persona · {c.live.persona} (AI) → variant C</div>}
                <div className="mt-2 flex gap-1.5">
                  <Badge tone="accent">AI persona</Badge>
                  <Badge>no real likeness</Badge>
                </div>
              </div>
            </div>
          </Panel>
          <Panel title="Creative DNA" meta={c.live?.trendName ?? c.trend.trendName} className="flex-1">
            <div className="p-2">
              {c.dna.map((d) => (
                <div key={d.gene} className={`grid grid-cols-[86px_1fr] gap-3 rounded px-2 py-2 text-[12px] ${d.insert ? 'bg-accent/8 ring-1 ring-accent/40' : ''}`}>
                  <span className={`font-mono ${d.insert ? 'text-accent' : 'text-faint'}`}>{d.gene}</span>
                  <span className="text-text">{d.value}</span>
                </div>
              ))}
            </div>
          </Panel>
        </div>

        <Panel title="UGC variants" meta={`${TONES.find((t) => t.id === tone)?.label} · 9:16 · A/B`}>
          <div className={`flex h-full justify-center p-5 ${showC ? 'gap-5' : 'gap-10'}`}>
            {showC && (
              <motion.div key={`${tone}-C`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="w-[196px]">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-[13px] font-medium text-text">Variant C</span>
                  <Badge tone="accent">live run</Badge>
                </div>
                <Phone media={liveMedia} tone={tone} label="live-C" width={180} />
                <div className="mt-3 text-[13px] text-text">“Why would I deceive you?”</div>
                <div className="mt-1 text-[12px] text-muted">{c.live!.persona} (AI) · grok-imagine · 7 s</div>
              </motion.div>
            )}
            {(['A', 'B'] as const).map((v, i) => (
              <motion.div key={`${tone}-${v}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: (i + 1) * 0.08 }} className={showC ? 'w-[196px]' : 'w-[248px]'}>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-[13px] font-medium text-text">Variant {v}</span>
                  {v === winner && <Badge tone="accent">leading · CTR</Badge>}
                </div>
                <Phone media={variants[i]} tone={tone} width={showC ? 180 : 232} label={`${c.id}-${v}`} caption={i === 0 ? script.hook : (tone === 'ugc' && variants[1]?.hook && variants[1] !== variants[0] ? variants[1].hook : script.caption.replace(' #ad', ''))} />
                <div className="mt-3 text-[13px] text-text">“{i === 0 ? script.hook : script.beats[0]}”</div>
                <ol className="mt-1 space-y-0.5 text-[12px] text-muted">
                  {script.beats.map((b, j) => (
                    <li key={b}>
                      <span className="font-mono text-faint">{j + 1}.</span> {b}
                    </li>
                  ))}
                </ol>
              </motion.div>
            ))}
          </div>
        </Panel>

        <div className="flex min-h-0 flex-col gap-4">
          <Panel title="Critic checks" meta={c.reject ? 'round 2 · approved' : 'round 1 · approved'}>
            <div className="p-4">
              {c.reject ? (
                <div className="mb-3 rounded-md border border-danger/40 bg-danger/5 px-3 py-2 text-[12px]">
                  <span className="font-semibold uppercase tracking-wider text-danger">round 1 · absolutely not</span>
                  <span className="text-muted"> · {c.reject.check}: {c.reject.note}</span>
                </div>
              ) : (
                <div className="mb-3 rounded-md border border-accent/40 bg-accent/5 px-3 py-2 text-[12px]">
                  <span className="font-semibold uppercase tracking-wider text-accent">round 1 · fine. ship it.</span>
                  <span className="text-muted"> · live run, approved first pass</span>
                </div>
              )}
              {c.checks.map((k) => (
                <div key={k.label} className="flex items-center gap-2.5 border-b border-line py-2 text-[13px] last:border-0">
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[9px] text-black">✓</span>
                  <span className="text-text">{k.label}</span>
                  <span className="ml-auto font-mono text-[12px] text-muted">{k.result}</span>
                </div>
              ))}
            </div>
          </Panel>
          <Panel title="Publish" meta="simulated">
            <div className="p-4">
              {[
                ['TikTok', '19:00', 'A'],
                ['Reels', '19:30', 'B'],
                ['X', '20:00', 'A'],
              ].map(([p, time, v]) => (
                <div key={p} className="flex items-center gap-3 border-b border-line py-2 text-[13px] last:border-0">
                  <Avatar id="publisher" size={20} />
                  <span className="w-16 text-text">{p}</span>
                  <span className="font-mono text-[12px] text-muted">{time} CET · variant {v}</span>
                  <span className="ml-auto">
                    <Badge>scheduled</Badge>
                  </span>
                </div>
              ))}
            </div>
          </Panel>
          <Panel title="Analyst" meta="simulated metrics" className="flex-1">
            <table className="tabular w-full font-mono text-[13px]">
              <thead className="text-[11px] uppercase tracking-wider text-faint">
                <tr className="text-left">
                  <th className="px-4 py-2 font-medium">Variant</th>
                  <th className="py-2 text-right font-medium">Hook rate</th>
                  <th className="py-2 text-right font-medium">Watch</th>
                  <th className="px-4 py-2 text-right font-medium">CTR</th>
                </tr>
              </thead>
              <tbody>
                {c.metrics.map((m) => (
                  <tr key={m.variant} className="border-t border-line">
                    <td className="px-4 py-2 text-text">{m.variant}</td>
                    <td className="py-2 text-right text-muted">{Math.round(m.hookRate * 100)}%</td>
                    <td className="py-2 text-right text-muted">{Math.round(m.watch * 100)}%</td>
                    <td className={`px-4 py-2 text-right ${m.variant === winner ? 'text-accent' : 'text-muted'}`}>{(m.ctr * 100).toFixed(1)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="px-4 pb-3 text-[12px] text-faint">Winner feeds the next variant: Scout re-checks the trend, Creator iterates the hook.</p>
          </Panel>
        </div>
      </div>
    </div>
  )
}
