'use client'

import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { m, useScroll, useTransform } from 'framer-motion'
import { ArrowLeft, ArrowSquareOut as ExternalLink, FacebookLogo as Facebook, GithubLogo as Github, Globe, InstagramLogo as Instagram, LinkedinLogo as Linkedin, Envelope as Mail } from '@phosphor-icons/react'

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
    <div ref={containerRef} className="relative isolate min-h-screen overflow-x-clip selection:bg-primary/30">
      
      {/* Immersive Background Effects */}
      <div aria-hidden className="absolute inset-x-0 top-0 h-[40rem] -z-10 hero-glow pointer-events-none" />
      <div aria-hidden className="absolute inset-x-0 top-0 h-[40rem] -z-10 bg-graph pointer-events-none [mask-image:linear-gradient(to_bottom,black,transparent)]" />

      <div className="relative max-w-7xl mx-auto px-6 pt-36 md:pt-40 pb-32">
        
        {/* Header Navigation */}
        <m.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-12"
        >
          <Link href="/team" className="inline-flex items-center gap-3 text-auto-tertiary hover:text-primary dark:hover:text-secondary transition-colors font-bold text-sm group">
            <span className="p-2 rounded-full bg-white/80 border border-primary/15 group-hover:border-primary/40 dark:bg-white/5 dark:border-white/15 dark:group-hover:border-secondary/50 transition-all">
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            </span>
            Back to Team
          </Link>
        </m.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 relative items-start">
          
          {/* Left Column: Sticky Image & Core Identity */}
          <div className="lg:col-span-5 lg:sticky lg:top-32 space-y-8">
            <m.div 
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full aspect-[4/5] rounded-[2.5rem] overflow-hidden ring-brand-glow bg-primary-muted dark:bg-white/5 group"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/90 via-primary-dark/25 to-transparent z-10" />
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
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-full bg-white/15 text-white backdrop-blur-md border border-white/25">
                    {member.tenure}
                  </span>
                  {member.is_advisor && (
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-full bg-secondary text-primary-dark border border-secondary-dark/40">
                      ADVISOR
                    </span>
                  )}
                  <span className={`text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-full backdrop-blur-md border ${
                    member.status === 'ACTIVE' ? 'bg-emerald-500/30 text-white border-emerald-300/40' :
                    member.status === 'ALUMNI' ? 'bg-coral/30 text-white border-coral/40' :
                    'bg-amber-500/30 text-white border-amber-300/40'
                  }`}>
                    {member.status}
                  </span>
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter leading-none">
                  {member.name}
                </h1>
                <p className="text-xl font-bold text-secondary">
                  {member.position}
                </p>
              </div>
            </m.div>

            {/* Futuristic Social Bar */}
            <m.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-wrap gap-3"
            >
              {Object.entries(socialLinks).map(([platform, url]) => (
                platform !== 'role_history' && typeof url === 'string' && url.trim() !== '' && (
                  <a 
                    key={platform} 
                    href={platform.toLowerCase() === 'email' ? `mailto:${url}` : url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-14 h-14 rounded-2xl border border-primary/10 bg-white/85 text-primary shadow-sm flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 hover:-translate-y-1 dark:bg-white/[0.06] dark:border-white/15 dark:text-white/85 dark:hover:bg-secondary dark:hover:text-primary-dark dark:hover:border-secondary"
                    aria-label={`${member.name}'s ${platform}`}
                  >
                    {socialIcons[platform.toLowerCase()] || <ExternalLink size={20} />}
                  </a>
                )
              ))}
            </m.div>
          </div>

          {/* Right Column: Scrollable Content Details */}
          <div className="lg:col-span-7 space-y-16 pt-8 lg:pt-16">
            
            {/* Biography */}
            <m.section 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-6"
            >
              <div className="flex items-center gap-4">
                <h2 className="eyebrow">Biography</h2>
                <div className="flex-1 h-px bg-gradient-to-r from-primary/30 to-transparent dark:from-secondary/40" />
              </div>
              <p className="text-lg md:text-xl text-auto-secondary leading-relaxed font-medium whitespace-pre-wrap">
                {member.bio || "Biography details are currently being updated."}
              </p>
            </m.section>

            {/* Timeline Metrics */}
            <m.section 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="grid grid-cols-2 gap-6"
            >
              <div className="card-brand p-6 sm:p-8 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.06] to-transparent dark:from-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-auto-tertiary mb-3">Joined</p>
                <p className="text-2xl md:text-3xl font-black dark:text-white tracking-tighter">
                  {member.joined_date ? new Date(member.joined_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) : 'Unknown'}
                </p>
              </div>
              
              {member.farewell_date && (
                <div className="card-brand p-6 sm:p-8 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-secondary/30 to-transparent dark:from-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-auto-tertiary mb-3">Farewell</p>
                  <p className="text-2xl md:text-3xl font-black dark:text-white tracking-tighter">
                    {new Date(member.farewell_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
                  </p>
                </div>
              )}
            </m.section>

            {/* Role Evolution */}
            {roleHistory.length > 0 && (
              <m.section 
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-8"
              >
                <div className="flex items-center gap-4">
                  <h2 className="eyebrow">Role History</h2>
                  <div className="flex-1 h-px bg-gradient-to-r from-primary/30 to-transparent dark:from-secondary/40" />
                </div>
                <div className="space-y-4">
                  {roleHistory.sort((a,b) => parseInt(b.year) - parseInt(a.year)).map((history, i) => (
                    <m.div 
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                      className="card-brand card-brand-hover p-5 sm:p-6 flex items-center justify-between gap-4 group"
                    >
                      <span className="text-xl md:text-2xl font-black dark:text-white tracking-tight group-hover:text-primary dark:group-hover:text-secondary transition-colors">
                        {history.position}
                      </span>
                      <span className="shrink-0 text-sm font-black tracking-[0.2em] px-4 py-2 rounded-xl bg-primary/10 text-primary dark:bg-secondary/15 dark:text-secondary">
                        {history.year}
                      </span>
                    </m.div>
                  ))}
                </div>
              </m.section>
            )}

            {/* Official Certification */}
            {member.certificate_url && (
              <m.section 
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-8"
              >
                <div className="flex items-center gap-4">
                  <h2 className="eyebrow">Certification</h2>
                  <div className="flex-1 h-px bg-gradient-to-r from-primary/30 to-transparent dark:from-secondary/40" />
                </div>
                <div className="w-full aspect-[1/1.4] md:aspect-[1.4/1] bg-primary-muted dark:bg-white/5 rounded-[2rem] md:rounded-[2.5rem] overflow-hidden ring-brand-glow relative group">
                  {(member.certificate_url || '').toLowerCase().endsWith('.pdf') ? (
                    <iframe src={`${member.certificate_url}#toolbar=0&navpanes=0&scrollbar=0`} className="w-full h-full border-none opacity-80 group-hover:opacity-100 transition-opacity duration-500" title={`${member.name} Certificate`} />
                  ) : (
                    <img src={member.certificate_url} alt="Certificate" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" />
                  )}
                  <a href={member.certificate_url} target="_blank" rel="noopener noreferrer" className="btn-brand btn-brand-sm absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 focus-visible:opacity-100 translate-y-4 group-hover:translate-y-0">
                    View Full Size <ExternalLink size={18} />
                  </a>
                </div>
              </m.section>
            )}

          </div>
        </div>
      </div>
    </div>
  )
}
