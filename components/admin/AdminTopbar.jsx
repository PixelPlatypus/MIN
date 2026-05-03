'use client'
import { useState, useEffect, useRef } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, MagnifyingGlass, Gear, User, Clock, CaretRight, WarningCircle, List, SignOut } from '@phosphor-icons/react'
import Link from 'next/link'
import ThemeToggle from '@/components/shared/ThemeToggle'
import { useSidebar } from './SidebarProvider'

import AdminSearch from './AdminSearch'
export default function AdminTopbar({ profile, isMaintenance }) {
  const pathname = usePathname()
  const { toggleMobile } = useSidebar()
  const router = useRouter()
  const supabase = createClient()
  
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isOpen, setIsOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [readNotifs, setReadNotifs] = useState([])
  
  const dropdownRef = useRef(null)
  const profileDropdownRef = useRef(null)

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
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(e.target)) {
        setIsProfileOpen(false)
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

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
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
          className="lg:hidden p-2 rounded-xl hover:bg-bg-secondary dark:hover:bg-white/5 text-auto-secondary transition-all"
        >
          <List size={20} />
        </button>
        <h1 className="text-xl font-bold tracking-tight">{getPageTitle(pathname)}</h1>
        {isMaintenance && (
          <div className="flex items-center gap-2 bg-rose-500/10 text-rose-500 px-3 py-1.5 rounded-xl border border-rose-500/20 animate-pulse">
            <WarningCircle size={14} />
            <span className="text-[10px] font-black uppercase tracking-widest">Maintenance Active</span>
          </div>
        )}
        <AdminSearch />
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
                          <WarningCircle size={20} />
                        </div>
                        <div className="flex-1 space-y-1 pr-6">
                          <p className="text-xs font-bold leading-none">{notif.title}</p>
                          <p className="text-[11px] text-auto-secondary line-clamp-2 leading-tight">
                            {notif.message}
                          </p>
                          <div className="flex items-center gap-1 text-[9px] text-auto-tertiary">
                            <Clock size={10} />
                            {new Date(notif.time).toLocaleDateString()}
                          </div>
                        </div>
                        <button 
                          onClick={(e) => markAsRead(e, notif.id)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-black/5 dark:bg-white/5 hover:bg-primary hover:text-white rounded-full text-auto-tertiary opacity-0 group-hover:opacity-100 transition-all z-10"
                          title="Mark as read"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        </button>
                      </Link>
                    ))
                  ) : (
                    <div className="px-6 py-12 text-center">
                      <div className="w-12 h-12 bg-bg-secondary dark:bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4 text-auto-tertiary">
                        <Bell size={24} />
                      </div>
                      <p className="text-xs font-bold">All caught up!</p>
                      <p className="text-[10px] text-auto-tertiary">No new notifications at the moment.</p>
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
        
        <div className="relative" ref={profileDropdownRef}>
          <button 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className={`flex items-center gap-3 bg-bg-secondary dark:bg-white/5 px-3 py-1.5 rounded-xl border transition-all duration-200 group ${
              isProfileOpen ? 'ring-2 ring-primary border-primary shadow-lg shadow-primary/10' : 'border-border dark:border-border-dark hover:shadow-md'
            }`}
          >
            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary group-hover:bg-primary group-hover:text-white transition-all">
              {profile.name?.[0]?.toUpperCase() || profile.email?.[0]?.toUpperCase()}
            </div>
            <span className="text-xs font-bold truncate max-w-[100px] hidden sm:inline">{profile.name}</span>
            <CaretRight size={14} className={`text-auto-tertiary transition-transform duration-300 ${isProfileOpen ? 'rotate-90' : ''}`} />
          </button>

          <AnimatePresence>
            {isProfileOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-3 w-56 glass rounded-[2rem] shadow-2xl border border-border dark:border-border-dark overflow-hidden z-50 p-2"
              >
                <div className="p-4 border-b border-border dark:border-border-dark mb-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-auto-tertiary mb-1">Authenticated as</p>
                  <p className="text-xs font-bold truncate">{profile.email}</p>
                </div>

                <div className="space-y-1">
                  <Link
                    href="/admin/settings/account"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-3 p-3 rounded-2xl hover:bg-black/5 dark:hover:bg-white/5 transition-all group"
                  >
                    <div className="p-2 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-all">
                      <Gear size={20} />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-bold leading-none">My Account</p>
                      <p className="text-[9px] text-auto-tertiary font-medium">Profile Settings</p>
                    </div>
                  </Link>
                  
                  <Link
                    href="/admin/settings/account#password"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-3 p-3 rounded-2xl hover:bg-black/5 dark:hover:bg-white/5 transition-all group"
                  >
                    <div className="p-2 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-all">
                      <Lock size={20} />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-bold leading-none">Change Password</p>
                      <p className="text-[9px] text-auto-tertiary font-medium">Update Credentials</p>
                    </div>
                  </Link>

                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-coral/10 transition-all group"
                  >
                    <div className="p-2 rounded-xl bg-coral/10 text-coral group-hover:bg-coral group-hover:text-white transition-all">
                      <SignOut size={14} />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="text-xs font-bold leading-none text-coral">Sign Out</p>
                      <p className="text-[9px] text-coral/60 font-medium">End Session</p>
                    </div>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  )
}
