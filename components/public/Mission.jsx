'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, Award, Target, Heart } from 'lucide-react'
import Image from 'next/image'

export default function Mission() {
  const [settings, setSettings] = useState(null)

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => setSettings(data))
      .catch(err => console.error('Mission settings load error', err))
  }, [])

  const features = settings ? [
    { 
      title: settings.mission_f1_title || 'Accessible Learning', 
      desc: settings.mission_f1_desc || 'Breaking barriers to ensure every student in Nepal has access to quality math education.',
      icon: <CheckCircle2 className="text-primary" />
    },
    { 
      title: settings.mission_f2_title || 'Engaging Programs', 
      desc: settings.mission_f2_desc || 'From olympiads to bootcamps, we make math fun, challenging, and relevant.',
      icon: <Award className="text-cyan" />
    },
    { 
      title: settings.mission_f3_title || 'Goal Oriented', 
      desc: settings.mission_f3_desc || 'Empowering students with problem-solving skills for their future careers.',
      icon: <Target className="text-purple" />
    },
    { 
      title: settings.mission_f4_title || 'Community First', 
      desc: settings.mission_f4_desc || 'Building a supportive network of educators, volunteers, and math enthusiasts.',
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
            <span className="text-primary font-bold uppercase tracking-widest text-sm">{settings?.mission_badge || "Our Mission"}</span>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight">
              {settings?.mission_title || "Empowering the next generation of thinkers and problem solvers."}
            </h2>
            <p className="text-lg text-text-secondary dark:text-text-secondary-dark leading-relaxed">
              {settings?.mission_description || "At MIN, we believe that mathematics is more than just numbers and formulas. It's a powerful tool for understanding the world, driving innovation, and creating impact. Our mission is to inspire a love for math across Nepal."}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-4">
            {features.map((feature) => (
              <div key={feature.title} className="space-y-3 group">
                <div className="w-10 h-10 rounded-xl bg-bg-secondary dark:bg-white/5 flex items-center justify-center transition-transform group-hover:scale-110">
                  {feature.icon}
                </div>
                <h4 className="font-bold text-lg">{feature.title}</h4>
                <p className="text-sm text-text-secondary dark:text-text-secondary-dark leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="lg:w-1/2 relative"
        >
          <div className="aspect-square relative rounded-[3rem] overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-primary/10 mix-blend-overlay z-10" />
            <Image 
              src={settings?.mission_image_url || "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=2132&auto=format&fit=crop"} 
              alt="Students learning mathematics"
              fill
              className="object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-700"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          
          {/* Decorative Elements */}
          <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-primary/20 rounded-full blur-3xl -z-10" />
          
          <div className="absolute -bottom-6 -right-6 glass p-6 rounded-3xl shadow-xl max-w-[200px] z-20 hidden sm:block">
            <p className="text-sm font-bold leading-tight mb-2">
              {settings?.mission_rec_title || "Recognized Globally"}
            </p>
            <p className="text-xs text-text-secondary dark:text-text-secondary-dark">
              {settings?.mission_rec_desc || "Top 100 Global Education Innovations by HundrED."}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
