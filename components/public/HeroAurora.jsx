'use client'
import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { useTheme } from 'next-themes'

// WebGL is client-only; keep ogl out of the server bundle and first paint
const Aurora = dynamic(() => import('@/components/Aurora'), { ssr: false })

export default function HeroAurora() {
  const { resolvedTheme } = useTheme()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    // Static backdrop is enough when the user asked for less motion
    setReady(!window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  }, [])

  if (!ready) return null
  const dark = resolvedTheme === 'dark'

  return (
    <div
      aria-hidden
      className={`absolute inset-x-0 top-0 h-[75%] pointer-events-none ${dark ? 'opacity-60' : 'opacity-40'}`}
      style={{ maskImage: 'linear-gradient(to bottom, #000 40%, transparent 100%)' }}
    >
      <Aurora
        colorStops={dark ? ['#4A90A4', '#F6F094', '#00CFE8'] : ['#4A90A4', '#F6F094', '#1A6B87']}
        lightMode={!dark}
        amplitude={1.0}
        blend={0.6}
        speed={0.6}
      />
    </div>
  )
}
