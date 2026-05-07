export default function MountainPeaks({ className = '', opacity = 0.05 }) {
  return (
    <svg
      className={`pointer-events-none ${className}`}
      viewBox="0 0 200 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
    >
      <path
        d="M0,80 L0,30 L20,8 L40,40 L55,15 L70,35 L90,5 L110,28 L125,10 L140,32 L155,18 L170,35 L185,12 L200,25 L200,80 Z"
        stroke="var(--color-marigold)"
        strokeWidth="0.5"
        fill="none"
        opacity={opacity}
      />
      <path
        d="M0,80 L0,32 L20,10 L40,42 L55,17 L70,37 L90,7 L110,30 L125,12 L140,34 L155,20 L170,37 L185,14 L200,27 L200,80 Z"
        stroke="var(--color-marigold)"
        strokeWidth="0.3"
        fill="none"
        opacity={opacity * 0.5}
      />
    </svg>
  )
}
