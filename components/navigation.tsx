"use client"

import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"

export const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Team", href: "/team" },
    { name: "Learn", href: "/learn" },
    { name: "Contents", href: "/content" },
    { name: "Join Us", href: "/join" },
    { name: "Gallery", href: "/gallery" },
    { name: "RTO", href: "/rto" },
  ]

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/"
    return pathname.startsWith(href)
  }

  return (
    <nav
      className={`fixed top-0 w-full z-40 transition-all duration-500 ${
        isScrolled ? "glass-dark shadow-2xl" : "glass"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 sm:space-x-3 group" data-hover="true">
            <div className="relative">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Image src="/images/min-logo.png" alt="MIN" width={32} height={32} className="rounded-lg" />
              </div>
            </div>
            <div>
              <span className="text-white font-bold text-lg sm:text-xl tracking-tight min-gradient-accent">MIN</span>
              <div className="text-white text-xs font-medium hidden sm:block">
                Mathematics Initiatives Nepal
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-2">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`relative text-sm font-medium tracking-wide px-4 py-2 rounded-full transition-all duration-300 ${
                  isActive(item.href)
                    ? "text-white bg-min-accent/20 border border-min-accent/30"
                    : "text-white/90 hover:text-white hover:bg-white/5"
                }`}
                data-hover="true"
              >
                {item.name}
              </Link>
            ))}
            <motion.button
              className="btn-min-accent px-4 sm:px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 ml-4"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              data-hover="true"
              onClick={() => {
                window.location.href = "/submit-content"
              }}
            >
              Submit Content
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-white p-2 rounded-xl transition-colors hover:bg-white/10"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            data-hover="true"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="lg:hidden mt-4 glass-dark rounded-2xl p-4 sm:p-6"
          >
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`block py-3 px-4 text-sm font-medium rounded-xl mb-2 transition-all duration-300 ${
                  isActive(item.href)
                    ? "text-white bg-min-accent/20 border border-min-accent/30"
                    : "text-white/90 hover:text-white hover:bg-white/5"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
                data-hover="true"
              >
                {item.name}
              </Link>
            ))}
            <button
              className="w-full btn-min-accent py-3 rounded-xl text-sm font-semibold mt-4"
              onClick={() => {
                setIsMobileMenuOpen(false)
                window.location.href = "/submit-content"
              }}
            >
              Submit Content
            </button>
          </motion.div>
        )}
      </div>
    </nav>
  )
}
