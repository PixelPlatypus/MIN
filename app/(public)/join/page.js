'use client'
import { useRef, useEffect, useState } from 'react'
import JoinForm from '@/components/public/JoinForm'
import ContactForm from '@/components/public/ContactForm'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Heart, Sparkles, Target, Users, ArrowRight, Zap, Globe, ChevronDown, Building2 } from 'lucide-react'
import { Skeleton } from '@/components/ui/Skeleton'

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
      case 'Heart': return <Heart size={28} />
      case 'Building2': return <Building2 size={28} />
      case 'Globe': return <Globe size={28} />
      case 'Target': return <Target size={28} />
      case 'Zap': return <Zap size={24} />
      case 'Users': return <Users size={24} />
      default: return <Sparkles size={24} />
    }
  }

  const values = settings?.join_features || []
  const roles = settings?.join_paths || []
  const faqs = settings?.join_faqs || []

  return (
    <div className="pt-20 pb-32">
      {/* ── Hero ── */}
      <section className="container mx-auto px-6 py-24 md:py-36">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 glass px-5 py-2 rounded-full text-xs font-semibold text-primary"
          >
            <Sparkles size={14} className="text-secondary-dark" />
            {isLoading ? <Skeleton className="w-24 h-3" /> : settings?.join_title}
          </motion.div>

          <div className="flex justify-center">
            {isLoading ? (
              <Skeleton className="w-[80%] h-16 md:h-24 lg:h-32" />
            ) : (
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[0.9] text-gradient"
              >
                {settings?.join_subtitle}
              </motion.h1>
            )}
          </div>

          <div className="max-w-2xl mx-auto">
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
                className="text-lg md:text-xl text-text-secondary dark:text-text-secondary-dark leading-relaxed"
              >
                {settings?.join_description}
              </motion.p>
            )}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            {isLoading ? (
              <>
                <Skeleton className="w-full sm:w-40 h-14 rounded-2xl" />
                <Skeleton className="w-full sm:w-48 h-14 rounded-2xl" />
              </>
            ) : (
              <>
                <button
                  onClick={scrollToForm}
                  className="bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-2xl font-semibold text-sm flex items-center gap-3 transition-all shadow-lg shadow-primary/20 hover:-translate-y-0.5 group"
                >
                  Apply Now
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </button>
                <button
                  onClick={scrollToForm}
                  className="glass px-8 py-4 rounded-2xl font-semibold text-sm text-text-secondary dark:text-text-secondary-dark hover:text-primary transition-all flex items-center gap-2"
                  aria-label="Explore joining opportunities"
                >
                  Explore Opportunities
                  <ChevronDown size={16} />
                </button>
              </>
            )}
          </motion.div>
        </div>
      </section>

      {/* ── Values ── */}
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
                className="glass rounded-3xl p-7 group hover:shadow-xl transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  {getIcon(item.icon)}
                </div>
                <h3 className="text-base font-bold tracking-tight mb-2">{item.title}</h3>
                <p className="text-sm text-text-secondary dark:text-text-secondary-dark leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* ── Role Selection ── */}
      <section ref={formRef} className="container mx-auto px-6 max-w-6xl pb-32 scroll-mt-24">
        <div className="text-center space-y-3 mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
            {isLoading ? <Skeleton className="w-64 h-10 mx-auto" /> : settings?.join_badge}
          </h2>
          <p className="text-text-secondary dark:text-text-secondary-dark max-w-xl mx-auto">
            Choose how you want to contribute to the mathematical revolution in Nepal.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {isLoading ? (
            [...Array(3)].map((_, i) => (
              <div key={i} className="glass rounded-3xl p-8 space-y-6">
                <Skeleton className="w-14 h-14 rounded-2xl" />
                <Skeleton className="w-48 h-8" />
                <Skeleton className="w-full h-4" />
                <div className="space-y-2">
                  <Skeleton className="w-24 h-3" />
                  <Skeleton className="w-32 h-3" />
                  <Skeleton className="w-28 h-3" />
                </div>
                <Skeleton className="w-full h-12 rounded-2xl" />
              </div>
            ))
          ) : (
            roles.map((role, idx) => (
              <motion.div
                key={role.id || idx}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group"
              >
                <div className="glass rounded-3xl p-8 flex flex-col h-full hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    {getIcon(role.icon)}
                  </div>

                  <h3 className="text-xl font-bold tracking-tight mb-2">{role.title}</h3>
                  <p className="text-sm text-text-secondary dark:text-text-secondary-dark leading-relaxed mb-6">
                    {role.desc}
                  </p>

                  <ul className="space-y-2.5 flex-1 mb-8">
                    {(role.perks || role.features || []).map(f => (
                      <li key={f} className="flex items-center gap-2.5 text-xs font-medium text-text-secondary dark:text-text-secondary-dark">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={`/join/${role.slug || role.id}`}
                    className="w-full bg-primary hover:bg-primary-dark text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
                  >
                    Apply Now
                    <ArrowRight size={18} />
                  </Link>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </section>

      {/* ── FAQ ── */}
      {faqs.length > 0 && (
        <section className="container mx-auto px-6 py-24">
          <div className="max-w-3xl mx-auto">
            <div className="text-center space-y-3 mb-14">
              <h3 className="text-3xl md:text-4xl font-bold tracking-tight">Common Questions</h3>
              <p className="text-sm text-text-secondary dark:text-text-secondary-dark">Everything you need to know before applying</p>
            </div>

            <div className="divide-y divide-border dark:divide-border-dark">
              {faqs.map((faq, i) => (
                <div key={i} className="py-7 first:pt-0 last:pb-0">
                  <h4 className="text-base font-bold text-primary mb-2">{faq.question || faq.q}</h4>
                  <p className="text-sm text-text-secondary dark:text-text-secondary-dark leading-relaxed">{faq.answer || faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Contact ── */}
      <section id="contact" className="container mx-auto px-6 pb-32 scroll-mt-24">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12 space-y-3">
            <h2 className="text-3xl font-bold tracking-tight">Still have questions?</h2>
            <p className="text-text-secondary dark:text-text-secondary-dark text-sm">
              If your inquiry doesn't fit an application, message us directly.
            </p>
          </div>
          <ContactForm />
        </div>
      </section>
    </div>
  )
}
