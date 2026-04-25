'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Sparkles, Library } from 'lucide-react'

export default function ContentLibraryHero() {
  return (
    <section className="container mx-auto px-6">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-bold tracking-widest uppercase"
        >
          <Library size={16} />
          Library
        </motion.div>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl md:text-7xl font-bold tracking-tight"
        >
          Knowledge & Resources
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-xl text-text-secondary dark:text-text-secondary-dark leading-relaxed max-w-3xl mx-auto"
        >
          Discover a wealth of mathematical articles, challenging problems, 
          and educational resources curated for students and teachers.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-center gap-4"
        >
          <Link 
            href="/submit-content"
            className="bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-2xl font-bold text-sm shadow-xl shadow-primary/20 transition-all hover:-translate-y-1 active:scale-[0.98] flex items-center gap-2"
          >
            <Sparkles size={18} />
            Contribute Your Knowledge
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
