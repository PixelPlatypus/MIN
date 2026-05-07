'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import Logo from '@/components/shared/Logo'

const navLinks = [
  { name: 'About', href: '/about' },
  { name: 'Team', href: '/team' },
  { name: 'Content', href: '/content' },
  { name: 'Events', href: '/events' },
  { name: 'RTO', href: '/rto' },
  { name: 'Gallery', href: '/gallery' },
  { name: 'Join Us', href: '/join' },
]

export default function Navbar({ settings }) {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      <div className={`transition-all duration-500 ${scrolled ? 'bg-bg-dynamic/90 backdrop-blur-md border-b border-border-dynamic' : 'bg-transparent'}`}>
        <div className="px-6 md:px-12 lg:px-20">
          <div className="flex items-center justify-between h-16">
            <Logo size="sm" />
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} aria-current={pathname === link.href ? 'page' : undefined}
                  className={`relative text-sm font-medium transition-colors hover:text-headline ${pathname === link.href ? 'text-headline' : 'text-text-secondary-dynamic'}`}>
                  {link.name}
                  {pathname === link.href && <span className="absolute -bottom-1 left-0 right-0 h-px bg-headline" />}
                </Link>
              ))}
            </div>
            <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2" aria-label={isOpen ? 'Close menu' : 'Open menu'} aria-expanded={isOpen}>
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden bg-bg-dynamic/95 backdrop-blur-md border-b border-border-dynamic">
          <div className="px-6 py-4 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setIsOpen(false)}
                className={`px-4 py-3 text-sm font-medium transition-colors ${pathname === link.href ? 'text-headline' : 'text-text-secondary-dynamic hover:text-headline'}`}>
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}
