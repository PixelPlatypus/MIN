'use client'
import { motion } from 'framer-motion'
import { ArrowRight, BookOpen, GraduationCap, Laptop, Sparkles, Trophy, Users } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

const programIcons = {
  'eta-campaigns': <Sparkles className="text-primary" />,
  'jmoc': <Trophy className="text-cyan" />,
  'm3-bootcamp': <Laptop className="text-purple" />,
  'women-in-mathematics': <GraduationCap className="text-coral" />,
  'road-to-olympiad': <BookOpen className="text-orange" />,
  'digital-content': <Users className="text-green" />,
  'minspire': <Sparkles className="text-primary" />,
}

export default function ProgramCard({ program, index }) {
  const { name, slug, tagline, cover_url } = program
  const icon = programIcons[slug] || <BookOpen className="text-primary" />

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group h-full"
    >
      <div className="block h-full cursor-default">
        <div className="relative glass bg-white/60 dark:bg-white/5 backdrop-blur-2xl rounded-[2.5rem] overflow-hidden flex flex-col h-full border border-white/40 dark:border-white/10 hover:border-primary/30 transition-all duration-500 shadow-sm hover:shadow-2xl hover:-translate-y-2 group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0" />
          <div className="relative z-10 flex flex-col h-full w-full">
            {/* Cover Image */}
            <div className="aspect-[16/9] relative overflow-hidden">
              <Image 
                src={cover_url || 'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=2132&auto=format&fit=crop'} 
                alt={name}
                fill
                className="object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                <span className="text-white text-sm font-bold flex items-center gap-2">
                  Explore Program <ArrowRight size={16} />
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-8 flex flex-col flex-grow text-center items-center bg-white/40 dark:bg-black/20">
              <div className="w-14 h-14 bg-bg-secondary dark:bg-white/5 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 shadow-lg z-10">
                {icon}
              </div>
              <h3 className="text-xl font-bold tracking-tight mb-3 text-text dark:text-white group-hover:text-primary transition-colors z-10">
                {name}
              </h3>
              <p className="text-sm text-text-secondary dark:text-text-secondary-dark leading-relaxed line-clamp-2 z-10">
                {tagline}
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
