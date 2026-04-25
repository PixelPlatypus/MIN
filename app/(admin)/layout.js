import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminTopbar from '@/components/admin/AdminTopbar'
import AdminLayoutClient from '@/components/admin/AdminLayoutClient'
import OnboardingTour from '@/components/admin/OnboardingTour'
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
    .select('*, has_completed_onboarding')
    .eq('id', user.id)
    .single()

  if (profileError || !profile) {
    console.error('Failed to fetch admin profile:', profileError || 'No profile found')
    redirect('/login?error=profile_not_found')
  }

  // Fetch maintenance status
  const { data: settings } = await supabase
    .from('site_settings')
    .select('is_maintenance_mode')
    .eq('id', 'main')
    .single()

  return (
    <SidebarProvider>
      <NetworkResilience />
      {!profile.has_completed_onboarding && (
        <OnboardingTour role={profile.role} profileName={profile.name} />
      )}
      <AdminLayoutClient 
        sidebar={<AdminSidebar profile={profile} isMaintenance={settings?.is_maintenance_mode} />}
        topbar={<AdminTopbar profile={profile} isMaintenance={settings?.is_maintenance_mode} />}
      >
        {children}
      </AdminLayoutClient>
    </SidebarProvider>
  )
}
