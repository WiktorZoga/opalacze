import { motion } from 'framer-motion'

interface Props {
  src?: string
  kind?: 'image' | 'video'
  alt: string
  width: number
  height: number
  /** fade/scale the media in once it is ready */
  reveal?: boolean
  className?: string
  pendingLabel?: string
  /** meme caption overlaid on the media (only for media without a baked-in caption) */
  caption?: string
}

/** real media (image or clip) in a clean frame, or a neutral pending tile */
export function MediaFrame({ src, kind = 'image', alt, width, height, reveal = true, className = '', pendingLabel = 'render pending', caption }: Props) {
  if (!src) {
    return (
      <div
        className={`flex flex-col items-center justify-center gap-2 rounded-md border border-dashed border-line-strong bg-raised/60 ${className}`}
        style={{ width, height }}
      >
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-faint" />
        {height > 80 && <span className="px-2 text-center font-mono text-[11px] text-faint">{pendingLabel}</span>}
      </div>
    )
  }
  const inner =
    kind === 'video' ? (
      <video src={src} className="h-full w-full object-cover" autoPlay muted loop playsInline />
    ) : (
      <img src={src} alt={alt} className="h-full w-full object-cover" />
    )
  return (
    <motion.div
      className={`relative overflow-hidden rounded-md border border-line-strong bg-black ${className}`}
      style={{ width, height }}
      initial={reveal ? { opacity: 0, scale: 0.97 } : false}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
    >
      {inner}
      {caption && width >= 120 && (
        <div className="meme-text absolute inset-x-0 top-0 px-2 pt-3 text-center" style={{ fontSize: Math.max(13, width * 0.085) }}>
          {caption}
        </div>
      )}
    </motion.div>
  )
}
