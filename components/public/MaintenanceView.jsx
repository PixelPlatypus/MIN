'use client'
import { motion } from 'framer-motion'
import { Hammer, ShieldCheck, ArrowRight, Zap, Calculator } from 'lucide-react'
import Link from 'next/link'

export default function MaintenanceView() {
  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Mesh Gradient Background (Internalized glow) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-[#16556D]/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[100px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-xl w-full glass bg-white/5 border-white/10 backdrop-blur-3xl rounded-[3.5rem] p-10 md:p-16 text-center space-y-10 relative z-10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)]"
      >
        {/* Branding inside the box */}
        <div className="text-primary text-[10px] font-black uppercase tracking-[0.4em] mb-2 opacity-80">
          Mathematics Initiatives in Nepal
        </div>

        <div className="relative mx-auto w-full max-w-md">
           <div className="absolute inset-0 bg-primary/20 rounded-[2.5rem] blur-2xl animate-pulse" />
           <div className="relative w-full aspect-video rounded-[2rem] overflow-hidden border border-white/20 shadow-2xl">
              <img 
                src="/images/maintainance.gif" 
                alt="MINion at work" 
                className="w-full h-full object-cover"
              />
           </div>
        </div>

        <div className="space-y-6">
          <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter leading-[0.95]">
            Optimizing <br /> 
            <span className="text-primary">Our Limits</span>
          </h1>
          <div className="space-y-2">
            <p className="text-white/60 text-lg font-bold uppercase tracking-[0.2em]">
              We are under maintenance
            </p>
            <p className="text-white/40 text-sm font-medium leading-relaxed max-w-sm mx-auto">
              Solving for <span className="text-primary italic font-serif">x</span> where <span className="text-primary italic font-serif">x</span> is the ultimate platform experience.
            </p>
          </div>
        </div>

        <div className="pt-10 border-t border-white/10">
           <div className="flex items-center justify-center gap-3 text-white/40 text-[10px] font-black uppercase tracking-[0.3em]">
              <span className="w-8 h-px bg-white/10" />
              Returning Shortly
              <span className="w-8 h-px bg-white/10" />
           </div>
        </div>
      </motion.div>
    </div>
  )
}
