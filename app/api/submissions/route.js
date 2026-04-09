// app/api/submissions/route.js
import { createClient, createAdminClient } from '@/lib/supabase/server'
import { rateLimit } from '@/lib/rateLimit'
import { logAudit } from '@/lib/audit'
import { Resend } from 'resend'
import fs from 'fs'
import path from 'path'

export async function POST(request) {
  // Rate limit: 3 submissions per hour per IP
  const limited = await rateLimit(request, { requests: 3, window: '1h' })
  if (limited) return Response.json({ error: 'Too many requests. Please try again in an hour.' }, { status: 429 })

  // Use admin client to bypass RLS — this is a public submission endpoint
  // The server-side admin client is safe and never exposed to the browser
  const supabaseAdmin = await createAdminClient()
  const body = await request.json()

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
    const resend = new Resend(process.env.RESEND_API_KEY)
    const fromEmail = process.env.FROM_EMAIL || 'noreply@mathsinitiatives.org.np'
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    let logoBase64 = ''
    try {
      const logoPath = path.join(process.cwd(), 'public', 'images', 'logo.svg')
      logoBase64 = Buffer.from(fs.readFileSync(logoPath, 'utf8')).toString('base64')
    } catch (e) {}
    const logoSrc = logoBase64 ? `data:image/svg+xml;base64,${logoBase64}` : `${appUrl}/images/logo.svg`

    await resend.emails.send({
      from: `MIN Submissions <${fromEmail}>`,
      to: fromEmail,
      subject: `New Content Submission: "${title}"`,
      tags: [{ name: 'category', value: 'new_submission' }],
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background-color: #f7f9fb; padding: 40px; text-align: center;">
          <div style="max-width: 480px; margin: 0 auto; background-color: #ffffff; border-radius: 24px; padding: 40px; box-shadow: 0 10px 25px rgba(0,0,0,0.05); text-align: left;">
            <img src="${logoSrc}" alt="MIN Logo" style="width: 80px; height: auto; display: block; margin-bottom: 24px;" />
            <h1 style="color: #16556D; font-size: 20px; font-weight: 800; margin-bottom: 8px;">New Submission Received</h1>
            <p style="color: #6B7280; font-size: 14px; margin-bottom: 24px;">A new piece of content has been submitted and is awaiting your review.</p>
            <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
              <tr><td style="padding: 8px 0; color: #6B7280; font-weight: 600;">Title</td><td style="padding: 8px 0; color: #111827;">${title}</td></tr>
              <tr><td style="padding: 8px 0; color: #6B7280; font-weight: 600;">From</td><td style="padding: 8px 0; color: #111827;">${submitter_name} (${submitter_email})</td></tr>
              <tr><td style="padding: 8px 0; color: #6B7280; font-weight: 600;">Type</td><td style="padding: 8px 0; color: #111827;">${type}</td></tr>
            </table>
            <div style="margin-top: 32px; text-align: center;">
              <a href="${appUrl}/admin/submissions" style="display: inline-block; background-color: #16556D; color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 700; padding: 14px 32px; border-radius: 12px;">Review Submission</a>
            </div>
          </div>
        </div>
      `
    })
  } catch (mailErr) {
    console.error('Submission notification email failed:', mailErr)
    // Don't fail the request because of email
  }

  return Response.json({ success: true, data })
}

export async function GET(request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profile } = await supabase
    .from('profiles').select('role').eq('id', user.id).single()
  
  if (!profile || !['ADMIN', 'MANAGER', 'WRITER'].includes(profile.role)) {
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
