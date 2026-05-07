'use client'

export default function SunMotif({ className = '' }) {
  return (
    <svg
      viewBox="0 0 200 200"
      className={`pointer-events-none ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer rays */}
      {Array.from({ length: 16 }).map((_, i) => {
        const angle = (i * 22.5 * Math.PI) / 180
        const x1 = 100 + Math.cos(angle) * 40
        const y1 = 100 + Math.sin(angle) * 40
        const x2 = 100 + Math.cos(angle) * 95
        const y2 = 100 + Math.sin(angle) * 95
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="currentColor"
            strokeWidth="1.5"
            opacity="0.15"
          />
        )
      })}
      {/* Inner circle */}
      <circle cx="100" cy="100" r="35" stroke="currentColor" strokeWidth="1.5" opacity="0.2" />
      {/* Center dot */}
      <circle cx="100" cy="100" r="6" fill="currentColor" opacity="0.25" />
      {/* Concentric rings */}
      <circle cx="100" cy="100" r="55" stroke="currentColor" strokeWidth="0.5" opacity="0.1" />
      <circle cx="100" cy="100" r="75" stroke="currentColor" strokeWidth="0.5" opacity="0.08" />
    </svg>
  )
}
