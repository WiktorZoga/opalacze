import { motion } from 'framer-motion'
import { MEMES } from '../data/memes'
import { HALL_OF_FAME, TREE } from '../data/generations'
import { MemeCard } from '../components/MemeCard'

const GENS = [1, 2, 4, 5, 6, 7]
const COL_W = 140
const X0 = 70
const Y_TOP = 150
const AREA_H = 560

function layout() {
  const pos: Record<string, { x: number; y: number }> = {}
  for (const gen of GENS) {
    const nodes = TREE.filter((n) => n.gen === gen)
    nodes.forEach((n, i) => {
      pos[n.id] = {
        x: X0 + GENS.indexOf(gen) * COL_W,
        y: Y_TOP + ((i + 1) * AREA_H) / (nodes.length + 1) - 70,
      }
    })
  }
  return pos
}

export function FamilyTree() {
  const pos = layout()
  const CARD = 110
  return (
    <div className="grid-bg relative h-full overflow-hidden">
      <div className="absolute left-12 top-6">
        <div className="font-mono text-[13px] tracking-[0.3em] text-hot glow-hot">EVOLUTION LOOP</div>
        <h1 className="font-display text-[50px] font-bold leading-none text-white">
          FAMILY <span className="text-acid glow-acid">TREE</span>
        </h1>
      </div>
      <div className="absolute left-[70px] top-[118px] flex font-mono text-[13px] font-bold tracking-widest text-white/40">
        {GENS.map((g) => (
          <div key={g} style={{ width: COL_W }}>
            GEN {g}
          </div>
        ))}
      </div>
      <svg className="absolute inset-0" width="1480" height="800">
        {TREE.flatMap((n) =>
          n.parents.map((p, i) => {
            const a = pos[p]
            const b = pos[n.id]
            const x1 = a.x + CARD
            const y1 = a.y + CARD * 0.56
            const x2 = b.x
            const y2 = b.y + CARD * 0.56
            const legend = n.status === 'legend'
            return (
              <motion.path
                key={`${p}-${n.id}`}
                d={`M${x1},${y1} C${x1 + 50},${y1} ${x2 - 50},${y2} ${x2},${y2}`}
                stroke={legend ? '#b6ff00' : n.status === 'extinct' ? '#ff2d3d66' : '#ff2bd6aa'}
                strokeWidth={legend ? 4 : 2}
                fill="none"
                style={{ filter: legend ? 'drop-shadow(0 0 6px #b6ff00)' : undefined }}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: 0.2 + n.gen * 0.18 + i * 0.05, duration: 0.6 }}
              />
            )
          }),
        )}
      </svg>
      {TREE.map((n) => (
        <motion.div
          key={n.id}
          className="absolute"
          style={{ left: pos[n.id].x, top: pos[n.id].y }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: n.status === 'legend' ? 1.35 : 1, opacity: 1 }}
          transition={{ delay: 0.1 + n.gen * 0.18, type: 'spring', stiffness: 200, damping: 16 }}
        >
          <div className={n.status === 'extinct' ? 'opacity-40 grayscale' : ''}>
            <MemeCard meme={MEMES[n.memeId]} width={CARD} glow={n.status === 'legend' ? 'acid' : 'none'} />
          </div>
          <div className="mt-1 w-[110px] truncate text-center font-mono text-[11px] font-bold text-white/70">
            {n.status === 'extinct' ? '☠ ' : n.status === 'legend' ? '👑 ' : ''}
            {MEMES[n.memeId].name}
          </div>
        </motion.div>
      ))}
      <motion.div
        className="absolute rounded-xl border-2 border-dashed border-[#8b5cff] px-4 py-6 text-center font-mono text-[13px] font-bold text-[#b9a0ff]"
        style={{ left: X0 + 6 * COL_W + 30, top: 360 }}
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 1.6, repeat: Infinity }}
      >
        🥚 GEN 8
        <br />
        incubating
      </motion.div>

      <div className="absolute right-10 top-8 w-[330px] rounded-xl border border-amber/50 bg-black/70 p-5 shadow-[0_0_30px_#ffb80033]">
        <div className="font-mono text-[14px] font-extrabold tracking-[0.3em] text-amber">🏆 HALL OF FAME</div>
        <div className="mt-4 space-y-4">
          {HALL_OF_FAME.map((h, i) => (
            <motion.div key={h.memeId} className="flex items-center gap-3" initial={{ x: 60, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 1.2 + i * 0.2 }}>
              <div className="font-meme text-[34px] text-amber">#{i + 1}</div>
              <MemeCard meme={MEMES[h.memeId]} width={70} />
              <div className="font-mono">
                <div className="text-[15px] font-bold text-white">{h.title}</div>
                <div className="text-[12px] text-white/50">
                  Gen {h.gen} · {h.stat}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
