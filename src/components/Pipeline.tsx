import { motion } from 'framer-motion'
import { AGENTS, PIPELINE } from '../data/agents'
import { Mascot } from './Mascot'

const W = 1480
const H = 168
const NODE_Y = 62
const xs = PIPELINE.map((_, i) => 110 + i * ((W - 220) / (PIPELINE.length - 1)))

/** stage = index of the node currently emitting; PIPELINE.length means the metrics → scout feedback edge */
export function Pipeline({ stage }: { stage: number }) {
  const loopPath = `M${xs[xs.length - 1]},${NODE_Y + 40} C${xs[xs.length - 1]},${H - 6} ${xs[0]},${H - 6} ${xs[0]},${NODE_Y + 40}`
  const loopActive = stage >= PIPELINE.length - 1
  return (
    <div className="relative shrink-0 border-b border-line bg-[linear-gradient(180deg,#0b0d12,#050507)]" style={{ width: W, height: H }}>
      <div className="absolute left-5 top-3 font-mono text-[12px] font-bold tracking-[0.3em] text-white/40">AGENT PIPELINE · EVOLUTION LOOP</div>
      <svg width={W} height={H} className="absolute inset-0">
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {xs.slice(0, -1).map((x, i) => {
          const on = i === stage
          const path = `M${x + 40},${NODE_Y} L${xs[i + 1] - 40},${NODE_Y}`
          const c = AGENTS[PIPELINE[i].agent].color
          return (
            <g key={i}>
              <path id={`edge-${i}`} d={path} stroke={on ? c : '#2a3040'} strokeWidth={on ? 3 : 2} strokeDasharray={on ? '0' : '6 6'} filter={on ? 'url(#glow)' : undefined} />
              {[0, 1, 2].map((k) => (
                <circle key={k} r={on ? 5 : 3} fill={on ? c : '#4a5468'} filter={on ? 'url(#glow)' : undefined}>
                  <animateMotion dur={on ? '1.1s' : '2.6s'} repeatCount="indefinite" begin={`${k * (on ? 0.37 : 0.87)}s`} path={path} />
                </circle>
              ))}
            </g>
          )
        })}
        <path d={loopPath} fill="none" stroke={loopActive ? '#8b5cff' : '#2a3040'} strokeWidth={loopActive ? 3 : 2} strokeDasharray="6 6" filter={loopActive ? 'url(#glow)' : undefined} />
        {[0, 1, 2, 3].map((k) => (
          <circle key={k} r={loopActive ? 5 : 3} fill={loopActive ? '#8b5cff' : '#4a5468'}>
            <animateMotion dur="3s" repeatCount="indefinite" begin={`${k * 0.75}s`} path={loopPath} />
          </circle>
        ))}
      </svg>
      <div
        className="absolute rounded-full border border-hot/60 bg-black px-3 py-0.5 font-mono text-[12px] font-bold text-hot"
        style={{ left: (xs[0] + xs[xs.length - 1]) / 2 - 130, top: H - 30 }}
      >
        ↺ metrics → next generation
      </div>
      {PIPELINE.map((p, i) => {
        const active = i === stage || (stage === PIPELINE.length && i === 0)
        const a = AGENTS[p.agent]
        return (
          <div key={p.agent} className="absolute flex -translate-x-1/2 flex-col items-center" style={{ left: xs[i], top: NODE_Y - 34 }}>
            <Mascot id={p.agent} size={68} active={active} />
            <div className="mt-1 font-mono text-[12px] font-extrabold tracking-widest" style={{ color: active ? a.color : '#8892a6' }}>
              {a.name}
            </div>
          </div>
        )
      })}
      {stage < PIPELINE.length - 1 && (
        <motion.div
          key={stage}
          className="absolute rounded-md px-2.5 py-1 font-mono text-[13px] font-extrabold uppercase text-black"
          style={{ top: NODE_Y - 38, background: AGENTS[PIPELINE[stage].agent].color, boxShadow: `0 0 20px ${AGENTS[PIPELINE[stage].agent].color}` }}
          initial={{ left: xs[stage] + 20, opacity: 0 }}
          animate={{ left: [xs[stage] + 20, xs[stage + 1] - 90], opacity: [0, 1, 1, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        >
          📦 {PIPELINE[stage].packet}
        </motion.div>
      )}
    </div>
  )
}
