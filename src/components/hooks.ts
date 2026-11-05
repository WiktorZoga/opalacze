import { useEffect, useState } from 'react'

export function useElapsed(resetKey: unknown, tick = 100) {
  const [ms, setMs] = useState(0)
  useEffect(() => {
    const start = performance.now()
    setMs(0)
    const id = setInterval(() => setMs(performance.now() - start), tick)
    return () => clearInterval(id)
  }, [resetKey, tick])
  return ms
}

/** frame-accurate clock in ms, capped at `max` */
export function useClock(resetKey: unknown, max = Infinity) {
  const [ms, setMs] = useState(0)
  useEffect(() => {
    let raf = 0
    const start = performance.now()
    setMs(0)
    const loop = (now: number) => {
      const t = now - start
      setMs(Math.min(t, max))
      if (t < max) raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [resetKey, max])
  return ms
}
