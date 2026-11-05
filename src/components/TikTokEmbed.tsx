import { useEffect, useRef, useState } from 'react'
import type { TikTokSource } from '../data/tiktokSources'

interface Props {
  source: TikTokSource
  /** px; height follows 9:16 */
  width?: number
  autoplay?: boolean
  muted?: boolean
  /** show trend name / stats strip under the player */
  showMeta?: boolean
  /** fall back to the card if the player hasn't loaded by then */
  loadTimeoutMs?: number
  className?: string
}

type Status = 'idle' | 'loading' | 'ready' | 'failed'

const fill = { position: 'absolute', inset: 0, width: '100%', height: '100%' } as const

const compact = new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 })
const formatCount = (n: number) => compact.format(n)

const tiktokPlayerUrl = (videoId: string, { autoplay = false, muted = true } = {}) =>
  `https://www.tiktok.com/player/v1/${videoId}?` +
  new URLSearchParams({
    autoplay: autoplay ? '1' : '0',
    muted: muted ? '1' : '0',
    loop: '1',
    rel: '0',
    controls: '1',
    progress_bar: '1',
    play_button: '1',
    volume_control: '1',
    fullscreen_button: '1',
    music_info: '1',
    description: '1',
  })

export function TikTokEmbed({
  source,
  width = 300,
  autoplay = false,
  muted = true,
  showMeta = true,
  loadTimeoutMs = 10000,
  className = '',
}: Props) {
  const box = useRef<HTMLDivElement>(null)
  const frame = useRef<HTMLIFrameElement>(null)
  const [status, setStatus] = useState<Status>(() => {
    if (typeof navigator !== 'undefined' && navigator.onLine === false) return 'failed'
    return typeof IntersectionObserver === 'undefined' ? 'loading' : 'idle'
  })

  useEffect(() => {
    if (status !== 'idle' || !box.current) return
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setStatus('loading')
          io.disconnect()
        }
      },
      { rootMargin: '300px' },
    )
    io.observe(box.current)
    return () => io.disconnect()
  }, [status])

  useEffect(() => {
    if (status !== 'loading') return
    const timer = window.setTimeout(() => setStatus((s) => (s === 'loading' ? 'failed' : s)), loadTimeoutMs)
    const onMessage = (e: MessageEvent) => {
      if (e.source !== frame.current?.contentWindow) return
      const data = typeof e.data === 'string' ? safeParse(e.data) : e.data
      if (data?.['x-tiktok-player'] && data.type === 'onPlayerReady') setStatus('ready')
    }
    const onOffline = () => setStatus('failed')
    window.addEventListener('message', onMessage)
    window.addEventListener('offline', onOffline)
    return () => {
      window.clearTimeout(timer)
      window.removeEventListener('message', onMessage)
      window.removeEventListener('offline', onOffline)
    }
  }, [status, loadTimeoutMs])

  const height = Math.round(width * (16 / 9))

  return (
    <div className={`flex flex-col gap-2 ${className}`} style={{ width }}>
      <div
        ref={box}
        className="relative overflow-hidden rounded-lg border border-line bg-black"
        style={{ position: 'relative', overflow: 'hidden', borderRadius: 8, background: '#000', width, height }}
      >
        {status === 'failed' ? (
          <FallbackCard source={source} />
        ) : (
          <>
            {status !== 'ready' && <Poster source={source} />}
            {status !== 'idle' && (
              <iframe
                ref={frame}
                title={`TikTok by @${source.author}: ${source.trendName}`}
                src={tiktokPlayerUrl(source.videoId, { autoplay, muted })}
                className="absolute inset-0 h-full w-full"
                loading="lazy"
                allow="autoplay; encrypted-media; fullscreen; picture-in-picture; clipboard-write; web-share"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
                onLoad={() => setStatus((s) => (s === 'loading' ? 'ready' : s))}
                style={{ ...fill, border: 0 }}
              />
            )}
          </>
        )}
      </div>
      {showMeta && <MetaStrip source={source} />}
    </div>
  )
}

function safeParse(s: string): Record<string, unknown> | null {
  try {
    return JSON.parse(s)
  } catch {
    return null
  }
}

function Thumb({ source }: { source: TikTokSource }) {
  const [broken, setBroken] = useState(!source.thumbnailUrl)
  if (broken) {
    return <div style={{ ...fill, background: '#18181b' }} />
  }
  return (
    <img
      src={source.thumbnailUrl}
      alt=""
      loading="lazy"
      referrerPolicy="no-referrer"
      onError={() => setBroken(true)}
      style={{ ...fill, objectFit: 'cover' }}
    />
  )
}

function Poster({ source }: { source: TikTokSource }) {
  return (
    <div style={fill}>
      <Thumb source={source} />
      <div style={fill} className="flex items-center justify-center bg-black/30">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/30 border-t-white" />
      </div>
    </div>
  )
}

function FallbackCard({ source }: { source: TikTokSource }) {
  return (
    <a
      href={source.url}
      target="_blank"
      rel="noopener noreferrer"
      style={fill}
      className="group block text-white"
    >
      <Thumb source={source} />
      <div style={fill} className="flex flex-col justify-end bg-gradient-to-t from-black/90 via-black/40 to-transparent p-3">
        <div className="mb-auto self-start rounded bg-black/60 px-1.5 py-0.5 font-mono text-[10px] text-white/70">
          {source.trendTag}
        </div>
        <div className="text-[15px] font-medium leading-tight">{source.trendName}</div>
        <div className="mt-1 line-clamp-2 text-[12px] text-white/75">{source.title}</div>
        <div className="mt-2 text-[12px] text-white/90">
          @{source.author} · {formatCount(source.views)} views · {formatCount(source.likes)} likes
        </div>
        <div className="mt-3 rounded-md border border-white/25 px-3 py-1.5 text-center text-[12px] text-white/90 group-hover:border-white/60">
          Watch on TikTok ↗
        </div>
      </div>
    </a>
  )
}

function MetaStrip({ source }: { source: TikTokSource }) {
  const posted = new Date(source.postedAt).toLocaleDateString('en', { month: 'short', day: 'numeric' })
  return (
    <div className="text-[12px] leading-snug text-muted">
      <div className="flex items-baseline justify-between gap-2">
        <span className="truncate font-medium text-text">{source.trendName}</span>
        <span className="shrink-0 text-white/60">{posted}</span>
      </div>
      <div className="text-white/60">
        <a href={source.authorUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white">
          @{source.author}
        </a>{' '}
        · ▶ {formatCount(source.views)} · ♥ {formatCount(source.likes)}
      </div>
      <div className="mt-1 text-white/70">{source.whyViral}</div>
    </div>
  )
}
