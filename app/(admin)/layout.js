import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminTopbar from '@/components/admin/AdminTopbar'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

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
    <div className="flex h-screen bg-bg-secondary dark:bg-bg-secondary-dark overflow-hidden transition-colors">
      <AdminSidebar profile={profile} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <AdminTopbar profile={profile} />
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
