'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
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
  ChevronRight
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const navGroups = [
  {
    title: 'Overview',
    roles: ['ADMIN', 'MANAGER'],
    links: [
      { name: 'Dashboard', href: '/admin', icon: <LayoutDashboard size={20} /> },
    ]
  },
  {
    title: 'Content',
    roles: ['ADMIN', 'MANAGER', 'WRITER'],
    links: [
      { name: 'Library', href: '/admin/content', icon: <Library size={20} />, roles: ['ADMIN', 'MANAGER', 'WRITER'] },
      { name: 'Submissions', href: '/admin/submissions', icon: <Send size={20} />, roles: ['ADMIN', 'MANAGER', 'WRITER'] },
      { name: 'New Content', href: '/admin/content/new', icon: <PlusCircle size={20} />, roles: ['ADMIN', 'MANAGER', 'WRITER'] },
    ]
  },
  {
    title: 'Management',
    roles: ['ADMIN', 'MANAGER'],
    links: [
      { name: 'Events', href: '/admin/events', icon: <Calendar size={20} /> },
      { name: 'Team', href: '/admin/team', icon: <Users size={20} /> },
      { name: 'Gallery', href: '/admin/gallery', icon: <ImageIcon size={20} /> },
    ]
  },
  {
    title: 'Applications',
    roles: ['ADMIN', 'MANAGER'],
    links: [
      { name: 'Join Us', href: '/admin/applications', icon: <UserPlus size={20} /> },
      { name: 'Form Builder', href: '/admin/applications/builder', icon: <Layers size={20} /> },
      { name: 'Pop-up Notices', href: '/admin/notices', icon: <Bell size={20} />, roles: ['ADMIN'] },
    ]
  },
  {
    title: 'System',
    roles: ['ADMIN'],
    links: [
      { name: 'Users', href: '/admin/users', icon: <Users size={20} /> },
      { name: 'Audit Log', href: '/admin/audit', icon: <History size={20} /> },
    ]
  }
]

export default function AdminSidebar({ profile }) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

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

  return (
    <aside className="w-64 flex flex-col bg-white dark:bg-bg-dark border-r border-border dark:border-border-dark transition-all duration-300">
      <div className="p-6">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-lg shadow-primary/20">
            <span className="text-secondary font-bold text-2xl">M</span>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg leading-tight tracking-tight">MIN Admin</span>
            <span className="text-[10px] text-primary font-semibold uppercase tracking-widest">{profile.role}</span>
          </div>
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto px-4 py-2 space-y-8 scrollbar-hide">
        {filteredGroups.map((group) => (
          <div key={group.title} className="space-y-2">
            <h4 className="px-3 text-[10px] font-bold text-text-tertiary dark:text-text-tertiary-dark uppercase tracking-widest">
              {group.title}
            </h4>
            <div className="space-y-1">
              {group.links.map((link) => {
                const isActive = pathname === link.href || (link.href !== '/admin' && pathname.startsWith(link.href))
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                      isActive 
                        ? 'bg-primary text-white shadow-md shadow-primary/20' 
                        : 'text-text-secondary dark:text-text-secondary-dark hover:bg-bg-secondary dark:hover:bg-white/5 hover:text-primary'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`${isActive ? 'text-white' : 'text-text-tertiary dark:text-text-tertiary-dark group-hover:text-primary'} transition-colors`}>
                        {link.icon}
                      </span>
                      {link.name}
                    </div>
                    {isActive && (
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
        <div className="bg-bg-secondary dark:bg-white/5 rounded-2xl p-4 mb-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold">
              {profile.name?.[0]?.toUpperCase() || profile.email?.[0]?.toUpperCase()}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-bold truncate">{profile.name}</span>
              <span className="text-[10px] text-text-tertiary truncate">{profile.email}</span>
            </div>
          </div>
          <button 
            onClick={handleSignOut}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold text-coral bg-coral/10 hover:bg-coral/20 transition-all border border-coral/20"
          >
            <LogOut size={14} />
            Sign Out
          </button>
        </div>
      </div>
    </aside>
  )
}
