'use client'
import { useRef } from 'react'
import JoinForm from '@/components/public/JoinForm'
import ContactForm from '@/components/public/ContactForm'
import { motion } from 'framer-motion'
import { Heart, Sparkles, Target, Users, ArrowRight, Zap, Globe, MessageSquare, ChevronDown } from 'lucide-react'

export default function JoinPage() {
  const formRef = useRef(null)

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="pt-20 pb-32">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-1/4 -right-1/4 w-1/2 h-1/2 bg-primary/5 blur-[120px] rounded-full" />
        <div className="absolute -bottom-1/4 -left-1/4 w-1/2 h-1/2 bg-secondary/10 blur-[120px] rounded-full" />
      </div>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-24 md:py-32">
        <div className="max-w-5xl mx-auto text-center space-y-12">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 bg-white/40 dark:bg-white/5 text-primary dark:text-secondary px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-primary/10 dark:border-white/10 backdrop-blur-xl"
          >
            <Sparkles size={14} className="text-secondary-dark" />
            Shape the Future
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-[0.85] text-gradient"
          >
            Make an Impact <br />
            <span className="text-primary dark:text-secondary">With Math.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl text-text-secondary dark:text-text-secondary-dark max-w-2xl mx-auto leading-relaxed font-medium"
          >
            Join a globally recognized movement dedicated to igniting curiosity 
            and fostering excellence across Nepal.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex justify-center"
          >
            <button 
              onClick={scrollToForm}
              className="bg-primary hover:bg-primary-dark text-white px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 transition-all shadow-xl shadow-primary/20 hover:-translate-y-1 group"
            >
              Click to Apply
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* Philosophy / Value Grid */}
      <section className="container mx-auto px-6 mb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {[
            { icon: <Zap size={28} />, title: 'Purpose Driven', theme: 'primary', desc: 'Contribute to projects that directly improve how mathematics is perceived in Nepal.', gradient: 'from-primary/10' },
            { icon: <Globe size={28} />, title: 'Global Network', theme: 'secondary', desc: 'Collaborate with educators and innovators from across the globe through our programs.', gradient: 'from-secondary/10' },
            { icon: <Target size={28} />, title: 'Direct Influence', theme: 'coral', desc: 'Have a voice in the design and execution of high-impact workshops and competitions.', gradient: 'from-coral/10' },
            { icon: <Users size={28} />, title: 'Rich Community', theme: 'cyan', desc: 'Connect with hundreds of like-minded problem solvers and community leaders.', gradient: 'from-cyan/10' },
          ].map((item, i) => (
            <motion.div 
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative glass bg-white/60 dark:bg-white/5 backdrop-blur-2xl rounded-[2.5rem] p-8 space-y-6 hover:shadow-2xl transition-all duration-500 border border-white/40 dark:border-white/10 group hover:-translate-y-2 overflow-hidden"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />
              
              <div className="relative z-10">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center bg-${item.theme}/10 text-${item.theme} transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-sm mb-6`}>
                  {item.icon}
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-black tracking-tight text-text dark:text-white group-hover:text-primary transition-colors">{item.title}</h3>
                  <p className="text-sm text-text-secondary dark:text-text-secondary-dark leading-relaxed font-medium">
                    {item.desc}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Form Section */}
      <section ref={formRef} className="container mx-auto px-6 max-w-6xl py-24 bg-bg-secondary/30 dark:bg-white/5 rounded-[4rem] border border-border dark:border-border-dark relative overflow-hidden scroll-mt-24">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 blur-[100px] -mr-48 -mt-48 rounded-full" />
        
        <div className="relative z-10 space-y-4">
          <div className="text-center space-y-6">
            <h2 className="text-5xl md:text-6xl font-black tracking-tight">Application Form</h2>
            <p className="text-lg md:text-xl text-text-secondary dark:text-text-secondary-dark max-w-2xl mx-auto font-medium">
              Fill out the form below to start your journey with us. We review all 
              applications and respond within 7-10 days.
            </p>
            <div className="flex justify-center">
              <button 
                onClick={() => {
                  const el = document.getElementById('form-start')
                  el?.scrollIntoView({ behavior: 'smooth' })
                }}
                className="bg-primary/10 text-primary px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all border border-primary/20"
              >
                Click to Apply Below
              </button>
            </div>
            <div id="form-start" className="w-12 h-1 bg-primary/20 mx-auto rounded-full mt-4" />
          </div>
          
          <JoinForm />
        </div>
      </section>

      {/* FAQ Section - Refined Apple Style */}
      <section className="container mx-auto px-6 py-32 space-y-16">
        <div className="text-center space-y-4">
          <h3 className="text-3xl md:text-4xl font-black tracking-tight">Common Questions</h3>
          <p className="text-text-tertiary text-sm font-bold uppercase tracking-widest">Everything you need to know</p>
        </div>
        
        <div className="max-w-3xl mx-auto space-y-0 divide-y divide-border dark:divide-white/10">
          {[
            { q: 'Can I join remotely?', a: 'Yes, many of our operational and content creation roles are fully remote. We coordinate via Slack and Zoom.' },
            { q: 'Is there a time commitment?', a: 'It varies by role, typically ranging from 2-10 hours per week depending on the current project phase.' },
            { q: 'Do I need a math degree?', a: 'Not at all! We need writers, designers, and organizers as much as we need mathematicians.' },
            { q: 'How long is the process?', a: 'After submission, we usually perform a technical review and then invite you for a 20-minute intro call.' },
          ].map((faq, i) => (
            <div key={i} className="py-8 first:pt-0 last:pb-0">
              <h4 className="text-lg font-black text-primary mb-3">{faq.q}</h4>
              <p className="text-sm text-text-secondary dark:text-text-secondary-dark font-medium leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section className="container mx-auto px-6 pb-32">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl font-black tracking-tight">Still have questions?</h2>
            <p className="text-text-secondary font-medium">If your inquiry is general and doesn't fit an application, message us directly.</p>
          </div>
          <ContactForm />
        </div>
      </section>
    </div>
  )
}
