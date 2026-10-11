'use client'
import { m } from 'framer-motion'
import { ArrowRight, BookOpen, GraduationCap, Monitor as Laptop, Megaphone, Lightbulb, Trophy, Users } from '@phosphor-icons/react'
import Image from 'next/image'
import Link from 'next/link'

const programIcons = {
  'eta-campaigns': <Megaphone className="text-primary dark:text-secondary" />,
  'jmoc': <Trophy className="text-cyan" />,
  'm3-bootcamp': <Laptop className="text-purple" />,
  'm³-bootcamp': <Laptop className="text-purple" />,
  'women-in-mathematics': <GraduationCap className="text-coral" />,
  'road-to-olympiad': <BookOpen className="text-orange" />,
  'digital-content': <Users className="text-green" />,
  'minspire': <Lightbulb className="text-primary dark:text-secondary" />,
}

export default function ProgramCard({ program, index }) {
  const { name, slug, tagline, cover_url } = program
  const icon = programIcons[slug] || <BookOpen className="text-primary dark:text-secondary" />

  return (
    <m.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group h-full"
    >
      <div className="block h-full cursor-default">
        <div className="relative card-brand card-brand-hover rounded-[2.5rem] overflow-hidden flex flex-col h-full group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/15 dark:from-white/5 dark:to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0" />
          <div className="relative z-10 flex flex-col h-full w-full">
            {/* Cover Image */}
            <div className="aspect-[16/9] relative overflow-hidden">
              <Image 
                src={cover_url || '/images/logo.png'} 
                alt={name}
                fill
                className="object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                <span className="text-white text-sm font-bold flex items-center gap-2">
                  Explore Program <ArrowRight size={16} weight="bold" />
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-8 flex flex-col flex-grow text-center items-center">
              <div className="w-14 h-14 bg-primary/5 border border-primary/10 dark:bg-white/5 dark:border-white/10 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 z-10">
                {icon}
              </div>
              <h3 className="text-xl font-bold tracking-tight mb-3 group-hover:text-primary dark:group-hover:text-secondary transition-colors z-10">
                {name}
              </h3>
              <p className="text-sm text-auto-secondary leading-relaxed line-clamp-2 z-10">
                {tagline}
              </p>
            </div>
          </div>
        </div>
      </div>
    </m.div>
  )
}
