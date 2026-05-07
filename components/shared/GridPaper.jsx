'use client'

export default function GridPaper({ className = '', opacity = 0.3, spacing = 40 }) {
  return (
    <div
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{
        backgroundImage: `
          linear-gradient(var(--color-border-dynamic) 1px, transparent 1px),
          linear-gradient(90deg, var(--color-border-dynamic) 1px, transparent 1px)
        `,
        backgroundSize: `${spacing}px ${spacing}px`,
        opacity,
      }}
    />
  )
}
