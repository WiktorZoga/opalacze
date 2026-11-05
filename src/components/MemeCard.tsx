import { assetUrl, type Meme } from '../data/memes'
import { Krasnal } from './Krasnal'

interface Props {
  meme: Meme
  width?: number
  gen?: number
  className?: string
  glow?: 'acid' | 'hot' | 'none'
}

export function MemeCard({ meme, width = 320, gen, className = '', glow = 'none' }: Props) {
  const h = width * 1.12
  const fs = Math.max(12, width * 0.085)
  const glowCls = glow === 'acid' ? 'box-glow-acid' : glow === 'hot' ? 'box-glow-hot' : ''
  return (
    <div
      className={`relative overflow-hidden rounded-xl border-2 border-black select-none ${glowCls} ${className}`}
      style={{ width, height: h, background: meme.bg }}
    >
      <div className="absolute inset-0 opacity-30" style={{ background: 'radial-gradient(circle at 50% 120%,#000 0%,transparent 60%)' }} />
      {meme.img ? (
        <img src={assetUrl(meme.img)} alt={meme.name} className="absolute inset-0 h-full w-full object-cover" />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          {meme.art === 'krasnal' ? (
            <Krasnal className="drop-shadow-[0_8px_16px_rgba(0,0,0,.6)]" />
          ) : (
            <span style={{ fontSize: width * 0.46, lineHeight: 1 }} className="drop-shadow-[0_8px_16px_rgba(0,0,0,.6)]">
              {meme.art}
            </span>
          )}
          {meme.accent && (
            <span
              className="absolute drop-shadow-[0_4px_8px_rgba(0,0,0,.6)]"
              style={{ fontSize: width * 0.2, right: width * 0.1, bottom: h * 0.24, transform: 'rotate(12deg)' }}
            >
              {meme.accent}
            </span>
          )}
        </div>
      )}
      <div className="meme-text absolute inset-x-0 top-0 px-3 pt-3 text-center" style={{ fontSize: fs }}>
        {meme.top}
      </div>
      <div className="meme-text absolute inset-x-0 bottom-0 px-3 pb-3 text-center" style={{ fontSize: fs }}>
        {meme.bottom}
      </div>
      {gen !== undefined && (
        <div className="absolute right-2 top-1/2 -translate-y-1/2 rotate-90 origin-right font-mono text-[10px] font-bold tracking-widest text-white/60">
          ROT BOT · GEN {gen}
        </div>
      )}
    </div>
  )
}
