'use client'
import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import { ArrowRight, Sparkles } from 'lucide-react'
import Link from 'next/link'

export default function Hero() {
  const [settings, setSettings] = useState(null)
  const headlineRef = useRef(null)

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => setSettings(data))
      .catch(err => console.error('Hero settings load error', err))
  }, [])

  useEffect(() => {
    if (!settings) return
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const ctx = gsap.context(() => {
      // GSAP text stagger animation
      if (headlineRef.current) {
        const words = headlineRef.current.querySelectorAll('.word')
        if (prefersReducedMotion) {
          gsap.set(words, { y: 0, opacity: 1, rotate: 0 })
        } else {
          gsap.fromTo(words, 
            { y: 80, opacity: 0, rotate: 4 },
            { 
              y: 0, 
              opacity: 1, 
              rotate: 0,
              stagger: 0.12, 
              duration: 1.2, 
              ease: 'power4.out',
              delay: 0.3 
            }
          )
        }
      }
    })

    return () => ctx.revert()
  }, [])

  const splitText = (text) => {
    return text.split(' ').map((word, i) => (
      <span key={i} className="inline-block mr-2 md:mr-4 py-2 overflow-visible">
        <span className="word inline-block origin-bottom-left text-gradient pb-2">{word}</span>
      </span>
    ))
  }

  return (
    <section className="relative min-h-[85vh] lg:min-h-screen flex items-center pt-24 pb-12 overflow-hidden bg-transparent border-b border-black/10 dark:border-white/10">
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="inline-flex items-center gap-2 bg-white/40 dark:bg-white/5 text-primary dark:text-secondary px-6 py-2.5 rounded-full text-xs font-bold mb-6 border border-primary/10 dark:border-white/10 backdrop-blur-xl shadow-xl shadow-black/5"
          >
            <Sparkles size={16} className="text-secondary-dark" />
            <span className="uppercase tracking-[0.2em]">{settings?.hero_badge || "Global Innovation Award Winner"}</span>
          </motion.div>

          <motion.h1 
            ref={headlineRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="text-5xl md:text-7xl lg:text-[90px] font-black tracking-tighter mb-8 leading-[1.1] flex flex-wrap justify-center overflow-visible"
          >
            {splitText(settings?.hero_title || "Elevating Nepal Through Mathematics.")}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9, ease: 'easeOut' }}
            className="text-xl md:text-2xl text-text-secondary dark:text-text-secondary-dark mb-10 max-w-4xl mx-auto leading-relaxed font-medium transition-all"
          >
            {settings?.hero_subtitle || "Igniting curiosity and fostering excellence across Nepal. We're building a future where every student views mathematics as a tool for innovation."}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.1, ease: 'easeOut' }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <Link 
              href={settings?.hero_cta_link || "/join"}
              className="w-full sm:w-auto bg-primary hover:bg-primary-dark text-white px-12 py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all shadow-2xl shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-1.5 active:scale-[0.98] group"
            >
              {settings?.hero_cta_text || "Join the Movement"}
              <ArrowRight size={22} className="transition-transform group-hover:translate-x-2" />
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Mouse scroll indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <div className="w-6 h-10 border-2 border-primary/20 rounded-full flex justify-center p-2">
          <motion.div 
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className="w-1.5 h-1.5 bg-primary rounded-full"
          />
        </div>
      </motion.div>
    </section>
  )
}
