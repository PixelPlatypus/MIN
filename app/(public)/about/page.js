'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Heart, Target, Lightbulb, Users, Award } from 'lucide-react'

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

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => setSettings(data))
      .catch(err => console.error('About settings load error', err))
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
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold tracking-tight"
          >
            {settings?.about_hero_title || "Transforming Math Education in Nepal"}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-text-secondary dark:text-text-secondary-dark leading-relaxed max-w-3xl mx-auto"
          >
            {settings?.about_hero_description || "Mathematics Initiatives in Nepal (MIN) is a non-profit organization dedicated to making mathematics accessible, engaging, and inspiring for all students across the country."}
          </motion.p>
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
            <p className="text-lg text-text-secondary dark:text-text-secondary-dark leading-relaxed">
              {settings?.about_vision_text || "To build a Nepal where every student is empowered with logical thinking and problem-solving skills, viewing mathematics as a tool for innovation and understanding."}
            </p>
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
            <p className="text-lg text-text-secondary dark:text-text-secondary-dark leading-relaxed">
              {settings?.about_mission_text || "To democratize math education through innovative programs, community outreach, and high-quality digital resources that inspire curiosity and foster excellence."}
            </p>
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
              {settings?.about_rec_title || "Globally Recognized Innovation"}
            </h2>
            <p className="text-lg text-text-secondary dark:text-text-secondary-dark leading-relaxed">
              {settings?.about_rec_description || "Our commitment to excellence was recognized by HundrED, identifying MIN as one of the Top 100 most inspiring global education innovations in 2024. This recognition fuels our drive to reach even more students across Nepal."}
            </p>
            <div className="pt-4">
              <div className="flex items-center gap-4 mb-2">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <span className="font-bold text-primary">{settings?.about_rec_badge_title || "HundrED Top 100"}</span>
              </div>
              <p className="text-sm text-text-tertiary">
                {settings?.about_rec_badge_desc || "Global Education Innovation Award 2024"}
              </p>
            </div>
          </div>
          <div className="w-64 h-64 md:w-80 md:h-80 relative flex-shrink-0">
            <div className="absolute inset-0 bg-primary/10 rounded-full blur-3xl" />
            <img 
              src={settings?.about_rec_image || "https://hundred-cdn.s3.amazonaws.com/uploads/innovation/image/2443/hundred_logo_full_color.png"}
              alt="HundrED Award" 
              className="w-full h-full object-contain relative z-10 p-8"
            />
          </div>
        </div>
      </section>
    </div>
  )
}
