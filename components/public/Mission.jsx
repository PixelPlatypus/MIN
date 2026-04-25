'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, Award, Target, Heart } from 'lucide-react'
import Image from 'next/image'
import { Skeleton } from '@/components/ui/Skeleton'

export default function Mission() {
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
        console.error('Mission settings load error', err)
        setIsLoading(false)
      })
  }, [])

  const features = settings ? [
    { 
      title: settings.mission_f1_title, 
      desc: settings.mission_f1_desc,
      icon: <CheckCircle2 className="text-primary" />
    },
    { 
      title: settings.mission_f2_title, 
      desc: settings.mission_f2_desc,
      icon: <Award className="text-cyan" />
    },
    { 
      title: settings.mission_f3_title, 
      desc: settings.mission_f3_desc,
      icon: <Target className="text-purple" />
    },
    { 
      title: settings.mission_f4_title, 
      desc: settings.mission_f4_desc,
      icon: <Heart className="text-coral" />
    },
  ] : []

  return (
    <section className="container mx-auto px-6 py-24 relative overflow-hidden">
      <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
        <motion.div 
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="lg:w-1/2 space-y-8"
        >
          <div className="space-y-4">
            <span className="text-primary font-bold uppercase tracking-widest text-sm">
              {isLoading ? <Skeleton className="w-24 h-4" /> : settings?.mission_badge}
            </span>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight">
              {isLoading ? (
                <>
                  <Skeleton className="w-full h-10 mb-2" />
                  <Skeleton className="w-3/4 h-10" />
                </>
              ) : settings?.mission_title}
            </h2>
            <div className="max-w-2xl">
              {isLoading ? (
                <div className="space-y-2">
                  <Skeleton className="w-full h-4" />
                  <Skeleton className="w-full h-4" />
                  <Skeleton className="w-5/6 h-4" />
                </div>
              ) : (
                <p className="text-lg text-text-secondary dark:text-text-secondary-dark leading-relaxed">
                  {settings?.mission_description}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-4">
            {isLoading ? (
              [...Array(4)].map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="w-10 h-10 rounded-xl" />
                  <Skeleton className="w-32 h-6" />
                  <Skeleton className="w-full h-4" />
                </div>
              ))
            ) : (
              features.map((feature) => (
                <div key={feature.title} className="space-y-3 group">
                  <div className="w-10 h-10 rounded-xl bg-bg-secondary dark:bg-white/5 flex items-center justify-center transition-transform group-hover:scale-110">
                    {feature.icon}
                  </div>
                  <h4 className="font-bold text-lg">{feature.title}</h4>
                  <p className="text-sm text-text-secondary dark:text-text-secondary-dark leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              ))
            )}
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="lg:w-1/2 relative"
        >
          <div className="aspect-square relative rounded-[3rem] overflow-hidden shadow-2xl min-h-[300px]">
            {isLoading ? (
              <Skeleton className="w-full h-full" />
            ) : (
              <>
                <div className="absolute inset-0 bg-primary/10 mix-blend-overlay z-10" />
                {settings?.mission_image_url && (
                  <Image 
                    src={settings.mission_image_url} 
                    alt="MIN Mission" 
                    fill
                    className="object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                )}
              </>
            )}
          </div>
          
          {/* Decorative Elements */}
          <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-primary/20 rounded-full blur-3xl -z-10" />
          
          {!isLoading && (
            <div className="absolute -bottom-6 -right-6 glass p-6 rounded-3xl shadow-xl max-w-[200px] z-20 hidden sm:block">
              <p className="text-sm font-bold leading-tight mb-2">
                {settings?.mission_rec_title}
              </p>
              <p className="text-xs text-text-secondary dark:text-text-secondary-dark">
                {settings?.mission_rec_desc}
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  )
}
