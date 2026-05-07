'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Target, Heart, Users, Globe, Award, BookOpen, Clock } from 'lucide-react'
import VoronoiCanvas from '@/components/shared/VoronoiCanvas'

const features = [
  { icon: <Target size={24} />, label: 'Olympiad Training', desc: 'Rigorous preparation for national and international competitions.' },
  { icon: <Heart size={24} />, label: 'ETA Campaigns', desc: 'Empowering teachers with modern pedagogical tools.' },
  { icon: <Users size={24} />, label: 'Women in Math', desc: 'Building inclusive pathways for future mathematicians.' },
  { icon: <Globe size={24} />, label: 'Global Reach', desc: 'Connecting Nepali talent with the world.' },
]

const stats = [
  { icon: <Users size={20} />, value: '15,000+', label: 'Students Reached' },
  { icon: <Award size={20} />, value: 'HundrED', label: 'Top 100 Global' },
  { icon: <BookOpen size={20} />, value: '7', label: 'Provinces' },
  { icon: <Clock size={20} />, value: '2020', label: 'Founded' },
]

export default function Hero({ settings }) {
  const [visible, setVisible] = useState(false)
  const [subVisible, setSubVisible] = useState(false)
  const sectionRef = useRef(null)

  useEffect(() => {
    setVisible(true)
    const t1 = setTimeout(() => setSubVisible(true), 400)
    return () => clearTimeout(t1)
  }, [])

  useEffect(() => {
    let ctx
    Promise.all([
      import('gsap'),
      import('gsap/ScrollTrigger')
    ]).then(([{ default: gsap }, { ScrollTrigger }]) => {
      gsap.registerPlugin(ScrollTrigger)
      ctx = gsap.context(() => {
        if (sectionRef.current) {
          gsap.to(sectionRef.current, {
            y: -30,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top top',
              end: 'bottom top',
              scrub: true,
            },
          })
        }
      })
    })
    return () => ctx?.revert()
  }, [])

  return (
    <section ref={sectionRef} className="relative min-h-screen flex items-center pt-20 pb-12 overflow-hidden">
      <VoronoiCanvas className="opacity-40" />
      <div className="absolute inset-0 math-grid opacity-[0.08]" />

      {/* Ambient glows */}
      <div className="absolute top-1/4 -left-32 w-[500px] h-[500px] rounded-full bg-bg/80 blur-[120px] opacity-60 pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-[400px] h-[400px] bg-marigold/20 rounded-full blur-[100px] opacity-40 pointer-events-none" />

      {/* Nepal flag motif */}
      <svg className="absolute right-0 top-1/2 -translate-y-1/2 w-[600px] h-[400px] opacity-[0.06] pointer-events-none" viewBox="0 0 600 400">
        <polygon points="100,380 300,20 300,380" fill="white" />
        <polygon points="100,380 500,380 500,160" fill="white" />
        <polygon points="140,340 300,60 300,340" fill="white" stroke="currentColor" strokeWidth="0.5" />
        <polygon points="140,340 460,340 460,180" fill="white" stroke="currentColor" strokeWidth="0.5" />
      </svg>

      {/* Animated SVG math graph */}
      <svg className="absolute right-12 top-1/4 w-72 h-72 opacity-[0.08] pointer-events-none" viewBox="0 0 300 300">
        <path d="M0,150 C50,50 100,250 150,150 S250,50 300,150" fill="none" stroke="currentColor" strokeWidth="1.5"
          strokeDasharray="600" strokeDashoffset="600">
          <animate attributeName="stroke-dashoffset" from="600" to="0" dur="3s" fill="freeze" />
        </path>
        <path d="M0,180 C50,80 100,280 150,180 S250,80 300,180" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.5"
          strokeDasharray="600" strokeDashoffset="600">
          <animate attributeName="stroke-dashoffset" from="600" to="0" dur="4s" fill="freeze" />
        </path>
        <circle cx="150" cy="150" r="3" fill="var(--color-marigold)">
          <animate attributeName="opacity" values="0;1;1;0" dur="3s" fill="freeze" />
        </circle>
        <circle cx="0" cy="150" r="2" fill="var(--color-headline)">
          <animate attributeName="opacity" values="0;1" dur="1s" fill="freeze" />
        </circle>
      </svg>

      <div className="relative z-10 px-6 md:px-12 lg:px-20 max-w-7xl mx-auto w-full">
        <div className="max-w-4xl">
          <div className={`transition-all duration-700 delay-100 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <span className="pill inline-flex items-center gap-2 px-4 py-1.5 text-xs font-semibold tracking-wider uppercase font-institutional mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-marigold" />
              {settings?.hero_badge || 'Mathematics Initiatives in Nepal'}
            </span>
          </div>

          <h1 className={`transition-all duration-700 delay-200 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <span className="block text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.05] text-text-primary-dynamic">
              Elevating
            </span>
            <span className="block text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.05] text-accent">
              Nepal
            </span>
            <span className="block text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.05] text-headline">
              Through Mathematics.
            </span>
          </h1>

          <div className={`transition-all duration-700 delay-[600ms] ${subVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <p className="mt-8 text-lg md:text-xl text-text-secondary-dynamic leading-relaxed max-w-2xl">
              {settings?.hero_subtitle || 'We build a nationwide ecosystem of olympiad training, teacher empowerment, and digital content — making world-class mathematics accessible to every corner of Nepal.'}
            </p>
          </div>

          <div className={`transition-all duration-700 delay-[800ms] ${subVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <div className="mt-10 flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <Link
                href={settings?.hero_cta_link || '/join'}
                className="inline-flex items-center gap-2 bg-headline text-bg px-8 py-4 rounded-xl font-bold text-base transition-all hover:scale-[1.02] active:scale-[0.98] group"
              >
                {settings?.hero_cta_text || 'Join the Movement'}
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <span className="text-sm text-text-tertiary-dynamic flex items-center gap-3">
                <span className="w-1 h-1 rounded-full bg-marigold" />
                Founded 2020 · HundrED Top 100 · 7 Provinces
              </span>
            </div>
          </div>
        </div>

        <div className={`transition-all duration-700 delay-[1000ms] ${subVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-20">
            {features.map((f, i) => (
              <div key={i} className="bg-surface border border-border-dynamic rounded-xl p-5 flex flex-col gap-3 hover:border-marigold/40 transition-colors duration-300">
                <div className="w-10 h-10 rounded-xl bg-marigold/10 flex items-center justify-center text-marigold">
                  {f.icon}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-text-primary-dynamic">{f.label}</h4>
                  <p className="text-xs text-text-tertiary-dynamic mt-1 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between mt-14 pt-8 border-t border-border-dynamic flex-wrap gap-4">
            {stats.map((s, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="text-marigold">{s.icon}</div>
                <div>
                  <div className="text-lg font-bold text-text-primary-dynamic">{s.value}</div>
                  <div className="text-xs text-text-tertiary-dynamic tracking-wide uppercase">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
