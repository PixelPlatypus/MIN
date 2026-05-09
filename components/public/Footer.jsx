'use client'
import Link from 'next/link'
import { Facebook, Instagram, Youtube, Linkedin, Mail } from 'lucide-react'
import NepalBar from '@/components/shared/NepalBar'
import GridPaper from '@/components/shared/GridPaper'
import { LogoMark } from '@/components/shared/Logo'

const footerLinks = [
  { title: 'Organization', links: [{ name: 'About Us', href: '/about' }, { name: 'Our Team', href: '/team' }, { name: 'Events', href: '/events' }] },
  { title: 'Resources', links: [{ name: 'Content Library', href: '/content' }, { name: 'Gallery', href: '/gallery' }, { name: 'RTO Program', href: '/rto' }, { name: 'Submit Content', href: '/submit-content' }] },
  { title: 'Support', links: [{ name: 'Join Us', href: '/join' }, { name: 'DMO Practice', href: '/dmopractice' }, { name: 'Contact Us', href: '/join#contact' }, { name: 'Privacy Policy', href: '/about/privacy' }] },
]

const socialLinks = [
  { name: 'Facebook', href: 'https://www.facebook.com/mathsinitiatives', icon: Facebook },
  { name: 'Instagram', href: 'https://www.instagram.com/minnepal', icon: Instagram },
  { name: 'YouTube', href: 'https://www.youtube.com/@mathsinitiatives', icon: Youtube },
  { name: 'LinkedIn', href: 'https://www.linkedin.com/company/min-nepal/', icon: Linkedin },
].filter(s => !!s.href)

export default function Footer({ settings }) {
  return (
    <footer className="relative pt-20 pb-10 px-6 md:px-12 lg:px-20 overflow-hidden border-t border-border-dynamic">
      <GridPaper opacity={0.10} spacing={80} />
      <NepalBar position="left" />
      <div className="relative max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr] gap-12 mb-16">
          <div>
            <Link href="/" className="inline-flex items-start gap-3 mb-6 text-headline group" aria-label="Mathematics Initiatives in Nepal — Home">
              <LogoMark className="h-11 w-auto shrink-0" />
              <span className="flex flex-col leading-tight">
                <span className="font-bold text-base tracking-tight text-text-primary-dynamic">Mathematics Initiatives</span>
                <span className="text-xs text-text-tertiary-dynamic font-institutional tracking-[0.2em] mt-1">in Nepal</span>
              </span>
            </Link>
            <p className="text-text-secondary-dynamic max-w-sm leading-relaxed text-sm mb-8">
              {settings?.footer_description || 'Empowering students across Nepal through innovative mathematics education, resources, and events since 2020.'}
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon
                return <a key={social.name} href={social.href} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl flex items-center justify-center text-text-secondary-dynamic hover:text-headline hover:bg-headline/5 transition-colors" aria-label={social.name}><Icon size={18} /></a>
              })}
            </div>
          </div>
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h4 className="text-xs font-institutional tracking-[0.2em] text-text-tertiary-dynamic mb-5">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}><Link href={link.href} className="text-sm text-text-secondary-dynamic hover:text-headline transition-colors">{link.name}</Link></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="rule mb-8" />
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 text-sm text-text-tertiary-dynamic">
          <p className="order-2 md:order-1">&copy; {new Date().getFullYear()} Mathematics Initiatives in Nepal. All rights reserved.</p>

          <span className="order-1 md:order-2 text-base text-headline/80 text-center" title="Dhanyabad — thank you">धन्यवाद</span>

          <div className="order-3 flex items-center justify-center md:justify-end gap-6 flex-wrap">
            <Link href="/about/cookies" className="hover:text-headline transition-colors">Cookies</Link>
            <Link href="/about/legal" className="hover:text-headline transition-colors">Legal</Link>
            {settings?.contact_email && <a href={`mailto:${settings.contact_email}`} className="hover:text-headline transition-colors flex items-center gap-1.5"><Mail size={14} />{settings.contact_email}</a>}
          </div>
        </div>
      </div>
    </footer>
  )
}
