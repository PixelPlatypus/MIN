'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const MATH_FACTS = [
  "Defining the future of math...",
]

export default function SitePreloader() {
  const [loading, setLoading] = useState(true)
  const [progress, setProgress] = useState(0)
  const [factIndex, setFactIndex] = useState(0)
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    // Logic to always show for now as per user preference for the entry experience
    const factInterval = setInterval(() => {
      setFactIndex(prev => (prev + 1) % MATH_FACTS.length)
    }, 1200)

    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          setIsComplete(true)
          return 100
        }
        return prev + 1.5
      })
    }, 15)

    if (isComplete) {
      const timer = setTimeout(() => {
        setLoading(false)
      }, 800)
      return () => clearTimeout(timer)
    }

    return () => {
      clearInterval(factInterval)
      clearInterval(progressInterval)
    }
  }, [isComplete])

  return (
    <AnimatePresence mode="wait">
      {loading && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0,
            scale: 1,
            transition: { duration: 0.5, ease: "easeInOut" } 
          }}
          className="fixed inset-0 z-[1000] bg-bg-dynamic flex flex-col items-center justify-center overflow-hidden"
        >
          {/* Minimal Grid Background */}
          <div 
            className="absolute inset-0 opacity-[0.03] dark:opacity-[0.02] pointer-events-none" 
            style={{ 
              backgroundImage: `linear-gradient(to right, var(--color-text-primary-dynamic) 1px, transparent 1px), linear-gradient(to bottom, var(--color-text-primary-dynamic) 1px, transparent 1px)`, 
              backgroundSize: '50px 50px' 
            }} 
          />

          <div className="relative flex flex-col items-center">
            <div className="relative w-80 h-80 flex items-center justify-center">
              
              {!isComplete && (
                <motion.div 
                  style={{ rotate: (progress / 100) * 360 }}
                  className="absolute inset-0 z-20 pointer-events-none"
                >
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full w-[2px] h-32 origin-bottom">
                    <div className="absolute top-0 left-0 w-full h-full bg-primary" />
                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-primary shadow-lg shadow-primary/50" />
                  </div>
                </motion.div>
              )}

              <svg className="absolute inset-0 w-full h-full -rotate-90">
                <motion.circle
                  cx="50%"
                  cy="50%"
                  r="128"
                  fill="none"
                  stroke="var(--color-primary)"
                  strokeWidth="1.5"
                  strokeDasharray="804" // 2 * pi * 128
                  initial={{ strokeDashoffset: 804 }}
                  animate={{ strokeDashoffset: 804 - (804 * (progress / 100)) }}
                  transition={{ ease: "linear" }}
                  className="opacity-30"
                />
              </svg>

              <div className="relative z-10 text-center">
                <AnimatePresence mode="wait">
                  {isComplete ? (
                    <motion.div
                      key="logo"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                      className="flex flex-col items-center"
                    >
                      <div className="text-9xl font-black tracking-tighter text-text-primary-dynamic leading-none">
                        MIN
                      </div>
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.5 }}
                        transition={{ delay: 0.2 }}
                        className="text-[10px] text-text-primary-dynamic font-bold uppercase tracking-[1em] mt-6 ml-[1em]"
                      >
                        Nepal
                      </motion.p>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="progress"
                      className="flex flex-col items-center"
                    >
                      <span className="text-6xl font-bold tracking-tighter text-text-primary-dynamic opacity-20 font-sans">
                        {Math.round(progress)}
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="mt-16 h-8">
              <AnimatePresence mode="wait">
                <motion.p
                  key={factIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.4 }}
                  exit={{ opacity: 0 }}
                  className="text-[11px] text-text-primary-dynamic font-medium uppercase tracking-[0.4em] text-center"
                >
                  {isComplete ? "Success" : MATH_FACTS[factIndex]}
                </motion.p>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
