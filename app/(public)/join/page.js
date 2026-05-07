'use client'
import { useRef, useEffect, useState } from 'react'
import ContactForm from '@/components/public/ContactForm'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Heart, Sparkles, Target, Users, ArrowRight, Zap, Globe, ChevronDown, Building2, Rocket, Flame, Brain, Gem } from 'lucide-react'

export default function JoinPage() {
  const formRef = useRef(null)
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
        console.error('Join settings load error', err)
        setIsLoading(false)
      })
  }, [])

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const getIcon = (type) => {
    switch(type) {
      case 'Heart': return <Heart size={28} className="text-marigold" />
      case 'Building2': return <Building2 size={28} className="text-marigold" />
      case 'Globe': return <Globe size={28} className="text-marigold" />
      case 'Target': return <Target size={28} className="text-marigold" />
      case 'Zap': return <Zap size={24} className="text-marigold" />
      case 'Users': return <Users size={24} className="text-marigold" />
      case 'Rocket': return <Rocket size={28} className="text-marigold" />
      case 'Flame': return <Flame size={28} className="text-marigold" />
      case 'Brain': return <Brain size={28} className="text-marigold" />
      case 'Gem': return <Gem size={28} className="text-marigold" />
      default: return <Sparkles size={24} className="text-marigold" />
    }
  }

  const values = settings?.join_features || []
  const roles = settings?.join_paths || []
  const faqs = settings?.join_faqs || []

  return (
    <div className="pt-20 pb-32">
      <section className="container mx-auto px-6 py-24 md:py-36">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 pill px-5 py-2 text-xs font-institutional tracking-[0.2em] text-text-secondary-dynamic"
          >
            <Sparkles size={14} className="text-marigold" />
            {settings?.join_title || 'Join Us'}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-headline text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[0.9]"
          >
            {settings?.join_subtitle || 'Be Part of the Movement'}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-text-secondary-dynamic leading-relaxed max-w-2xl mx-auto"
          >
            {settings?.join_description || 'Join a community of passionate individuals dedicated to advancing mathematics education in Nepal.'}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button
              onClick={scrollToForm}
              className="bg-headline text-bg px-8 py-4 rounded-xl font-bold text-sm flex items-center gap-3 transition-all hover:bg-accent"
            >
              Apply Now
              <ArrowRight size={16} />
            </button>
            <button
              onClick={scrollToForm}
              className="border border-border px-8 py-4 rounded-xl font-bold text-sm text-text-secondary-dynamic hover:text-headline hover:border-border-strong transition-all flex items-center gap-2"
              aria-label="Explore joining opportunities"
            >
              Explore Opportunities
              <ChevronDown size={16} />
            </button>
          </motion.div>
        </div>
      </section>

      {values.length > 0 && (
        <section className="container mx-auto px-6 mb-32">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {values.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-surface rounded-2xl p-7 border border-border hover:border-border-strong transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-bg-secondary flex items-center justify-center mb-5">
                  {getIcon(item.icon)}
                </div>
                <h3 className="text-headline text-base font-bold tracking-tight mb-2">{item.title}</h3>
                <p className="text-sm text-text-secondary-dynamic leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      <section ref={formRef} className="container mx-auto px-6 max-w-6xl pb-32 scroll-mt-24">
        <div className="text-center space-y-3 mb-16">
          <h2 className="text-headline text-3xl md:text-5xl font-bold tracking-tight">
            {settings?.join_badge || 'Choose Your Path'}
          </h2>
          <p className="text-text-secondary-dynamic max-w-xl mx-auto">
            Choose how you want to contribute to the mathematical revolution in Nepal.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {roles.map((role, idx) => (
            <motion.div
              key={role.id || idx}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <div className="bg-surface rounded-2xl p-8 flex flex-col h-full border border-border hover:border-border-strong transition-colors">
                <div className="w-14 h-14 rounded-xl bg-bg-secondary flex items-center justify-center mb-6">
                  {getIcon(role.icon)}
                </div>

                <h3 className="text-headline text-xl font-bold tracking-tight mb-2">{role.title}</h3>
                <p className="text-sm text-text-secondary-dynamic leading-relaxed mb-6">
                  {role.desc}
                </p>

                <ul className="space-y-2.5 flex-1 mb-8">
                  {(role.perks || role.features || []).map(f => (
                    <li key={f} className="flex items-center gap-2.5 text-xs font-medium text-text-secondary-dynamic">
                      <div className="w-1.5 h-1.5 pill bg-marigold shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>

                <Link
                  href={`/join/${role.slug || role.id}`}
                  className="w-full bg-headline text-bg py-4 rounded-xl font-bold text-xs font-institutional tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-accent transition-all"
                >
                  Apply Now
                  <ArrowRight size={18} />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {faqs.length > 0 && (
        <section className="container mx-auto px-6 py-24">
          <div className="max-w-3xl mx-auto">
            <div className="text-center space-y-3 mb-14">
              <h3 className="text-headline text-3xl md:text-4xl font-bold tracking-tight">Common Questions</h3>
              <p className="text-sm text-text-secondary-dynamic">Everything you need to know before applying</p>
            </div>

            <div className="divide-y divide-border">
              {faqs.map((faq, i) => (
                <div key={i} className="py-7 first:pt-0 last:pb-0">
                  <h4 className="text-headline text-base font-bold mb-2">{faq.question || faq.q}</h4>
                  <p className="text-sm text-text-secondary-dynamic leading-relaxed">{faq.answer || faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section id="contact" className="container mx-auto px-6 pb-32 scroll-mt-24">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12 space-y-3">
            <h2 className="text-headline text-3xl font-bold tracking-tight">Still have questions?</h2>
            <p className="text-text-secondary-dynamic text-sm">
              If your inquiry doesn&apos;t fit an application, message us directly.
            </p>
          </div>
          <ContactForm />
        </div>
      </section>
    </div>
  )
}
