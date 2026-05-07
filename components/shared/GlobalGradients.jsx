'use client'

export default function GlobalGradients() {
  return (
    <>
      {/* Animating gradient blobs — fixed behind everything */}
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-primary/15 blur-[140px] animate-float-slow will-change-transform" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[50vw] h-[50vw] rounded-full bg-marigold/8 blur-[120px] animate-float-slow-reverse will-change-transform" />
        <div className="absolute top-[40%] left-[20%] w-[30vw] h-[30vw] rounded-full bg-headline/[0.04] blur-[100px] animate-float-medium will-change-transform" />
      </div>

      {/* Grain/noise overlay — fixed, above background, below content */}
      <div className="grain-overlay" aria-hidden="true" />

      {/* Inline SVG for grain filter — rendered once, cached by browser */}
      <svg className="sr-only" aria-hidden="true">
        <filter id="grain-filter">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
      </svg>
    </>
  )
}
