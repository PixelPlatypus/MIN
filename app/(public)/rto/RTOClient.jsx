'use client'
import { m } from 'framer-motion'
import { 
  Trophy, BookOpen, Compass, Target, 
  CaretRight as ChevronRight, Calculator, Globe, 
  Users, Books as Library, FileText, ArrowRight,
  MapPin, Flag, Medal as Award, RocketLaunch as Sparkles
} from '@phosphor-icons/react'
import { Fragment, useEffect, useState } from 'react'
import Link from 'next/link'
import { Skeleton } from '@/components/ui/Skeleton'
import PageHero from '@/components/public/PageHero'
import SectionHeader from '@/components/public/SectionHeader'
import BrandSpotlightCard from '@/components/public/BrandSpotlightCard'

const ICON_MAP = {
  MapPin, Flag, Award, Users, Globe, Library, FileText
}

// Roadmap phases are tinted by position on the brand palette (teal → yellow).
// The colour classes stored with each phase in the DB are intentionally ignored.
const PHASE_STYLES = [
  {
    surface: 'from-primary-light/15 dark:from-primary-light/20',
    border: 'border-primary-light/30 dark:border-primary-light/40',
    chip: 'bg-primary-light/15 text-primary dark:bg-primary-light/25 dark:text-white',
  },
  {
    surface: 'from-primary/10 dark:from-white/10',
    border: 'border-primary/25 dark:border-white/20',
    chip: 'bg-primary/10 text-primary dark:bg-white/10 dark:text-secondary-light',
  },
  {
    surface: 'from-cyan/10 dark:from-cyan/10',
    border: 'border-cyan/30 dark:border-cyan/30',
    chip: 'bg-cyan/15 text-primary-dark dark:bg-cyan/20 dark:text-white',
  },
  {
    surface: 'from-secondary/50 dark:from-secondary/10',
    border: 'border-secondary-dark/50 dark:border-secondary/35',
    chip: 'bg-secondary/70 text-primary-dark dark:bg-secondary/15 dark:text-secondary',
  },
]

export default function RTOClient({ initialSettings = null }) {
  const [settings, setSettings] = useState(initialSettings)
  const [isLoading, setIsLoading] = useState(!initialSettings)

  useEffect(() => {
    if (initialSettings) return // rendered on the server
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        setSettings(data)
        setIsLoading(false)
      })
      .catch(err => {
        console.error('RTO settings load error', err)
        setIsLoading(false)
      })
  }, [])

  const displayStages = settings?.rto_stages || []
  const displayRoadmap = settings?.rto_roadmap || []
  const displayResources = settings?.rto_resources || []

  return (
    <div className="pb-24 space-y-20 md:space-y-28">
      {/* Hero + selection process share one block so the section gap doesn't stack on the hero's padding */}
      <div>
      <PageHero
        loading={isLoading}
        eyebrow={settings?.rto_title}
        icon={<Compass size={16} weight="bold" />}
        title={settings?.rto_subtitle}
        description={settings?.rto_description}
      />

      {/* Selection Process Timeline */}
      <section className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <SectionHeader
            title="Olympiad Selection Process"
            description="Students in Nepal reach the International Mathematical Olympiad (IMO) through several selection stages. Each stage narrows the pool and trains the students who advance."
          />

          {/* Path: card → arrow → card. Arrows point right on desktop, down when the cards stack. */}
          <ol className="flex flex-col lg:flex-row items-stretch">
            {isLoading ? (
              [...Array(5)].map((_, i) => (
                <li key={i} className="card-brand p-8 flex-1 flex flex-col items-center text-center space-y-4 mb-6 lg:mb-0 lg:mr-6">
                  <Skeleton className="w-16 h-16 rounded-2xl" />
                  <Skeleton className="w-12 h-6" />
                  <Skeleton className="w-24 h-4" />
                  <Skeleton className="w-full h-12" />
                </li>
              ))
            ) : (
              displayStages.map((stage, idx) => {
                const Icon = ICON_MAP[stage.icon] || Award
                const isLast = idx === displayStages.length - 1
                return (
                  <Fragment key={stage.id}>
                    <m.li
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.12 }}
                      className={`card-brand card-brand-hover p-8 relative flex-1 min-w-0 flex flex-col items-center text-center group ${isLast ? 'ring-2 ring-secondary-dark/70 dark:ring-secondary/60' : ''}`}
                    >
                      <div className="relative mb-6">
                        <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary dark:bg-secondary/15 dark:text-secondary flex items-center justify-center group-hover:scale-110 group-hover:bg-primary group-hover:text-white dark:group-hover:bg-secondary dark:group-hover:text-primary-dark transition-all">
                          <Icon size={32} />
                        </div>
                        <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-primary text-white dark:bg-secondary dark:text-primary-dark text-xs font-black flex items-center justify-center ring-4 ring-white dark:ring-primary-dark">
                          {idx + 1}
                        </span>
                      </div>
                      <h3 className="font-black text-xl mb-3 tracking-tight">{stage.id}</h3>
                      <h4 className="text-sm font-bold text-auto-secondary mb-4 leading-tight lg:min-h-[40px]">{stage.name}</h4>
                      <p className="text-sm text-auto-tertiary leading-relaxed">{stage.desc}</p>
                      {isLast && (
                        <span className="mt-4 text-[11px] font-black tracking-wide px-3 py-1 rounded-full bg-secondary/70 text-primary-dark dark:bg-secondary/15 dark:text-secondary">
                          Final stage
                        </span>
                      )}
                    </m.li>

                    {!isLast && (
                      <m.li
                        aria-hidden
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.12 + 0.1 }}
                        className="flex flex-col lg:flex-row items-center justify-center shrink-0 h-14 lg:h-auto lg:w-12 lg:self-start lg:mt-[55px]"
                      >
                        <span className="w-0.5 h-full lg:w-full lg:h-0.5 bg-primary/40 dark:bg-secondary/50 rounded-full" />
                        <ArrowRight size={18} weight="bold" className="shrink-0 rotate-90 lg:rotate-0 text-primary dark:text-secondary -mt-1 lg:mt-0 lg:-ml-1.5" />
                      </m.li>
                    )}
                  </Fragment>
                )
              })
            )}
          </ol>
        </div>
      </section>
      </div>

      {/* DMO Practice Banner */}
      <section className="container mx-auto px-6">
        <m.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto"
        >
          <BrandSpotlightCard className="p-8 sm:p-12 md:p-16 overflow-hidden">
            <div aria-hidden className="absolute -top-24 -right-24 w-64 h-64 bg-secondary/40 dark:bg-secondary/15 blur-[80px] rounded-full pointer-events-none" />
            <div className="flex flex-col md:flex-row items-center justify-between gap-10 md:gap-12 relative z-10">
              <div className="space-y-6 flex-1 text-center md:text-left">
                <div className="w-16 h-16 rounded-3xl bg-primary/10 text-primary dark:bg-secondary/15 dark:text-secondary flex items-center justify-center mx-auto md:mx-0">
                  <Target size={32} />
                </div>
                <h2 className="text-4xl font-black tracking-tight">DMO Practice Questions</h2>
                <p className="text-lg text-auto-secondary leading-relaxed">
                  Sharpen your problem-solving skills with a diverse set of District Mathematical Olympiad practice questions. Each set is designed to challenge and prepare you for the real competition.
                </p>
              </div>
              <Link href="/dmopractice" className="btn-brand group shrink-0 w-full sm:w-auto text-lg">
                Start Practicing
                <ArrowRight size={22} weight="bold" className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </BrandSpotlightCard>
        </m.div>
      </section>

      {/* Roadmap Section */}
      {displayRoadmap.length > 0 && (
        <section className="container mx-auto px-6">
          <SectionHeader
            title="Roadmap: Beginner to IMO"
            description="Follow this structured path to master Olympiad mathematics step-by-step."
          />

          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            {displayRoadmap.map((phase, idx) => {
              const tone = PHASE_STYLES[idx % PHASE_STYLES.length]
              return (
                <m.div
                  key={phase.phase}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className={`card-brand rounded-[2.5rem] p-6 sm:p-8 md:p-10 relative overflow-hidden ${tone.border}`}
                >
                  <div aria-hidden className={`absolute inset-0 bg-gradient-to-br ${tone.surface} to-transparent pointer-events-none`} />
                  <div className="relative">
                    <div className="mb-8">
                      <span className={`text-xs font-black tracking-wide px-3 py-1.5 rounded-full mb-4 inline-block ${tone.chip}`}>
                        {phase.timeline}
                      </span>
                      <h3 className="text-3xl font-black tracking-tight mb-2">{phase.phase}</h3>
                      <p className="text-sm font-bold text-auto-secondary">Goal: {phase.goal}</p>
                    </div>

                    <div className="space-y-4">
                      {(phase.items || []).map((item, i) => (
                        <div key={i} className="flex gap-4 p-4 rounded-2xl bg-white/60 dark:bg-white/5 border border-primary/10 dark:border-white/10 hover:bg-white/90 dark:hover:bg-white/10 transition-colors">
                          <div className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center font-black text-sm ${tone.chip}`}>
                            {i + 1}
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-bold text-sm mb-1">{item.label}</h4>
                            <p className="text-xs text-auto-tertiary leading-relaxed">{item.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </m.div>
              )
            })}
          </div>
        </section>
      )}

      {/* Resources Section */}
      {displayResources.length > 0 && (
        <section className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <SectionHeader
              title="Essential Resources"
              description="Study materials chosen by the MIN team for Olympiad preparation."
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {displayResources.map((category, idx) => {
                const Icon = ICON_MAP[category.icon] || Library
                return (
                  <m.div
                    key={category.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="card-brand card-brand-hover p-8 flex flex-col h-full"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary dark:bg-secondary/15 dark:text-secondary flex items-center justify-center mb-6">
                      <Icon size={24} />
                    </div>
                    <h3 className="text-xl font-black mb-6 tracking-tight">{category.title}</h3>
                    <ul className="space-y-4">
                      {(category.items || []).map((item, i) => {
                        const name = typeof item === 'string' ? item : item.name
                        const url = typeof item === 'string' ? '' : (item.url || '')
                        const linked = url && url !== '#'
                        return (
                          <li key={i} className="group flex items-start gap-3">
                            <ChevronRight size={16} weight="bold" className="text-primary/40 group-hover:text-primary dark:text-secondary/80 dark:group-hover:text-secondary shrink-0 mt-0.5 transition-all group-hover:translate-x-1" />
                            {linked ? (
                              <a
                                href={url}
                                target={url.startsWith('http') ? '_blank' : '_self'}
                                rel="noopener noreferrer"
                                className="text-sm leading-snug font-medium text-auto-secondary underline-offset-4 hover:underline group-hover:text-primary dark:group-hover:text-secondary transition-colors break-words min-w-0"
                              >
                                {name}
                              </a>
                            ) : (
                              <span className="text-sm leading-snug font-medium text-auto-secondary break-words min-w-0">{name}</span>
                            )}
                          </li>
                        )
                      })}
                    </ul>
                  </m.div>
                )
              })}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
