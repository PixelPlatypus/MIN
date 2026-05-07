'use client'

export default function SectionDivider({ variant = 'sine', className = '' }) {
  if (variant === 'sine') {
    return (
      <svg
        className={`w-full h-8 pointer-events-none ${className}`}
        viewBox="0 0 1200 32"
        preserveAspectRatio="none"
        fill="none"
      >
        <path
          d="M0 16 Q150 0 300 16 T600 16 T900 16 T1200 16"
          stroke="var(--color-border-dynamic)"
          strokeWidth="1"
        />
      </svg>
    )
  }

  if (variant === 'stepped') {
    return (
      <svg
        className={`w-full h-8 pointer-events-none ${className}`}
        viewBox="0 0 1200 32"
        preserveAspectRatio="none"
        fill="none"
      >
        <polyline
          points="0,16 100,16 100,8 200,8 200,24 300,24 300,12 400,12 400,20 500,20 500,16 1200,16"
          stroke="var(--color-border-dynamic)"
          strokeWidth="1"
          fill="none"
        />
      </svg>
    )
  }

  if (variant === 'diagonal') {
    return (
      <svg
        className={`w-full h-16 pointer-events-none ${className}`}
        viewBox="0 0 1200 64"
        preserveAspectRatio="none"
        fill="none"
      >
        <line x1="0" y1="64" x2="1200" y2="0" stroke="var(--color-border-dynamic)" strokeWidth="1" />
        <line x1="0" y1="60" x2="1190" y2="0" stroke="var(--color-border-dynamic)" strokeWidth="0.5" opacity="0.5" />
      </svg>
    )
  }

  if (variant === 'dots') {
    return (
      <div className={`flex items-center justify-center gap-3 py-6 ${className}`}>
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="w-1.5 h-1.5 bg-border-dynamic"
            style={{ opacity: 1 - i * 0.15 }}
          />
        ))}
      </div>
    )
  }

  return <div className={`h-px bg-border-dynamic ${className}`} />
}
