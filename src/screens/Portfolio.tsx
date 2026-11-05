import { useEffect, useRef } from 'react'
import { useCleanClips } from '../data/textless'
import { Swarm } from './Swarm'
import { Work } from './Ads'

export type PortfolioSection = 'hero' | 'swarm' | 'work'

function Wall() {
  const clips = useCleanClips()
  const cols = clips.length <= 5 ? Math.max(clips.length, 1) : Math.ceil(clips.length / 2)
  return (
    <div className="grid min-h-0 flex-1 gap-1.5 p-1.5" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`, gridAutoRows: '1fr' }}>
      {clips.map((c) => (
        <div key={c.id} className="relative min-h-0 overflow-hidden rounded-xl bg-[#e7ebef]">
          <video
            src={c.url}
            poster={c.poster}
            className="absolute inset-0 h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
          />
        </div>
      ))}
    </div>
  )
}

export function Portfolio({ runKey, onOpen, section }: { runKey: number; onOpen: (id: string) => void; section?: PortfolioSection }) {
  const scroller = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const root = scroller.current
    if (!root || !section) return
    const el = root.querySelector(`[data-section="${section}"]`)
    if (el instanceof HTMLElement) el.scrollIntoView({ behavior: section === 'hero' ? 'auto' : 'smooth', block: 'start' })
  }, [section])

  return (
    <div ref={scroller} className="h-full overflow-y-auto">
      <section data-section="hero" className="flex h-full flex-col overflow-hidden">
        <Wall />
        <div className="flex shrink-0 items-baseline justify-between px-8 py-3">
          <div className="text-[15px] text-text">UGC ads, made by the swarm</div>
          <div className="text-[13px] text-muted">NOIR/05 · STRIDE · Rynek 13</div>
        </div>
      </section>
      <section data-section="swarm" className="h-full overflow-hidden">
        <Swarm runKey={runKey} onOpen={onOpen} embedded />
      </section>
      <section data-section="work" className="h-full overflow-hidden">
        <Work />
      </section>
    </div>
  )
}
