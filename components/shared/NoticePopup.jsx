'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, X, ExternalLink, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function NoticePopup() {
  const [notice, setNotice] = useState(null)
  const [isVisible, setIsVisible] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    // Don't show popups on admin pages
    if (pathname.startsWith('/admin')) return

    async function checkNotices() {
      try {
        const res = await fetch('/api/notices/public')
        if (!res.ok) return
        
        const notices = await res.json()
        if (!Array.isArray(notices)) return

        const eligibleNotices = notices.filter(n => {
          // 1. Check Date Range (with local time safety)
          const now = new Date()
          if (n.starts_at && new Date(n.starts_at) > now) return false
          
          if (n.ends_at) {
            const endDate = new Date(n.ends_at)
            endDate.setHours(23, 59, 59, 999) // End of day
            if (endDate < now) return false
          }
          return true
        })

        // Find the first notice that isn't permanently dismissed and matches path
        const validNotice = eligibleNotices.find(n => {
          // 1. Check if dismissed permanently
          const dismissed = localStorage.getItem(`min_notice_dismissed_${n.id}`)
          if (dismissed === 'true') return false

          // 2. Check target pages
          if (n.target_pages && n.target_pages.length > 0) {
            return n.target_pages.some(p => {
              if (p === 'ALL') return true
              if (p === 'HOME' && pathname === '/') return true
              return pathname.startsWith(p)
            })
          }
          return true
        })

        if (validNotice) {
          setNotice(validNotice)
          setTimeout(() => setIsVisible(true), 1200)
        }
      } catch (err) {
        console.error('Popup check error:', err)
      }
    }

    checkNotices()
  }, [pathname])

  const closePopup = () => {
    setIsVisible(false)
  }

  const dismissPermanently = () => {
    setIsVisible(false)
    if (notice) {
      localStorage.setItem(`min_notice_dismissed_${notice.id}`, 'true')
    }
  }

  if (!notice) return null

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed bottom-6 left-6 right-6 z-[100] sm:left-auto sm:right-8 sm:bottom-8 sm:w-[400px]">
          <>
            {/* Backdrop Blur — localized fallback */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closePopup}
              className="fixed inset-0 pointer-events-auto -z-10"
            />

            <motion.div
              initial={{ opacity: 0, y: 100, scale: 0.9, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: 20, scale: 0.9, filter: 'blur(10px)' }}
              transition={{ 
                type: 'spring', 
                damping: 25, 
                stiffness: 200 
              }}
              className="relative overflow-hidden group shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] dark:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)] rounded-[2.5rem]"
            >
              {/* Localized Glow Effect */}
              <div className="absolute -inset-10 bg-primary/20 dark:bg-primary/30 blur-[80px] opacity-50 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
              
              <div className="relative glass-brand rounded-[2.5rem] p-8 overflow-hidden">
                 {/* Close Button — Brand Sync */}
                 <button 
                  onClick={closePopup}
                  className="absolute top-5 right-5 w-10 h-10 flex items-center justify-center rounded-full bg-white dark:bg-black/40 hover:scale-110 active:scale-95 transition-all z-20 shadow-lg border border-border dark:border-white/10"
                  aria-label="Close"
                >
                  <X size={22} strokeWidth={3} className="text-primary dark:text-secondary" />
                </button>

                <div className="flex flex-col gap-6">
                  {notice.image_url ? (
                    <div className="w-full aspect-video rounded-3xl overflow-hidden border border-primary/10 shadow-2xl">
                      <img 
                        src={notice.image_url} 
                        alt={notice.title} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center text-white shadow-xl shadow-primary/30">
                      <Bell size={28} className="animate-wiggle" />
                    </div>
                  )}

                  <div className="space-y-3">
                    <h3 className="text-2xl font-black text-text-primary dark:text-white leading-tight font-sans tracking-tight">
                      {notice.title}
                    </h3>
                    <p className="text-text-secondary dark:text-white/70 text-base leading-relaxed line-clamp-4">
                      {notice.body}
                    </p>
                  </div>

                  <div className="pt-2 flex flex-col gap-3">
                    {notice.cta_url ? (
                      <Link 
                        href={notice.cta_url}
                        onClick={closePopup}
                        className="group/btn relative w-full inline-flex items-center justify-center gap-3 bg-primary dark:bg-white text-white dark:text-black px-8 py-4 rounded-2xl font-black transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-primary/20 dark:shadow-white/10"
                      >
                        <span>{notice.cta_text || 'Learn More'}</span>
                        <ArrowRight size={20} className="transition-transform group-hover/btn:translate-x-1" />
                      </Link>
                    ) : (
                      <button 
                        onClick={closePopup}
                        className="w-full inline-flex items-center justify-center bg-primary/10 dark:bg-white/10 hover:bg-primary/20 dark:hover:bg-white/20 text-primary dark:text-white px-8 py-4 rounded-2xl font-black transition-all"
                      >
                        Got it
                      </button>
                    )}
                    
                    <button 
                      onClick={dismissPermanently}
                      className="text-text-tertiary dark:text-white/40 hover:text-text-secondary dark:hover:text-white/60 text-[10px] font-bold uppercase tracking-widest transition-colors w-full text-center py-2"
                    >
                      Don't show this again
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        </div>
      )}
    </AnimatePresence>
  )
}

