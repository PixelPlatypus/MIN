'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { m } from 'framer-motion'
import { FacebookLogo, InstagramLogo, LinkedinLogo, YoutubeLogo, Envelope } from '@phosphor-icons/react'

const footerLinks = [
  {
    title: 'Organization',
    links: [
      { name: 'About Us', href: '/about' },
      { name: 'Our Team', href: '/team' },
      { name: 'Events', href: '/events' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { name: 'Content Library', href: '/content' },
      { name: 'Gallery', href: '/gallery' },
      { name: 'RTO Program', href: '/rto' },
      { name: 'DMO Practice', href: '/dmopractice' },
      { name: 'Submit Content', href: '/submit-content' },
    ],
  },
  {
    title: 'Support',
    links: [
      { name: 'Join Us', href: '/join' },
      { name: 'Contact Us', href: '/join#contact' },
      { name: 'Verify Certificate', href: '/verify' },
      { name: 'Privacy Policy', href: '/about/privacy' },
      { name: 'Terms of Use', href: '/about/terms' },
    ],
  },
]

export default function Footer({ settings: initialSettings = null }) {
  const [settings, setSettings] = useState(initialSettings)

  useEffect(() => {
    if (initialSettings) {
      setSettings(initialSettings)
      return
    }

    fetch('/api/settings')
      .then(res => res.json())
      .then(data => setSettings(data))
      .catch(err => console.error('Footer settings load error', err))
  }, [initialSettings])

  const socialLinks = settings ? [
    { name: 'Facebook', icon: <FacebookLogo size={20} />, href: settings.facebook_url },
    { name: 'Instagram', icon: <InstagramLogo size={20} />, href: settings.instagram_url },
    { name: 'LinkedIn', icon: <LinkedinLogo size={20} />, href: settings.linkedin_url },
    { name: 'YouTube', icon: <YoutubeLogo size={20} />, href: settings.youtube_url },
  ].filter(s => !!s.href) : []

  return (
    <footer className="bg-transparent pt-16 md:pt-24 pb-8 transition-colors">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="card-brand relative overflow-hidden px-6 py-12 sm:px-10 md:px-14 md:py-16">
          <div aria-hidden className="absolute inset-0 hero-glow opacity-50 pointer-events-none" />
          <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
            {/* Brand Column */}
            <div className="lg:col-span-2">
              <Link href="/" className="flex items-center gap-2 group mb-6">
                <span className="sr-only">Mathematics Initiatives in Nepal Home</span>
                {settings?.site_logo_url && (
                  <Image 
                    src={settings.site_logo_url} 
                    alt="MIN Logo" 
                    width={48}
                    height={48}
                    priority
                    className="h-12 w-12 p-1 bg-white dark:bg-white/10 rounded-full border border-primary/10 dark:border-white/15 transition-transform group-hover:scale-105 object-contain" 
                  />
                )}
              </Link>
              <p className="text-auto-secondary leading-relaxed max-w-sm mb-8">
                {settings?.footer_description}
              </p>
              <div className="flex items-center gap-4">
                {socialLinks.map((social) => (
                  <a 
                    key={social.name} 
                    href={social.href} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-xl bg-primary/5 dark:bg-white/5 border border-primary/10 dark:border-white/10 flex items-center justify-center text-dynamic hover:text-primary hover:border-primary/30 hover:bg-primary/10 dark:hover:bg-white/10 dark:duration-75 transition-all hover:-translate-y-1"
                    aria-label={social.name}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Links Columns */}
            {footerLinks.map((section) => (
              <div key={section.title}>
                <h4 className="font-bold text-sm mb-6 text-primary tracking-tight">{section.title}</h4>
                <ul className="space-y-4">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <Link 
                        href={link.href}
                        className="text-auto-secondary hover:text-primary dark:duration-75 transition-colors text-sm font-medium"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="relative mt-16 md:mt-20 pt-8 border-t border-primary/10 dark:border-white/10 flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-auto-tertiary text-center md:text-left">
            <p>© {new Date().getFullYear()} Mathematics Initiatives in Nepal. All rights reserved.</p>
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
              <Link href="/about/cookies" className="hover:text-primary dark:duration-75 transition-colors">Cookies</Link>
              <Link href="/about/legal" className="hover:text-primary dark:duration-75 transition-colors">Legal</Link>
              {settings?.contact_email && (
                <div className="flex items-center gap-2 min-w-0">
                  <Envelope size={16} className="shrink-0" />
                  <a href={`mailto:${settings.contact_email}`} className="break-all hover:text-primary dark:duration-75 transition-colors">
                    {settings.contact_email}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
