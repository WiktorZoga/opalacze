import { CAMPAIGNS, TONES } from '../data/campaigns'
import { motion } from 'framer-motion'
import { StatusDot } from '../components/ui'
import { BrandLogo } from '../components/Logo'

const INTEGRATIONS: { name: string; detail: string; live: boolean }[] = [
  { name: 'Grok Bot', detail: '@grok/agent-sdk · 6 agents', live: true },
  { name: 'xAI Grok Imagine', detail: 'image + video', live: true },
  { name: 'X search', detail: 'live trends via x_trends', live: true },
  { name: 'Higgsfield', detail: 'AI video / UGC avatars', live: false },
  { name: 'TikTok Creative Center', detail: 'trend + sound data', live: false },
  { name: 'Meta / TikTok Ads', detail: 'campaign APIs', live: false },
  { name: 'ElevenLabs', detail: 'creator voice', live: false },
]

export function Sidebar({ selected, onOpen }: { selected: string; onOpen: (id: string) => void }) {
  return (
    <aside className="flex w-[300px] shrink-0 flex-col border-r border-line bg-surface/60">
      <div className="flex items-center justify-between px-4 pb-2 pt-5">
        <span className="text-[13px] font-medium text-text">Briefs</span>
        <span className="rounded border border-line-strong px-1.5 font-mono text-[11px] text-faint">+ new</span>
      </div>
      <div className="space-y-2 px-3">
        {CAMPAIGNS.map((c, idx) => {
          const on = c.id === selected
          return (
            <motion.button
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.06, duration: 0.3 }}
              key={c.id}
              onClick={() => onOpen(c.id)}
              className={`w-full rounded-lg border p-3 text-left transition-colors ${on ? 'glow-acid border-accent/60 bg-raised' : 'border-line bg-raised/40 hover:border-line-strong'}`}
            >
              <div className="flex items-center gap-2.5">
                <BrandLogo id={c.id} size={30} />
                <span className="text-[14px] font-medium text-text">{c.brand}</span>
                <span className="ml-auto font-mono text-[11px] text-faint">{c.received}</span>
              </div>
              <div className="mt-0.5 text-[12px] text-muted">{c.product}</div>
              <div className="mt-2 grid grid-cols-[54px_1fr] gap-x-2 gap-y-0.5 text-[11px]">
                <span className="text-faint">audience</span>
                <span className="truncate text-muted">{c.audience}</span>
                <span className="text-faint">goal</span>
                <span className="truncate text-muted">{c.goal}</span>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <span className={`rounded px-1.5 py-px text-[11px] ${c.tone === 'brainrot' ? 'bg-hot/15 text-hot' : 'bg-accent/10 text-accent'}`}>
                  {TONES.find((t) => t.id === c.tone)?.label}
                </span>
                <span className="flex items-center gap-1.5 text-[11px] text-faint">
                  <StatusDot state={on ? 'running' : 'done'} /> {on ? 'in production' : c.live ? 'delivered · live run' : 'delivered'}
                </span>
              </div>
            </motion.button>
          )
        })}
      </div>

      <div className="mt-auto border-t border-line px-4 py-4">
        <div className="mb-2 text-[13px] font-medium text-text">Integrations</div>
        {INTEGRATIONS.map((i) => (
          <div key={i.name} className="flex items-center gap-2 py-1 text-[12px]">
            <span className={`h-1.5 w-1.5 rounded-full ${i.live ? 'bg-accent shadow-[0_0_6px_#2dd4bf]' : 'bg-faint'}`} />
            <span className={i.live ? 'text-text' : 'text-muted'}>{i.name}</span>
            <span className="ml-auto truncate pl-2 text-right text-[11px] text-faint">{i.live ? 'live' : 'roadmap'}</span>
          </div>
        ))}
      </div>
    </aside>
  )
}
