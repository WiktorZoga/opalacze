import { motion } from 'framer-motion'
import { useCampaign } from '../data/campaigns'
import { useGrokMedia, type GrokMedia } from '../data/grokMedia'
import { assetUrl } from '../data/memes'
import { BriefPicker } from './Swarm'

interface Ad {
  key: string
  media?: { url: string; kind: 'image' | 'video'; poster?: string }
  title: string
  meta: string
  tag: string
  caption?: string
}

function Phone({ ad, i }: { ad: Ad; i: number }) {
  const W = 320
  const H = Math.round((W * 16) / 9)
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 * i, duration: 0.5, ease: 'easeOut' }} className="flex flex-col items-center">
      <div className="relative rounded-[42px] bg-[#0c1116] p-[10px] shadow-[0_30px_60px_-30px_rgba(16,24,40,.55),0_0_0_1px_rgba(16,24,40,.08)]">
        <div className="absolute left-1/2 top-[18px] z-10 h-[18px] w-[90px] -translate-x-1/2 rounded-full bg-[#0c1116]" />
        <div className="relative overflow-hidden rounded-[32px] bg-[#e9edf1]" style={{ width: W, height: H }}>
          {ad.media?.kind === 'video' ? (
            <video key={ad.media.url} src={ad.media.url} poster={ad.media.poster} className="h-full w-full object-cover" autoPlay muted loop playsInline preload="auto" />
          ) : ad.media ? (
            <img src={ad.media.url} alt={ad.title} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-[13px] text-faint">render queued</div>
          )}
          {ad.caption && (
            <div className="absolute inset-x-0 top-[20%] flex justify-center px-5">
              <span className="rounded-lg bg-black/70 px-3 py-1.5 text-center text-[17px] font-semibold leading-snug text-white">{ad.caption}</span>
            </div>
          )}
          <span className="absolute bottom-4 left-4 rounded-md bg-black/60 px-2 py-0.5 text-[11px] font-medium text-white/90">#ad · AI-generated</span>
        </div>
      </div>
      <div className="mt-5 text-center text-[17px] text-text">{ad.title}</div>
    </motion.div>
  )
}

const asMedia = (m?: GrokMedia) => (m ? { url: m.url, kind: m.kind, poster: m.poster ? assetUrl(m.poster) : undefined } : undefined)

export function Ads({ onOpen }: { onOpen: (id: string) => void }) {
  const { campaign: c } = useCampaign()
  const lib = useGrokMedia()
  const ads: Ad[] = []
  if (c.id === 'perfume') {
    if (c.live) ads.push({ key: 'live', media: { url: c.live.clip, kind: 'video' }, title: `${c.live.persona} · live run`, meta: `“Why would I deceive you?” · grok-imagine`, tag: 'UGC · Variant C' })
    ads.push({ key: 'a', media: asMedia(lib.byId('noir05-unboxing')), title: 'Maja · unboxing', meta: 'AI creator persona · 5 s', tag: 'UGC · Variant A', caption: 'okay this smells expensive' })
    ads.push({ key: 'b', media: asMedia(lib.byId('noir05-grwm')), title: 'Maja · get ready with me', meta: 'AI creator persona · 5 s', tag: 'UGC · Variant B', caption: 'get ready with me' })
    ads.push({ key: 'r', media: asMedia(lib.byId('noir05-brainrot-capybara')), title: 'Capybara spritz', meta: 'same brief, other tone', tag: 'Brainrot', caption: 'pov: you smell like a 3am decision' })
  } else if (c.id === 'cafe') {
    ads.push({ key: 'a', media: asMedia(lib.byId('cafe-first-time-fancy')), title: 'Kuba · first time in a fancy cafe', meta: 'rides the 10.8M-view trend', tag: 'UGC' })
    ads.push({ key: 'r', media: asMedia(lib.byId('brandrot-wroclaw-cafe')), title: 'Bronze energy', meta: 'same brief, other tone', tag: 'Brainrot' })
  } else {
    ads.push({ key: 'a', media: asMedia(lib.byId('brandrot-kebab-u-mustafy')), title: 'The prophecy', meta: 'late-night kebab · 6 s loop', tag: 'Brainrot' })
    ads.push({ key: 'b', media: asMedia(lib.byId('brandrot-your-startup')), title: 'One day before the pivot', meta: 'range demo', tag: 'Brainrot' })
  }

  return (
    <div className="flex h-full flex-col px-16 pb-8 pt-10">
      <div className="flex items-end justify-between gap-10">
        <div>
          <h1 className="text-[76px] font-semibold leading-[0.98] tracking-[-0.045em] text-text">The ads it made.</h1>
        </div>
        <BriefPicker onOpen={onOpen} />
      </div>
      <div className="flex flex-1 items-center justify-center gap-12">
        {ads.map((ad, i) => (
          <Phone key={`${c.id}-${ad.key}`} ad={ad} i={i} />
        ))}
      </div>
    </div>
  )
}
