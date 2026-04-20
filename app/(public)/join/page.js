'use client'
import { useRef, useEffect, useState } from 'react'
import JoinForm from '@/components/public/JoinForm'
import ContactForm from '@/components/public/ContactForm'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Heart, Sparkles, Target, Users, ArrowRight, Zap, Globe, ChevronDown } from 'lucide-react'

export default function JoinPage() {
  const formRef = useRef(null)
  const [settings, setSettings] = useState(null)

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => setSettings(data))
      .catch(err => console.error('Join settings load error', err))
  }, [])

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const values = [
    { icon: <Zap size={24} />, title: 'Purpose Driven', desc: 'Contribute to projects that directly improve how mathematics is perceived in Nepal.' },
    { icon: <Globe size={24} />, title: 'Global Network', desc: 'Collaborate with educators and innovators from across the globe through our programs.' },
    { icon: <Target size={24} />, title: 'Direct Influence', desc: 'Have a voice in the design and execution of high-impact workshops and competitions.' },
    { icon: <Users size={24} />, title: 'Rich Community', desc: 'Connect with hundreds of like-minded problem solvers and community leaders.' },
  ]

  const roles = [
    {
      id: 'volunteer',
      title: 'Become a Volunteer',
      desc: 'Join our core operational teams, create content, or help organize our nationwide programs.',
      icon: <Heart size={28} />,
      features: ['Team Access', 'Certificate', 'Networking'],
    },
    {
      id: 'organization',
      title: 'Scale as a Partner',
      desc: 'Register your school or organization to collaborate on workshops and resource distribution.',
      icon: <Globe size={28} />,
      features: ['Resource Kit', 'Brand Logo', 'Priority Support'],
    },
    {
      id: 'ambassador',
      title: 'Join as Ambassador',
      desc: 'Lead the movement in your local region or university and represent MATHS INITIATIVE NEPAL.',
      icon: <Target size={28} />,
      features: ['Leadership Role', 'Exclusive Merch', 'Direct Mentorship'],
    },
  ]

  const faqs = [
    { q: 'Can I join remotely?', a: 'Yes, many of our operational and content creation roles are fully remote. We coordinate via Slack and Zoom.' },
    { q: 'Is there a time commitment?', a: 'It varies by role, typically ranging from 2–10 hours per week depending on the current project phase.' },
    { q: 'Do I need a math degree?', a: 'Not at all! We need writers, designers, and organizers as much as we need mathematicians.' },
    { q: 'How long is the process?', a: 'After submission, we usually perform a technical review and then invite you for a 20-minute intro call.' },
  ]

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
            {settings?.join_title || 'Shape the Future'}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[0.9] text-gradient"
          >
            {settings?.join_subtitle || (
              <>Become a Part<br />of MIN Nepal</>
            )}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-text-secondary dark:text-text-secondary-dark max-w-2xl mx-auto leading-relaxed"
          >
            {settings?.join_description || 'Join a globally recognized movement dedicated to igniting curiosity and fostering excellence across Nepal.'}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
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
          </motion.div>
        </div>
      </section>

      {/* ── Values ── */}
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
                {item.icon}
              </div>
              <h3 className="text-base font-bold tracking-tight mb-2">{item.title}</h3>
              <p className="text-sm text-text-secondary dark:text-text-secondary-dark leading-relaxed">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Role Selection ── */}
      <section ref={formRef} className="container mx-auto px-6 max-w-6xl pb-32 scroll-mt-24">
        <div className="text-center space-y-3 mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Identify Your Path</h2>
          <p className="text-text-secondary dark:text-text-secondary-dark max-w-xl mx-auto">
            Choose how you want to contribute to the mathematical revolution in Nepal.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {roles.map((role, idx) => (
            <motion.div
              key={role.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group"
            >
              <div className="glass rounded-3xl p-8 flex flex-col h-full hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {role.icon}
                </div>

                <h3 className="text-xl font-bold tracking-tight mb-2">{role.title}</h3>
                <p className="text-sm text-text-secondary dark:text-text-secondary-dark leading-relaxed mb-6">
                  {role.desc}
                </p>

                <ul className="space-y-2.5 flex-1 mb-8">
                  {role.features.map(f => (
                    <li key={f} className="flex items-center gap-2.5 text-xs font-medium text-text-secondary dark:text-text-secondary-dark">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>

                <Link
                  href={`/join/${role.id}`}
                  className="w-full bg-primary hover:bg-primary-dark text-white py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
                >
                  Apply Now
                  <ArrowRight size={16} />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="container mx-auto px-6 py-24">
        <div className="max-w-3xl mx-auto">
          <div className="text-center space-y-3 mb-14">
            <h3 className="text-3xl md:text-4xl font-bold tracking-tight">Common Questions</h3>
            <p className="text-sm text-text-secondary dark:text-text-secondary-dark">Everything you need to know before applying</p>
          </div>

          <div className="divide-y divide-border dark:divide-border-dark">
            {faqs.map((faq, i) => (
              <div key={i} className="py-7 first:pt-0 last:pb-0">
                <h4 className="text-base font-bold text-primary mb-2">{faq.q}</h4>
                <p className="text-sm text-text-secondary dark:text-text-secondary-dark leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

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
