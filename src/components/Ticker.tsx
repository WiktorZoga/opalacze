import { TICKER_EXTRA, TRENDS } from '../data/trends'

export function Ticker({ fast = false }: { fast?: boolean }) {
  const items = [
    ...TRENDS.map((t) => ({ ticker: t.ticker, growth: t.growth })),
    ...TICKER_EXTRA,
  ]
  const row = [...items, ...items]
  return (
    <div className="relative h-11 overflow-hidden border-y border-acid/30 bg-black">
      <div className={`flex h-full w-max items-center whitespace-nowrap ${fast ? 'animate-ticker-fast' : 'animate-ticker'}`}>
        {row.map((it, i) => {
          const up = it.growth >= 0
          return (
            <span key={i} className="mx-6 font-mono text-[18px] font-bold">
              <span className="text-white/90">{it.ticker}</span>{' '}
              <span className={up ? 'text-acid glow-acid' : 'text-blood'}>
                {up ? '▲' : '▼'} {Math.abs(it.growth).toFixed(it.growth % 1 ? 1 : 0)}%
              </span>
              <span className="ml-6 text-white/20">│</span>
            </span>
          )
        })}
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-black to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-black to-transparent" />
    </div>
  )
}
