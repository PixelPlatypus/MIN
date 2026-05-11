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
  { icon: Users, value: '12,500+', label: 'Students' },
  { icon: BookOpen, value: '8', label: 'Programs' },
  { icon: Clock, value: '200+', label: 'Volunteers' },
  { icon: Award, value: '2020', label: 'Founded' },
]

export default function Hero({ settings }) {
  const [visible, setVisible] = useState(false)
  const sectionRef = useRef(null)
  const curveRef = useRef(null)

  useEffect(() => { setVisible(true) }, [])

  useEffect(() => {
    let ctx
    Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(([{ default: gsap }, { ScrollTrigger }]) => {
      gsap.registerPlugin(ScrollTrigger)
      ctx = gsap.context(() => {
        if (sectionRef.current) {
          gsap.to(sectionRef.current, { y: -30, ease: 'none', scrollTrigger: { trigger: sectionRef.current, start: 'top top', end: 'bottom top', scrub: true } })
        }
        if (curveRef.current) {
          const len = curveRef.current.getTotalLength()
          gsap.fromTo(curveRef.current, { strokeDashoffset: len }, {
            strokeDashoffset: 0, ease: 'none',
            scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', end: 'center 40%', scrub: true },
          })
        }
      })
    })
    return () => ctx?.revert()
  }, [])

  const subtitle = settings?.hero_subtitle || 'Igniting curiosity and fostering excellence across Nepal. We\'re building a future where every student views mathematics as a tool for innovation.'

  return (
    <section ref={sectionRef} className="relative min-h-screen flex items-center pt-20 pb-16 overflow-hidden">
      <VoronoiCanvas className="opacity-35" />
      <div className="absolute inset-0 math-grid opacity-[0.06]" />

      {/* Math motif: integral curve drawing across hero */}
      <svg className="absolute left-0 bottom-[25%] w-full h-40 pointer-events-none opacity-[0.07]" viewBox="0 0 1200 160" preserveAspectRatio="none" fill="none">
        <defs>
          <linearGradient id="curveGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--color-headline)" stopOpacity="0" />
            <stop offset="20%" stopColor="var(--color-headline)" stopOpacity="1" />
            <stop offset="80%" stopColor="var(--color-headline)" stopOpacity="1" />
            <stop offset="100%" stopColor="var(--color-headline)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path ref={curveRef} d="M-10,80 Q100,140 200,80 T400,40 T600,100 T800,30 T1000,70 T1210,50"
          stroke="url(#curveGrad)" strokeWidth="2" strokeDasharray="1200" strokeDashoffset="1200" />
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
            <span className="block text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[1.05] text-text-primary-dynamic">Elevating</span>
            <span className="block text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[1.05] text-accent">Nepal</span>
            <span className="block text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[1.05] text-headline">Through Mathematics.</span>
          </h1>

          <div className={`transition-all duration-700 delay-[600ms] ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <p className="mt-8 text-lg md:text-xl text-text-secondary-dynamic leading-relaxed max-w-2xl">{subtitle}</p>
          </div>

          <div className={`transition-all duration-700 delay-[800ms] ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
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

        <div className={`transition-all duration-700 delay-[1000ms] ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
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
                  <Icon size={20} className="text-marigold/40 shrink-0" />
                  <div className="flex flex-col justify-center gap-1.5">
                    <div className="text-2xl font-black tracking-tighter text-headline leading-none">{s.value}</div>
                    <div className="text-[10px] text-text-tertiary-dynamic tracking-[0.2em] uppercase leading-none">{s.label}</div>
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
