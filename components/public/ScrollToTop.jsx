'use client'
import { useState, useEffect } from 'react'
import { m, AnimatePresence } from 'framer-motion'
import { ArrowUp } from '@phosphor-icons/react'

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener('scroll', toggleVisibility, { passive: true })
    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <m.button
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          onClick={scrollToTop}
          className="btn-brand fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-[90] size-14 p-0 rounded-full group"
          aria-label="Scroll to top"
        >
          <ArrowUp size={22} weight="bold" className="transition-transform duration-300 group-hover:-translate-y-0.5" />
        </m.button>
      )}
    </AnimatePresence>
  )
}
