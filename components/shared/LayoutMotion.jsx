'use client'
import { LazyMotion } from 'framer-motion'

const loadMax = () => import('@/lib/motion-features-max').then(mod => mod.default)

// Upgrades the lazy motion features to domMax for subtrees that use `layout` / `layoutId`
export default function LayoutMotion({ children }) {
  return <LazyMotion features={loadMax}>{children}</LazyMotion>
}
