// app/api/admin/notifications/route.js
import { withRole } from '@/lib/rbac'

export async function GET() {
  const { supabase, error } = await withRole(['ADMIN', 'MANAGER'])
  if (error) return Response.json({ error: error.message }, { status: error.status })

  try {
    // 1. Get pending applications
    const { data: apps } = await supabase
      .from('join_applications')
      .select('id, name, role_type, created_at')
      .eq('status', 'PENDING')
      .order('created_at', { ascending: false })
      .limit(5)

    // 2. Get pending content submissions (if the table exists and uses status=PENDING or DRAFT)
    const { data: content } = await supabase
      .from('content')
      .select('id, title, type, created_at')
      .eq('status', 'DRAFT')
      .order('created_at', { ascending: false })
      .limit(5)

    // Format for notifications list
    const notifications = [
      ...(apps || []).map(a => ({
        id: `app-${a.id}`,
        title: 'New Application',
        message: `${a.name} applied for ${a.role_type}`,
        time: a.created_at,
        type: 'APPLICATION',
        href: `/admin/applications/${a.id}`
      })),
      ...(content || []).map(c => ({
        id: `content-${c.id}`,
        title: 'Content Review',
        message: `New ${c.type.toLowerCase()} draft: ${c.title}`,
        time: c.created_at,
        type: 'CONTENT',
        href: `/admin/content/${c.id}`
      }))
    ].sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 5)

    return Response.json({
      notifications,
      count: notifications.length
    })
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 })
  }
}
