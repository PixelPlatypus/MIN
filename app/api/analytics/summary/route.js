// app/api/analytics/summary/route.js
import { withRole } from '@/lib/rbac'

export async function GET() {
  const { supabase, error } = await withRole(['ADMIN', 'MANAGER', 'WEBSITE_MANAGER'])
  if (error) return Response.json({ error: error.message }, { status: error.status })

  try {
    // 1. Total active members
    const { count: membersCount } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })

    // 2. Active programs
    const { count: programsCount } = await supabase
      .from('programs')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'ACTIVE')

    // 3. Pending applications
    const { count: pendingAppsCount } = await supabase
      .from('join_applications')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'PENDING')

    // 4. Total content items
    const { count: contentCount } = await supabase
      .from('content')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'PUBLISHED')
      
    return Response.json({
      members: membersCount || 0,
      programs: programsCount || 0,
      pendingApplications: pendingAppsCount || 0,
      contentItems: contentCount || 0
    })
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 })
  }
}
