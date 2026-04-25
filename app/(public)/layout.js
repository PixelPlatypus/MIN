export const revalidate = 0;
import Navbar from '@/components/public/Navbar'
import Footer from '@/components/public/Footer'
import PageTransition from '@/components/public/PageTransition'
import ScrollToTop from '@/components/public/ScrollToTop'
import { createClient } from '@/lib/supabase/server'
import MaintenanceView from '@/components/public/MaintenanceView'

export default async function PublicLayout({ children }) {
  const supabase = await createClient()
  
  // Parallel fetch for settings and user
  const [
    { data: settings },
    { data: { user } }
  ] = await Promise.all([
    supabase.from('site_settings').select('is_maintenance_mode').eq('id', 'main').single(),
    supabase.auth.getUser()
  ])

  if (settings?.is_maintenance_mode) {
    let isAdmin = false

    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()
      
      if (['ADMIN', 'WEBSITE_MANAGER'].includes(profile?.role)) {
        isAdmin = true
      }
    }

    if (!isAdmin) {
      return <MaintenanceView />
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      {settings?.is_maintenance_mode && (
        <div className="bg-rose-600 text-white text-[9px] font-black uppercase tracking-[0.2em] py-1.5 text-center sticky top-0 z-[100] shadow-lg">
           Site Maintenance Active — Administrative Preview Only
        </div>
      )}
      <Navbar />
      <main className="flex-grow">
        <PageTransition>
          {children}
        </PageTransition>
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  )
}
