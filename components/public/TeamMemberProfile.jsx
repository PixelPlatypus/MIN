'use client'

import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowLeft, ExternalLink, Facebook, Github, Globe, Instagram, Linkedin, Mail } from 'lucide-react'

const socialIcons = {
  facebook: <Facebook size={20} />,
  instagram: <Instagram size={20} />,
  linkedin: <Linkedin size={20} />,
  email: <Mail size={20} />,
  github: <Github size={20} />,
  social_media: <Globe size={20} />,
}

export default function TeamMemberProfile({ member, socialLinks, roleHistory }) {
  const containerRef = useRef(null)

  return (
    <div ref={containerRef} className="relative min-h-screen bg-bg-main dark:bg-bg-main-dark selection:bg-primary/30">
      
      {/* Immersive Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[50vw] h-[50vh] bg-primary/10 rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute bottom-0 left-0 w-[50vw] h-[50vh] bg-coral/5 rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute inset-0 bg-[url('/images/grid.svg')] bg-center opacity-5 dark:opacity-10" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 pt-32 pb-32">
        
        {/* Header Navigation */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-12"
        >
          <Link href="/team" className="inline-flex items-center gap-3 text-text-tertiary hover:text-primary transition-colors font-black text-xs tracking-[0.2em] uppercase group">
            <span className="p-2 rounded-full bg-white/5 border border-white/10 group-hover:bg-primary/20 group-hover:border-primary/30 transition-all">
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            </span>
            Back to Team
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 relative items-start">
          
          {/* Left Column: Sticky Image & Core Identity */}
          <div className="lg:col-span-5 lg:sticky lg:top-32 space-y-8">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full aspect-[4/5] rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl glass-strong group"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
              <div className="w-full h-full">
                <Image 
                  src={member.photo_url || '/images/logo.png'} 
                  alt={member.name}
                  fill
                  priority
                  className="object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-1000"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
              </div>
              
              {/* Overlay Content */}
              <div className="absolute bottom-0 left-0 w-full p-8 z-20 space-y-3">
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-full bg-primary/20 text-white backdrop-blur-md border border-primary/30 shadow-[0_0_15px_rgba(var(--color-primary),0.3)]">
                    {member.tenure}
                  </span>
                  {member.is_advisor && (
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-full bg-purple-500/20 text-white backdrop-blur-md border border-purple-500/30">
                      ADVISOR
                    </span>
                  )}
                  <span className={`text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-full backdrop-blur-md border ${
                    member.status === 'ACTIVE' ? 'bg-green/20 text-white border-green/30' :
                    member.status === 'ALUMNI' ? 'bg-coral/20 text-white border-coral/30' :
                    'bg-amber-500/20 text-white border-amber-500/30'
                  }`}>
                    {member.status}
                  </span>
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter leading-none">
                  {member.name}
                </h1>
                <p className="text-xl font-bold text-amber-400">
                  {member.position}
                </p>
              </div>
            </motion.div>

            {/* Futuristic Social Bar */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-wrap gap-3"
            >
              {Object.entries(socialLinks).map(([platform, url]) => (
                platform !== 'role_history' && platform !== 'certificate_url' && typeof url === 'string' && url.trim() !== '' && (
                  <a 
                    key={platform} 
                    href={platform.toLowerCase() === 'email' ? `mailto:${url}` : url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-14 h-14 rounded-2xl glass border border-white/10 flex items-center justify-center text-text-tertiary hover:text-white hover:bg-white/5 hover:border-primary/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(var(--color-primary),0.2)] hover:-translate-y-1"
                    aria-label={`${member.name}'s ${platform}`}
                  >
                    {socialIcons[platform.toLowerCase()] || <ExternalLink size={20} />}
                  </a>
                )
              ))}
            </motion.div>
          </div>

          {/* Right Column: Scrollable Content Details */}
          <div className="lg:col-span-7 space-y-16 pt-8 lg:pt-16">
            
            {/* Biography */}
            <motion.section 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-6"
            >
              <div className="flex items-center gap-4">
                <h2 className="text-sm font-black uppercase tracking-[0.3em] text-primary">Biography</h2>
                <div className="flex-1 h-px bg-gradient-to-r from-primary/30 to-transparent" />
              </div>
              <p className="text-lg md:text-xl text-text-secondary dark:text-text-secondary-dark leading-relaxed font-medium whitespace-pre-wrap">
                {member.bio || "Biography details are currently being updated."}
              </p>
            </motion.section>

            {/* Timeline Metrics */}
            <motion.section 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="grid grid-cols-2 gap-6"
            >
              <div className="glass p-8 rounded-[2rem] border border-white/5 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-text-tertiary mb-3">Joined</p>
                <p className="text-2xl md:text-3xl font-black text-text-main dark:text-white tracking-tighter">
                  {member.joined_date ? new Date(member.joined_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) : 'Unknown'}
                </p>
              </div>
              
              {member.farewell_date && (
                <div className="glass p-8 rounded-[2rem] border border-white/5 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-coral/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-text-tertiary mb-3">Farewell</p>
                  <p className="text-2xl md:text-3xl font-black text-text-main dark:text-white tracking-tighter">
                    {new Date(member.farewell_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
                  </p>
                </div>
              )}
            </motion.section>

            {/* Role Evolution */}
            {roleHistory.length > 0 && (
              <motion.section 
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-8"
              >
                <div className="flex items-center gap-4">
                  <h2 className="text-sm font-black uppercase tracking-[0.3em] text-primary">Role History</h2>
                  <div className="flex-1 h-px bg-gradient-to-r from-primary/30 to-transparent" />
                </div>
                <div className="space-y-4">
                  {roleHistory.sort((a,b) => parseInt(b.year) - parseInt(a.year)).map((history, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                      className="glass p-6 rounded-[2rem] flex items-center justify-between border border-white/5 hover:border-primary/20 transition-colors group"
                    >
                      <span className="text-xl md:text-2xl font-black text-text-main dark:text-white tracking-tight group-hover:text-primary transition-colors">
                        {history.position}
                      </span>
                      <span className="text-sm font-black text-text-tertiary tracking-[0.2em] bg-white/5 px-4 py-2 rounded-xl">
                        {history.year}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </motion.section>
            )}

            {/* Official Certification */}
            {socialLinks.certificate_url && (
              <motion.section 
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-8"
              >
                <div className="flex items-center gap-4">
                  <h2 className="text-sm font-black uppercase tracking-[0.3em] text-primary">Certification</h2>
                  <div className="flex-1 h-px bg-gradient-to-r from-primary/30 to-transparent" />
                </div>
                <div className="w-full aspect-[1/1.4] md:aspect-[1.4/1] bg-black/20 dark:bg-black/40 rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl relative group">
                  {socialLinks.certificate_url.toLowerCase().endsWith('.pdf') ? (
                    <iframe src={`${socialLinks.certificate_url}#toolbar=0&navpanes=0&scrollbar=0`} className="w-full h-full border-none opacity-80 group-hover:opacity-100 transition-opacity duration-500" title={`${member.name} Certificate`} />
                  ) : (
                    <img src={socialLinks.certificate_url} alt="Certificate" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" />
                  )}
                  <a href={socialLinks.certificate_url} target="_blank" rel="noopener noreferrer" className="absolute bottom-6 right-6 px-6 py-3 bg-black/50 hover:bg-primary backdrop-blur-xl border border-white/10 rounded-2xl text-white font-bold tracking-wide flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-[0_0_30px_rgba(0,0,0,0.5)] translate-y-4 group-hover:translate-y-0">
                    View Full Size <ExternalLink size={18} />
                  </a>
                </div>
              </motion.section>
            )}

          </div>
        </div>
      </div>
    </div>
  )
}
