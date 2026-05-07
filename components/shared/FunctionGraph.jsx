export default function FunctionGraph({ className = '', opacity = 0.05 }) {
  return (
    <svg
      className={`pointer-events-none ${className}`}
      viewBox="0 0 200 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
    >
      {/* Grid lines */}
      {[0, 25, 50, 75, 100].map((y) => (
        <line key={`h-${y}`} x1="0" y1={y} x2="200" y2={y} stroke="var(--color-border)" strokeWidth="0.3" />
      ))}
      {[0, 50, 100, 150, 200].map((x) => (
        <line key={`v-${x}`} x1={x} y1="0" x2={x} y2="100" stroke="var(--color-border)" strokeWidth="0.3" />
      ))}

      {/* Sine wave 1 */}
      <path
        d="M0,50 C10,50 15,20 25,50 C35,80 40,50 50,50 C60,50 65,20 75,50 C85,80 90,50 100,50 C110,50 115,20 125,50 C135,80 140,50 150,50 C160,50 165,20 175,50 C185,80 190,50 200,50"
        stroke="var(--color-headline)"
        strokeWidth="0.8"
        opacity={opacity * 1.5}
      />

      {/* Sine wave 2 (offset) */}
      <path
        d="M0,55 C12,55 18,30 30,55 C42,80 48,55 60,55 C72,55 78,30 90,55 C102,80 108,55 120,55 C132,55 138,30 150,55 C162,80 168,55 180,55 C192,30 198,55 200,55"
        stroke="var(--color-marigold)"
        strokeWidth="0.5"
        opacity={opacity * 0.8}
      />

      {/* Tangent section */}
      <line x1="80" y1="30" x2="87" y2="25" stroke="var(--color-marigold)" strokeWidth="0.4" opacity={opacity * 0.6} />
      <circle cx="85" cy="27" r="1" fill="var(--color-marigold)" opacity={opacity} />
    </svg>
  )
}
