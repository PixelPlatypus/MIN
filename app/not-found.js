'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Home, ArrowLeft, AlertCircle } from 'lucide-react'

import { useEffect } from 'react'

export default function NotFound() {
  useEffect(() => {
    // Report 404 to admin via email
    try {
      fetch('/api/report-error', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          errorName: '404 Not Found',
          errorMessage: 'User attempted to access a non-existent page',
          errorStack: 'No stack trace (404 Error)',
          url: window.location.href
        })
      }).catch(err => console.error('Failed to send 404 report:', err))
    } catch (e) {
      console.error('Error reporting logic failed:', e)
    }

    // Auto-redirect after 10 seconds
    const timer = setTimeout(() => {
      window.location.href = '/'
    }, 10000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Premium Mesh Gradient Background */}
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

        <div className="relative mx-auto w-full max-w-sm">
           <div className="absolute inset-0 bg-primary/20 rounded-[2.5rem] blur-2xl animate-pulse" />
           <div className="relative w-full aspect-video rounded-[2rem] overflow-hidden border border-white/20 shadow-2xl">
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
          <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter leading-[0.95]">
            Lost in <br /> 
            <span className="text-primary">the Universe</span>
          </h1>
          <p className="text-white/50 text-base font-medium leading-relaxed max-w-sm mx-auto">
            The page you're looking for doesn't exist. Maybe it was an irrational number or just a rounding error.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button 
            onClick={() => window.history.back()}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-bold transition-all border border-white/10 active:scale-95"
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

        <div className="pt-10 border-t border-white/5">
           <p className="text-[10px] text-white/30 font-black uppercase tracking-[0.3em]">
             Redirecting to home shortly...
           </p>
        </div>
      </motion.div>
    </div>
  )
}
