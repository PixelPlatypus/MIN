import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminTopbar from '@/components/admin/AdminTopbar'
import AdminLayoutClient from '@/components/admin/AdminLayoutClient'
import { SidebarProvider } from '@/components/admin/SidebarProvider'
import NetworkResilience from '@/components/shared/NetworkResilience'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export const metadata = {
  title: {
    template: '%s | MIN Admin',
    default: 'Dashboard | MIN Admin'
  },
  robots: {
    index: false,
    follow: false
  }
}

export default async function AdminLayout({ children }) {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect('/login')
  }

  // Fetch full profile from the database
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (profileError || !profile) {
    console.error('Failed to fetch admin profile:', profileError || 'No profile found')
    redirect('/login?error=profile_not_found')
  }

  return (
    <SidebarProvider>
      <NetworkResilience />
      <AdminLayoutClient 
        sidebar={<AdminSidebar profile={profile} />}
        topbar={<AdminTopbar profile={profile} />}
      >
        {children}
      </AdminLayoutClient>
    </SidebarProvider>
  )
}
