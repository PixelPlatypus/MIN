'use client'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Facebook, Instagram, Linkedin, Github, Mail, Globe } from 'lucide-react'

const socialIcons = { facebook: <Facebook size={16} />, instagram: <Instagram size={16} />, linkedin: <Linkedin size={16} />, email: <Mail size={16} />, github: <Github size={16} />, social_media: <Globe size={16} /> }

export default function TeamCard({ member, index, fallbackImage }) {
  const { id, slug, name, position, bio, photo_url, social_links = {}, status, tenure } = member
  const profileHref = `/team/${slug || id}`
  const statusConfig = { ACTIVE: { label: 'Active', class: 'bg-marigold/10 text-marigold' }, ALUMNI: { label: 'Alumni', class: 'bg-lotus-pink/10 text-lotus-pink' }, INACTIVE: { label: 'Inactive', class: 'bg-text-tertiary-dynamic/10 text-text-tertiary-dynamic' } }

  return (
    <motion.div layout initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.3, delay: index * 0.04 }} className="group">
      <div className="rounded-2xl overflow-hidden border border-border hover:border-headline/20 transition-all duration-300">
        <Link href={profileHref} aria-label={`View ${name}'s profile`} className="block">
          <div className="relative aspect-[3/4] overflow-hidden">
            <Image src={photo_url || fallbackImage || '/images/logo.png'} alt={name} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="(max-width: 768px) 50vw, 25vw" />
            {status && statusConfig[status] && <span className={`absolute top-3 right-3 px-2.5 py-1 rounded-lg text-[10px] font-bold ${statusConfig[status].class}`}>{statusConfig[status].label}</span>}
          </div>
        </Link>
        <div className="p-4 space-y-3">
          <Link href={profileHref} className="block group/name">
            <h3 className="font-bold text-sm text-headline mb-0.5 group-hover/name:underline underline-offset-4 decoration-headline/30">{name}</h3>
            <p className="text-xs text-text-tertiary-dynamic">{position}</p>
          </Link>
          {tenure && <span className="pill inline-block px-2 py-0.5 text-[9px] font-bold text-text-tertiary-dynamic">{tenure}</span>}
          {bio && <p className="text-xs text-text-secondary-dynamic leading-relaxed line-clamp-3">{bio}</p>}
          {Object.keys(social_links).length > 0 && (
            <div className="flex items-center gap-2 pt-2 border-t border-border">
              {Object.entries(social_links).map(([platform, url]) => {
                if (typeof url !== 'string' || !url.trim()) return null
                const linkHref = platform.toLowerCase() === 'email' ? `mailto:${url}` : url
                return <a key={platform} href={linkHref} target="_blank" rel="noopener noreferrer" className="text-text-tertiary-dynamic hover:text-headline transition-colors" aria-label={platform}>{socialIcons[platform] || <Globe size={16} />}</a>
              })}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
