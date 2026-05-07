'use client'

export default function GlobalGradients() {
  return (
    <>
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        <div className="absolute top-[-15%] right-[-10%] w-[70vw] h-[70vw] rounded-full bg-primary/15 blur-[160px] animate-float-slow" />
        <div className="absolute bottom-[-15%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-marigold/10 blur-[140px] animate-float-slow-reverse" />
        <div className="absolute top-[35%] left-[15%] w-[35vw] h-[35vw] rounded-full bg-headline/[0.05] blur-[120px] animate-float-medium" />
      </div>

      <div className="fixed inset-0 pointer-events-none z-[9998]" aria-hidden="true" style={{ opacity: 0.04, mixBlendMode: 'overlay', backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`, backgroundRepeat: 'repeat', backgroundSize: '256px 256px' }} />
    </>
  )
}
