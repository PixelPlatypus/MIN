'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { m, AnimatePresence } from 'framer-motion'
import { List, X } from '@phosphor-icons/react'
import Image from 'next/image'
import ThemeToggle from '@/components/shared/ThemeToggle'

const navLinks = [
  { name: 'About', href: '/about' },
  { name: 'Team', href: '/team' },
  { name: 'Content', href: '/content' },
  { name: 'Events', href: '/events' },
  { name: 'RTO', href: '/rto' },
  { name: 'Gallery', href: '/gallery' },
  { name: 'Join Us', href: '/join' },
]

export default function Navbar({ settings: initialSettings = null }) {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const [settings, setSettings] = useState(initialSettings)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (initialSettings) {
      setSettings(initialSettings)
      return
    }

    fetch('/api/settings')
      .then(res => res.json())
      .then(data => setSettings(data))
      .catch(err => console.error('Navbar settings load error', err))
  }, [initialSettings])

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'py-3' : 'py-5'
      }`}
    >
      <div className="container mx-auto px-6">
        <div className={`glass !border-primary/10 dark:!border-white/15 rounded-2xl flex items-center justify-between px-4 sm:px-6 py-3 transition-all duration-300 ${
          scrolled ? 'shadow-[0_12px_32px_-16px_rgba(22,85,109,0.35)] dark:shadow-[0_12px_32px_-16px_rgba(0,0,0,0.5)]' : 'shadow-none'
        }`}>
          <Link href="/" className="flex items-center gap-2 group">
            <span className="sr-only">Mathematics Initiatives in Nepal Home</span>
            {settings?.site_logo_url && (
              <Image 
                src={settings.site_logo_url} 
                alt="MIN Logo" 
                width={40}
                height={40}
                priority
                className="h-10 w-10 p-1 bg-white dark:bg-white/10 rounded-full border border-primary/10 dark:border-white/15 object-contain transition-transform group-hover:scale-105" 
              />
            )}
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            {navLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href}
                aria-current={pathname === link.href ? 'page' : undefined}
                className={link.href === '/join'
                  ? 'btn-brand !px-5 !py-2.5 text-sm !rounded-xl'
                  : `relative text-sm font-semibold transition-colors hover:text-primary dark:duration-75 after:absolute after:left-0 after:-bottom-1.5 after:h-0.5 after:rounded-full after:bg-secondary-dark after:transition-all after:duration-300 ${
                    pathname === link.href ? 'text-primary after:w-full' : 'text-dynamic after:w-0 hover:after:w-full'
                  }`}
              >
                {link.name}
              </Link>
            ))}
            <div className="h-6 w-px bg-primary/15 dark:bg-white/15" />
            <ThemeToggle />
          </div>

          {/* Mobile Toggle */}
          <div className="flex md:hidden items-center gap-4">
            <ThemeToggle />
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-dynamic hover:bg-primary/5 dark:hover:bg-white/10 rounded-xl transition-colors"
              aria-label={isOpen ? "Close menu" : "Open menu"}
              aria-expanded={isOpen}
            >
              {isOpen ? <X size={24} /> : <List size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <m.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden absolute top-full left-0 right-0 px-6 pt-2"
          >
            <div className="glass-brand rounded-[1.75rem] overflow-hidden p-3 flex flex-col gap-1 relative">
              {navLinks.map((link) => (
                <Link 
                  key={link.href} 
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  aria-current={pathname === link.href ? 'page' : undefined}
                  className={`relative px-4 py-3 rounded-xl font-semibold transition-colors ${
                    pathname === link.href 
                      ? 'bg-primary/10 dark:bg-white/10 text-primary' 
                      : 'hover:bg-primary/5 dark:hover:bg-white/5 text-dynamic'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
