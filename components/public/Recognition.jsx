'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Award, ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default function Recognition() {
  const [settings, setSettings] = useState(null)

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => setSettings(data))
      .catch(err => console.error('Recognition settings load error', err))
  }, [])

  return (
    <section className="container mx-auto px-6 py-24 relative overflow-hidden">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="bg-primary rounded-[3rem] p-12 md:p-24 relative overflow-hidden shadow-2xl shadow-primary/20"
      >
        {/* Decorative Circles */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-48 -mt-48 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/10 rounded-full -ml-32 -mb-32 blur-3xl" />

        <div className="relative flex flex-col md:flex-row items-center gap-16 lg:gap-24">
          <div className="flex-1 space-y-8">
            <div className="inline-flex items-center gap-2 bg-white/10 text-white px-4 py-2 rounded-full text-sm font-semibold border border-white/10 backdrop-blur-md">
              <Award size={16} />
              Global Recognition
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight text-white">
              {settings?.about_rec_title || "Top 100 Global Education Innovations"}
            </h2>
            
            <p className="text-lg text-white/80 leading-relaxed max-w-2xl">
              {settings?.about_rec_description || "MIN is proud to be recognized by HundrED, a global non-profit organization that researches, identifies and shares the most inspiring K12 education innovations across the world."}
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <a 
                href={settings?.about_rec_link || "https://hundred.org/en/innovations/mathematics-initiatives-in-nepal-min"}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto bg-secondary hover:bg-secondary-dark text-[#16556D] px-8 py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-xl shadow-secondary/20 hover:shadow-2xl hover:shadow-secondary/30 hover:-translate-y-1 active:scale-[0.98]"
                aria-label="Explore MIN Global Recognition on hundred.org"
              >
                Explore Recognition
                <ArrowRight size={20} />
              </a>
              <Link 
                href="/about"
                className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all border border-white/10 backdrop-blur-md"
              >
                Our Journey
              </Link>
            </div>
          </div>

          <div className="flex-1 w-full max-w-[500px] relative group">
            <div className="absolute inset-0 bg-white/20 rounded-[3rem] blur-2xl group-hover:blur-3xl transition-all duration-500" />
            <div className="aspect-square relative rounded-[3rem] overflow-hidden shadow-2xl transition-transform duration-500 group-hover:scale-[1.02] z-10 border border-white/10">
              <Image 
                src={settings?.recognition_image_url || "/images/hundrED.jpg"} 
                alt="Recognition" 
                fill
                className="object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700"
                sizes="(max-width: 768px) 100vw, 500px"
              />
            </div>
            
            <div className="absolute -bottom-6 -right-6 glass p-8 rounded-3xl shadow-2xl z-20 hidden lg:block border border-white/20 hover:scale-105 transition-transform">
              <p className="text-3xl font-black text-primary mb-1 tracking-tighter">{settings?.about_rec_badge_title || "Top 100"}</p>
              <p className="text-[10px] text-text-secondary dark:text-text-secondary-dark font-black uppercase tracking-[0.2em]">{settings?.about_rec_badge_desc || "Global Innovations"}</p>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
