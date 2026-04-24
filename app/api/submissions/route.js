import { createClient, createAdminClient } from '@/lib/supabase/server'
import { rateLimit } from '@/lib/rateLimit'
import { logAudit } from '@/lib/audit'
import { sanitizeObject } from '@/lib/security'
import { sendEmail, generateMINThemeEmail, sendTemplatedEmail } from '@/lib/resend'
import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    // Rate limit: 3 submissions per hour per IP
    const limitCount = process.env.NODE_ENV === 'development' ? 500 : 3;
    try {
      const limited = await rateLimit(request, { requests: limitCount, window: '1h' })
      if (limited) {
        return NextResponse.json({ error: 'Too many requests. Please try again in an hour.' }, { status: 429 })
      }
    } catch (rlError) {
      console.error('Rate limit failed (check Upstash config):', rlError)
      // Continue without rate limiting if config is broken
    }

    const supabaseAdmin = await createAdminClient()
    let body = await request.json()
    body = sanitizeObject(body)

    // Basic server-side validation
    const { submitter_name, submitter_email, title, type, content_type } = body
    if (!submitter_name || !submitter_email || !title || !type || !content_type) {
      return NextResponse.json({ 
        error: 'Missing required fields: ' + [!submitter_name && 'name', !submitter_email && 'email', !title && 'title', !type && 'type', !content_type && 'content_type'].filter(Boolean).join(', ') 
      }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin
      .from('content_submissions')
      .insert([body])
      .select()
      .single()

    if (error) {
      console.error('Database insert error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Notify admin via Resend
    try {
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
      await sendTemplatedEmail('submission_received', submitter_email, {
        applicant_name: submitter_name,
        content_title: title
      })
    } catch (mailErr) {
      console.error('Submission notification email failed:', mailErr)
    }

    return NextResponse.json({ success: true, data })
  } catch (fatalError) {
    console.error('Fatal submission error:', fatalError)
    return NextResponse.json({ error: 'Internal Server Error', message: fatalError.message }, { status: 500 })
  }
}

export async function GET(request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data: profile } = await supabase
      .from('profiles').select('role').eq('id', user.id).single()
    
    if (!profile || !['ADMIN', 'MANAGER', 'WRITER', 'WEBSITE_MANAGER'].includes(profile.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { data, error } = await supabase
      .from('content_submissions')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (err) {
    console.error('GET submissions error:', err)
    return NextResponse.json({ error: 'Internal Server Error', message: err.message }, { status: 500 })
  }
}

