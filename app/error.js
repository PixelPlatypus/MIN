'use client'
import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { RefreshCcw, AlertCircle, ArrowLeft, Home } from 'lucide-react'
import Link from 'next/link'

export default function Error({ error, reset }) {
  useEffect(() => {
    // Log error to Sentry or similar
    console.error('Next.js Error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-bg dark:bg-bg-dark flex items-center justify-center p-6 transition-colors duration-500">
      <div className="max-w-md w-full text-center space-y-12">
        {/* Error Code/Icon */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative inline-block"
        >
          <div className="text-[12rem] font-black text-coral/10 leading-none tracking-tighter select-none">
            ERR
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 bg-coral/20 rounded-[2.5rem] flex items-center justify-center text-coral backdrop-blur-xl border border-coral/20 animate-pulse">
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
            Something <span className="text-coral">went wrong!</span>
          </h1>
          <p className="text-lg text-text-secondary dark:text-text-secondary-dark font-medium leading-relaxed">
            An unexpected error occurred. Don't worry, it's not you, it's us. Our team has been notified.
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
            onClick={() => reset()}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-primary text-white font-bold hover:bg-primary-dark transition-all shadow-xl shadow-primary/20 hover:shadow-primary/40"
          >
            <RefreshCcw size={20} />
            Try Again
          </button>
          <Link 
            href="/"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-10 py-4 rounded-2xl bg-bg-secondary dark:bg-white/5 text-text-primary dark:text-text-primary-dark font-bold hover:bg-bg-tertiary dark:hover:bg-white/10 transition-all border border-border dark:border-border-dark"
          >
            <Home size={20} />
            Home Page
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
