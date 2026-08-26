import { createAdminClient } from '@/lib/supabase/server'
import { withRole } from '@/lib/rbac'
import { rateLimit } from '@/lib/rateLimit'
import { sanitizeObject } from '@/lib/security'
import { sendTemplatedEmail } from '@/lib/resend'

export const dynamic = 'force-dynamic'

// Public Contact / Inquiry Submission
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
      console.error('Rate limit error:', rlError)
    }

    let body = await request.json()
    body = sanitizeObject(body)

    const { name, email, phone, subject, message } = body

    if (!name || !email || !message) {
      return Response.json({ error: 'Name, email, and message are required.' }, { status: 400 })
    }

    const supabase = await createAdminClient()

    // 2. Insert into dedicated inquiries table
    const { data, error: insertError } = await supabase
      .from('inquiries')
      .insert([{
        name,
        email,
        phone: phone || null,
        subject: subject || 'General Inquiry',
        message,
        status: 'PENDING'
      }])
      .select()
      .single()

    if (insertError) {
      console.error('Inquiry Insert Error:', insertError)
      return Response.json({ error: 'Failed to submit inquiry.', details: insertError.message }, { status: 500 })
    }

    // 3. Send automated receipt to the sender
    try {
      await sendTemplatedEmail('inquiry_received', email, {
        applicant_name: name,
        contact_message: message,
        role_type: subject || 'General Inquiry'
      })
    } catch (mailErr) {
      console.error('Inquiry autoresponder error:', mailErr)
    }

    // 4. Notify admin team
    try {
      await sendTemplatedEmail('admin_new_application', 'website@mathsinitiatives.org.np', {
        form_title: `New Inquiry: ${subject || 'General'}`,
        applicant_name: name,
        applicant_email: email,
        category: 'Website Inquiry',
        form_data_summary: `**Subject:** ${subject || 'None'}\n**Phone:** ${phone || 'N/A'}\n**Message:**\n${message}`,
        admin_url: `${process.env.NEXT_PUBLIC_APP_URL}/admin/inquiries`
      })
    } catch (adminMailErr) {
      console.error('Admin inquiry notification error:', adminMailErr)
    }

    return Response.json({ success: true, id: data.id })
  } catch (fatalError) {
    console.error('Inquiry POST Fatal:', fatalError)
    return Response.json({ error: 'Internal Server Error', details: fatalError.message }, { status: 500 })
  }
}

// Staff Inquiries List
export async function GET(request) {
  try {
    const { error: roleError } = await withRole(['ADMIN', 'SUPER_ADMIN', 'MANAGER', 'WEBSITE_MANAGER', 'HR'])
    if (roleError) {
      return Response.json({ error: roleError.message }, { status: roleError.status })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const search = searchParams.get('search')

    const supabase = await createAdminClient()
    let query = supabase.from('inquiries').select('*').order('created_at', { ascending: false })

    if (status && status !== 'ALL') {
      query = query.eq('status', status)
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,subject.ilike.%${search}%,message.ilike.%${search}%`)
    }

    const { data, error } = await query

    if (error) {
      return Response.json({ error: error.message }, { status: 500 })
    }

    return Response.json(data || [])
  } catch (fatalError) {
    return Response.json({ error: 'Internal Server Error', details: fatalError.message }, { status: 500 })
  }
}
