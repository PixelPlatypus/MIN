import { createAdminClient } from '@/lib/supabase/server'

export async function POST(request) {
  // Rate limiting
  try {
    const { rateLimit } = await import('@/lib/rateLimit')
    const limitCount = process.env.NODE_ENV === 'development' ? 500 : 5
    const limited = await rateLimit(request, { requests: limitCount, window: '1h' })
    if (limited) return Response.json({ error: 'Too many requests. Please try again later.' }, { status: 429 })
  } catch (e) {
    console.error('Rate limit error:', e)
  }

  const { sanitizeObject } = await import('@/lib/security')
  let body = await request.json()
  body = sanitizeObject(body)
  const { form_id, data } = body

  if (!form_id || !data) {
    return Response.json({ error: "Missing submission data" }, { status: 400 })
  }

  const supabase = await createAdminClient()
  
  // 1. Store the submission
  const { data: submission, error: subError } = await supabase
    .from('form_submissions')
    .insert([{ 
      form_id, 
      data, 
      status: 'PENDING' 
    }])
    .select()
    .single()

  if (subError) return Response.json({ error: subError.message }, { status: 500 })

  // 2. Trigger automated email if template exists
  try {
    const { data: formDef } = await supabase
      .from('form_definitions')
      .select('email_template_id, category, title')
      .eq('id', form_id)
      .single()

    if (formDef?.email_template_id || true) { // We always check mappings now
      const { sendTemplatedEmail } = await import('@/lib/resend')
      const email = data.Email || data["Email Address"] || data.email
      const name = data.Name || data["Full Name"] || data.name || "Friend"
      const category = formDef?.category?.toLowerCase() || ''
      
      let eventKey = 'application_received'
      if (category.includes('inquiry')) eventKey = 'inquiry_received'
      else if (category.includes('org') || category.includes('partner')) eventKey = 'org_submission'
      else if (category.includes('ambassador')) eventKey = 'ambassadorship_submission'
      else if (formDef?.email_template_id) eventKey = formDef.email_template_id

      if (email) {
        await sendTemplatedEmail(eventKey, email, {
          applicant_name: name,
          site_url: process.env.NEXT_PUBLIC_APP_URL || 'https://mathsinitiatives.org.np',
          contact_message: data.Message || data.message || ''
        })
      }
    }
  } catch (err) {
    console.error('Automated Form Email Error:', err)
  }

  return Response.json({ success: true, id: submission.id })
}
