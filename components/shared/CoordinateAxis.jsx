export default function CoordinateAxis({ className = '', opacity = 0.06 }) {
  return (
    <svg
      className={`pointer-events-none ${className}`}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
    >
      {/* Y axis */}
      <line x1="15" y1="5" x2="15" y2="95" stroke="var(--color-headline)" strokeWidth="0.5" opacity={opacity * 1.2} />
      {/* X axis */}
      <line x1="15" y1="50" x2="90" y2="50" stroke="var(--color-headline)" strokeWidth="0.5" opacity={opacity * 1.2} />
      {/* X axis arrow */}
      <polygon points="88,47 92,50 88,53" fill="var(--color-headline)" opacity={opacity} />
      {/* Y axis arrow */}
      <polygon points="12,7 15,3 18,7" fill="var(--color-headline)" opacity={opacity} />
      {/* Tick marks */}
      {[25, 35, 45, 65, 75, 85].map((x) => (
        <line key={x} x1={x} y1="48" x2={x} y2="52" stroke="var(--color-headline)" strokeWidth="0.3" opacity={opacity * 0.6} />
      ))}
      {[20, 30, 40, 60, 70, 80].map((y) => (
        <line key={y} x1="13" y1={y} x2="17" y2={y} stroke="var(--color-headline)" strokeWidth="0.3" opacity={opacity * 0.6} />
      ))}
    </svg>
  )
}
