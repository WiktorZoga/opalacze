export function Krasnal({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 250" className={className} aria-label="Wrocław krasnal CEO">
      <defs>
        <linearGradient id="hat" x1="0" x2="1">
          <stop offset="0" stopColor="#ff3b3b" />
          <stop offset="1" stopColor="#b3001b" />
        </linearGradient>
        <linearGradient id="suit" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#23263a" />
          <stop offset="1" stopColor="#0c0d16" />
        </linearGradient>
        <linearGradient id="bronze" x1="0" x2="1">
          <stop offset="0" stopColor="#7a4a1a" />
          <stop offset=".5" stopColor="#d9a35b" />
          <stop offset="1" stopColor="#6b3e12" />
        </linearGradient>
      </defs>
      <rect x="40" y="228" width="120" height="20" rx="3" fill="url(#bronze)" />
      <text x="100" y="243" textAnchor="middle" fontSize="11" fontFamily="JetBrains Mono" fontWeight="800" fill="#2a1505">
        WROCŁAW · CEO
      </text>
      <path d="M52 228 L66 152 Q100 140 134 152 L148 228 Z" fill="url(#suit)" />
      <path d="M86 150 L114 150 L100 192 Z" fill="#f4f4f4" />
      <path d="M96 156 L104 156 L107 196 L100 206 L93 196 Z" fill="#ff2bd6" />
      <path d="M66 152 L86 150 L98 200 L80 188 Z" fill="#2d3150" />
      <path d="M134 152 L114 150 L102 200 L120 188 Z" fill="#2d3150" />
      <rect x="114" y="176" width="20" height="13" rx="2" fill="#b6ff00" />
      <text x="124" y="186" textAnchor="middle" fontSize="8" fontWeight="800" fontFamily="JetBrains Mono" fill="#000">
        AI
      </text>
      <path d="M58 118 Q60 175 100 182 Q140 175 142 118 Q130 136 100 134 Q70 136 58 118 Z" fill="#fafafa" />
      <path d="M70 140 Q100 196 130 140" fill="#e8e8e8" />
      <circle cx="100" cy="108" r="30" fill="#f6c7a1" />
      <circle cx="70" cy="110" r="6" fill="#f0b48a" />
      <circle cx="130" cy="110" r="6" fill="#f0b48a" />
      <path d="M100 6 L56 96 Q100 104 144 96 Z" fill="url(#hat)" />
      <path d="M100 6 L84 60 Q92 40 100 6 Z" fill="#ff8a8a" opacity=".6" />
      <ellipse cx="100" cy="96" rx="46" ry="8" fill="#8f0016" />
      <circle cx="100" cy="6" r="6" fill="#fff" />
      <rect x="72" y="100" width="24" height="12" rx="4" fill="#050505" />
      <rect x="104" y="100" width="24" height="12" rx="4" fill="#050505" />
      <rect x="96" y="104" width="8" height="2.5" fill="#050505" />
      <rect x="75" y="102" width="8" height="3" rx="1" fill="#00f0ff" opacity=".8" />
      <rect x="107" y="102" width="8" height="3" rx="1" fill="#00f0ff" opacity=".8" />
      <circle cx="100" cy="120" r="7" fill="#ea9878" />
      <path d="M88 132 Q100 140 112 132" stroke="#7a3b2b" strokeWidth="3" fill="none" strokeLinecap="round" />
    </svg>
  )
}
