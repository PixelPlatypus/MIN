'use client'
import { motion } from 'framer-motion'
import { LogoMark } from '@/components/shared/Logo'
import GridPaper from '@/components/shared/GridPaper'
import NepalBar from '@/components/shared/NepalBar'

export default function MaintenanceView() {
  return (
    <main className="relative min-h-screen flex items-center justify-center px-6 py-24 overflow-hidden bg-bg">
      <GridPaper opacity={0.10} spacing={80} />
      <NepalBar position="left" />

      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 max-w-xl w-full text-center"
      >
        <div className="inline-flex items-center gap-3 mb-10 text-headline">
          <LogoMark className="h-12 w-auto" />
          <div className="text-left leading-tight">
            <div className="font-bold text-base tracking-tight text-text-primary-dynamic">Mathematics Initiatives</div>
            <div className="text-[10px] uppercase tracking-[0.28em] text-text-tertiary-dynamic font-institutional mt-1">in Nepal</div>
          </div>
        </div>

        <div className="text-[10px] font-institutional uppercase tracking-[0.32em] text-text-tertiary-dynamic mb-6">
          Status — Maintenance Window
        </div>

        <h1 className="text-5xl md:text-6xl font-black tracking-tighter leading-[0.95] text-headline mb-6">
          Optimizing <br />
          <span className="italic font-serif text-text-secondary-dynamic">our limits</span>
        </h1>

        <p className="text-text-secondary-dynamic text-base leading-relaxed max-w-md mx-auto mb-10">
          The site is briefly offline for an upgrade. Solving for <span className="italic font-serif text-headline">x</span>, where <span className="italic font-serif text-headline">x</span> is a sharper experience for every learner.
        </p>

        <div className="flex items-center justify-center gap-3 text-text-tertiary-dynamic text-[10px] font-institutional uppercase tracking-[0.3em]">
          <span className="w-8 h-px bg-border-dynamic" />
          Returning shortly
          <span className="w-8 h-px bg-border-dynamic" />
        </div>
      </motion.section>
    </main>
  )
}
