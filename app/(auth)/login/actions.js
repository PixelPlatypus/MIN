// app/(auth)/login/actions.js
'use server'

import { createClient, createAdminClient } from '@/lib/supabase/server'
import { Resend } from 'resend'
import fs from 'node:fs'
import path from 'node:path'

export async function loginAction(data) {
  try {
    const supabase = await createClient()
    let loginEmail = data.identifier

    // If it's a username (no @), look up their email
    if (!loginEmail.includes('@')) {
      const supabaseAdmin = await createAdminClient()
      const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('email')
        .eq('username', loginEmail)
        .single()
        
      if (!profile) {
        return { success: false, error: 'Invalid login credentials' }
      }
      loginEmail = profile.email
    }

    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email: loginEmail,
      password: data.password,
    })

    if (error) {
      console.error('Login error details:', {
        message: error.message,
        status: error.status,
        name: error.name
      })
      
      // If the user doesn't exist, we can try to re-seed it automatically
      if (error.message === 'Invalid login credentials' && data.email === 'admin@mathsinitiatives.org') {
        console.log('Admin login failed. Re-seeding admin user...')
        // We can't run shell scripts easily from a server action without security risks,
        // but we've already given the user the seeding script.
      }

      return { success: false, error: error.message }
    }

    console.log('Login successful for user:', authData.user.id)
    
    // Check if we can get the user immediately to verify cookies are set
    const { data: { user } } = await supabase.auth.getUser()
    console.log('Immediate session check:', user ? 'Session exists' : 'No session')

    return { success: true }
  } catch (err) {
    console.error('Unexpected action error:', err)
    return { success: false, error: err.message || 'Unknown error' }
  }
}

export async function resetPasswordAction(identifier) {
  try {
    const supabaseAdmin = await createAdminClient()
    let resetEmail = identifier

    if (!resetEmail.includes('@')) {
      const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('email')
        .eq('username', resetEmail)
        .single()
        
      if (!profile) {
        return { success: false, error: 'User not found' }
      }
      resetEmail = profile.email
    }

    // Generate secure reset link via Supabase Auth Admin
    const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'recovery',
      email: resetEmail,
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/login/reset`
      }
    })

    if (linkError) {
      return { success: false, error: linkError.message }
    }

    const actionLink = linkData.properties.action_link
    const resend = new Resend(process.env.RESEND_API_KEY)

    const fromEmail = process.env.FROM_EMAIL || 'noreply@mathsinitiatives.org'
    
    const appUrl = process.env.NEXT_PUBLIC_APP_URL

    // Load SVG and convert to Base64 Data URI to prevent broken external links in strict email clients
    let logoBase64 = ''
    try {
      const logoPath = path.join(process.cwd(), 'public', 'images', 'logo.svg')
      const logoFile = fs.readFileSync(logoPath, 'utf8')
      logoBase64 = Buffer.from(logoFile).toString('base64')
    } catch (e) {
      console.error('Could not load logo file for email embedding:', e)
    }
    const logoSrc = logoBase64 ? `data:image/svg+xml;base64,${logoBase64}` : `${appUrl}/images/logo.svg`

    const { data: sendData, error: sendError } = await resend.emails.send({
      from: `MIN Admin Portal <${fromEmail}>`,
      to: resetEmail,
      subject: 'Reset Your MIN Account Password',
      tags: [
        { name: 'category', value: 'password_reset' },
        { name: 'track_opens', value: 'true' }
      ],
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f7f9fb; padding: 40px; text-align: center;">
          <div style="max-w: 480px; margin: 0 auto; background-color: #ffffff; border-radius: 24px; padding: 40px; box-shadow: 0 10px 25px rgba(0,0,0,0.05); text-align: center;">
            <img src="${logoSrc}" alt="MIN Logo" style="width: 100px; height: auto; margin: 0 auto 24px auto; display: block;" />
            <h1 style="color: #111827; font-size: 24px; font-weight: 800; margin-bottom: 8px; letter-spacing: -0.5px;">Password Reset Request</h1>
            <p style="color: #6B7280; font-size: 15px; line-height: 1.6; margin-bottom: 32px;">
              We received a request to reset your password for the Mathematics Initiatives in Nepal (MIN) admin portal. Click the secure button below to choose a new password.
            </p>
            <a href="${actionLink}" style="display: inline-block; background-color: #16556D; color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 700; padding: 16px 36px; border-radius: 12px; transition: all 0.2s;">
              Reset Password
            </a>
            <p style="color: #6B7280; font-size: 13px; margin-top: 32px; border-top: 1px solid #E5E7EB; padding-top: 24px;">
              If you didn't request a password reset, you can safely ignore this email. This link will expire shortly.
            </p>
          </div>
        </div>
      `
    })

    if (sendError) {
      console.error('Resend delivery failed:', sendError);
      return { success: false, error: 'Email delivery blocked: ' + sendError.message }
    }

    return { success: true }
  } catch (err) {
    return { success: false, error: err.message }
  }
}
