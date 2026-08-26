// app/api/admin/notifications/route.js
import { createAdminClient } from '@/lib/supabase/server'
import { withRole } from '@/lib/rbac'

export const dynamic = 'force-dynamic'

export async function GET() {
  const { error } = await withRole(['ADMIN', 'SUPER_ADMIN', 'MANAGER', 'WEBSITE_MANAGER', 'HR'])
  if (error) return Response.json({ error: error.message }, { status: error.status })

  try {
    const supabase = await createAdminClient()

    // 1. Get pending contact inquiries
    const { data: inquiries, count: inqCount } = await supabase
      .from('inquiries')
      .select('id, name, email, subject, message, created_at', { count: 'exact' })
      .eq('status', 'PENDING')
      .order('created_at', { ascending: false })
      .limit(10)

    // 2. Get pending recruitment applications
    const { data: apps, count: appCount } = await supabase
      .from('join_applications')
      .select('id, name, type, created_at', { count: 'exact' })
      .eq('status', 'PENDING')
      .order('created_at', { ascending: false })
      .limit(10)

    // 3. Get pending form submissions (if dynamic forms active)
    const { count: formSubCount } = await supabase
      .from('form_submissions')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'PENDING')

    // 4. Get pending content submissions
    const { data: submissions, count: subCount } = await supabase
      .from('content_submissions')
      .select('id, title, type, submitter_name, created_at', { count: 'exact' })
      .eq('status', 'PENDING')
      .order('created_at', { ascending: false })
      .limit(10)

    const pendingInquiries = inqCount || (inquiries?.length || 0)
    const pendingApps = (appCount || 0) + (formSubCount || 0)
    const pendingSubmissions = subCount || (submissions?.length || 0)
    const totalCount = pendingInquiries + pendingApps + pendingSubmissions

    // Format consolidated notification feed
    const notifications = [
      ...(inquiries || []).map(i => ({
        id: `inq-${i.id}`,
        title: 'New Contact Inquiry',
        message: `From ${i.name}: "${i.subject || i.message?.substring(0, 40) + '...'}"`,
        time: i.created_at,
        type: 'INQUIRY',
        href: `/admin/inquiries`
      })),
      ...(apps || []).map(a => ({
        id: `app-${a.id}`,
        title: 'New Candidate Application',
        message: `${a.name} applied for ${a.type || 'Role'}`,
        time: a.created_at,
        type: 'APPLICATION',
        href: `/admin/applications`
      })),
      ...(submissions || []).map(s => ({
        id: `submission-${s.id}`,
        title: 'New Content Submission',
        message: `"${s.title}" from ${s.submitter_name}`,
        time: s.created_at,
        type: 'SUBMISSION',
        href: `/admin/submissions`
      }))
    ].sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 15)

    return Response.json({
      notifications,
      count: totalCount,
      counts: {
        inquiries: pendingInquiries,
        applications: pendingApps,
        submissions: pendingSubmissions,
        total: totalCount
      }
    })
  } catch (err) {
    console.error('Notifications fetch error:', err)
    return Response.json({ error: err.message }, { status: 500 })
  }
}
