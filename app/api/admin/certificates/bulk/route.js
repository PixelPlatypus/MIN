// app/api/admin/certificates/bulk/route.js
import { createAdminClient } from '@/lib/supabase/server'
import { withRole } from '@/lib/rbac'
import { logAudit } from '@/lib/audit'
import { sendCertificateEmail } from '@/lib/resend'

export async function POST(request) {
  const { user, profile, supabase, error } = await withRole(['ADMIN', 'MANAGER', 'WEBSITE_MANAGER'])
  if (error) return Response.json({ error: error.message }, { status: error.status })

  const body = await request.json()
  const { certificates } = body

  if (!Array.isArray(certificates) || certificates.length === 0) {
    return Response.json({ error: 'Invalid or empty certificates array' }, { status: 400 })
  }

  const adminSupabase = await createAdminClient()

  // Fetch all events to resolve event names to event_ids
  const { data: events } = await adminSupabase
    .from('events')
    .select('id, title')

  const eventMap = new Map()
  if (events) {
    events.forEach(e => {
      eventMap.set(e.title.toLowerCase().trim(), e.id)
    })
  }

  const insertedCertificates = []
  const failedCertificates = []

  // Insert records sequentially or in batch
  // Sequentially is safer if we want to run auto-emailing per inserted row
  for (const item of certificates) {
    const trimmedEventName = (item.event_name || '').trim()
    const resolvedEventId = eventMap.get(trimmedEventName.toLowerCase()) || null

    try {
      const { data: cert, error: insertError } = await adminSupabase
        .from('certificates')
        .insert([{
          recipient_name: item.recipient_name,
          recipient_email: item.recipient_email || null,
          program_name: item.program_name || 'MIN Program',
          event_name: trimmedEventName || null,
          event_id: resolvedEventId,
          issued_date: item.issued_date || new Date().toISOString().split('T')[0],
          expiry_date: item.expiry_date || null,
          pdf_url: item.pdf_url || null,
          is_valid: true,
          is_visible: item.is_visible !== undefined ? item.is_visible : true,
          issued_by: user.id
        }])
        .select()
        .single()

      if (insertError) {
        failedCertificates.push({ item, error: insertError.message })
        continue
      }

      // If visible, send email immediately
      if (cert.is_visible && cert.recipient_email) {
        try {
          const emailResult = await sendCertificateEmail({
            to: cert.recipient_email,
            recipientName: cert.recipient_name,
            eventName: cert.event_name || 'MIN Event',
            certUuid: cert.cert_uuid,
            issuedDate: cert.issued_date
          })

          if (emailResult && !emailResult.error) {
            // Update email_sent
            await adminSupabase
              .from('certificates')
              .update({ email_sent: true })
              .eq('id', cert.id)
            cert.email_sent = true
          }
        } catch (emailErr) {
          console.error(`Bulk Upload: Failed to email ${cert.recipient_email}:`, emailErr)
        }
      }

      insertedCertificates.push(cert)
    } catch (err) {
      failedCertificates.push({ item, error: err.message })
    }
  }

  // Audit Log for bulk insertion
  if (insertedCertificates.length > 0) {
    await logAudit({
      actor_id: user.id,
      actor_name: profile.name,
      action: 'BULK_ISSUED_CERTIFICATES',
      entity_type: 'certificates',
      meta: { 
        count: insertedCertificates.length,
        failed: failedCertificates.length 
      }
    })
  }

  return Response.json({
    success: true,
    insertedCount: insertedCertificates.length,
    failedCount: failedCertificates.length,
    failures: failedCertificates
  })
}
