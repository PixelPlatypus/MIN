'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Heart, Target, Lightbulb, Users, Award } from 'lucide-react'
import { Skeleton } from '@/components/ui/Skeleton'

const values = [
  { 
    title: 'Passion', 
    desc: 'We are deeply passionate about mathematics and its potential to transform lives.',
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

export default function AboutPage() {
  const [settings, setSettings] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
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
    <div className="pt-32 pb-24 space-y-32">
      {/* Hero Section */}
      <section className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-bold tracking-widest uppercase"
          >
            <Sparkles size={16} />
            Our Mission
          </motion.div>
          <div className="flex justify-center">
            {isLoading ? (
              <Skeleton className="w-[80%] h-16 md:h-20" />
            ) : (
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-5xl md:text-7xl font-bold tracking-tight"
              >
                {settings?.about_hero_title}
              </motion.h1>
            )}
          </div>
          <div className="max-w-3xl mx-auto">
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="w-full h-4" />
                <Skeleton className="w-5/6 h-4 mx-auto" />
              </div>
            ) : (
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xl text-text-secondary dark:text-text-secondary-dark leading-relaxed"
              >
                {settings?.about_hero_description}
              </motion.p>
            )}
          </div>
        </div>
      </section>

      {/* Vision & Mission Cards */}
      <section className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass rounded-[3rem] p-12 space-y-6 relative overflow-hidden"
          >
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
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
              <p className="text-lg text-text-secondary dark:text-text-secondary-dark leading-relaxed">
                {settings?.about_vision_text}
              </p>
            )}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl" />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass rounded-[3rem] p-12 space-y-6 relative overflow-hidden"
          >
            <div className="w-16 h-16 bg-secondary/20 rounded-2xl flex items-center justify-center text-secondary-dark">
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
              <p className="text-lg text-text-secondary dark:text-text-secondary-dark leading-relaxed">
                {settings?.about_mission_text}
              </p>
            )}
            <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 rounded-full -mr-16 -mt-16 blur-3xl" />
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-bg-secondary dark:bg-bg-secondary-dark py-32 transition-colors">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 space-y-4">
            <span className="text-primary font-bold uppercase tracking-widest text-sm">Core Values</span>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">What Drives Us</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, i) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="glass rounded-3xl p-8 hover:shadow-xl transition-all duration-300 group hover:-translate-y-2"
              >
                <div className="w-12 h-12 bg-white dark:bg-white/5 rounded-xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform">
                  {value.icon}
                </div>
                <h4 className="text-xl font-bold mb-3">{value.title}</h4>
                <p className="text-sm text-text-secondary dark:text-text-secondary-dark leading-relaxed">
                  {value.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Recognition Summary */}
      <section className="container mx-auto px-6 py-12">
        <div className="max-w-5xl mx-auto glass rounded-[3rem] p-12 md:p-24 flex flex-col md:flex-row items-center gap-16">
          <div className="flex-1 space-y-6">
            <h2 className="text-4xl font-bold tracking-tight leading-tight">
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
                <p className="text-lg text-text-secondary dark:text-text-secondary-dark leading-relaxed">
                  {settings?.about_rec_description}
                </p>
              )}
            </div>
            <div className="pt-4">
              <div className="flex items-center gap-4 mb-2">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <span className="font-bold text-primary">
                  {isLoading ? <Skeleton className="w-32 h-4" /> : settings?.about_rec_badge_title}
                </span>
              </div>
              <div className="text-sm text-text-tertiary">
                {isLoading ? <Skeleton className="w-48 h-4" /> : settings?.about_rec_badge_desc}
              </div>
            </div>
          </div>
          <div className="w-64 h-64 md:w-80 md:h-80 relative flex-shrink-0">
            <div className="absolute inset-0 bg-primary/10 rounded-full blur-3xl" />
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
