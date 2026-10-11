export const revalidate = 60; // ISR: revalidate public pages every 60 seconds
import Navbar from '@/components/public/Navbar'
import Footer from '@/components/public/Footer'
import PageTransition from '@/components/public/PageTransition'
import ScrollToTop from '@/components/public/ScrollToTop'
import { getSiteSettings } from '@/lib/supabase/server'
import MaintenanceGate from '@/components/public/MaintenanceGate'

export default async function PublicLayout({ children }) {
  const settings = await getSiteSettings()

  const site = (
    <div className="flex flex-col min-h-screen">
      {settings?.is_maintenance_mode && (
        <div className="bg-rose-600 text-white text-[9px] font-black uppercase tracking-[0.2em] py-1.5 text-center sticky top-0 z-[100] shadow-lg">
           Site Maintenance Active — Administrative Preview Only
        </div>
      )}
      <Navbar settings={settings} />
      <main className="flex-grow">
        <PageTransition>
          {children}
        </PageTransition>
      </main>
      <Footer settings={settings} />
      <ScrollToTop />
    </div>
  )

  return settings?.is_maintenance_mode ? <MaintenanceGate>{site}</MaintenanceGate> : site
}
