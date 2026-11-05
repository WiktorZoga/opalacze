import { useEffect, useState, type ReactNode } from 'react'

export const STAGE_W = 1920
export const STAGE_H = 1080

export function Stage({ children }: { children: ReactNode }) {
  const [scale, setScale] = useState(1)
  useEffect(() => {
    const fit = () => setScale(Math.min(window.innerWidth / STAGE_W, window.innerHeight / STAGE_H))
    fit()
    window.addEventListener('resize', fit)
    return () => window.removeEventListener('resize', fit)
  }, [])
  return (
    <div className="flex h-full w-full items-center justify-center bg-black">
      <div
        className="relative shrink-0 overflow-hidden bg-bg"
        style={{ width: STAGE_W, height: STAGE_H, transform: `scale(${scale})`, transformOrigin: 'center' }}
      >
        {children}
      </div>
    </div>
  )
}
