import { motion } from 'framer-motion'
import { AGENTS, type AgentId } from '../data/agents'

interface Props {
  id: AgentId
  size?: number
  active?: boolean
  label?: boolean
}

export function Mascot({ id, size = 64, active = false, label = false }: Props) {
  const a = AGENTS[id]
  return (
    <div className="flex flex-col items-center gap-1">
      <motion.div
        className="relative flex items-center justify-center rounded-full"
        style={{
          width: size,
          height: size,
          background: `radial-gradient(circle at 35% 30%, ${a.color}55, #0b0d12 70%)`,
          boxShadow: active ? `0 0 0 2px ${a.color}, 0 0 28px ${a.color}aa` : `0 0 0 1px ${a.color}66`,
        }}
        animate={active ? { y: [0, -6, 0], rotate: [0, -4, 4, 0] } : { y: 0 }}
        transition={{ duration: 0.6, repeat: active ? Infinity : 0 }}
      >
        <span style={{ fontSize: size * 0.58, lineHeight: 1 }}>{a.emoji}</span>
        <span className="absolute" style={{ fontSize: size * 0.32, right: -size * 0.06, bottom: -size * 0.04 }}>
          {a.prop}
        </span>
      </motion.div>
      {label && (
        <div className="font-mono text-[11px] font-bold tracking-widest" style={{ color: a.color }}>
          {a.name}
        </div>
      )}
    </div>
  )
}

export function SpeechBubble({ id, text, tone }: { id: AgentId; text: string; tone?: string }) {
  const a = AGENTS[id]
  const border = tone === 'reject' ? '#ff2d3d' : tone === 'approve' ? '#b6ff00' : a.color
  return (
    <motion.div
      initial={{ scale: 0.6, opacity: 0, y: 10 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ type: 'spring', stiffness: 400, damping: 22 }}
      className="relative max-w-[360px] rounded-2xl bg-black/85 px-4 py-2 font-mono text-[17px] font-bold text-white"
      style={{ border: `2px solid ${border}`, boxShadow: `0 0 20px ${border}66` }}
    >
      {text}
    </motion.div>
  )
}
