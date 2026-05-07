'use client'
import { useEffect, useRef } from 'react'
import Image from 'next/image'

export default function Mission({ settings }) {
  const sectionRef = useRef(null)

  useEffect(() => {
    let ctx
    Promise.all([
      import('gsap'),
      import('gsap/ScrollTrigger')
    ]).then(([{ default: gsap }, { ScrollTrigger }]) => {
      gsap.registerPlugin(ScrollTrigger)
      ctx = gsap.context(() => {
        if (!sectionRef.current) return
        gsap.fromTo('.mission-fade-in',
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 75%',
            },
          }
        )
      })
    })
    return () => ctx?.revert()
  }, [])

  return (
    <section ref={sectionRef} className="relative bg-bg-secondary/30 border-y border-border-dynamic overflow-hidden">
      <div className="absolute top-1/3 right-0 w-[350px] h-[350px] bg-marigold/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="px-6 md:px-12 lg:px-20 py-24 lg:py-32">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-20 max-w-7xl mx-auto">

          <div className="lg:w-1/2 space-y-8 mission-fade-in">
            <span className="pill inline-flex items-center gap-2 px-4 py-1.5 text-xs font-semibold tracking-wider uppercase font-institutional">
              {settings?.mission_badge || 'Our Mission'}
            </span>

            <p className="text-sm font-medium tracking-widest uppercase text-marigold">लक्ष्य</p>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05] text-headline">
              {settings?.mission_title || 'Redefining mathematics education in Nepal.'}
            </h2>

            <p className="text-base md:text-lg text-text-secondary-dynamic leading-relaxed max-w-xl">
              {settings?.mission_description || 'Since 2020, we have been building a nationwide movement that transforms how students and teachers engage with mathematics — from grassroots classrooms to international olympiad podiums.'}
            </p>

            <blockquote className="border-l-2 border-marigold/30 pl-5 py-1">
              <p className="text-sm text-text-tertiary-dynamic italic leading-relaxed">
                {settings?.mission_quote || '"Our vision is a Nepal where every student, regardless of geography or background, has access to world-class mathematical thinking."'}
              </p>
            </blockquote>
          </div>

          <div className="lg:w-1/2 w-full mission-fade-in">
            <div className="relative aspect-[16/10] rounded-3xl overflow-hidden border border-border-dynamic shadow-2xl">
              {settings?.mission_image_url ? (
                <Image
                  src={settings.mission_image_url}
                  alt="MIN Mission"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              ) : (
                <div className="w-full h-full bg-surface flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-20 h-20 mx-auto rounded-2xl bg-marigold/10 flex items-center justify-center">
                      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                        <circle cx="20" cy="20" r="18" stroke="var(--color-marigold)" strokeWidth="1.5" strokeDasharray="4 3" />
                        <circle cx="20" cy="20" r="6" fill="var(--color-marigold)" opacity="0.3" />
                      </svg>
                    </div>
                    <p className="text-text-tertiary-dynamic text-sm mt-4">Mission image placeholder</p>
                  </div>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-bg/30 to-transparent pointer-events-none" />
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
