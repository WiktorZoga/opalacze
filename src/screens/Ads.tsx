import { motion } from 'framer-motion'
import { useCampaign } from '../data/campaigns'
import { useCleanClips, workCards, type WorkCard } from '../data/textless'

function Card({ card, i, hot, width }: { card: WorkCard; i: number; hot: boolean; width: string }) {
  const v = card.video
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.06 * i, duration: 0.45, ease: 'easeOut' }}
      className="flex h-full min-h-0 flex-col"
      style={{ width }}
    >
      <div className={`min-h-0 flex-1 overflow-hidden rounded-2xl ${card.fun ? 'bg-gradient-to-br from-[#2dd4bf] to-[#3b82f6] p-[3px]' : 'bg-[#e7ebef]'} ${hot ? 'outline outline-2 outline-offset-4 outline-text' : ''}`}>
        <video
          key={v.url}
          src={v.url}
          poster={v.poster ? v.poster : undefined}
          className={`h-full w-full object-cover ${card.fun ? 'rounded-[13px]' : ''}`}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        />
      </div>
      <div className="mt-3 shrink-0 px-1">
        <div className="text-[15px] font-medium text-text">{card.brand}</div>
        <div className="text-[13px] text-muted">{card.line}</div>
      </div>
    </motion.div>
  )
}

export function Work() {
  const { campaign, tone } = useCampaign()
  const cards = workCards(useCleanClips())
  const hot = tone === 'brainrot' ? 'brainrot' : campaign.id
  return (
    <div className="flex h-full flex-col px-10 pb-6 pt-4">
      <h1 className="shrink-0 text-[56px] font-semibold leading-none tracking-[-0.045em] text-text">Work</h1>
      <div className="mt-5 flex min-h-0 flex-1 items-stretch justify-center gap-5">
        {cards.map((card, i) => (
          <Card key={card.node} card={card} i={i} hot={hot === card.node} width={`${Math.floor(90 / cards.length)}%`} />
        ))}
      </div>
    </div>
  )
}
