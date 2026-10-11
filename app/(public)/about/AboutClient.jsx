'use client'
import { useEffect, useState } from 'react'
import { m } from 'framer-motion'
import { Lightning as Sparkles, Heart, Target, Lightbulb, Users, Trophy as Award } from '@phosphor-icons/react'
import { Skeleton } from '@/components/ui/Skeleton'
import PageHero from '@/components/public/PageHero'
import SectionHeader from '@/components/public/SectionHeader'
import BrandSpotlightCard from '@/components/public/BrandSpotlightCard'

const values = [
  { 
    title: 'Passion', 
    desc: 'We love mathematics and want students to enjoy it as much as we do.',
    icon: <Heart className="text-coral" />
  },
  { 
    title: 'Accessibility', 
    desc: 'Making quality math education available to every student in Nepal, regardless of background.',
    icon: <Users className="text-primary" />
  },
  { 
    title: 'Innovation', 
    desc: 'Constantly exploring new ways to teach and engage with mathematical concepts.',
    icon: <Lightbulb className="text-secondary-dark" />
  },
  { 
    title: 'Excellence', 
    desc: 'Striving for the highest standards in everything we do, from programs to content.',
    icon: <Award className="text-cyan" />
  },
]

export default function AboutClient({ initialSettings = null }) {
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
        console.error('About settings load error', err)
        setIsLoading(false)
      })
  }, [])

  return (
    <div className="pb-24 space-y-24 md:space-y-32">
      {/* Hero Section */}
      <PageHero
        eyebrow="About MIN"
        icon={<Sparkles size={16} weight="fill" />}
        title={settings?.about_hero_title}
        description={settings?.about_hero_description}
        loading={isLoading}
        className="!mb-0"
      />

      {/* Vision & Mission Cards */}
      <section className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <m.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <BrandSpotlightCard className="h-full p-8 md:p-12">
              <div className="space-y-6">
              <div className="w-16 h-16 bg-primary/10 dark:bg-white/10 rounded-2xl flex items-center justify-center text-primary">
                <Target size={32} />
              </div>
              <h3 className="text-3xl font-bold">Our Vision</h3>
              {isLoading ? (
                <div className="space-y-2">
                  <Skeleton className="w-full h-4" />
                  <Skeleton className="w-full h-4" />
                  <Skeleton className="w-2/3 h-4" />
                </div>
              ) : (
                <p className="text-lg text-auto-secondary leading-relaxed">
                  {settings?.about_vision_text}
                </p>
              )}
              </div>
            </BrandSpotlightCard>
          </m.div>

          <m.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <BrandSpotlightCard className="h-full p-8 md:p-12">
              <div className="space-y-6">
              <div className="w-16 h-16 bg-secondary/30 dark:bg-secondary/15 rounded-2xl flex items-center justify-center text-primary-dark dark:text-secondary">
                <Heart size={32} />
              </div>
              <h3 className="text-3xl font-bold">Our Mission</h3>
              {isLoading ? (
                <div className="space-y-2">
                  <Skeleton className="w-full h-4" />
                  <Skeleton className="w-full h-4" />
                  <Skeleton className="w-2/3 h-4" />
                </div>
              ) : (
                <p className="text-lg text-auto-secondary leading-relaxed">
                  {settings?.about_mission_text}
                </p>
              )}
              </div>
            </BrandSpotlightCard>
          </m.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="container mx-auto px-6">
        <SectionHeader eyebrow="Core Values" title="What Drives Us" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {values.map((value, i) => (
            <m.div
              key={value.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="card-brand card-brand-hover p-8 group"
            >
              <div className="w-12 h-12 bg-bg-secondary dark:bg-white/5 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {value.icon}
              </div>
              <h4 className="text-xl font-bold mb-3">{value.title}</h4>
              <p className="text-sm text-auto-secondary leading-relaxed">
                {value.desc}
              </p>
            </m.div>
          ))}
        </div>
      </section>

      {/* Recognition Summary */}
      <section className="container mx-auto px-6">
        <div className="max-w-5xl mx-auto card-brand p-8 md:p-16 lg:p-20 flex flex-col md:flex-row items-center gap-12 md:gap-16 relative overflow-hidden">
          <div aria-hidden className="absolute inset-0 hero-glow opacity-60 pointer-events-none" />
          <div className="flex-1 space-y-6 relative">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight leading-tight">
              {isLoading ? <Skeleton className="w-full h-10" /> : settings?.about_rec_title}
            </h2>
            <div className="max-w-xl">
              {isLoading ? (
                <div className="space-y-2">
                  <Skeleton className="w-full h-4" />
                  <Skeleton className="w-full h-4" />
                  <Skeleton className="w-2/3 h-4" />
                </div>
              ) : (
                <p className="text-lg text-auto-secondary leading-relaxed">
                  {settings?.about_rec_description}
                </p>
              )}
            </div>
            <div className="pt-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-2 h-2 rounded-full bg-secondary-dark shadow-[0_0_0_3px_rgb(232_224_80/0.25)]" />
                <span className="font-bold text-primary">
                  {isLoading ? <Skeleton className="w-32 h-4" /> : settings?.about_rec_badge_title}
                </span>
              </div>
              <div className="text-sm text-auto-tertiary">
                {isLoading ? <Skeleton className="w-48 h-4" /> : settings?.about_rec_badge_desc}
              </div>
            </div>
          </div>
          <div className="w-56 h-56 sm:w-64 sm:h-64 md:w-80 md:h-80 relative flex-shrink-0">
            <div className="absolute inset-0 bg-primary/10 dark:bg-secondary/10 rounded-full blur-3xl" />
            {isLoading ? (
              <Skeleton className="w-full h-full rounded-full" />
            ) : settings?.about_rec_image && (
              <img 
                src={settings.about_rec_image}
                alt="Award" 
                className="w-full h-full object-contain relative z-10 p-8"
              />
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
