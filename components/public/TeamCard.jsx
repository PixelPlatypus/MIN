'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { Facebook, Instagram, Linkedin, Github, Mail, Globe, ExternalLink } from 'lucide-react'

const socialIcons = {
  facebook: <Facebook size={18} />,
  instagram: <Instagram size={18} />,
  linkedin: <Linkedin size={18} />,
  email: <Mail size={18} />,
  github: <Github size={18} />,
  social_media: <Globe size={18} />,
}

export default function TeamCard({ member, index }) {
  const { name, position, bio, photo_url, social_links = {}, tenure, farewell_date } = member
  const [settings, setSettings] = useState(null)

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => setSettings(data))
      .catch(err => console.error('TeamCard settings load error', err))
  }, [])

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group relative h-full"
    >
      <div className="relative glass bg-white/60 dark:bg-white/5 backdrop-blur-2xl rounded-[2.5rem] p-6 flex flex-col items-center text-center h-full border border-white/40 dark:border-white/10 hover:border-primary/30 transition-all duration-500 shadow-sm hover:shadow-2xl hover:-translate-y-2 group overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0" />
        <div className="relative z-10 flex flex-col items-center h-full w-full">
          {/* Profile Image Container */}
          <div className="w-40 h-40 relative mb-6 rounded-full overflow-hidden p-1.5 border-2 border-primary/10 group-hover:border-primary/40 transition-colors">
            <Image 
              src={photo_url || settings?.default_team_photo || 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?q=80&w=1931&auto=format&fit=crop'} 
              alt={name}
              fill
              className="object-cover rounded-full grayscale-[20%] group-hover:grayscale-0 transition-all duration-500 group-hover:scale-110"
              sizes="160px"
            />
          </div>

          {/* Name & Position */}
          <div className="space-y-1 mb-4 flex-grow">
            <h3 className="text-xl font-bold tracking-tight text-text dark:text-white group-hover:text-primary transition-colors">{name}</h3>
            <p className="text-sm font-semibold text-primary">{position}</p>
            <div className="flex items-center justify-center gap-2 mt-2">
              <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/10">
                {tenure}
              </span>
              <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border ${
                member.status === 'ACTIVE' 
                  ? 'bg-green/10 text-green border-green/20' 
                  : member.status === 'ALUMNI'
                  ? 'bg-coral/10 text-coral border-coral/20'
                  : 'bg-amber/10 text-amber-600 border-amber-600/20'
              }`}>
                {member.status || 'Active'}
              </span>
            </div>
          </div>

          {/* Bio */}
          <p className="text-sm text-text-secondary dark:text-text-secondary-dark leading-relaxed mb-6 line-clamp-3 group-hover:line-clamp-none transition-all duration-300">
            {bio || 'Empowering math education in Nepal with the MIN family.'}
          </p>

          {/* Social Links */}
          <div className="flex items-center justify-center gap-3 mt-auto">
            {Object.entries(social_links).map(([platform, url]) => (
              url && (
                <a 
                  key={platform} 
                  href={platform.toLowerCase() === 'email' ? `mailto:${url}` : url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl bg-white dark:bg-white/5 flex items-center justify-center text-text-secondary hover:text-primary dark:text-text-secondary-dark dark:hover:text-primary transition-all shadow-sm hover:shadow-md hover:-translate-y-1 z-20"
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
