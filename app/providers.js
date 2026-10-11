// app/providers.js
'use client'

import dynamic from 'next/dynamic'
import { LazyMotion, MotionConfig } from 'framer-motion'

// Components use the lightweight `m.*` elements; the animation features load after first paint
const loadMotionFeatures = () => import('@/lib/motion-features').then(mod => mod.default)

const NoticePopup = dynamic(() => import('@/components/shared/NoticePopup'), { ssr: false })

export function ClientProviders({ children }) {
  return (
    // reducedMotion="user": framer animations respect the OS "reduce motion" setting
    <LazyMotion features={loadMotionFeatures}>
      <MotionConfig reducedMotion="user">
        {children}
        <NoticePopup />
      </MotionConfig>
    </LazyMotion>
  )
}
