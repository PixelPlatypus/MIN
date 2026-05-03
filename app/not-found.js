'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { House as Home, ArrowLeft, WarningCircle as AlertCircle } from '@phosphor-icons/react'

import { useEffect } from 'react'

export default function NotFound() {
  useEffect(() => {
    // Auto-redirect after 10 seconds
    const timer = setTimeout(() => {
      window.location.href = '/'
    }, 10000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen bg-bg-dynamic flex items-center justify-center p-6 relative overflow-hidden transition-colors duration-500">
      {/* Premium Mesh Gradient Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[100px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-xl w-full glass bg-bg-secondary-dynamic/40 border-border-dynamic backdrop-blur-3xl rounded-[3.5rem] p-10 md:p-16 text-center space-y-10 relative z-10 shadow-2xl"
      >
        {/* Branding inside the box */}
        <div className="text-auto-tertiary-dynamic text-[10px] font-black uppercase tracking-[0.4em] mb-2 opacity-80">
          Mathematics Initiatives in Nepal
        </div>

        <div className="relative mx-auto w-full max-w-sm">
           <div className="absolute inset-0 bg-primary/20 rounded-[2.5rem] blur-2xl animate-pulse" />
           <div className="relative w-full aspect-video rounded-[2rem] overflow-hidden border border-border-dynamic shadow-2xl">
              <img 
                src="/images/404page.gif" 
                alt="Lost in space" 
                className="w-full h-full object-cover"
              />
           </div>
           <div className="absolute -top-4 -right-4 bg-primary text-white w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl shadow-xl shadow-primary/30 rotate-12">
              404
           </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-5xl md:text-6xl font-black text-text-primary-dynamic tracking-tighter leading-[0.95]">
            Lost in <br /> 
            <span className="text-secondary">the Universe</span>
          </h1>
          <p className="text-auto-secondary-dynamic text-base font-medium leading-relaxed max-w-sm mx-auto">
            The page you're looking for doesn't exist. Maybe it was an irrational number or just a rounding error.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button 
            onClick={() => window.history.back()}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-bg-secondary-dynamic text-text-primary-dynamic hover:bg-border-dynamic font-bold transition-all border border-border-dynamic active:scale-95"
          >
            <ArrowLeft size={18} />
            Go Back
          </button>
          <Link 
            href="/"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-10 py-4 rounded-2xl bg-primary text-white font-bold hover:bg-primary-dark transition-all shadow-xl shadow-primary/20 active:scale-95"
          >
            <Home size={18} />
            Home Page
          </Link>
        </div>

        <div className="pt-10 border-t border-border-dynamic">
           <p className="text-[10px] text-auto-tertiary-dynamic font-black uppercase tracking-[0.3em]">
             Redirecting to home shortly...
           </p>
        </div>
      </motion.div>
    </div>
  )
}
