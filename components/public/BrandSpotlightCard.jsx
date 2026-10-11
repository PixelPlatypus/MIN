'use client'
import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import SpotlightCard from '@/components/SpotlightCard'

// SpotlightCard tuned to MIN colours: teal light on white in light mode,
// pale-yellow light on translucent teal in dark mode.
export default function BrandSpotlightCard({ className = '', style, ...props }) {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  const dark = mounted && resolvedTheme === 'dark'

  return (
    <SpotlightCard
      theme={dark ? 'dark' : 'light'}
      spotlightColor={dark ? '#F6F094' : '#16556D'}
      intensity={dark ? 0.12 : 0.35}
      borderGlow={0.8}
      spotlightSize={280}
      proximity={0} // only the hovered card animates; >0 woke all 10 cards on every mouse move
      className={`rounded-[2.5rem] transition-transform duration-500 hover:-translate-y-1.5 ${className}`}
      style={{
        // No backdrop blur: re-blurring behind every card on each spotlight repaint caused jank
        '--spotlight-card-surface': dark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.85)',
        '--spotlight-card-border': dark ? 'rgba(255,255,255,0.14)' : 'rgba(22,85,109,0.12)',
        '--spotlight-card-shadow': dark
          ? '0 24px 48px -24px rgba(0,0,0,0.45)'
          : '0 1px 2px rgba(22,85,109,0.05), 0 24px 48px -24px rgba(22,85,109,0.22)',
        ...style,
      }}
      {...props}
    />
  )
}
