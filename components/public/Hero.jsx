'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Target, Heart, Users, Globe, Award, BookOpen, Clock } from 'lucide-react'
import VoronoiCanvas from '@/components/shared/VoronoiCanvas'

const features = [
  { icon: Target, title: 'Discover Talent', desc: 'Identify mathematically gifted students across all seven provinces through district and national olympiads.' },
  { icon: Heart, title: 'Train Champions', desc: 'Intensive camps, mentorship, and world-class resources to prepare students for international competition.' },
  { icon: Users, title: 'Build Community', desc: 'A growing network of educators, alumni, and volunteers passionate about mathematics in Nepal.' },
  { icon: Globe, title: 'Bridge the Gap', desc: 'Making world-class mathematics education accessible regardless of geography or economic background.' },
]

const stats = [
  { icon: Users, value: '12,500+', label: 'Students Reached' },
  { icon: BookOpen, value: '8', label: 'Active Programs' },
  { icon: Clock, value: '200+', label: 'Volunteers' },
  { icon: Award, value: '5+', label: 'Years of Impact' },
]

export default function Hero({ settings }) {
  const [visible, setVisible] = useState(false)
  const [subVisible, setSubVisible] = useState(false)
  const sectionRef = useRef(null)

  useEffect(() => { setVisible(true); const t = setTimeout(() => setSubVisible(true), 400); return () => clearTimeout(t) }, [])

  useEffect(() => {
    let ctx
    Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(([{ default: gsap }, { ScrollTrigger }]) => {
      gsap.registerPlugin(ScrollTrigger)
      ctx = gsap.context(() => {
        if (sectionRef.current) gsap.to(sectionRef.current, { y: -30, ease: 'none', scrollTrigger: { trigger: sectionRef.current, start: 'top top', end: 'bottom top', scrub: true } })
      })
    })
    return () => ctx?.revert()
  }, [])

  const subtitle = settings?.hero_subtitle || 'Igniting curiosity and fostering excellence across Nepal. We\'re building a future where every student views mathematics as a tool for innovation.'

  return (
    <section ref={sectionRef} className="relative min-h-screen flex items-center pt-20 pb-12 overflow-hidden">
      <VoronoiCanvas className="opacity-40" />
      <div className="absolute inset-0 math-grid opacity-[0.08]" />

      {/* Nepal flag — the only national motif, breathing animation */}
      <svg className="absolute right-[3%] top-[18%] w-32 h-44 opacity-[0.08] pointer-events-none animate-nepal-flag" viewBox="0 0 100 140" fill="none">
        <path d="M5 135 L5 20 L50 5 L50 65 L95 55 L95 135 Z" stroke="var(--color-marigold)" strokeWidth="2.5" fill="none" />
        <path d="M50 25 L75 60 L50 55" stroke="var(--color-marigold)" strokeWidth="1" fill="none" opacity="0.5" />
        <circle cx="68" cy="75" r="3" fill="var(--color-marigold)" opacity="0.4">
          <animate attributeName="opacity" values="0.2;0.6;0.2" dur="4s" repeatCount="indefinite" />
        </circle>
      </svg>

      <div className="relative z-10 px-6 md:px-12 lg:px-20 max-w-7xl mx-auto w-full">
        <div className="max-w-4xl">
          <div className={`transition-all duration-700 delay-100 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <span className="pill inline-flex items-center gap-2 px-4 py-1.5 text-xs font-semibold tracking-wider uppercase font-institutional mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-marigold animate-pulse" />
              {settings?.hero_badge || 'Mathematics Initiatives in Nepal'}
            </span>
          </div>

          <h1 className={`transition-all duration-700 delay-200 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <span className="block text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[1.05] text-text-primary-dynamic">
              Elevating
            </span>
            <span className="block text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[1.05] text-accent">
              Nepal
            </span>
            <span className="block text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[1.05] text-headline">
              Through Mathematics.
            </span>
          </h1>

          <div className={`transition-all duration-700 delay-[600ms] ${subVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <p className="mt-8 text-lg md:text-xl text-text-secondary-dynamic leading-relaxed max-w-2xl">{subtitle}</p>
          </div>

          <div className={`transition-all duration-700 delay-[800ms] ${subVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <div className="mt-10 flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <Link href={settings?.hero_cta_link || '/join'}
                className="inline-flex items-center gap-2 bg-headline text-bg px-8 py-4 rounded-xl font-bold text-base transition-all hover:bg-accent hover:shadow-xl hover:shadow-accent/25 group">
                Join the Movement
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <span className="text-sm text-text-tertiary-dynamic flex items-center gap-3">
                <span className="w-1 h-1 rounded-full bg-marigold" />
                Founded 2020 &middot; HundrED Top 100 &middot; 7 Provinces
              </span>
            </div>
          </div>
        </div>

        <div className={`transition-all duration-700 delay-[1000ms] ${subVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-20">
            {features.map((f) => {
              const Icon = f.icon
              return (
                <div key={f.title} className="bg-surface border border-border-dynamic rounded-xl p-5 hover:border-marigold/30 transition-colors duration-300">
                  <div className="w-10 h-10 rounded-xl bg-marigold/5 border border-marigold/10 flex items-center justify-center mb-3">
                    <Icon size={18} className="text-marigold" />
                  </div>
                  <h4 className="font-bold text-sm text-headline mb-1">{f.title}</h4>
                  <p className="text-xs text-text-secondary-dynamic leading-relaxed">{f.desc}</p>
                </div>
              )
            })}
          </div>

          <div className="flex items-center justify-between mt-14 pt-8 border-t border-border-dynamic flex-wrap gap-4">
            {stats.map((s) => {
              const Icon = s.icon
              return (
                <div key={s.label} className="flex items-center gap-3">
                  <Icon size={18} className="text-marigold/40" />
                  <div>
                    <div className="text-2xl font-black tracking-tighter text-headline">{s.value}</div>
                    <div className="text-xs text-text-tertiary-dynamic tracking-wide uppercase">{s.label}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
