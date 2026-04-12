'use client'
import { Sun, Moon } from 'lucide-react'
import { useTheme } from 'next-themes'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return <div className="w-10 h-10" />

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-xl transition-colors hover:bg-black/5 dark:hover:bg-white/5 group relative overflow-hidden"
      aria-label="Toggle theme"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={theme}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
        >
          {theme === 'light' ? (
            <Sun size={20} className="text-text-secondary group-hover:text-primary transition-colors" />
          ) : (
            <Moon size={20} className="text-text-secondary-dark group-hover:text-secondary transition-colors" />
          )}
        </motion.div>
      </AnimatePresence>
    </button>
  )
}
