'use client'
import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import { ArrowRight, Sparkles, BookOpen, GraduationCap } from 'lucide-react'
import Link from 'next/link'

const mathSymbols = [
  { char: 'Σ', size: 'text-7xl', top: '15%', left: '10%', color: 'text-primary/10' },
  { char: 'π', size: 'text-8xl', top: '25%', right: '12%', color: 'text-secondary/20' },
  { char: '√', size: 'text-6xl', bottom: '20%', left: '15%', color: 'text-coral/10' },
  { char: '∫', size: 'text-9xl', top: '45%', left: '42%', color: 'text-primary-light/10' },
  { char: '∞', size: 'text-7xl', bottom: '25%', right: '20%', color: 'text-cyan/10' },
  { char: 'λ', size: 'text-5xl', top: '65%', left: '12%', color: 'text-purple/10' },
  { char: 'Δ', size: 'text-6xl', bottom: '40%', right: '15%', color: 'text-orange/10' },
  { char: 'θ', size: 'text-6xl', top: '10%', right: '35%', color: 'text-primary/5' },
  { char: 'φ', size: 'text-7xl', bottom: '15%', left: '30%', color: 'text-secondary/15' },
]

export default function Hero() {
  const headlineRef = useRef(null)
  const symbolsRef = useRef(null)

  useEffect(() => {
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

      // GSAP floating symbols animation
      if (symbolsRef.current && !prefersReducedMotion) {
        const symbols = symbolsRef.current.querySelectorAll('.symbol')
        symbols.forEach((symbol, i) => {
          gsap.to(symbol, {
            y: i % 2 === 0 ? -40 : 40,
            x: i % 3 === 0 ? -30 : 30,
            rotation: i % 2 === 0 ? 25 : -25,
            duration: 4 + i * 0.7,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            delay: i * 0.2
          })
        })
      }
    })

    return () => ctx.revert()
  }, [])

  const splitText = (text) => {
    return text.split(' ').map((word, i) => (
      <span key={i} className="inline-block mr-3 md:mr-5 py-3">
        <span className="word inline-block origin-bottom-left">{word}</span>
      </span>
    ))
  }

  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-transparent border-b border-black/10 dark:border-white/10">
      {/* Floating Math Symbols */}
      <div ref={symbolsRef} className="absolute inset-0 pointer-events-none -z-5 opacity-40 md:opacity-70">
        {mathSymbols.map((s, i) => (
          <div 
            key={i} 
            className={`symbol absolute font-serif ${s.size} ${s.color} transition-colors duration-1000`}
            style={{ 
              top: s.top, 
              left: s.left, 
              right: s.right, 
              bottom: s.bottom 
            }}
          >
            {s.char}
          </div>
        ))}
      </div>

      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="inline-flex items-center gap-2 bg-white/40 dark:bg-white/5 text-primary dark:text-secondary px-6 py-2.5 rounded-full text-xs font-bold mb-10 border border-primary/10 dark:border-white/10 backdrop-blur-xl shadow-xl shadow-black/5"
          >
            <Sparkles size={16} className="text-secondary-dark" />
            <span className="uppercase tracking-[0.2em]">Global Innovation Award Winner</span>
          </motion.div>

          <motion.h1 
            ref={headlineRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="text-5xl md:text-7xl lg:text-[90px] font-black tracking-tighter mb-10 leading-[0.95] text-gradient flex flex-wrap justify-center gap-x-4 md:gap-x-6"
          >
            {splitText("Elevating Nepal Through Mathematics.")}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9, ease: 'easeOut' }}
            className="text-xl md:text-2xl text-text-secondary dark:text-text-secondary-dark mb-14 max-w-4xl mx-auto leading-relaxed font-medium"
          >
            Igniting curiosity and fostering excellence across Nepal. We're building a 
            future where every student views mathematics as a tool for innovation.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.1, ease: 'easeOut' }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <Link 
              href="/join"
              className="w-full sm:w-auto bg-primary hover:bg-primary-dark text-white px-12 py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all shadow-2xl shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-1.5 active:scale-[0.98] group"
            >
              Join the Movement
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
