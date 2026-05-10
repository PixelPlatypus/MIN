'use client'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, ExternalLink, Facebook, Instagram, Linkedin, Github, Mail, Globe, Award, Calendar } from 'lucide-react'
import GridPaper from '@/components/shared/GridPaper'
import NepalBar from '@/components/shared/NepalBar'

const socialIcons = {
  facebook: Facebook,
  instagram: Instagram,
  linkedin: Linkedin,
  email: Mail,
  github: Github,
  social_media: Globe,
}

const statusStyle = {
  ACTIVE: 'bg-marigold/10 text-marigold border-marigold/20',
  ALUMNI: 'bg-lotus-pink/10 text-lotus-pink border-lotus-pink/20',
  INACTIVE: 'bg-text-tertiary-dynamic/10 text-text-tertiary-dynamic border-border',
}

const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) : null

export default function TeamMemberProfile({ member, socialLinks, roleHistory }) {
  const joined = formatDate(member.joined_date)
  const farewell = formatDate(member.farewell_date)
  const sortedHistory = [...roleHistory].sort((a, b) => parseInt(b.year) - parseInt(a.year))
  const socials = Object.entries(socialLinks).filter(([k, v]) => k !== 'role_history' && typeof v === 'string' && v.trim())

  return (
    <main className="relative pt-32 pb-32 px-6 md:px-12 lg:px-20 overflow-hidden">
      <GridPaper opacity={0.08} spacing={80} />
      <NepalBar position="left" />

      <div className="relative max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-14"
        >
          <Link
            href="/team"
            className="inline-flex items-center gap-2 text-xs font-institutional uppercase tracking-[0.28em] text-text-tertiary-dynamic hover:text-headline transition-colors group"
          >
            <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" />
            Back to Team
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          <aside className="lg:col-span-5 lg:sticky lg:top-32 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden border border-border"
            >
              <Image
                src={member.photo_url || '/images/logo.png'}
                alt={member.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-bg via-bg/40 to-transparent pointer-events-none" />
              <div className="absolute inset-x-0 bottom-0 p-6 md:p-8 space-y-3">
                <div className="flex flex-wrap gap-2">
                  {member.tenure && (
                    <span className="pill px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-text-tertiary-dynamic">
                      Tenure {member.tenure}
                    </span>
                  )}
                  {member.is_advisor && (
                    <span className="pill px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-headline">
                      Advisor
                    </span>
                  )}
                  {member.status && statusStyle[member.status] && (
                    <span className={`px-2.5 py-1 rounded-full border text-[10px] font-bold uppercase tracking-[0.18em] ${statusStyle[member.status]}`}>
                      {member.status === 'ACTIVE' ? 'Active' : member.status === 'ALUMNI' ? 'Alumni' : 'Inactive'}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>

            {socials.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="flex flex-wrap items-center gap-2"
              >
                {socials.map(([platform, url]) => {
                  const Icon = socialIcons[platform.toLowerCase()] || Globe
                  const href = platform.toLowerCase() === 'email' ? `mailto:${url}` : url
                  return (
                    <a
                      key={platform}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${member.name} on ${platform}`}
                      className="h-10 w-10 grid place-items-center rounded-full border border-border text-text-tertiary-dynamic hover:text-headline hover:border-headline/40 transition-colors"
                    >
                      <Icon size={16} />
                    </a>
                  )
                })}
              </motion.div>
            )}
          </aside>

          <div className="lg:col-span-7 space-y-16">
            <motion.header
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-4"
            >
              <div className="text-[10px] font-institutional uppercase tracking-[0.32em] text-text-tertiary-dynamic">
                {member.position || 'MINion'}
              </div>
              <h1 className="text-5xl md:text-6xl font-black tracking-tighter leading-[0.95] text-headline">
                {member.name}
              </h1>
              {(joined || farewell) && (
                <p className="text-sm text-text-tertiary-dynamic flex flex-wrap items-center gap-x-3 gap-y-1">
                  {joined && (
                    <span className="inline-flex items-center gap-1.5">
                      <Calendar size={14} />
                      Joined {joined}
                    </span>
                  )}
                  {farewell && (
                    <>
                      <span className="text-border-dynamic">·</span>
                      <span>Departed {farewell}</span>
                    </>
                  )}
                </p>
              )}
            </motion.header>

            <motion.section
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.7 }}
              className="space-y-5"
            >
              <div className="flex items-center gap-4">
                <h2 className="text-[10px] font-institutional uppercase tracking-[0.32em] text-text-tertiary-dynamic">Biography</h2>
                <span className="flex-1 h-px bg-border-dynamic" />
              </div>
              <p className="text-base md:text-lg leading-relaxed text-text-secondary-dynamic whitespace-pre-wrap">
                {member.bio || 'Biography details are currently being updated.'}
              </p>
            </motion.section>

            {sortedHistory.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.7 }}
                className="space-y-5"
              >
                <div className="flex items-center gap-4">
                  <h2 className="text-[10px] font-institutional uppercase tracking-[0.32em] text-text-tertiary-dynamic">Role History</h2>
                  <span className="flex-1 h-px bg-border-dynamic" />
                </div>
                <ol className="divide-y divide-border-dynamic border-y border-border-dynamic">
                  {sortedHistory.map((h, i) => (
                    <li key={`${h.year}-${i}`} className="flex items-baseline justify-between py-4">
                      <span className="text-base md:text-lg font-bold text-headline tracking-tight">{h.position}</span>
                      <span className="font-mono text-sm text-text-tertiary-dynamic">{h.year}</span>
                    </li>
                  ))}
                </ol>
              </motion.section>
            )}

            {member.certificate_url && (
              <motion.section
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.7 }}
                className="space-y-5"
              >
                <div className="flex items-center gap-4">
                  <h2 className="text-[10px] font-institutional uppercase tracking-[0.32em] text-text-tertiary-dynamic">Certification</h2>
                  <span className="flex-1 h-px bg-border-dynamic" />
                </div>
                <div className="relative w-full aspect-[1.4/1] rounded-2xl overflow-hidden border border-border bg-surface group">
                  {(member.certificate_url || '').toLowerCase().endsWith('.pdf') ? (
                    <iframe
                      src={`${member.certificate_url}#toolbar=0&navpanes=0&scrollbar=0`}
                      className="w-full h-full border-none"
                      title={`${member.name} Certificate`}
                    />
                  ) : (
                    <img
                      src={member.certificate_url}
                      alt={`${member.name} certificate`}
                      className="w-full h-full object-cover"
                    />
                  )}
                  <a
                    href={member.certificate_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute bottom-4 right-4 inline-flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-institutional uppercase tracking-[0.2em] bg-bg-dynamic/85 backdrop-blur-md border border-border-dynamic text-text-primary-dynamic hover:text-headline hover:border-headline/40 transition-colors"
                  >
                    <Award size={14} />
                    View Full Size
                    <ExternalLink size={12} />
                  </a>
                </div>
              </motion.section>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
