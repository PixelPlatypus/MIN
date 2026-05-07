'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

let noticeClosedForSession = false

export default function NoticePopup() {
  const [notice, setNotice] = useState(null)
  const [isVisible, setIsVisible] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    if (pathname.startsWith('/admin') || pathname.startsWith('/login')) return
    if (noticeClosedForSession) return

    async function checkNotices() {
      try {
        const res = await fetch('/api/notices/public')
        if (!res.ok) return

        const notices = await res.json()
        if (!Array.isArray(notices)) return

        const eligibleNotices = notices.filter(n => {
          const now = new Date()
          if (n.starts_at && new Date(n.starts_at) > now) return false
          if (n.ends_at) {
            const endDate = new Date(n.ends_at)
            endDate.setHours(23, 59, 59, 999)
            if (endDate < now) return false
          }
          return true
        })

        const validNotice = eligibleNotices.find(n => {
          const dismissed = localStorage.getItem(`min_notice_dismissed_${n.id}`)
          if (dismissed === 'true') return false
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
          setTimeout(() => {
            if (!noticeClosedForSession) setIsVisible(true)
          }, 1200)
        }
      } catch (err) {
        console.error('Popup check error:', err)
      }
    }

    checkNotices()
  }, [pathname])

  const closePopup = () => {
    setIsVisible(false)
    noticeClosedForSession = true
  }

  const dismissPermanently = () => {
    setIsVisible(false)
    noticeClosedForSession = true
    if (notice) {
      localStorage.setItem(`min_notice_dismissed_${notice.id}`, 'true')
    }
  }

  if (!notice) return null

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed bottom-6 right-6 z-[100] w-[calc(100vw-3rem)] sm:w-[400px]">
          <motion.div
            initial={{ opacity: 0, y: 80, scale: 0.85, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: 30, scale: 0.9, filter: 'blur(10px)' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="relative overflow-hidden"
          >
            <div className="bg-surface rounded-3xl border border-border-dynamic shadow-2xl p-0">
              <button
                onClick={closePopup}
                className="absolute top-3 right-3 w-9 h-9 flex items-center justify-center rounded-full bg-black/40 backdrop-blur-sm hover:scale-110 active:scale-95 transition-all z-20"
                aria-label="Close"
              >
                <X size={18} strokeWidth={2.5} className="text-white" />
              </button>

              {notice.image_url && (
                <div className="relative w-full aspect-video rounded-t-3xl overflow-hidden">
                  <Image
                    src={notice.image_url}
                    alt={notice.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 400px"
                  />
                </div>
              )}

              <div className="p-7 flex flex-col gap-5">
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-text-primary-dynamic tracking-tight leading-tight">
                    {notice.title}
                  </h3>
                  <p className="text-sm text-text-secondary-dynamic leading-relaxed line-clamp-4">
                    {notice.body}
                  </p>
                </div>

                <div className="flex flex-col gap-3">
                  {notice.cta_url ? (
                    <Link
                      href={notice.cta_url}
                      onClick={closePopup}
                      className="inline-flex items-center justify-center gap-2 bg-headline text-bg px-6 py-3.5 rounded-xl font-bold text-sm transition-all hover:scale-[1.02] active:scale-[0.98] group"
                    >
                      {notice.cta_text || 'View Announcement'}
                      <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  ) : (
                    <button
                      onClick={closePopup}
                      className="w-full bg-headline/10 text-headline px-6 py-3.5 rounded-xl font-bold text-sm transition-all hover:bg-headline/15"
                    >
                      Got it
                    </button>
                  )}

                  <button
                    onClick={dismissPermanently}
                    className="text-text-tertiary-dynamic hover:text-text-secondary-dynamic text-[10px] font-bold uppercase tracking-widest transition-colors w-full text-center py-1"
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
