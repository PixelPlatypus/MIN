'use client'
import { useState, useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, Search, Settings, User, Clock, ChevronRight, AlertCircle, Menu } from 'lucide-react'
import Link from 'next/link'
import ThemeToggle from '@/components/shared/ThemeToggle'
import { useSidebar } from './SidebarProvider'

export default function AdminTopbar({ profile }) {
  const pathname = usePathname()
  const { toggleMobile } = useSidebar()
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isOpen, setIsOpen] = useState(false)
  const [readNotifs, setReadNotifs] = useState([])
  const dropdownRef = useRef(null)

  useEffect(() => {
    const stored = localStorage.getItem('min_read_notifs')
    if (stored) {
      try { setReadNotifs(JSON.parse(stored)) } catch (e) {}
    }
    
    // Slight delay before first fetch to avoid race with auth/server startup
    const timer = setTimeout(fetchNotifications, 2000)
    const interval = setInterval(fetchNotifications, 60000)

    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      clearTimeout(timer)
      clearInterval(interval)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  async function fetchNotifications() {
    try {
      const res = await fetch('/api/admin/notifications')
      
      // If we get a network failure before JSON parsing
      if (!res.ok) {
        if (res.status === 403) {
          const data = await res.json()
          console.warn('Notifications permission:', data.error)
        }
        return
      }

      const data = await res.json()
      setNotifications(data.notifications || [])
      setUnreadCount(data.count || 0)
    } catch (err) {
      // Silence network errors to avoid intrusive console overlays in dev
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        console.debug('Notifications background fetch skipped (offline or server restarting)')
      } else {
        console.error('Failed to fetch notifications:', err)
      }
    }
  }

  const markAsRead = (e, notifId) => {
    e.preventDefault()
    e.stopPropagation()
    const updated = [...readNotifs, notifId]
    setReadNotifs(updated)
    localStorage.setItem('min_read_notifs', JSON.stringify(updated))
  }

  const visibleNotifications = notifications.filter(n => !readNotifs.includes(n.id))
  const actualUnreadCount = visibleNotifications.length

  const getPageTitle = (path) => {
    const parts = path.split('/').filter(p => p !== '')
    if (parts.length === 1 && parts[0] === 'admin') return 'Dashboard'
    if (parts.length > 1) {
      const lastPart = parts[parts.length - 1]
      if (lastPart.length > 20 || !isNaN(lastPart)) {
        const parentPart = parts[parts.length - 2]
        return `Editing ${parentPart.slice(0, -1)}`
      }
      return lastPart.charAt(0).toUpperCase() + lastPart.slice(1).replace(/-/g, ' ')
    }
    return 'Admin'
  }

  return (
    <header className="h-16 flex items-center justify-between px-6 bg-white dark:bg-bg-dark border-b border-border dark:border-border-dark transition-all duration-300 z-40 sticky top-0">
      <div className="flex items-center gap-4">
        <button 
          onClick={toggleMobile}
          className="lg:hidden p-2 rounded-xl hover:bg-bg-secondary dark:hover:bg-white/5 text-text-secondary transition-all"
        >
          <Menu size={20} />
        </button>
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
            className="w-10 h-10 bg-white dark:bg-bg-dark border border-border dark:border-border-dark rounded-xl flex items-center justify-center relative hover:bg-bg-secondary dark:hover:bg-white/5 transition-colors shadow-sm"
          >
            <Bell size={18} className="text-dynamic" />
            {actualUnreadCount > 0 && (
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-coral rounded-full ring-2 ring-white dark:ring-bg-dark" />
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
                  {actualUnreadCount > 0 && (
                    <span className="text-[10px] font-black bg-coral/10 text-coral px-2 py-0.5 rounded-full uppercase tracking-tighter">
                      {actualUnreadCount} Actions
                    </span>
                  )}
                </div>

                <div className="max-h-[350px] overflow-y-auto py-2">
                  {visibleNotifications.length > 0 ? (
                    visibleNotifications.map((notif) => (
                      <Link
                        key={notif.id}
                        href={notif.href}
                        onClick={() => setIsOpen(false)}
                        className="flex items-start gap-3 p-4 hover:bg-black/5 dark:hover:bg-white/5 transition-all group relative"
                      >
                        <div className={`mt-0.5 p-2 rounded-xl ${notif.type === 'APPLICATION' ? 'bg-green/10 text-green' : 'bg-primary/10 text-primary'}`}>
                          <AlertCircle size={16} />
                        </div>
                        <div className="flex-1 space-y-1 pr-6">
                          <p className="text-xs font-bold leading-none">{notif.title}</p>
                          <p className="text-[11px] text-text-secondary dark:text-text-secondary-dark line-clamp-2 leading-tight">
                            {notif.message}
                          </p>
                          <div className="flex items-center gap-1 text-[9px] text-text-tertiary">
                            <Clock size={10} />
                            {new Date(notif.time).toLocaleDateString()}
                          </div>
                        </div>
                        <button 
                          onClick={(e) => markAsRead(e, notif.id)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-black/5 dark:bg-white/5 hover:bg-primary hover:text-white rounded-full text-text-tertiary opacity-0 group-hover:opacity-100 transition-all z-10"
                          title="Mark as read"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        </button>
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
