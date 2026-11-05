import { motion } from 'framer-motion'
import type { Meme } from '../data/memes'
import { Krasnal } from './Krasnal'
import { useElapsed } from './AgentSwarm'

interface Props {
  meme: Meme
  caption: string
  width?: number
  handle?: string
  delay?: number
  stats?: [string, string, string]
}

export function Phone({ meme, caption, width = 300, handle = '@rotbot.lab', delay = 0, stats = ['1.2M', '8.4K', '31K'] }: Props) {
  const h = width * (16 / 9)
  const ms = useElapsed(`phone-${meme.id}-${caption}`, 80)
  const t = Math.max(0, ms - delay)
  const words = caption.split(' ')
  const shownWords = Math.min(words.length, Math.floor(t / 260))
  const progress = ((t % 6000) / 6000) * 100

  return (
    <div className="relative rounded-[38px] border-[3px] border-white/20 bg-black p-2 shadow-[0_0_40px_#ff2bd633]" style={{ width: width + 16 }}>
      <div className="relative overflow-hidden rounded-[30px]" style={{ width, height: h, background: meme.bg }}>
        <div className="absolute left-1/2 top-2 z-20 h-5 w-24 -translate-x-1/2 rounded-full bg-black" />
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{ scale: [1, 1.18, 1.05, 1.2], rotate: [0, -2, 2, 0], y: [0, -10, 6, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: delay / 1000 }}
        >
          {meme.img ? (
            <img src={meme.img} alt={meme.name} className="h-full w-full object-cover" />
          ) : meme.art === 'krasnal' ? (
            <Krasnal className="w-[85%]" />
          ) : (
            <span style={{ fontSize: width * 0.5 }}>{meme.art}</span>
          )}
          {meme.accent && (
            <motion.span
              className="absolute"
              style={{ fontSize: width * 0.2, right: width * 0.08, top: h * 0.3 }}
              animate={{ rotate: [0, 20, -20, 0], scale: [1, 1.3, 1] }}
              transition={{ duration: 1.2, repeat: Infinity }}
            >
              {meme.accent}
            </motion.span>
          )}
        </motion.div>
        <div className="absolute inset-x-3 top-9 z-10 h-1 rounded bg-white/25">
          <div className="h-full rounded bg-white" style={{ width: `${progress}%` }} />
        </div>
        <div className="absolute inset-x-4 top-[58%] z-10 text-center">
          <span className="meme-text inline rounded px-1 text-[26px] leading-tight" style={{ fontSize: width * 0.085 }}>
            {words.slice(0, shownWords).join(' ')}
          </span>
        </div>
        <div className="absolute bottom-24 right-3 z-10 flex flex-col items-center gap-4 font-mono text-[12px] font-bold text-white">
          {[
            ['♥', stats[0]],
            ['💬', stats[1]],
            ['↗', stats[2]],
          ].map(([i, v]) => (
            <div key={i} className="flex flex-col items-center">
              <span className="text-[26px] drop-shadow">{i}</span>
              {v}
            </div>
          ))}
        </div>
        <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/90 to-transparent p-4 pt-12 font-mono text-[13px] text-white">
          <div className="font-bold">{handle}</div>
          <div className="truncate text-white/70">{meme.name} · #brainrot #wrocław</div>
        </div>
      </div>
    </div>
  )
}
