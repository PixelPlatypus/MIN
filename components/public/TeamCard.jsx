'use client'
import { useState, useEffect } from 'react'
import { m } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { FacebookLogo as Facebook, InstagramLogo as Instagram, LinkedinLogo as Linkedin, GithubLogo as Github, Envelope as Mail, Globe, ArrowSquareOut as ExternalLink } from '@phosphor-icons/react'

const socialIcons = {
  facebook: <Facebook size={18} />,
  instagram: <Instagram size={18} />,
  linkedin: <Linkedin size={18} />,
  email: <Mail size={18} />,
  github: <Github size={18} />,
  social_media: <Globe size={18} />,
}

export default function TeamCard({ member, index, fallbackImage, activeTab }) {
  const { name, position, bio, photo_url, social_links = {}, tenure, slug, joined_date, farewell_date } = member

  const isAlumniTab = activeTab === 'Alumni'
  const isAdvisorTab = activeTab === 'Advisors'

  return (
    <m.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group relative h-full"
    >
      <div className="relative card-brand card-brand-hover rounded-[2.5rem] p-6 flex flex-col items-center text-center h-full group overflow-hidden">
        
        {/* Background Clickable Link (Avoids nested <a> tags) */}
        <Link href={`/team/${slug || member.id}`} className="absolute inset-0 z-0 rounded-[inherit] outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary dark:focus-visible:ring-secondary" aria-label={`View ${name}'s profile`} />
        
        <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.06] via-transparent to-secondary/20 dark:from-secondary/10 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0" />
        <div className="relative z-10 flex flex-col items-center h-full w-full pointer-events-none">
            {/* Profile Image Container */}
            <div className="w-40 h-40 relative mb-6 rounded-full overflow-hidden ring-4 ring-primary/10 group-hover:ring-primary/30 dark:ring-white/15 dark:group-hover:ring-secondary/50 transition-all duration-500 bg-primary-muted dark:bg-white/5">
              <Image
                loading={index < 4 ? 'eager' : 'lazy'}
                fetchPriority={index < 4 ? 'high' : 'auto'}
                src={photo_url || fallbackImage || '/images/logo.png'} 
                alt={name}
                fill
                className="object-cover rounded-full grayscale-[20%] group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
                sizes="160px"
              />
            </div>

            {/* Name & Position */}
            <div className="space-y-1 mb-4 flex-grow">
              <h3 className="text-xl font-bold tracking-tight dark:text-white group-hover:text-primary dark:group-hover:text-secondary transition-colors">{name}</h3>
              
              {!isAdvisorTab && !isAlumniTab && (
                <p className="text-sm font-semibold text-primary dark:text-secondary">{position}</p>
              )}



              <div className="flex items-center justify-center gap-2 mt-2">
                {!isAdvisorTab && (
                  <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/10 dark:bg-secondary/15 dark:text-secondary dark:border-secondary/25">
                    {tenure}
                  </span>
                )}
                <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border ${
                  isAdvisorTab 
                    ? 'bg-secondary/40 text-primary-dark border-secondary-dark/40 dark:bg-secondary/15 dark:text-secondary dark:border-secondary/30'
                    : member.status === 'ACTIVE' 
                    ? 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20 dark:text-emerald-300 dark:border-emerald-300/30' 
                    : member.status === 'ALUMNI'
                    ? 'bg-coral/10 text-coral border-coral/20 dark:text-[#FFB3AB] dark:border-coral/40'
                    : 'bg-amber-500/10 text-amber-700 border-amber-500/20 dark:text-amber-300 dark:border-amber-300/30'
                }`}>
                  {isAdvisorTab ? 'ADVISOR' : member.status}
                </span>
              </div>
            </div>

          {/* Bio */}
          <p className="text-sm text-auto-secondary leading-relaxed mb-6 line-clamp-3 group-hover:line-clamp-none transition-all duration-300">
            {bio}
          </p>

          {/* Social Links */}
          <div className="flex items-center justify-center gap-3 mt-auto pointer-events-auto">
            {Object.entries(social_links || {}).map(([platform, url]) => (
              platform !== 'role_history' && typeof url === 'string' && url.trim() !== '' && (
                <a 
                  key={platform} 
                  href={platform.toLowerCase() === 'email' ? `mailto:${url}` : url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl bg-primary-muted/70 border border-primary/10 dark:bg-white/5 dark:border-white/10 flex items-center justify-center text-primary dark:text-white/80 hover:bg-primary hover:text-white dark:hover:bg-secondary dark:hover:text-primary-dark transition-all hover:-translate-y-1 z-20"
                  aria-label={`${name}'s ${platform}`}
                >
                  {socialIcons[platform.toLowerCase()] || <ExternalLink size={18} />}
                </a>
              )
            ))}
          </div>
          </div>
      </div>
    </m.div>
  )
}
