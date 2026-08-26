import { createAdminClient } from '@/lib/supabase/server'
import { withRole } from '@/lib/rbac'
import { rateLimit } from '@/lib/rateLimit'
import { sendEmail, generateMINThemeEmail } from '@/lib/resend'
import { SYSTEM_EMAIL_TEMPLATES } from '@/lib/emailTemplates'
import { marked } from 'marked'
import sanitizeHtml from 'sanitize-html'

export const dynamic = 'force-dynamic'

export async function POST(request) {
  // 1. Role validation (Admin, SuperAdmin, WebsiteManager, HR)
  const { user, profile, error: roleError } = await withRole(['ADMIN', 'SUPER_ADMIN', 'WEBSITE_MANAGER', 'HR'])
  if (roleError) return Response.json({ error: roleError.message }, { status: roleError.status })

  // 2. Strict Rate limit on test emails to prevent spamming
  const limitCount = process.env.NODE_ENV === 'development' ? 50 : 15
  const limited = await rateLimit(request, { requests: limitCount, window: '10m' })
  if (limited) {
    return Response.json({ error: 'Too many test emails sent. Please wait a few minutes before sending another test.' }, { status: 429 })
  }

  try {
    const body = await request.json()
    const { to, template_id, subject, body_markdown, from_name, from_email, sample_variables } = body

    if (!to || typeof to !== 'string' || !to.includes('@')) {
      return Response.json({ error: 'A valid destination email address is required.' }, { status: 400 })
    }

    const defaultTpl = SYSTEM_EMAIL_TEMPLATES.find(t => t.id === template_id) || {}
    
    let rawSubject = subject || defaultTpl.subject || 'Test Notification — MIN Nepal'
    let rawMarkdown = body_markdown || defaultTpl.body_markdown || 'Hello,\n\nThis is a test notification.'
    const senderName = from_name || defaultTpl.from_name || 'Mathematics Initiatives in Nepal'
    const senderEmail = from_email || defaultTpl.from_email || 'website@mathsinitiatives.org.np'

    // Combine sample variables
    const vars = {
      ...(defaultTpl.sample_variables || {}),
      ...(sample_variables || {})
    }

    // Replace variables in subject and markdown
    Object.entries(vars).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, 'g')
      rawSubject = rawSubject.replace(regex, value ?? '')
      rawMarkdown = rawMarkdown.replace(regex, value ?? '')
    })

    const supabase = await createAdminClient()
    const { data: settings } = await supabase.from('site_settings').select('*').eq('id', 'main').single()

    const bodyHtml = await marked.parse(rawMarkdown)
    const cleanHtml = sanitizeHtml(bodyHtml, {
      allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'table', 'tbody', 'tr', 'td', 'th', 'thead'])
    })

    const finalHtml = generateMINThemeEmail(null, cleanHtml, settings || {})

    const result = await sendEmail({
      to,
      subject: `[TEST EMAIL] ${rawSubject}`,
      html: finalHtml,
      from: `${senderName} <${senderEmail}>`
    })

    if (!result) {
      return Response.json({ error: 'Resend delivery failed. Check API key or verified domains.' }, { status: 500 })
    }

    return Response.json({
      success: true,
      message: `Test email successfully dispatched to ${to}`,
      result
    })
  } catch (err) {
    console.error('Test email exception:', err)
    return Response.json({ error: 'Failed to send test email: ' + err.message }, { status: 500 })
  }
}
