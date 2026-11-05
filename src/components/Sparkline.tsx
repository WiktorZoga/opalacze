import { motion } from 'framer-motion'

interface Props {
  data: number[]
  width?: number
  height?: number
  color?: string
}

export function Sparkline({ data, width = 220, height = 60, color = '#b6ff00' }: Props) {
  const max = Math.max(...data)
  const min = Math.min(...data)
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width
    const y = height - 4 - ((v - min) / (max - min || 1)) * (height - 8)
    return [x, y] as const
  })
  const d = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ')
  const area = `${d} L${width},${height} L0,${height} Z`
  const id = `sg-${color.slice(1)}`
  const [lx, ly] = pts[pts.length - 1]
  return (
    <svg width={width} height={height} className="overflow-visible">
      <defs>
        <linearGradient id={id} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor={color} stopOpacity=".45" />
          <stop offset="1" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${id})`} />
      <motion.path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={2.5}
        style={{ filter: `drop-shadow(0 0 4px ${color})` }}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.4, ease: 'easeOut' }}
      />
      <motion.circle
        cx={lx}
        cy={ly}
        r={4}
        fill={color}
        animate={{ r: [3, 7, 3], opacity: [1, 0.4, 1] }}
        transition={{ duration: 1.2, repeat: Infinity }}
      />
    </svg>
  )
}
