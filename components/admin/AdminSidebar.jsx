'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { useSidebar } from './SidebarProvider'
import { 
  LayoutDashboard, 
  FileText, 
  Calendar, 
  Layers, 
  Users, 
  Image as ImageIcon, 
  Send, 
  Award, 
  Bell, 
  UserPlus, 
  BarChart3, 
  History,
  LogOut,
  PlusCircle,
  Library,
  Globe,
  ChevronRight,
  ChevronLeft,
  Menu,
  X,
  Calculator,
  LayoutList,
  Mail
} from 'lucide-react'

const navGroups = [
  {
    title: 'Overview',
    roles: ['ADMIN', 'MANAGER', 'WEBSITE_MANAGER'],
    links: [
      { name: 'Dashboard', href: '/admin', icon: <LayoutDashboard size={20} /> },
    ]
  },
  {
    title: 'Content',
    roles: ['ADMIN', 'MANAGER', 'WRITER', 'WEBSITE_MANAGER'],
    links: [
      { name: 'Library', href: '/admin/content', icon: <Library size={20} />, roles: ['ADMIN', 'MANAGER', 'WRITER', 'WEBSITE_MANAGER'] },
      { name: 'Submissions', href: '/admin/submissions', icon: <Send size={20} />, roles: ['ADMIN', 'MANAGER', 'WRITER', 'WEBSITE_MANAGER'] },
      { name: 'New Content', href: '/admin/content/new', icon: <PlusCircle size={20} />, roles: ['ADMIN', 'MANAGER', 'WRITER', 'WEBSITE_MANAGER'] },
    ]
  },
  {
    title: 'Management',
    roles: ['ADMIN', 'MANAGER', 'WEBSITE_MANAGER'],
    links: [
      { name: 'Programs', href: '/admin/programs', icon: <Layers size={20} /> },
      { name: 'Events', href: '/admin/events', icon: <Calendar size={20} /> },
      { name: 'DMO Practice', href: '/admin/dmopractice', icon: <Calculator size={20} /> },
      { name: 'Team', href: '/admin/team', icon: <Users size={20} /> },
      { name: 'Gallery', href: '/admin/gallery', icon: <ImageIcon size={20} /> }
    ]
  },
  {
    title: 'Applications',
    roles: ['ADMIN', 'MANAGER', 'WEBSITE_MANAGER'],
    links: [
      { name: 'Join Us', href: '/admin/applications', icon: <UserPlus size={20} /> },
      { name: 'Inquiries', href: '/admin/inquiries', icon: <Mail size={20} /> },
      { name: 'Form Builder', href: '/admin/applications/builder', icon: <Layers size={20} /> },
      { name: 'Pop-up Notices', href: '/admin/notices', icon: <Bell size={20} />, roles: ['ADMIN', 'WEBSITE_MANAGER'] },
    ]
  },
  {
    title: 'Configuration',
    roles: ['ADMIN', 'WEBSITE_MANAGER'],
    links: [
      { name: 'Site Editor', href: '/admin/settings', icon: <Globe size={20} /> },
      { name: 'Users', href: '/admin/users', icon: <Users size={20} />, roles: ['ADMIN'] },
      { name: 'Audit Log', href: '/admin/audit', icon: <History size={20} />, roles: ['ADMIN'] },
    ]
  }
]

export default function AdminSidebar({ profile }) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const { isCollapsed, toggleCollapse, isMobileOpen, toggleMobile } = useSidebar()

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  const filteredGroups = navGroups.filter(group => 
    group.roles.includes(profile.role)
  ).map(group => ({
    ...group,
    links: group.links.filter(link => 
      !link.roles || link.roles.includes(profile.role)
    )
  })).filter(group => group.links.length > 0)

  const sidebarClasses = `
    fixed inset-y-0 left-0 z-50 flex flex-col bg-white dark:bg-bg-dark border-r border-border dark:border-border-dark transition-all duration-300 shadow-2xl lg:shadow-none
    ${isCollapsed ? 'w-20' : 'w-64'}
    ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
  `

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleMobile}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      <aside className={sidebarClasses}>
        {/* Header */}
        <div className={`p-6 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
          <Link href="/" className="flex items-center gap-3 group min-w-0">
            <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center transition-transform group-hover:scale-110 shadow-lg shadow-primary/20 rounded-full overflow-hidden bg-white/5">
              <img src="/images/logo.svg" alt="MIN Logo" className="w-full h-full object-cover" />
            </div>
            {!isCollapsed && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }} 
                animate={{ opacity: 1, x: 0 }}
                className="flex flex-col overflow-hidden"
              >
                <span className="font-bold text-lg leading-tight tracking-tight truncate">MIN Admin</span>
                <span className="text-[10px] text-primary font-semibold uppercase tracking-widest">{profile.role}</span>
              </motion.div>
            )}
          </Link>
          
          {/* Collapse Toggle for Desktop */}
          {!isCollapsed && (
            <button 
              onClick={toggleCollapse}
              className="hidden lg:flex p-1.5 rounded-lg hover:bg-bg-secondary dark:hover:bg-white/5 text-text-tertiary hover:text-primary transition-all ml-2"
            >
              <ChevronLeft size={18} />
            </button>
          )}
        </div>

        {isCollapsed && (
          <button 
            onClick={toggleCollapse}
            className="hidden lg:flex mx-auto mb-4 p-2 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all shadow-sm"
            title="Expand Sidebar"
          >
            <ChevronRight size={18} />
          </button>
        )}

        <nav className="flex-1 overflow-y-auto px-4 py-2 space-y-8 scrollbar-hide">
          {filteredGroups.map((group) => (
            <div key={group.title} className="space-y-2">
              {!isCollapsed && (
                <h4 className="px-3 text-[10px] font-bold text-text-tertiary dark:text-text-tertiary-dark uppercase tracking-widest whitespace-nowrap">
                  {group.title}
                </h4>
              )}
              {isCollapsed && <div className="h-px bg-border dark:bg-border-dark mx-2 opacity-50" />}
              
              <div className="space-y-1">
                {group.links.map((link) => {
                  const isExact = pathname === link.href
                  const isChild = link.href !== '/admin' && pathname.startsWith(link.href + '/')
                  // A sibling 'better' match exists if another link in the same group starts with the current pathname
                  // and is more specific (longer) than the current link.
                  const hasBetterMatch = group.links.some(
                    sibling => sibling.href !== link.href && pathname.startsWith(sibling.href) && sibling.href.length > link.href.length
                  )
                  const isActive = isExact || (isChild && !hasBetterMatch)
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                        isActive 
                          ? 'bg-primary text-white shadow-md shadow-primary/20' 
                          : 'text-text-secondary dark:text-text-secondary-dark hover:bg-bg-secondary dark:hover:bg-white/5 hover:text-primary'
                      }`}
                      title={isCollapsed ? link.name : ''}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`${isActive ? 'text-white' : 'text-text-tertiary dark:text-text-tertiary-dark group-hover:text-primary'} flex-shrink-0 transition-colors`}>
                          {link.icon}
                        </span>
                        {!isCollapsed && <span className="truncate">{link.name}</span>}
                      </div>
                      {!isCollapsed && isActive && (
                        <motion.div layoutId="active-indicator">
                          <ChevronRight size={14} className="opacity-50" />
                        </motion.div>
                      )}
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-border dark:border-border-dark">
          <div className={`bg-bg-secondary dark:bg-white/5 rounded-2xl p-4 mb-4 ${isCollapsed ? 'flex flex-col items-center' : ''}`}>
            <div className={`flex items-center gap-3 ${isCollapsed ? 'mb-0' : 'mb-4'}`}>
              <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex-shrink-0 flex items-center justify-center text-primary font-bold">
                {profile.name?.[0]?.toUpperCase() || profile.email?.[0]?.toUpperCase()}
              </div>
              {!isCollapsed && (
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-bold truncate">{profile.name}</span>
                  <span className="text-[10px] text-text-tertiary truncate">{profile.email}</span>
                </div>
              )}
            </div>
            
            {!isCollapsed && (
              <button 
                onClick={handleSignOut}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold text-coral bg-coral/10 hover:bg-coral/20 transition-all border border-coral/20"
              >
                <LogOut size={14} />
                Sign Out
              </button>
            )}
            {isCollapsed && (
               <button 
                onClick={handleSignOut}
                className="p-2 rounded-xl text-coral hover:bg-coral/10 transition-all mt-2"
                title="Sign Out"
              >
                <LogOut size={18} />
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  )
}
