import { useEffect, useState } from 'react'

interface Props {
  width?: number
  height?: number
  colors?: string[]
  speed?: number
  rungs?: number
  amplitude?: number
  strandA?: string
  strandB?: string
}

export function useTime() {
  const [t, setT] = useState(0)
  useEffect(() => {
    let raf = 0
    const start = performance.now()
    const loop = (now: number) => {
      setT((now - start) / 1000)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])
  return t
}

export function Helix({
  width = 160,
  height = 520,
  colors = ['#b6ff00', '#ff2bd6', '#00f0ff', '#ffb800', '#8b5cff', '#ff5a36', '#3dffa8'],
  speed = 1.6,
  rungs = 22,
  amplitude,
  strandA = '#b6ff00',
  strandB = '#ff2bd6',
}: Props) {
  const t = useTime()
  const cx = width / 2
  const A = amplitude ?? width * 0.38
  const items = Array.from({ length: rungs }, (_, i) => {
    const y = 12 + (i / (rungs - 1)) * (height - 24)
    const ph = t * speed + i * 0.55
    const s = Math.sin(ph)
    const c = Math.cos(ph)
    return { i, y, x1: cx + A * s, x2: cx - A * s, front: c > 0, depth: (c + 1) / 2 }
  })
  return (
    <svg width={width} height={height} className="overflow-visible">
      {items.map(({ i, y, x1, x2, depth }) => (
        <line
          key={`r${i}`}
          x1={x1}
          x2={x2}
          y1={y}
          y2={y}
          stroke={colors[i % colors.length]}
          strokeWidth={3 + depth * 3}
          strokeLinecap="round"
          opacity={0.35 + depth * 0.65}
          style={{ filter: `drop-shadow(0 0 4px ${colors[i % colors.length]})` }}
        />
      ))}
      {items.map(({ i, y, x1, x2, front, depth }) => (
        <g key={`n${i}`}>
          <circle cx={x1} cy={y} r={4 + (front ? 4 : 1) * depth} fill={strandA} style={{ filter: `drop-shadow(0 0 6px ${strandA})` }} />
          <circle cx={x2} cy={y} r={4 + (front ? 1 : 4) * (1 - depth)} fill={strandB} style={{ filter: `drop-shadow(0 0 6px ${strandB})` }} />
        </g>
      ))}
    </svg>
  )
}
