// app/api/admin/certificates/route.js
import { createAdminClient } from '@/lib/supabase/server'
import { withRole } from '@/lib/rbac'
import { logAudit } from '@/lib/audit'
import { sendCertificateEmail } from '@/lib/resend'

export async function GET(request) {
  const { user, profile, supabase, error } = await withRole(['ADMIN', 'MANAGER', 'WEBSITE_MANAGER'])
  if (error) return Response.json({ error: error.message }, { status: error.status })

  const { searchParams } = new URL(request.url)
  const search = searchParams.get('search') || ''
  const eventId = searchParams.get('eventId')
  const status = searchParams.get('status') // 'valid', 'revoked', 'draft', 'published'

  let query = supabase
    .from('certificates')
    .select('*, events(title, certificates_enabled)')
    .order('created_at', { ascending: false })

  if (search) {
    query = query.or(`recipient_name.ilike.%${search}%,recipient_email.ilike.%${search}%`)
  }

  if (eventId) {
    query = query.eq('event_id', eventId)
  }

  if (status) {
    if (status === 'valid') {
      query = query.eq('is_valid', true)
    } else if (status === 'revoked') {
      query = query.eq('is_valid', false)
    } else if (status === 'draft') {
      query = query.eq('is_visible', false)
    } else if (status === 'published') {
      query = query.eq('is_visible', true)
    }
  }

  const { data, error: fetchError } = await query

  if (fetchError) {
    return Response.json({ error: fetchError.message }, { status: 500 })
  }

  return Response.json(data)
}

export async function POST(request) {
  const { user, profile, supabase, error } = await withRole(['ADMIN', 'MANAGER', 'WEBSITE_MANAGER'])
  if (error) return Response.json({ error: error.message }, { status: error.status })

  const body = await request.json()
  const adminSupabase = await createAdminClient()

  // Insert the certificate
  const { data: cert, error: insertError } = await adminSupabase
    .from('certificates')
    .insert([{
      recipient_name: body.recipient_name,
      recipient_email: body.recipient_email || null,
      program_name: body.program_name,
      event_name: body.event_name || null,
      event_id: body.event_id || null,
      issued_date: body.issued_date || new Date().toISOString().split('T')[0],
      expiry_date: body.expiry_date || null,
      pdf_url: body.pdf_url || null,
      is_valid: body.is_valid !== undefined ? body.is_valid : true,
      is_visible: body.is_visible !== undefined ? body.is_visible : true,
      issued_by: user.id
    }])
    .select()
    .single()

  if (insertError) {
    return Response.json({ error: insertError.message }, { status: 500 })
  }

  // Auto emailing if visible, valid, and email exists
  let emailSent = false
  if (cert.is_visible && cert.is_valid && cert.recipient_email) {
    try {
      const emailResult = await sendCertificateEmail({
        to: cert.recipient_email,
        recipientName: cert.recipient_name,
        eventName: cert.event_name || 'MIN Event',
        certUuid: cert.cert_uuid,
        issuedDate: cert.issued_date
      })
      if (emailResult && !emailResult.error) {
        emailSent = true
        // Update database that email has been sent
        await adminSupabase
          .from('certificates')
          .update({ email_sent: true })
          .eq('id', cert.id)
      }
    } catch (emailErr) {
      console.error('Failed to dispatch auto email on create:', emailErr)
    }
  }

  // Log audit trail
  await logAudit({
    actor_id: user.id,
    actor_name: profile.name,
    action: 'ISSUED_CERTIFICATE',
    entity_type: 'certificates',
    entity_id: cert.id,
    meta: { 
      recipient: cert.recipient_name, 
      event: cert.event_name,
      email_sent: emailSent 
    }
  })

  return Response.json({ ...cert, email_sent: emailSent })
}
