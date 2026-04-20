'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
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

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const [settings, setSettings] = useState(null)
  
  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => setSettings(data))
      .catch(err => console.error('Navbar settings load error', err))
  }, [])

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'py-3' : 'py-5'
      }`}
    >
      <div className="container mx-auto px-6">
        <div className={`glass rounded-2xl flex items-center justify-between px-6 py-3 transition-all duration-300 ${
          scrolled ? 'shadow-lg' : 'shadow-none'
        }`}>
          <Link href="/" className="flex items-center gap-2 group">
            <span className="sr-only">Mathematics Initiatives in Nepal Home</span>
            <img 
              src={settings?.site_logo_url || "/images/logo.svg"} 
              alt="MIN Logo" 
              className="h-10 w-10 p-1 bg-white dark:bg-white/10 rounded-full border border-black/5 dark:border-white/10 object-contain transition-transform group-hover:scale-105" 
            />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href}
                aria-current={pathname === link.href ? 'page' : undefined}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  pathname === link.href ? 'text-primary' : 'text-dynamic'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <div className="h-6 w-px bg-border dark:bg-border-dark" />
            <ThemeToggle />
          </div>

          {/* Mobile Toggle */}
          <div className="flex md:hidden items-center gap-4">
            <ThemeToggle />
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors"
              aria-label={isOpen ? "Close menu" : "Open menu"}
              aria-expanded={isOpen}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden absolute top-full left-0 right-0 px-6 pt-2"
          >
            <div className="glass rounded-2xl overflow-hidden shadow-xl p-4 flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link 
                  key={link.href} 
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  aria-current={pathname === link.href ? 'page' : undefined}
                  className={`px-4 py-3 rounded-xl transition-colors ${
                    pathname === link.href 
                      ? 'bg-primary/10 text-primary' 
                      : 'hover:bg-black/5 dark:hover:bg-white/5 text-black dark:text-white'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
