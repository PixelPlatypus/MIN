import { createClient } from '@/lib/supabase/server'
import { 
  Users, 
  Calendar, 
  FileText, 
  TrendingUp, 
  Clock, 
  ArrowUpRight, 
  ArrowDownRight,
  MoreVertical,
  AlertCircle
} from 'lucide-react'

export default async function AdminDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
  const dateStr = sevenDaysAgo.toISOString()

  // Fetch real-time stats and growth
  const [
    { count: contentCount },
    { count: newContentCount },
    { count: eventsCount },
    { count: newEventsCount },
    { count: teamCount },
    { count: newTeamCount },
    { count: applicationsCount },
    { count: newAppsCount },
    { data: recentAudit },
    settingsData
  ] = await Promise.all([
    supabase.from('content').select('*', { count: 'exact', head: true }),
    supabase.from('content').select('*', { count: 'exact', head: true }).gt('created_at', dateStr),
    supabase.from('events').select('*', { count: 'exact', head: true }).eq('status', 'PUBLISHED'),
    supabase.from('events').select('*', { count: 'exact', head: true }).eq('status', 'PUBLISHED').gt('created_at', dateStr),
    supabase.from('team_members').select('*', { count: 'exact', head: true }).eq('is_active', true),
    supabase.from('team_members').select('*', { count: 'exact', head: true }).eq('is_active', true).gt('created_at', dateStr),
    supabase.from('join_applications').select('*', { count: 'exact', head: true }).eq('status', 'PENDING'),
    supabase.from('join_applications').select('*', { count: 'exact', head: true }).eq('status', 'PENDING').gt('created_at', dateStr),
    supabase.from('audit_log').select('*').order('created_at', { ascending: false }).limit(5),
    supabase.from('site_settings').select('is_maintenance_mode').eq('id', 'main').single()
  ])

  const isMaintenance = settingsData?.data?.is_maintenance_mode

  // Helper to calculate pseudo-trend
  const getTrend = (newItemCount, total) => {
    if (!total || total === 0) return { change: '0', trend: 'neutral' }
    if (!newItemCount || newItemCount === 0) return { change: '0', trend: 'neutral' }
    const percent = Math.round((newItemCount / (total - newItemCount || 1)) * 100)
    return { 
      change: `+${percent}%`, 
      trend: percent > 0 ? 'up' : 'neutral' 
    }
  }

  const contentTrend = getTrend(newContentCount, contentCount)
  const eventTrend = getTrend(newEventsCount, eventsCount)
  const teamTrend = getTrend(newTeamCount, teamCount)
  const appTrend = { change: `+${newAppsCount || 0}`, trend: (newAppsCount || 0) > 0 ? 'up' : 'neutral' }

  const stats = [
    { 
      label: 'Total Content', 
      value: contentCount || 0, 
      change: contentTrend.change, 
      trend: contentTrend.trend, 
      icon: <FileText className="text-primary" />,
      color: 'bg-primary/10'
    },
    { 
      label: 'Active Events', 
      value: eventsCount || 0, 
      change: eventTrend.change, 
      trend: eventTrend.trend, 
      icon: <Calendar className="text-cyan" />,
      color: 'bg-cyan/10'
    },
    { 
      label: 'Team Members', 
      value: teamCount || 0, 
      change: teamTrend.change, 
      trend: teamTrend.trend, 
      icon: <Users className="text-purple" />,
      color: 'bg-purple/10'
    },
    { 
      label: 'New Applications', 
      value: applicationsCount || 0, 
      change: appTrend.change, 
      trend: appTrend.trend, 
      icon: <TrendingUp className="text-green" />,
      color: 'bg-green/10'
    },
  ]

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight mb-1">Welcome back, {user?.email?.split('@')[0]}</h2>
          <p className="text-text-secondary dark:text-text-secondary-dark text-sm">
            Here's what's happening with MIN this week.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Analytics integrations coming soon */}
        </div>
      </div>

      {isMaintenance && (
        <div className="p-6 rounded-[2.5rem] bg-rose-500/10 border border-rose-500/20 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-rose-500/5 animate-in slide-in-from-top-4 duration-500">
           <div className="flex items-center gap-5">
              <div className="w-14 h-14 bg-rose-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-rose-500/20 animate-pulse">
                 <AlertCircle size={32} />
              </div>
              <div className="space-y-1">
                 <h3 className="text-xl font-black text-rose-600">Site Maintenance Active</h3>
                 <p className="text-sm text-rose-600/70 font-medium">Public users are currently seeing the maintenance landing page.</p>
              </div>
           </div>
           <a 
             href="/admin/settings" 
             className="px-8 py-3 bg-rose-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-rose-500/20 hover:bg-rose-600 transition-all active:scale-95"
           >
             Go to Settings
           </a>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="glass rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${stat.color} rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110`}>
                {stat.icon}
              </div>
              <button className="text-text-tertiary hover:text-text-primary transition-colors">
                <MoreVertical size={18} />
              </button>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium text-text-tertiary dark:text-text-tertiary-dark uppercase tracking-wider">
                {stat.label}
              </p>
              <div className="flex items-end gap-3">
                <h3 className="text-3xl font-bold tracking-tight">{stat.value}</h3>
                <div className={`flex items-center gap-0.5 text-xs font-bold mb-1 ${
                  stat.trend === 'up' ? 'text-green' : stat.trend === 'down' ? 'text-coral' : 'text-text-tertiary'
                }`}>
                  {stat.trend === 'up' && <ArrowUpRight size={14} />}
                  {stat.trend === 'down' && <ArrowDownRight size={14} />}
                  {stat.change}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass rounded-3xl p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-bold mb-1">Recent Activity</h3>
              <p className="text-xs text-text-tertiary">Latest actions across the platform</p>
            </div>
            <button className="text-xs font-semibold text-primary hover:underline">View All</button>
          </div>
          
          <div className="space-y-6">
            {!recentAudit || recentAudit.length === 0 ? (
              <p className="text-xs text-text-tertiary py-8 text-center">No recent activity found.</p>
            ) : (
              recentAudit.map((log) => (
                <div key={log.id} className="flex items-start gap-4 group">
                  <div className="w-10 h-10 rounded-full bg-bg-secondary dark:bg-white/5 flex items-center justify-center flex-shrink-0">
                    <Clock size={18} className="text-text-tertiary" />
                  </div>
                  <div className="flex-1 border-b border-border dark:border-border-dark pb-6 group-last:border-none group-last:pb-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-bold">{log.action.replace(/_/g, ' ')}</p>
                      <span className="text-[10px] text-text-tertiary">
                        {new Date(log.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs text-text-secondary dark:text-text-secondary-dark">
                      <span className="font-semibold text-primary">{log.actor_name || 'System'}</span> performed an action on {log.entity_type}.
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="glass rounded-3xl p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-bold mb-1">Quick Actions</h3>
              <p className="text-xs text-text-tertiary">Commonly used tasks</p>
            </div>
          </div>
          
          <div className="space-y-3">
            {[
              { label: 'Create Content', icon: <FileText size={16} />, color: 'bg-primary', href: '/admin/content/new' },
              { label: 'New Event', icon: <Calendar size={16} />, color: 'bg-cyan', href: '/admin/events/new' },
              { label: 'Add Team Member', icon: <Users size={16} />, color: 'bg-purple', href: '/admin/team/new' },
            ].map((action) => (
              <a 
                href={action.href}
                key={action.label}
                className="w-full flex items-center justify-between p-4 rounded-2xl bg-bg-secondary dark:bg-white/5 hover:bg-bg-tertiary dark:hover:bg-white/10 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 ${action.color} text-white rounded-lg flex items-center justify-center`}>
                    {action.icon}
                  </div>
                  <span className="text-sm font-semibold">{action.label}</span>
                </div>
                <ArrowRight size={16} className="text-text-tertiary transition-transform group-hover:translate-x-1" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}


function ArrowRight({ size, className }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  )
}
