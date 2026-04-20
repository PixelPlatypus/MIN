import { createAdminClient } from '@/lib/supabase/server'
import { withRole } from '@/lib/rbac'
import { logAudit } from '@/lib/audit'
import { sendEmail, generateMINThemeEmail } from '@/lib/resend'

export async function PATCH(request, { params }) {
  try {
    const { id } = await params
    
    const { user, profile, error } = await withRole(['ADMIN', 'MANAGER', 'WEBSITE_MANAGER'])
    if (error) {
      return Response.json({ error: error.message }, { status: error.status })
    }

    const body = await request.json()
    let { status, notes } = body
    
    if (!status) {
      return Response.json({ error: 'Status is required' }, { status: 400 })
    }

    const supabase = await createAdminClient()
    
    // form_submissions uses: PENDING, APPROVED, REJECTED, DRAFT
    // join_applications uses: PENDING, REVIEWED, ACCEPTED, REJECTED
    // Map frontend 'ACCEPTED' to the correct DB value per table
    const formSubStatus = status === 'ACCEPTED' ? 'APPROVED' : status
    const legacyStatus = status // join_applications already uses ACCEPTED directly

    const updateData = { status: formSubStatus }
    if (notes !== undefined) updateData.notes = notes

    // Try form_submissions first
    let { data: updatedSub, error: updateError } = await supabase
      .from('form_submissions')
      .update(updateData)
      .eq('id', id)
      .select('*, form_definitions(category)')
      .single()

    // If not found in form_submissions, try join_applications (uses different status enum)
    if (updateError || !updatedSub) {
      const legacyUpdateData = { status: legacyStatus }
      if (notes !== undefined) legacyUpdateData.notes = notes

      const { data: legacySub, error: legacyError } = await supabase
        .from('join_applications')
        .update(legacyUpdateData)
        .eq('id', id)
        .select('*')
        .single()
      
      if (legacyError) {
        return Response.json({ error: legacyError.message }, { status: 500 })
      }
      updatedSub = legacySub
    }

    // Email Notification
    if (status === 'ACCEPTED' || status === 'REJECTED') {
      try {
        const isAccepted = status === 'ACCEPTED'
        const subject = isAccepted 
          ? '🎉 Congratulations! Your Application to MIN Nepal'
          : 'Thank you for your interest in MIN Nepal'

        // Extract semantic data from JSON blob payload (handle both 'data' for modern and 'form_data' for legacy)
        const subData = updatedSub.data || updatedSub.form_data || {}
        const applicantName = subData.Name || subData["Full Name"] || subData.name || "Applicant"
        const applicantEmail = updatedSub.email || subData.Email || subData["Email Address"] || subData.email
        const roleType = updatedSub.form_definitions?.category || updatedSub.type || 'Role'
        
        const content = isAccepted 
            ? `We are thrilled to inform you that your application as a <strong>${roleType}</strong> has been <strong>ACCEPTED</strong>! Welcome to the team. Our coordinators will reach out shortly.`
            : `Thank you for your interest in joining MIN Nepal as a <strong>${roleType}</strong>. After careful consideration, we have decided to move forward with other candidates at this time. We encourage you to apply again in the future.`

        const html = generateMINThemeEmail(`Hi ${applicantName},`, content)

        if (applicantEmail) {
          await sendEmail({
            to: applicantEmail,
            subject,
            html
          })
        }
      } catch (emailErr) {
        console.error(`[PATCH /api/applications/admin/${id}] Non-fatal email error:`, emailErr)
      }
    }

    await logAudit({
      actor_id: user.id,
      actor_name: profile.name,
      action: `UPDATED_APPLICATION_STATUS_${status}`,
      entity_type: 'form_submissions',
      entity_id: id,
      meta: { status, applicant_id: updatedSub.id }
    })

    return Response.json(updatedSub)
  } catch (fatalError) {
    return Response.json({ error: 'Internal Server Error', message: fatalError.message }, { status: 500 })
  }
}



