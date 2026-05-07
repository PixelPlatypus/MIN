'use client'

export default function GlobalGradients() {
  return (
    <>
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        <div className="absolute top-[-15%] right-[-10%] w-[70vw] h-[70vw] rounded-full bg-primary/15 blur-[160px] animate-float-slow" />
        <div className="absolute bottom-[-15%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-marigold/10 blur-[140px] animate-float-slow-reverse" />
        <div className="absolute top-[35%] left-[15%] w-[35vw] h-[35vw] rounded-full bg-headline/[0.05] blur-[120px] animate-float-medium" />
      </div>

      <div className="grain-overlay" aria-hidden="true" />

      <svg className="sr-only" aria-hidden="true">
        <filter id="grain-filter">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
      </svg>
    </>
  )
}
