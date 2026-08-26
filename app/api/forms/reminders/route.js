import { createAdminClient } from '@/lib/supabase/server'
import { rateLimit } from '@/lib/rateLimit'

export async function POST(request) {
  // Rate limit: 5 requests per hour
  const limitCount = process.env.NODE_ENV === 'development' ? 100 : 5
  const limited = await rateLimit(request, { requests: limitCount, window: '1h' })
  if (limited) return Response.json({ error: 'Too many requests. Please try again later.' }, { status: 429 })

  const body = await request.json()
  const { email, category } = body

  if (!email || !category || typeof email !== 'string' || !email.includes('@')) {
    return Response.json({ error: "A valid Email and Category are required" }, { status: 400 })
  }

  const supabase = await createAdminClient()
  
  const { error } = await supabase
    .from('intake_reminders')
    .insert([{ email, category }])

  // If it's a unique constraint violation, they are already on the list, which is fine
  if (error && error.code !== '23505') {
    return Response.json({ error: error.message }, { status: 500 })
  }

  // 2. Send confirmation email
  try {
    const { sendTemplatedEmail } = await import('@/lib/resend')
    await sendTemplatedEmail('reminder_confirmed', email, {
      form_name: category.charAt(0) + category.slice(1).toLowerCase()
    })
  } catch (mailError) {
    console.error('Reminder confirmation mail failed:', mailError)
  }
  
  return Response.json({ success: true, message: "Added to reminder list" })
}
