// app/api/admin/notifications/route.js
import { withRole } from '@/lib/rbac'

export async function GET() {
  const { supabase, error } = await withRole(['ADMIN', 'MANAGER', 'WEBSITE_MANAGER'])
  if (error) return Response.json({ error: error.message }, { status: error.status })

  try {
    // 1. Get pending applications
    // 1. Get pending applications
    const { data: apps } = await supabase
      .from('join_applications')
      .select('id, name, type, created_at')
      .eq('status', 'PENDING')
      .order('created_at', { ascending: false })
      .limit(5)

    // 2. Get pending content submissions
    const { data: submissions } = await supabase
      .from('content_submissions')
      .select('id, title, type, submitter_name, created_at')
      .eq('status', 'PENDING')
      .order('created_at', { ascending: false })
      .limit(5)

    // Format for notifications list
    const notifications = [
      ...(apps || []).map(a => ({
        id: `app-${a.id}`,
        title: 'New Application',
        message: `${a.name} applied as ${a.type}`,
        time: a.created_at,
        type: 'APPLICATION',
        href: `/admin/applications/${a.id}`
      })),
      ...(submissions || []).map(s => ({
        id: `submission-${s.id}`,
        title: 'New Content Submission',
        message: `"${s.title}" from ${s.submitter_name}`,
        time: s.created_at,
        type: 'SUBMISSION',
        href: `/admin/submissions/${s.id}`
      }))
    ].sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 10)

    return Response.json({
      notifications,
      count: notifications.length
    })
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 })
  }
}
