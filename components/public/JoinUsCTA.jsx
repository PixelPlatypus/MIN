'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default function JoinUsCTA() {
  const [settings, setSettings] = useState(null)

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => setSettings(data))
      .catch(err => console.error('JoinUsCTA settings load error', err))
  }, [])

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
            <span className="text-primary font-bold uppercase tracking-widest text-sm">Join the Community</span>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight">
              {settings?.join_cta_title || "Ready to make an impact in Nepal's education?"}
            </h2>
            <p className="text-lg text-text-secondary dark:text-text-secondary-dark leading-relaxed">
              {settings?.join_cta_description || "We're always looking for passionate volunteers, educators, and collaborators to join our mission. Whether you're a student, teacher, or professional, there's a place for you at MIN."}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
            <Link 
              href="/join"
              className="w-full sm:w-auto bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 hover:-translate-y-1 active:scale-[0.98] group"
            >
              {settings?.join_cta_btn_text || "Become a Volunteer"}
              <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <Link 
              href="/join#contact"
              className="w-full sm:w-auto glass hover:bg-black/5 dark:hover:bg-white/5 px-8 py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all border border-primary/20"
            >
              Contact Us
            </Link>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="lg:w-1/2 relative"
        >
          <div className="aspect-video relative rounded-[3rem] overflow-hidden shadow-2xl group">
            <div className="absolute inset-0 bg-primary/20 group-hover:bg-primary/10 transition-colors z-10" />
            <Image 
              src={settings?.join_cta_image_url || "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?q=80&w=2098&auto=format&fit=crop"} 
              alt="Volunteers collaborating" 
              fill
              className="object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            
            {(settings?.join_cta_stat_title || settings?.join_cta_stat_desc) && (
              <div className="absolute inset-0 flex items-center justify-center z-20">
                <div className="glass p-8 rounded-3xl shadow-2xl text-center max-w-sm mx-6">
                  <Sparkles className="text-primary mx-auto mb-4" size={32} />
                  <h4 className="text-2xl font-bold mb-2">{settings?.join_cta_stat_title}</h4>
                  <p className="text-sm text-text-secondary dark:text-text-secondary-dark">
                    {settings?.join_cta_stat_desc}
                  </p>
                </div>
              </div>
            )}
          </div>
          
          {/* Decorative Elements */}
          <div className="absolute -top-8 -right-8 w-48 h-48 bg-primary/20 rounded-full blur-3xl -z-10" />
          <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-secondary/30 rounded-full blur-3xl -z-10" />
        </motion.div>
      </div>
    </section>
  )
}
