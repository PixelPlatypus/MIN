'use client'

export default function CornerBracket({ position = 'top-left', size = 40, color = 'var(--color-marigold)', opacity = 0.4 }) {
  const rotations = {
    'top-left': 0,
    'top-right': 90,
    'bottom-right': 180,
    'bottom-left': 270,
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      className="pointer-events-none"
      style={{
        transform: `rotate(${rotations[position]}deg)`,
        opacity,
      }}
    >
      <path
        d="M0 0 L0 30 M0 0 L30 0"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="square"
      />
    </svg>
  )
}
