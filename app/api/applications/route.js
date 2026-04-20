import { createAdminClient } from '@/lib/supabase/server'
import { rateLimit } from '@/lib/rateLimit'


export async function POST(request) {
  try {
    // 1. Rate limiting (Upstash)
    try {
      const isDev = process.env.NODE_ENV === 'development'
      const limited = await rateLimit(request, { requests: isDev ? 500 : 5, window: '1h' })
      if (limited) {
        return Response.json({ error: 'Too many requests. Please try again later.' }, { status: 429 })
      }
    } catch (rlError) {
      console.error('Rate Limit Service Error:', rlError)
    }

    // Use admin client to bypass RLS — public unauthenticated route
    const supabaseAdmin = await createAdminClient()
    
    const { sanitizeObject } = await import('@/lib/security')
    let body = await request.json()
    body = sanitizeObject(body)

    const { name, email, phone, type, form_data } = body

    // 2. Basic validation
    if (!name || !email || !type) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // 2. Fetch active batch from settings
    const { data: settings } = await supabaseAdmin
      .from('site_settings')
      .select('active_volunteer_batch')
      .single()
    
    const activeBatch = settings?.active_volunteer_batch || 'General'

    // 3. Insert into join_applications table
    const { data, error: insertError } = await supabaseAdmin
      .from('join_applications')
      .insert([{ 
        name, 
        email, 
        phone, 
        type, 
        form_data: form_data || {}, 
        status: 'PENDING',
        batch_name: activeBatch
      }])
      .select()
      .single()

    if (insertError) {
      console.error('Join Application Insert Error:', insertError)
      return Response.json({ 
        error: 'Failed to submit application.',
        details: insertError.message 
      }, { status: 500 })
    }

    // 4. Send confirmation email to applicant + admin notification
    // 4. Send confirmation email to applicant + admin notification
    try {
      const { sendTemplatedEmail, sendEmail, generateMINThemeEmail } = await import('@/lib/resend')
      const typeLabel = type.charAt(0) + type.slice(1).toLowerCase()
      const isInquiry = type === 'INQUIRY'
      
      let eventKey = 'application_received' // Generic fallback
      if (isInquiry) eventKey = 'inquiry_received'
      else if (type.includes('ORG')) eventKey = 'org_submission'
      else if (type.includes('PARTNER')) eventKey = 'partnership_submission'

      // Send to applicant using the new branding system
      await sendTemplatedEmail(eventKey, email, {
        applicant_name: name,
        role_type: typeLabel,
        contact_message: form_data?.message || form_data?.subject || typeLabel
      })

      // Notify admin (using the same branding)
      const adminHtml = await generateMINThemeEmail(`New ${isInquiry ? 'Inquiry' : 'Application'}`, `
        <p><strong>From:</strong> ${name} (${email})</p>
        <p><strong>Type:</strong> ${typeLabel}</p>
        <div style="background: #f4f4f4; padding: 16px; border-radius: 12px; font-family: monospace; font-size: 12px; margin: 20px 0;">
          ${JSON.stringify(form_data, null, 2)}
        </div>
        <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/inquiries">Review in Admin Panel</a></p>
      `, settings || {})

      await sendEmail({
        to: process.env.FROM_EMAIL || 'noreply@mathsinitiatives.org.np',
        subject: isInquiry ? `[Inquiry] From ${name}` : `[New App] ${typeLabel}: ${name}`,
        html: adminHtml
      })
    } catch (mailErr) {
      console.error('Mail delivery error:', mailErr)
    }

    return Response.json({ success: true, id: data.id })
  } catch (error) {
    console.error('Join Application FATAL:', error)
    return Response.json({ 
      error: 'CRITICAL_SERVER_ERROR', 
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined 
    }, { status: 500 })
  }
}

