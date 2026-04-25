'use client'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, ChevronRight, LayoutDashboard, Library, Send, PlusCircle, Layers, Calendar, Calculator, Users, ImageIcon, UserPlus, Mail, Bell, Globe, History } from 'lucide-react'
import { useRouter } from 'next/navigation'

const SEARCH_ITEMS = [
  { name: 'Dashboard', href: '/admin', icon: <LayoutDashboard size={16} />, group: 'Overview' },
  { name: 'Content Library', href: '/admin/content', icon: <Library size={16} />, group: 'Content' },
  { name: 'Submissions', href: '/admin/submissions', icon: <Send size={16} />, group: 'Content' },
  { name: 'New Content', href: '/admin/content/new', icon: <PlusCircle size={16} />, group: 'Content' },
  { name: 'Programs', href: '/admin/programs', icon: <Layers size={16} />, group: 'Management' },
  { name: 'Events', href: '/admin/events', icon: <Calendar size={16} />, group: 'Management' },
  { name: 'DMO Practice', href: '/admin/dmopractice', icon: <Calculator size={16} />, group: 'Management' },
  { name: 'Team Management', href: '/admin/team', icon: <Users size={16} />, group: 'Management' },
  { name: 'Gallery', href: '/admin/gallery', icon: <ImageIcon size={16} />, group: 'Management' },
  { name: 'Join Applications', href: '/admin/applications', icon: <UserPlus size={16} />, group: 'Applications' },
  { name: 'Inquiries', href: '/admin/inquiries', icon: <Mail size={16} />, group: 'Applications' },
  { name: 'Form Builder', href: '/admin/applications/builder', icon: <Layers size={16} />, group: 'Applications' },
  { name: 'Pop-up Notices', href: '/admin/notices', icon: <Bell size={16} />, group: 'Applications' },
  { name: 'Site Editor', href: '/admin/settings', icon: <Globe size={16} />, group: 'Configuration' },
  { name: 'Intake Waitlist', href: '/admin/settings/waitlist', icon: <Bell size={16} />, group: 'Configuration' },
  { name: 'Users', href: '/admin/users', icon: <Users size={16} />, group: 'Configuration' },
  { name: 'Audit Log', href: '/admin/audit', icon: <History size={16} />, group: 'Configuration' },
]

export default function AdminSearch() {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const router = useRouter()
  const inputRef = useRef(null)

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsOpen(true)
      }
      if (e.key === 'Escape') {
        setIsOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100)
      setQuery('')
      setSelectedIndex(0)
    }
  }, [isOpen])

  const filteredItems = query.trim() === '' 
    ? SEARCH_ITEMS.slice(0, 5) 
    : SEARCH_ITEMS.filter(item => 
        item.name.toLowerCase().includes(query.toLowerCase()) || 
        item.group.toLowerCase().includes(query.toLowerCase())
      )

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(prev => (prev + 1) % filteredItems.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(prev => (prev - 1 + filteredItems.length) % filteredItems.length)
    } else if (e.key === 'Enter') {
      if (filteredItems[selectedIndex]) {
        handleNavigate(filteredItems[selectedIndex].href)
      }
    }
  }

  const handleNavigate = (href) => {
    router.push(href)
    setIsOpen(false)
  }

  return (
    <>
      {/* Search Trigger (The Topbar Bar) */}
      <div 
        onClick={() => setIsOpen(true)}
        className="hidden lg:flex items-center gap-2 bg-bg-secondary dark:bg-white/5 px-3 py-1.5 rounded-xl border border-border dark:border-border-dark cursor-pointer hover:border-primary/50 transition-all group"
      >
        <Search size={16} className="text-text-tertiary group-hover:text-primary transition-colors" />
        <div className="flex items-center justify-between w-48">
          <span className="text-xs text-text-tertiary select-none">Search dashboard...</span>
          <kbd className="hidden xl:inline-flex h-5 items-center gap-1 rounded border border-border bg-white/50 dark:bg-black/20 px-1.5 font-mono text-[10px] font-medium text-text-tertiary opacity-100">
            <span className="text-xs">⌘</span>K
          </kbd>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4 md:px-0">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-md"
            />
            
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="relative w-full max-w-xl glass rounded-[2.5rem] shadow-2xl border border-border dark:border-border-dark overflow-hidden bg-white/90 dark:bg-black/80"
            >
              <div className="flex items-center gap-4 px-6 py-5 border-b border-border dark:border-border-dark">
                <Search size={20} className="text-primary" />
                <input 
                  ref={inputRef}
                  type="text" 
                  placeholder="Search pages, actions, settings..." 
                  className="flex-1 bg-transparent border-none outline-none text-base font-medium placeholder:text-text-tertiary"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 hover:bg-bg-secondary dark:hover:bg-white/5 rounded-lg text-text-tertiary transition-all"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="max-h-[60vh] overflow-y-auto py-3 px-3 scrollbar-hide">
                {filteredItems.length > 0 ? (
                  <div className="space-y-1">
                    {filteredItems.map((item, index) => (
                      <button
                        key={item.href}
                        onClick={() => handleNavigate(item.href)}
                        onMouseEnter={() => setSelectedIndex(index)}
                        className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${
                          selectedIndex === index 
                            ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-[1.02]' 
                            : 'hover:bg-bg-secondary dark:hover:bg-white/5 text-text-secondary dark:text-text-secondary-dark'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                            selectedIndex === index ? 'bg-white/20' : 'bg-primary/10 text-primary'
                          }`}>
                            {item.icon}
                          </div>
                          <div className="text-left">
                            <p className="text-sm font-bold leading-none mb-1">{item.name}</p>
                            <p className={`text-[10px] uppercase tracking-widest font-black opacity-60`}>
                              {item.group}
                            </p>
                          </div>
                        </div>
                        <ChevronRight size={16} className={`opacity-0 ${selectedIndex === index ? 'opacity-100' : ''}`} />
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="py-20 text-center space-y-4">
                    <div className="w-16 h-16 bg-bg-secondary dark:bg-white/5 rounded-[2rem] flex items-center justify-center mx-auto text-text-tertiary">
                      <Search size={32} />
                    </div>
                    <p className="text-sm font-bold text-text-tertiary">No results found for "{query}"</p>
                  </div>
                )}
              </div>

              <div className="px-6 py-4 border-t border-border dark:border-border-dark flex items-center justify-between bg-bg-secondary/50 dark:bg-black/20">
                <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-text-tertiary">
                  <span className="flex items-center gap-1"><span className="bg-white dark:bg-white/10 px-1.5 py-0.5 rounded border border-border shadow-sm">↵</span> to select</span>
                  <span className="flex items-center gap-1"><span className="bg-white dark:bg-white/10 px-1.5 py-0.5 rounded border border-border shadow-sm">↑↓</span> to navigate</span>
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-primary/60">Forensic Search Ready</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
