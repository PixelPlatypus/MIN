import { createAdminClient } from '@/lib/supabase/server'
import { rateLimit } from '@/lib/rateLimit'
import { Resend } from 'resend'
import fs from 'fs'
import path from 'path'


export async function POST(request) {
  try {
    // 1. Rate limiting (Upstash) - Wrapped in try/catch to prevent crashing on Redis issues
    try {
      const limited = await rateLimit(request, { requests: 5, window: '1h' })
      if (limited) {
        return Response.json({ error: 'Too many requests. Please try again later.' }, { status: 429 })
      }
    } catch (rlError) {
      console.error('Rate Limit Service Error:', rlError)
    }

    // Use admin client to bypass RLS — public unauthenticated route
    const supabaseAdmin = await createAdminClient()
    
    let body
    try {
      body = await request.json()
    } catch (e) {
      return Response.json({ error: 'Invalid JSON body' }, { status: 400 })
    }

    const { name, email, phone, type, form_data } = body

    // 2. Basic validation
    if (!name || !email || !type) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // 3. Insert into join_applications table
    const { data, error: insertError } = await supabaseAdmin
      .from('join_applications')
      .insert([{ 
        name, 
        email, 
        phone, 
        type, 
        form_data: form_data || {}, 
        status: 'PENDING' 
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
    try {
      const resend = new Resend(process.env.RESEND_API_KEY)
      const fromEmail = process.env.FROM_EMAIL || 'noreply@mathsinitiatives.org.np'
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://mathsinitiatives.org.np'
      
      const logoSrc = `https://mathsinitiatives.org.np/images/logo.png` // Using static PNG for reliability in emails

      const typeLabel = type.charAt(0) + type.slice(1).toLowerCase()
      
      const emailHtml = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f7f9fb; padding: 40px; text-align: center; color: #374151;">
          <div style="max-width: 520px; margin: 0 auto; background-color: #ffffff; border-radius: 32px; padding: 48px; border: 1px solid #e5e7eb; text-align: left; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
            <div style="margin-bottom: 32px;">
              <img src="${logoSrc}" alt="MIN Logo" style="height: 48px; width: auto;" />
            </div>
            
            <h1 style="color: #16556D; font-size: 24px; font-weight: 900; margin-bottom: 16px; letter-spacing: -0.025em;">
              Application Received!
            </h1>
            
            <p style="font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
              Hi ${name}, thank you for reaching out to **Mathematics Initiatives in Nepal**. We've received your interest to join as a **${typeLabel}**.
            </p>
            
            <div style="background-color: #f0f7f9; border-radius: 20px; padding: 24px; margin-bottom: 32px; border: 1px solid #16556d10;">
              <h4 style="margin: 0 0 8px 0; font-size: 12px; font-weight: 800; color: #16556D; text-transform: uppercase; letter-spacing: 0.05em;">Category</h4>
              <p style="margin: 0; font-weight: 600; font-size: 14px;">${typeLabel}</p>
            </div>
            
            <p style="font-size: 14px; line-height: 1.6; color: #6b7280; margin-bottom: 32px;">
              Our team performs a weekly review of all submissions. We'll reach out to you directly at this address if we require further details or to discuss next steps.
            </p>
            
            <div style="border-top: 1px solid #e5e7eb; padding-top: 24px; text-align: center;">
              <p style="font-size: 12px; color: #9ca3af; margin-bottom: 8px;">Follow our impact</p>
              <div style="display: flex; justify-content: center; gap: 12px;">
                <a href="https://mathsinitiatives.org.np" style="color: #16556D; text-decoration: none; font-weight: 700; font-size: 13px;">Website</a>
                <span style="color: #d1d5db;">&bull;</span>
                <a href="https://facebook.com/mathsinitiatives" style="color: #16556D; text-decoration: none; font-weight: 700; font-size: 13px;">Facebook</a>
              </div>
            </div>
          </div>
          <p style="margin-top: 24px; font-size: 11px; color: #9ca3af;">
            Mathematics Initiatives in Nepal &bull; Lalitpur, Nepal
          </p>
        </div>
      `

      // Send to applicant
      await resend.emails.send({
        from: `MIN Nepal <${fromEmail}>`,
        to: email,
        subject: `Your ${typeLabel} Application — MIN Nepal`,
        html: emailHtml
      })

      // Notify admin with summary
      await resend.emails.send({
        from: `MIN Alerts <${fromEmail}>`,
        to: fromEmail,
        subject: `[New App] ${typeLabel}: ${name}`,
        html: `
          <div style="font-family: sans-serif; padding: 24px; border: 1px solid #eee; border-radius: 12px;">
            <h2 style="color: #16556D;">New Application</h2>
            <p><strong>Type:</strong> ${type}</p>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Data:</strong></p>
            <pre style="background: #f4f4f4; padding: 12px; border-radius: 8px;">${JSON.stringify(form_data, null, 2)}</pre>
            <a href="${appUrl}/admin/applications" style="background: #16556D; color: #fff; padding: 10px 20px; border-radius: 8px; text-decoration: none;">View in Admin</a>
          </div>
        `
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

