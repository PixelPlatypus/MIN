'use client'
import { motion } from 'framer-motion'
import { ArrowRight, BookOpen, GraduationCap, Laptop, Sparkles, Trophy, Users } from 'lucide-react'
import Link from 'next/link'

const programs = [
  { 
    name: 'ETA Campaigns', 
    slug: 'eta-campaigns', 
    tagline: 'Education to action', 
    icon: <Sparkles className="text-primary" />,
    color: 'bg-primary/10'
  },
  { 
    name: 'JMOC', 
    slug: 'jmoc', 
    tagline: 'Junior Mathematics Olympiad Camp', 
    icon: <Trophy className="text-cyan" />,
    color: 'bg-cyan/10'
  },
  { 
    name: 'M³ Bootcamp', 
    slug: 'm3-bootcamp', 
    tagline: 'Mathematical Modelling Bootcamp', 
    icon: <Laptop className="text-purple" />,
    color: 'bg-purple/10'
  },
  { 
    name: 'Women in Mathematics', 
    slug: 'women-in-mathematics', 
    tagline: 'Empowering female mathematicians', 
    icon: <GraduationCap className="text-coral" />,
    color: 'bg-coral/10'
  },
  { 
    name: 'Road to Olympiad', 
    slug: 'road-to-olympiad', 
    tagline: 'Training for math olympiads', 
    icon: <BookOpen className="text-orange" />,
    color: 'bg-orange/10'
  },
  { 
    name: 'Digital Content', 
    slug: 'digital-content', 
    tagline: 'YouTube series and online learning', 
    icon: <Users className="text-green" />,
    color: 'bg-green/10'
  },
]

export default function ProgramsGrid() {
  return (
    <section className="container mx-auto px-6 py-24 relative overflow-hidden">
      <div className="text-center mb-16 space-y-4">
        <span className="text-primary font-bold uppercase tracking-widest text-sm">Our Initiatives</span>
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Our Core Programs</h2>
        <p className="text-lg text-text-secondary dark:text-text-secondary-dark max-w-2xl mx-auto">
          Explore our range of initiatives designed to make mathematics accessible, 
          engaging, and impactful for students across Nepal.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {programs.map((program, i) => (
          <motion.div
            key={program.slug}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            viewport={{ once: true }}
            className="group"
          >
            <div 
              className="relative glass bg-white/60 dark:bg-white/5 backdrop-blur-2xl rounded-[2.5rem] p-8 flex flex-col items-center text-center h-full border border-white/40 dark:border-white/10 hover:border-primary/30 transition-all duration-500 shadow-sm hover:shadow-2xl hover:-translate-y-2 group overflow-hidden cursor-default"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${program.color} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0`} />
              <div className="relative z-10 flex flex-col items-center h-full w-full">
                <div className={`w-16 h-16 ${program.color} rounded-2xl flex items-center justify-center mb-6 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-sm`}>
                  {program.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-text dark:text-white group-hover:text-primary transition-colors">{program.name}</h3>
                <p className="text-sm text-text-secondary dark:text-text-secondary-dark leading-relaxed mb-6 flex-grow">
                  {program.tagline}
                </p>
                <div className="flex items-center gap-2 text-primary font-semibold text-sm group-hover:gap-4 transition-all">
                  Learn More
                  <ArrowRight size={16} />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-16 text-center">
      </div>
    </section>
  )
}
