export default function MathMotif({ className = '', opacity = 0.04 }) {
  const symbols = [
    { char: '∫', x: 5, y: 8 },
    { char: '∑', x: 42, y: 12 },
    { char: 'π', x: 78, y: 6 },
    { char: '√', x: 15, y: 55 },
    { char: '∞', x: 55, y: 48 },
    { char: 'Δ', x: 88, y: 52 },
    { char: '∏', x: 22, y: 85 },
    { char: '∂', x: 68, y: 82 },
    { char: '∃', x: 48, y: 90 },
    { char: 'Ω', x: 92, y: 88 },
    { char: 'θ', x: 8, y: 30 },
    { char: 'λ', x: 85, y: 28 },
    { char: 'α', x: 34, y: 35 },
    { char: 'β', x: 62, y: 22 },
    { char: '×', x: 76, y: 70 },
    { char: '÷', x: 14, y: 72 },
    { char: '≈', x: 38, y: 68 },
    { char: '≠', x: 52, y: 64 },
    { char: '⇒', x: 80, y: 40 },
    { char: '⇔', x: 28, y: 15 },
  ]

  return (
    <svg
      className={`pointer-events-none ${className}`}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
    >
      {symbols.map((s, i) => (
        <text
          key={i}
          x={s.x}
          y={s.y}
          fill="var(--color-headline)"
          opacity={opacity * (0.5 + (i % 3) * 0.25)}
          fontSize={5 + (i % 5) * 0.8}
          fontFamily="var(--font-content)"
          textAnchor="middle"
          dominantBaseline="middle"
        >
          {s.char}
        </text>
      ))}
    </svg>
  )
}
