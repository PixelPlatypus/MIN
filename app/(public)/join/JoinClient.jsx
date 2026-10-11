'use client'
import { useRef, useEffect, useState } from 'react'
import ContactForm from '@/components/public/ContactForm'
import { m } from 'framer-motion'
import Link from 'next/link'
import { Heart, Lightning as Sparkles, Target, Users, ArrowRight, Lightning as Zap, Globe, CaretDown as ChevronDown, Buildings as Building2, Rocket, Flame, Brain, Diamond as Gem } from '@phosphor-icons/react'
import { Skeleton } from '@/components/ui/Skeleton'
import PageHero from '@/components/public/PageHero'
import SectionHeader from '@/components/public/SectionHeader'
import BrandSpotlightCard from '@/components/public/BrandSpotlightCard'

export default function JoinClient({ initialSettings = null }) {
  const formRef = useRef(null)
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
        console.error('Join settings load error', err)
        setIsLoading(false)
      })
  }, [])

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const getIcon = (type) => {
    const normalizedType = type?.toLowerCase() || '';
    switch(normalizedType) {
      case 'heart': return <Heart size={28} />
      case 'building2': return <Building2 size={28} />
      case 'globe': return <Globe size={28} />
      case 'target': return <Target size={28} />
      case 'zap': return <Zap size={24} />
      case 'users': return <Users size={24} />
      case 'rocket': return <Rocket size={28} />
      case 'flame': return <Flame size={28} />
      case 'brain': return <Brain size={28} />
      case 'gem': return <Gem size={28} />
      default: return <Sparkles size={24} />
    }
  }

  const values = settings?.join_features || []
  const roles = settings?.join_paths || []
  const faqs = settings?.join_faqs || []

  return (
    <div className="pb-32">
      {/* ── Hero ── */}
      <PageHero
        loading={isLoading}
        eyebrow={settings?.join_title}
        icon={<Sparkles size={14} weight="fill" />}
        title={settings?.join_subtitle}
        description={settings?.join_description}
      >
        {isLoading ? (
          <>
            <Skeleton className="w-full sm:w-40 h-14 rounded-2xl" />
            <Skeleton className="w-full sm:w-48 h-14 rounded-2xl" />
          </>
        ) : (
          <>
            <button onClick={scrollToForm} className="btn-brand group w-full sm:w-auto">
              Apply Now
              <ArrowRight size={18} weight="bold" className="transition-transform group-hover:translate-x-1" />
            </button>
            <button
              onClick={scrollToForm}
              className="btn-brand-outline w-full sm:w-auto"
              aria-label="Explore joining opportunities"
            >
              Explore Opportunities
              <ChevronDown size={18} weight="bold" />
            </button>
          </>
        )}
      </PageHero>

      {/* ── Values ── */}
      {values.length > 0 && (
        <section className="container mx-auto px-6 mb-32">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {values.map((item, i) => (
              <m.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="card-brand card-brand-hover p-7 group h-full"
              >
                <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary dark:bg-secondary/15 dark:text-secondary flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  {getIcon(item.icon)}
                </div>
                <h3 className="text-base font-bold tracking-tight mb-2">{item.title}</h3>
                <p className="text-sm text-auto-secondary dark:text-auto-secondary-dark leading-relaxed">
                  {item.desc}
                </p>
              </m.div>
            ))}
          </div>
        </section>
      )}

      {/* ── Role Selection ── */}
      <section ref={formRef} className="container mx-auto px-6 max-w-6xl pb-32 scroll-mt-24">
        <SectionHeader
          title={isLoading ? <Skeleton className="w-64 h-10 mx-auto" /> : settings?.join_badge}
          description="Choose how you want to contribute to the mathematical revolution in Nepal."
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {isLoading ? (
            [...Array(3)].map((_, i) => (
              <div key={i} className="card-brand rounded-[2.5rem] p-8 space-y-6">
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
              <m.div
                key={role.id || idx}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group h-full"
              >
                <BrandSpotlightCard className="p-8 flex flex-col h-full">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary dark:bg-secondary/15 dark:text-secondary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    {getIcon(role.icon)}
                  </div>

                  <h3 className="text-xl font-bold tracking-tight mb-2">{role.title}</h3>
                  <p className="text-sm text-auto-secondary dark:text-auto-secondary-dark leading-relaxed mb-6">
                    {role.desc}
                  </p>

                  <ul className="space-y-2.5 flex-1 mb-8">
                    {(role.perks || role.features || []).map(f => (
                      <li key={f} className="flex items-center gap-2.5 text-xs font-medium text-auto-secondary dark:text-auto-secondary-dark">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary dark:bg-secondary shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={`/join/${role.slug || role.id}`}
                    className="btn-brand w-full"
                  >
                    Apply Now
                    <ArrowRight size={18} weight="bold" />
                  </Link>
                </BrandSpotlightCard>
              </m.div>
            ))
          )}
        </div>
      </section>

      {/* ── FAQ ── */}
      {faqs.length > 0 && (
        <section className="container mx-auto px-6 py-24">
          <div className="max-w-3xl mx-auto">
            <SectionHeader
              title="Common Questions"
              description="Everything you need to know before applying"
            />

            <div className="card-brand px-7 md:px-10 py-3 divide-y divide-primary/10 dark:divide-white/10">
              {faqs.map((faq, i) => (
                <div key={i} className="py-7">
                  <h4 className="text-base font-bold text-primary dark:text-secondary mb-2">{faq.question || faq.q}</h4>
                  <p className="text-sm text-auto-secondary dark:text-auto-secondary-dark leading-relaxed">{faq.answer || faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Contact ── */}
      <section id="contact" className="container mx-auto px-6 pb-32 scroll-mt-24">
        <div className="max-w-3xl mx-auto">
          <SectionHeader
            title="Still have questions?"
            description="If your inquiry doesn't fit an application, message us directly."
          />
          <ContactForm />
        </div>
      </section>
    </div>
  )
}
