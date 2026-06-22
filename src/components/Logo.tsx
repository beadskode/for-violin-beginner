export function Logo({ size = 28 }: { size?: number }) {
  const h = size
  const w = h * 4.2
  return (
    <svg viewBox="0 0 168 40" width={w} height={h} role="img" aria-label="Vi-ginner logo">
      {/* Violin silhouette as the "i" dot */}
      <g transform="translate(17.5, 3) scale(0.28)">
        <path
          d="M25 0 C25 0 30 8 30 14 C30 18 28 20 26 22 C29 25 31 30 31 36
             C31 46 26 54 25 58 C24 54 19 46 19 36 C19 30 21 25 24 22
             C22 20 20 18 20 14 C20 8 25 0 25 0Z"
          fill="var(--accent)"
        />
        <line x1="25" y1="22" x2="25" y2="58" stroke="var(--accent)" strokeWidth="1.5" />
        <line x1="20" y1="32" x2="30" y2="32" stroke="var(--accent)" strokeWidth="1.2" />
        <line x1="20" y1="42" x2="30" y2="42" stroke="var(--accent)" strokeWidth="1.2" />
        <circle cx="25" cy="36" r="2" fill="#f6f5f2" />
      </g>
      {/* Text: "Vi-ginner" */}
      <text x="30" y="30" fontFamily="-apple-system, 'Apple SD Gothic Neo', sans-serif" fontSize="26" fontWeight="800" fill="#1a1a1a" letterSpacing="-0.5">
        <tspan fill="var(--accent)">Vi</tspan>
        <tspan fill="#999">-</tspan>
        <tspan fill="#1a1a1a">ginner</tspan>
      </text>
    </svg>
  )
}
