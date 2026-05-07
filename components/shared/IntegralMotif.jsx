export default function IntegralMotif({ className = '', opacity = 0.03 }) {
  return (
    <svg
      className={`pointer-events-none ${className}`}
      viewBox="0 0 120 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
    >
      <g opacity={opacity}>
        {/* Large integral */}
        <text
          x="40"
          y="90"
          fill="var(--color-headline)"
          fontSize="55"
          fontFamily="var(--font-identity)"
          fontStyle="italic"
          fontWeight="700"
          textAnchor="middle"
          dominantBaseline="middle"
        >
          ∫
        </text>

        {/* Upper limit */}
        <text
          x="62"
          y="40"
          fill="var(--color-headline)"
          fontSize="12"
          fontFamily="var(--font-content)"
          textAnchor="middle"
        >
          x
        </text>

        {/* Lower limit */}
        <text
          x="62"
          y="138"
          fill="var(--color-headline)"
          fontSize="12"
          fontFamily="var(--font-content)"
          textAnchor="middle"
        >
          0
        </text>

        {/* Integrand */}
        <text
          x="92"
          y="92"
          fill="var(--color-headline)"
          fontSize="14"
          fontFamily="var(--font-content)"
          fontStyle="italic"
          textAnchor="middle"
        >
          f(t)dt
        </text>

        {/* Small decorative integral */}
        <text
          x="25"
          y="30"
          fill="var(--color-marigold)"
          fontSize="28"
          fontFamily="var(--font-identity)"
          fontStyle="italic"
          fontWeight="700"
          textAnchor="middle"
          dominantBaseline="middle"
        >
          ∫
        </text>
      </g>
    </svg>
  )
}
