// app/api/admin/certificates/[id]/route.js
import { createAdminClient } from '@/lib/supabase/server'
import { withRole } from '@/lib/rbac'
import { logAudit } from '@/lib/audit'
import { sendCertificateEmail } from '@/lib/resend'
import { deleteFromCloudinary } from '@/lib/cloudinary'

/**
 * Extracts a Cloudinary public_id from a full Cloudinary URL.
 * Handles versioned URLs: .../upload/v1234567890/folder/file.ext -> folder/file
 * Returns null if the URL is not a Cloudinary URL.
 */
function extractCloudinaryPublicId(url) {
  if (!url || !url.includes('res.cloudinary.com')) return null
  try {
    const uploadIndex = url.indexOf('/upload/')
    if (uploadIndex === -1) return null
    // Everything after /upload/
    let path = url.slice(uploadIndex + '/upload/'.length)
    // Strip version segment if present (e.g. v1234567890/)
    path = path.replace(/^v\d+\//, '')
    // Strip file extension
    path = path.replace(/\.[^/.]+$/, '')
    return path || null
  } catch {
    return null
  }
}

export async function PATCH(request, { params }) {
  const { id } = await params
  const { user, profile, error } = await withRole(['ADMIN', 'MANAGER', 'WEBSITE_MANAGER'])
  if (error) return Response.json({ error: error.message }, { status: error.status })

  const body = await request.json()
  const adminSupabase = await createAdminClient()

  // Fetch current certificate to compare state
  const { data: currentCert, error: fetchError } = await adminSupabase
    .from('certificates')
    .select('*')
    .eq('id', id)
    .single()

  if (fetchError || !currentCert) {
    return Response.json({ error: 'Certificate not found' }, { status: 404 })
  }

  // Build update payload - only include fields explicitly provided in the body
  const updatePayload = {}
  if (body.recipient_name !== undefined) updatePayload.recipient_name = body.recipient_name
  if (body.recipient_email !== undefined) updatePayload.recipient_email = body.recipient_email
  if (body.program_name !== undefined) updatePayload.program_name = body.program_name
  if (body.event_name !== undefined) updatePayload.event_name = body.event_name
  if (body.event_id !== undefined) updatePayload.event_id = body.event_id
  if (body.issued_date !== undefined) updatePayload.issued_date = body.issued_date
  if (body.expiry_date !== undefined) updatePayload.expiry_date = body.expiry_date
  if (body.pdf_url !== undefined) updatePayload.pdf_url = body.pdf_url
  if (body.is_valid !== undefined) updatePayload.is_valid = body.is_valid
  if (body.is_visible !== undefined) updatePayload.is_visible = body.is_visible

  if (Object.keys(updatePayload).length === 0) {
    return Response.json({ error: 'No fields to update' }, { status: 400 })
  }

  // Update certificate
  const { data: updatedCert, error: updateError } = await adminSupabase
    .from('certificates')
    .update(updatePayload)
    .eq('id', id)
    .select()
    .single()

  if (updateError) {
    return Response.json({ error: updateError.message }, { status: 500 })
  }

  // Trigger emailing if updated certificate was made visible, is valid, hasn't been emailed yet, and email is set.
  let emailSent = updatedCert.email_sent
  if (
    updatedCert.is_visible && 
    updatedCert.is_valid && 
    !currentCert.email_sent && 
    updatedCert.recipient_email
  ) {
    try {
      const emailResult = await sendCertificateEmail({
        to: updatedCert.recipient_email,
        recipientName: updatedCert.recipient_name,
        eventName: updatedCert.event_name || 'MIN Event',
        certUuid: updatedCert.cert_uuid,
        issuedDate: updatedCert.issued_date
      })
      if (emailResult && !emailResult.error) {
        emailSent = true
        await adminSupabase
          .from('certificates')
          .update({ email_sent: true })
          .eq('id', id)
      }
    } catch (emailErr) {
      console.error('Failed to dispatch auto email on update:', emailErr)
    }
  }

  await logAudit({
    actor_id: user.id,
    actor_name: profile.name,
    action: body.is_valid === false && currentCert.is_valid !== false ? 'REVOKED_CERTIFICATE' : 'UPDATED_CERTIFICATE',
    entity_type: 'certificates',
    entity_id: id,
    meta: { 
      recipient: updatedCert.recipient_name, 
      event: updatedCert.event_name,
      email_sent: emailSent 
    }
  })

  return Response.json({ ...updatedCert, email_sent: emailSent })
}

export async function DELETE(request, { params }) {
  const { id } = await params
  const { user, profile, error } = await withRole(['ADMIN', 'MANAGER', 'WEBSITE_MANAGER'])
  if (error) return Response.json({ error: error.message }, { status: error.status })

  const adminSupabase = await createAdminClient()

  // Fetch full certificate details first (need pdf_url for Cloudinary cleanup)
  const { data: cert } = await adminSupabase
    .from('certificates')
    .select('recipient_name, event_name, pdf_url')
    .eq('id', id)
    .single()

  // Delete from database
  const { error: deleteError } = await adminSupabase
    .from('certificates')
    .delete()
    .eq('id', id)

  if (deleteError) {
    return Response.json({ error: deleteError.message }, { status: 500 })
  }

  // Best-effort: delete associated file from Cloudinary
  if (cert?.pdf_url) {
    const publicId = extractCloudinaryPublicId(cert.pdf_url)
    if (publicId) {
      try {
        // Determine resource type from the URL — PDFs are 'raw', images are 'image'
        const isPdf = cert.pdf_url.toLowerCase().includes('.pdf') ||
                      cert.pdf_url.toLowerCase().includes('/raw/')
        const resourceType = isPdf ? 'raw' : 'image'

        const result = await deleteFromCloudinary(publicId, { resource_type: resourceType })

        // If not found as one type, try the other (handles edge cases)
        if (result?.result === 'not found') {
          const fallbackType = isPdf ? 'image' : 'raw'
          await deleteFromCloudinary(publicId, { resource_type: fallbackType }).catch(() => {})
        }
      } catch (cloudErr) {
        // Non-fatal — log but don't fail the request
        console.warn('Cloudinary cleanup failed for certificate file:', publicId, cloudErr?.message)
      }
    }
  }

  await logAudit({
    actor_id: user.id,
    actor_name: profile.name,
    action: 'DELETED_CERTIFICATE',
    entity_type: 'certificates',
    entity_id: id,
    meta: cert ? { recipient: cert.recipient_name, event: cert.event_name, file_cleaned: !!cert.pdf_url } : {}
  })

  return Response.json({ success: true })
}
