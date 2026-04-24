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
    <div className="min-h-screen bg-bg dark:bg-bg-dark flex items-center justify-center p-6 transition-colors duration-500">
      <div className="max-w-md w-full text-center space-y-12">
        {/* Error Code/Icon */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative inline-block"
        >
          <div className="text-[12rem] font-black text-primary/10 dark:text-secondary/10 leading-none tracking-tighter select-none">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 bg-primary/20 dark:bg-secondary/20 rounded-[2.5rem] flex items-center justify-center text-primary dark:text-secondary backdrop-blur-xl border border-primary/20 animate-pulse">
              <AlertCircle size={48} />
            </div>
          </div>
        </motion.div>

        {/* Message */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4"
        >
          <h1 className="text-4xl font-black tracking-tight text-text-primary dark:text-text-primary-dark">
            Lost in the <span className="text-primary dark:text-secondary">Math Universe?</span>
          </h1>
          <p className="text-lg text-text-secondary dark:text-text-secondary-dark font-medium leading-relaxed">
            The page you're looking for doesn't exist. Maybe it was an irrational number or just a rounding error.
          </p>
        </motion.div>

        {/* Actions */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button 
            onClick={() => window.history.back()}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-bg-secondary dark:bg-white/5 text-text-primary dark:text-text-primary-dark font-bold hover:bg-bg-tertiary dark:hover:bg-white/10 transition-all border border-border dark:border-border-dark"
          >
            <ArrowLeft size={20} />
            Go Back
          </button>
          <Link 
            href="/"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-10 py-4 rounded-2xl bg-primary text-white font-bold hover:bg-primary-dark transition-all shadow-xl shadow-primary/20 hover:shadow-primary/40"
          >
            <Home size={20} />
            Home Page
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
