'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
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
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group relative h-full"
    >
      <div className="relative glass rounded-[2.5rem] p-6 flex flex-col items-center text-center h-full hover:border-primary/30 transition-all duration-500 shadow-sm hover:shadow-2xl hover:-translate-y-2 group overflow-hidden">
        
        {/* Background Clickable Link (Avoids nested <a> tags) */}
        <Link href={`/team/${slug || member.id}`} className="absolute inset-0 z-0 outline-none" aria-label={`View ${name}'s profile`} />
        
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0" />
        <div className="relative z-10 flex flex-col items-center h-full w-full pointer-events-none">
            {/* Profile Image Container */}
            <div className="w-40 h-40 relative mb-6 rounded-full overflow-hidden p-1.5 border-2 border-primary/10 group-hover:border-primary/40 transition-colors">
              <Image 
                src={photo_url || fallbackImage || '/images/logo.png'} 
                alt={name}
                fill
                className="object-cover rounded-full grayscale-[20%] group-hover:grayscale-0 transition-all duration-500 group-hover:scale-110"
                sizes="160px"
              />
            </div>

            {/* Name & Position */}
            <div className="space-y-1 mb-4 flex-grow">
              <h3 className="text-xl font-bold tracking-tight text-text dark:text-white group-hover:text-primary transition-colors">{name}</h3>
              
              {!isAdvisorTab && !isAlumniTab && (
                <p className="text-sm font-semibold text-primary">{position}</p>
              )}



              <div className="flex items-center justify-center gap-2 mt-2">
                {!isAdvisorTab && (
                  <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/10">
                    {tenure}
                  </span>
                )}
                <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border ${
                  isAdvisorTab 
                    ? 'bg-purple-500/10 text-purple-500 border-purple-500/20'
                    : member.status === 'ACTIVE' 
                    ? 'bg-green/10 text-green border-green/20' 
                    : member.status === 'ALUMNI'
                    ? 'bg-coral/10 text-coral border-coral/20'
                    : 'bg-amber/10 text-amber-600 border-amber-600/20'
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
                  className="w-9 h-9 rounded-xl bg-white dark:bg-white/5 flex items-center justify-center text-auto-secondary hover:text-primary dark:text-auto-secondary-dark dark:hover:text-primary transition-all shadow-sm hover:shadow-md hover:-translate-y-1 z-20"
                  aria-label={`${name}'s ${platform}`}
                >
                  {socialIcons[platform.toLowerCase()] || <ExternalLink size={18} />}
                </a>
              )
            ))}
          </div>
          </div>
      </div>
    </motion.div>
  )
}
