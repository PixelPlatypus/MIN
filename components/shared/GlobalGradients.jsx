'use client'

import { useEffect, useRef } from 'react'

export default function GlobalGradients() {
  const blobA = useRef(null)
  const blobB = useRef(null)
  const blobC = useRef(null)

  useEffect(() => {
    Promise.all([import('gsap')]).then(([{ default: gsap }]) => {
      if (blobA.current) {
        gsap.to(blobA.current, { x: '10vw', y: '-5vh', scale: 1.12, duration: 24, ease: 'sine.inOut', repeat: -1, yoyo: true })
      }
      if (blobB.current) {
        gsap.to(blobB.current, { x: '-8vw', y: '6vh', scale: 1.08, duration: 20, ease: 'sine.inOut', repeat: -1, yoyo: true })
      }
      if (blobC.current) {
        gsap.to(blobC.current, { x: '5vw', y: '-8vh', scale: 1.14, duration: 18, ease: 'sine.inOut', repeat: -1, yoyo: true })
      }
    })
  }, [])

  return (
    <>
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        <div ref={blobA} className="absolute top-[-15%] right-[-10%] w-[70vw] h-[70vw] rounded-full bg-primary/10 blur-[160px] will-change-transform" />
        <div ref={blobB} className="absolute bottom-[-15%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-marigold/6 blur-[140px] will-change-transform" />
        <div ref={blobC} className="absolute top-[30%] left-[10%] w-[40vw] h-[40vw] rounded-full bg-headline/[0.04] blur-[120px] will-change-transform" />
      </div>

      <div className="fixed inset-0 pointer-events-none z-[9998]" aria-hidden="true"
        style={{ opacity: 0.04, mixBlendMode: 'overlay', backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`, backgroundRepeat: 'repeat', backgroundSize: '256px 256px' }}
      />
    </>
  )
}
