'use client'
import { useEffect, useState } from 'react'
import MaintenanceView from '@/components/public/MaintenanceView'

// Role check runs in the browser so the public layout never reads cookies and stays cacheable.
// ponytail: this is a preview gate, not access control. Page data is public anyway.
export default function MaintenanceGate({ children }) {
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    // Imported on demand: a static import put the whole Supabase client in every public page's bundle
    import('@/lib/supabase/client').then(({ createClient }) => {
      const supabase = createClient()
      supabase.auth.getUser().then(async ({ data: { user } }) => {
        if (!user) return
        const { data } = await supabase.from('profiles').select('role').eq('id', user.id).single()
        setIsAdmin(['ADMIN', 'WEBSITE_MANAGER'].includes(data?.role))
      })
    })
  }, [])

  return isAdmin ? children : <MaintenanceView />
}
