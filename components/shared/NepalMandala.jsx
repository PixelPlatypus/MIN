export default function NepalMandala({ className = '', opacity = 0.04 }) {
  const diamonds = [
    { points: '50,5 95,50 50,95 5,50', strokeWidth: 0.8, opacity: 1 },
    { points: '50,12 88,50 50,88 12,50', strokeWidth: 0.6, opacity: 0.7 },
    { points: '50,20 80,50 50,80 20,50', strokeWidth: 0.4, opacity: 0.5 },
    { points: '50,28 72,50 50,72 28,50', strokeWidth: 0.3, opacity: 0.35 },
    { points: '50,35 65,50 50,65 35,50', strokeWidth: 0.2, opacity: 0.2 },
  ]

  return (
    <svg
      className={`pointer-events-none ${className}`}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
    >
      {diamonds.map((d, i) => (
        <polygon
          key={i}
          points={d.points}
          stroke="var(--color-marigold)"
          strokeWidth={d.strokeWidth}
          fill="none"
          opacity={opacity * d.opacity}
        />
      ))}
      {/* Rays */}
      {[0, 45, 90, 135].map((angle, i) => {
        const rad = (angle * Math.PI) / 180
        const cx = 50
        const cy = 50
        const r = 47
        const x = cx + Math.cos(rad) * r
        const y = cy + Math.sin(rad) * r
        return (
          <line
            key={i}
            x1={cx}
            y1={cy}
            x2={x}
            y2={y}
            stroke="var(--color-marigold)"
            strokeWidth={0.4 + i * 0.1}
            opacity={opacity * 0.6}
          />
        )
      })}
    </svg>
  )
}
