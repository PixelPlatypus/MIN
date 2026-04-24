import { NextResponse } from 'next/server'
import { sendEmail, generateMINThemeEmail } from '@/lib/resend'
import { createAdminClient } from '@/lib/supabase/server'
import { rateLimit } from '@/lib/rateLimit'

export async function POST(request) {
  try {
    // Rate limit error reporting to prevent spam
    const limitCount = process.env.NODE_ENV === 'development' ? 500 : 10;
    try {
      const limited = await rateLimit(request, { requests: limitCount, window: '1h' })
      if (limited) return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
    } catch (e) {
      // ignore rate limit error
    }

    const { errorName, errorMessage, errorStack, url } = await request.json()

    const supabaseAdmin = await createAdminClient()
    const { data: settings } = await supabaseAdmin
      .from('site_settings')
      .select('*')
      .eq('id', 'main')
      .single()

    const adminHtml = await generateMINThemeEmail('🚨 Critical Error Reported', `
      <div style="background: #fff0f0; padding: 24px; border-radius: 16px; border: 1px solid #ffcccc; margin: 24px 0;">
        <h2 style="color: #d32f2f; margin-top: 0;">Error Detected on MIN Website</h2>
        <p style="margin: 0 0 10px 0;"><strong>URL:</strong> ${url || 'Unknown'}</p>
        <p style="margin: 0 0 10px 0;"><strong>Error Type:</strong> ${errorName || 'Error'}</p>
        <p style="margin: 0 0 10px 0;"><strong>Message:</strong> ${errorMessage || 'Unknown error'}</p>
        <p style="margin: 10px 0 0 0;"><strong>Please investigate and fix this issue as soon as possible.</strong></p>
      </div>
      <div style="background: #111; color: #00ff00; padding: 16px; border-radius: 8px; font-family: monospace; font-size: 12px; white-space: pre-wrap; overflow-x: auto;">
${errorStack || 'No stack trace available'}
      </div>
    `, settings || {})

    await sendEmail({
      to: 'contact@mathsinitiatives.org.np',
      subject: `🚨 [Error] ${errorName || 'Exception'} on MIN Website`,
      html: adminHtml
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to report error:', error)
    return NextResponse.json({ error: 'Failed to report error' }, { status: 500 })
  }
}
