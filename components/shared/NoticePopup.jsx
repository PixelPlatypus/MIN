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
          
          // 2. Check Target Pages
          // If empty array or null, show on all pages
          if (n.target_pages && n.target_pages.length > 0) {
            const isMatch = n.target_pages.some(page => {
              if (page === '/') return pathname === '/'
              return pathname.startsWith(page)
            })
            if (!isMatch) return false
          }
          
          // 3. Check if dismissed
          const dismissed = localStorage.getItem(`min_notice_dismissed_${n.id}`)
          return dismissed !== 'true'
        })

        if (eligibleNotices.length > 0) {
          setNotice(eligibleNotices[0])
          setTimeout(() => setIsVisible(true), 1200)
        }
      } catch (err) {
        console.error('Popup check error:', err)
      }
    }

    checkNotices()
  }, [pathname])

  const dismiss = () => {
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
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: 20, scale: 0.9, filter: 'blur(10px)' }}
            transition={{ 
              type: 'spring', 
              damping: 25, 
              stiffness: 200 
            }}
            className="relative overflow-hidden group shadow-2xl rounded-[2.5rem]"
          >
            {/* Background Glow */}
            <div className="absolute inset-0 bg-primary/10 dark:bg-primary/20 blur-3xl group-hover:bg-primary/20 transition-all duration-500" />
            
            <div className="relative glass rounded-[2.5rem] p-8 overflow-hidden">
              <button 
                onClick={dismiss}
                className="absolute top-6 right-6 p-2 rounded-full bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-text-secondary dark:text-white/60 hover:text-text-primary dark:hover:text-white transition-all z-10"
              >
                <X size={18} />
              </button>

              <div className="flex flex-col gap-6">
                <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
                  <Bell size={24} className="animate-wiggle" />
                </div>

                <div className="space-y-3">
                  <h3 className="text-2xl font-black text-text-primary dark:text-white leading-tight font-sans tracking-tight">
                    {notice.title}
                  </h3>
                  <p className="text-text-secondary dark:text-white/70 text-base leading-relaxed line-clamp-4">
                    {notice.body}
                  </p>
                </div>

                <div className="pt-4 flex flex-col gap-3">
                  {notice.cta_url ? (
                    <Link 
                      href={notice.cta_url}
                      onClick={dismiss}
                      className="group/btn relative w-full inline-flex items-center justify-center gap-3 bg-primary dark:bg-white text-white dark:text-black px-8 py-4 rounded-2xl font-black transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-primary/10 dark:shadow-white/10"
                    >
                      <span>{notice.cta_text || 'Learn More'}</span>
                      <ArrowRight size={20} className="transition-transform group-hover/btn:translate-x-1" />
                    </Link>
                  ) : (
                    <button 
                      onClick={dismiss}
                      className="w-full inline-flex items-center justify-center bg-primary/10 dark:bg-white/10 hover:bg-primary/20 dark:hover:bg-white/20 text-primary dark:text-white px-8 py-4 rounded-full font-black transition-all"
                    >
                      Got it
                    </button>
                  )}
                  
                  <button 
                    onClick={dismiss}
                    className="text-text-tertiary dark:text-white/40 hover:text-text-secondary dark:hover:text-white/60 text-[10px] font-bold uppercase tracking-widest transition-colors w-full text-center py-2"
                  >
                    Don't show this again
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

