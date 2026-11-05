export function WaveMark({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden>
      <defs>
        <linearGradient id="rt-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#2dd4bf" />
          <stop offset="1" stopColor="#3b82f6" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="8" fill="url(#rt-g)" />
      <path d="M5 19c3.5 0 3.5-5 7-5s3.5 5 7 5 3.5-5 7-5" fill="none" stroke="#04121a" strokeWidth="2.6" strokeLinecap="round" />
      <path d="M5 24c3.5 0 3.5-3 7-3s3.5 3 7 3 3.5-3 7-3" fill="none" stroke="#04121a" strokeOpacity=".45" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

export function Logo() {
  return (
    <div className="flex items-center gap-2.5">
      <WaveMark />
      <div className="leading-none">
        <div className="text-[17px] font-semibold tracking-[-0.02em] text-text">Riptide</div>
        <div className="mt-0.5 text-[11px] text-faint">Run by a Grok Bot swarm</div>
      </div>
    </div>
  )
}

const BRAND_STYLE: Record<string, { bg: string; fg: string; mark: string; font: string }> = {
  perfume: { bg: '#0b0b0c', fg: '#e8e1d4', mark: 'N/05', font: '600 11px Geist, sans-serif' },
  cafe: { bg: '#3b2418', fg: '#f3d9b1', mark: 'R13', font: '600 12px Geist, sans-serif' },
  brainrot: { bg: '#b91c1c', fg: '#fde68a', mark: 'KuM', font: '700 11px Geist, sans-serif' },
}

/** client logo tile for a brief */
export function BrandLogo({ id, size = 36 }: { id: string; size?: number }) {
  const b = BRAND_STYLE[id] ?? BRAND_STYLE.perfume
  return (
    <span
      className="inline-flex shrink-0 items-center justify-center rounded-md border border-white/10"
      style={{ width: size, height: size, background: b.bg, color: b.fg, font: b.font, fontSize: size * 0.3, letterSpacing: '0.02em' }}
    >
      {b.mark}
    </span>
  )
}
