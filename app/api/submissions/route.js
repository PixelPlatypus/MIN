// app/api/submissions/route.js
import { createClient, createAdminClient } from '@/lib/supabase/server'
import { rateLimit } from '@/lib/rateLimit'
import { logAudit } from '@/lib/audit'

export async function POST(request) {
  // Rate limit: 3 submissions per hour per IP (500 in dev for testing)
  const limitCount = process.env.NODE_ENV === 'development' ? 500 : 3;
  const limited = await rateLimit(request, { requests: limitCount, window: '1h' })
  if (limited) return Response.json({ error: 'Too many requests. Please try again in an hour.' }, { status: 429 })

  // Use admin client to bypass RLS — this is a public submission endpoint
  // The server-side admin client is safe and never exposed to the browser
  const { sanitizeObject } = await import('@/lib/security')
  const supabaseAdmin = await createAdminClient()
  let body = await request.json()
  body = sanitizeObject(body)

  // Basic server-side validation
  const { submitter_name, submitter_email, title, type, content_type } = body
  if (!submitter_name || !submitter_email || !title || !type || !content_type) {
    return Response.json({ error: 'Missing required fields.' }, { status: 400 })
  }

  const { data, error } = await supabaseAdmin
    .from('content_submissions')
    .insert([body])
    .select()
    .single()

  if (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }

  // Notify admin via Resend
  try {
    const { sendEmail, generateMINThemeEmail } = await import('@/lib/resend')
    
    // Fetch settings for signature
    const { data: settings } = await supabaseAdmin
      .from('site_settings')
      .select('*')
      .eq('id', 'main')
      .single()

    const adminHtml = await generateMINThemeEmail('New Content Submission', `
      <p>A new piece of content has been submitted and is awaiting your review.</p>
      <div style="background: #f4f4f4; padding: 24px; border-radius: 16px; margin: 24px 0;">
        <p style="margin: 0 0 10px 0;"><strong>Title:</strong> ${title}</p>
        <p style="margin: 0 0 10px 0;"><strong>From:</strong> ${submitter_name} (${submitter_email})</p>
        <p style="margin: 0;"><strong>Type:</strong> ${type}</p>
      </div>
      <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/submissions" style="display: inline-block; background-color: #4361ee; color: #ffffff; padding: 12px 24px; border-radius: 12px; text-decoration: none; font-weight: 700;">Review Submission</a></p>
    `, settings || {})

    await sendEmail({
      to: process.env.FROM_EMAIL || 'noreply@mathsinitiatives.org.np',
      from: `MIN Submissions <${process.env.FROM_EMAIL || 'noreply@mathsinitiatives.org.np'}>`,
      subject: `New Content Submission: "${title}"`,
      html: adminHtml
    })

    // Notify Submitter
    const { sendTemplatedEmail } = await import('@/lib/resend')
    await sendTemplatedEmail('submission_received', submitter_email, {
      applicant_name: submitter_name,
      content_title: title
    })
  } catch (mailErr) {
    console.error('Submission notification email failed:', mailErr)
  }

  return Response.json({ success: true, data })
}

export async function GET(request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profile } = await supabase
    .from('profiles').select('role').eq('id', user.id).single()
  
  if (!profile || !['ADMIN', 'MANAGER', 'WRITER', 'WEBSITE_MANAGER'].includes(profile.role)) {
    return Response.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { data, error } = await supabase
    .from('content_submissions')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }

  return Response.json(data)
}
