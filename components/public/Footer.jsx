'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Facebook, Instagram, Linkedin, Youtube, Mail } from 'lucide-react'

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
      { name: 'Submit Content', href: '/submit-content' },
    ],
  },
  {
    title: 'Support',
    links: [
      { name: 'Join Us', href: '/join' },
      { name: 'Contact Us', href: '/contact' },
      { name: 'Privacy Policy', href: '/about/privacy' },
      { name: 'Terms of Use', href: '/about/terms' },
    ],
  },
]

export default function Footer() {
  const [settings, setSettings] = useState(null)

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => setSettings(data))
      .catch(err => console.error('Footer settings load error', err))
  }, [])

  const socialLinks = settings ? [
    { name: 'Facebook', icon: <Facebook size={20} />, href: settings.facebook_url },
    { name: 'Instagram', icon: <Instagram size={20} />, href: settings.instagram_url },
    { name: 'LinkedIn', icon: <Linkedin size={20} />, href: settings.linkedin_url },
    { name: 'YouTube', icon: <Youtube size={20} />, href: settings.youtube_url },
  ].filter(s => !!s.href) : []

  return (
    <footer className="bg-transparent pt-24 pb-12 transition-colors border-t border-black/10 dark:border-white/10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 group mb-6">
              <span className="sr-only">Mathematics Initiatives in Nepal Home</span>
              <Image 
                src={settings?.site_logo_url || "/images/logo.svg"} 
                alt="MIN Logo" 
                width={48}
                height={48}
                priority
                className="h-12 w-12 transition-transform group-hover:scale-105 object-contain" 
              />
            </Link>
            <p className="text-dynamic max-w-sm mb-8 opacity-80">
              {settings?.footer_description || "Mathematics Initiatives in Nepal (MIN) is dedicated to making mathematics accessible, engaging, and inspiring for every student in Nepal."}
            </p>
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => (
                <a 
                  key={social.name} 
                  href={social.href} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-black/5 dark:bg-white/5 flex items-center justify-center text-dynamic hover:text-primary transition-all shadow-sm hover:shadow-md hover:-translate-y-1"
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
              <h4 className="font-bold text-sm mb-6 text-dynamic tracking-tight">{section.title}</h4>
              <ul className="space-y-4">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link 
                      href={link.href}
                      className="text-dynamic opacity-70 hover:opacity-100 hover:text-primary transition-all text-sm font-medium"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-20 pt-8 border-t border-black/5 dark:border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-dynamic opacity-50">
          <p>© {new Date().getFullYear()} Mathematics Initiatives in Nepal. All rights reserved.</p>
          <div className="flex items-center gap-8">
            <Link href="/about/cookies" className="hover:text-primary transition-colors">Cookies</Link>
            <Link href="/about/legal" className="hover:text-primary transition-colors">Legal</Link>
            <div className="flex items-center gap-2">
              <Mail size={16} />
                <a href={`mailto:${settings?.contact_email || 'contact@mathsinitiatives.org.np'}`} className="hover:text-primary transition-colors">
                  {settings?.contact_email || 'contact@mathsinitiatives.org.np'}
                </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
