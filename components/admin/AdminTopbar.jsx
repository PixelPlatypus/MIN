'use client'
import { useState, useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, Search, Settings, User, Clock, ChevronRight, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import ThemeToggle from '@/components/shared/ThemeToggle'

export default function AdminTopbar({ profile }) {
  const pathname = usePathname()
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    fetchNotifications()
    const interval = setInterval(fetchNotifications, 60000) // Polling every minute

    // Close on click outside
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      clearInterval(interval)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  async function fetchNotifications() {
    try {
      const res = await fetch('/api/admin/notifications')
      const data = await res.json()
      if (res.ok) {
        setNotifications(data.notifications || [])
        setUnreadCount(data.count || 0)
      }
    } catch (err) {
      console.error('Failed to fetch notifications:', err)
    }
  }

  // Map pathname to human-readable title
  const getPageTitle = (path) => {
    const parts = path.split('/').filter(p => p !== '')
    if (parts.length === 1 && parts[0] === 'admin') return 'Dashboard'
    if (parts.length > 1) {
      const lastPart = parts[parts.length - 1]
      // Handle IDs (usually UUIDs or numbers)
      if (lastPart.length > 20 || !isNaN(lastPart)) {
        const parentPart = parts[parts.length - 2]
        return `Editing ${parentPart.slice(0, -1)}` // Singularize roughly
      }
      return lastPart.charAt(0).toUpperCase() + lastPart.slice(1).replace(/-/g, ' ')
    }
    return 'Admin'
  }

  return (
    <header className="h-16 flex items-center justify-between px-6 bg-white dark:bg-bg-dark border-b border-border dark:border-border-dark transition-all duration-300 z-40">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold tracking-tight">{getPageTitle(pathname)}</h1>
        <div className="hidden lg:flex items-center gap-2 bg-bg-secondary dark:bg-white/5 px-3 py-1.5 rounded-xl border border-border dark:border-border-dark">
          <Search size={16} className="text-text-tertiary" />
          <input 
            type="text" 
            placeholder="Search dashboard..." 
            className="bg-transparent border-none text-xs focus:outline-none w-48 placeholder:text-text-tertiary"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <ThemeToggle />
        
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className={`p-2 rounded-xl transition-all relative group ${isOpen ? 'bg-primary/10 text-primary' : 'hover:bg-black/5 dark:hover:bg-white/5 text-text-secondary'}`}
          >
            <Bell size={20} className="transition-colors group-hover:text-primary" />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 bg-coral rounded-full ring-2 ring-white dark:ring-bg-dark" />
            )}
          </button>

          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-3 w-80 glass rounded-3xl shadow-2xl border border-border dark:border-border-dark overflow-hidden z-50"
              >
                <div className="p-4 border-b border-border dark:border-border-dark flex items-center justify-between bg-white/50 dark:bg-black/50 backdrop-blur-md">
                  <h3 className="font-bold text-sm">Notifications</h3>
                  {unreadCount > 0 && (
                    <span className="text-[10px] font-black bg-coral/10 text-coral px-2 py-0.5 rounded-full uppercase tracking-tighter">
                      {unreadCount} Actions
                    </span>
                  )}
                </div>

                <div className="max-h-[350px] overflow-y-auto py-2">
                  {notifications.length > 0 ? (
                    notifications.map((notif) => (
                      <Link
                        key={notif.id}
                        href={notif.href}
                        onClick={() => setIsOpen(false)}
                        className="flex items-start gap-3 p-4 hover:bg-black/5 dark:hover:bg-white/5 transition-all group"
                      >
                        <div className={`mt-0.5 p-2 rounded-xl ${notif.type === 'APPLICATION' ? 'bg-green/10 text-green' : 'bg-primary/10 text-primary'}`}>
                          <AlertCircle size={16} />
                        </div>
                        <div className="flex-1 space-y-1">
                          <p className="text-xs font-bold leading-none">{notif.title}</p>
                          <p className="text-[11px] text-text-secondary dark:text-text-secondary-dark line-clamp-2 leading-tight">
                            {notif.message}
                          </p>
                          <div className="flex items-center gap-1 text-[9px] text-text-tertiary">
                            <Clock size={10} />
                            {new Date(notif.time).toLocaleDateString()}
                          </div>
                        </div>
                        <ChevronRight size={14} className="mt-1 text-text-tertiary opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                      </Link>
                    ))
                  ) : (
                    <div className="px-6 py-12 text-center">
                      <div className="w-12 h-12 bg-bg-secondary dark:bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4 text-text-tertiary">
                        <Bell size={24} />
                      </div>
                      <p className="text-xs font-bold">All caught up!</p>
                      <p className="text-[10px] text-text-tertiary">No new notifications at the moment.</p>
                    </div>
                  )}
                </div>

                <Link
                  href="/admin/analytics"
                  onClick={() => setIsOpen(false)}
                  className="block p-4 text-center text-xs font-bold text-primary hover:bg-primary/5 transition-all border-t border-border dark:border-border-dark"
                >
                  View All Activity
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="h-6 w-px bg-border dark:bg-border-dark mx-2" />
        <div className="flex items-center gap-3 bg-bg-secondary dark:bg-white/5 px-3 py-1.5 rounded-xl border border-border dark:border-border-dark">
          <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">
            {profile.name?.[0]?.toUpperCase() || profile.email?.[0]?.toUpperCase()}
          </div>
          <span className="text-xs font-bold truncate max-w-[100px]">{profile.name}</span>
        </div>
      </div>
    </header>
  )
}
