// Error reporting route - centralized in resend.js
import { NextResponse } from 'next/server'
import { sendTemplatedEmail } from '@/lib/resend'
import { rateLimit } from '@/lib/rateLimit'

export async function POST(request) {
  try {
    const limitCount = process.env.NODE_ENV === 'development' ? 500 : 10;
    try {
      const limited = await rateLimit(request, { requests: limitCount, window: '1h' })
      if (limited) return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
    } catch (e) {
      // ignore rate limit error
    }

    const { errorName, errorMessage, errorStack, url } = await request.json()

    // Skip sending emails for localhost errors to prevent dev clutter
    if (url && (url.includes('localhost') || url.includes('127.0.0.1'))) {
       return NextResponse.json({ success: true, message: 'Localhost error reporting suppressed' })
    }

    // --- NEW: Suppress 404 errors ---
    const is404 = (errorName && errorName.includes('404')) || 
                  (errorMessage && errorMessage.includes('404')) ||
                  (errorMessage && errorMessage.toLowerCase().includes('not found'))
    
    if (is404) {
      return NextResponse.json({ success: true, message: '404 reporting suppressed' })
    }
    // -------------------------------

    await sendTemplatedEmail('admin_error_report', 'website@mathsinitiatives.org.np', {
      error_name: errorName || 'Exception',
      error_message: errorMessage || 'Unknown error',
      error_stack: errorStack || 'No stack trace available',
      url: url || 'Unknown'
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to report error:', error)
    return NextResponse.json({ error: 'Failed to report error' }, { status: 500 })
  }
}
