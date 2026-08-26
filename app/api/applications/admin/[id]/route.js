import { createAdminClient } from '@/lib/supabase/server'
import { withRole } from '@/lib/rbac'
import { logAudit } from '@/lib/audit'
import { sendEmail, generateMINThemeEmail, sendTemplatedEmail } from '@/lib/resend'

// Pipeline stages in order
const PIPELINE_STAGES = ['PENDING', 'REVIEWED', 'ACCEPTED', 'TASK_ASSIGNED', 'INTERVIEW', 'ONBOARDED']
const TERMINAL_STATES = ['REJECTED', 'ONBOARDED']

// Map pipeline status → email template key
const STATUS_EMAIL_MAP = {
  ACCEPTED: 'application_accepted',
  REJECTED: 'application_rejected',
  TASK_ASSIGNED: 'application_task_assigned',
  INTERVIEW: 'application_interview',
  ONBOARDED: 'application_onboarded',
}

export async function PATCH(request, { params }) {
  try {
    const { id } = await params
    
    const { user, profile, error } = await withRole(['ADMIN', 'SUPER_ADMIN', 'MANAGER', 'WEBSITE_MANAGER', 'HR'])
    if (error) {
      return Response.json({ error: error.message }, { status: error.status })
    }

    const body = await request.json()
    let { status, notes, task_bank_url, task_deadline, scheduling_url, buddy_name, buddy_email, team_name } = body
    
    if (!status) {
      return Response.json({ error: 'Status is required' }, { status: 400 })
    }

    const supabase = await createAdminClient()

    // Fetch current status
    const { data: currentApp } = await supabase
      .from('form_submissions')
      .select('status')
      .eq('id', id)
      .single()
    
    const { data: currentLegacyApp } = !currentApp ? await supabase
      .from('join_applications')
      .select('status')
      .eq('id', id)
      .single() : { data: null }

    // form_submissions uses APPROVED instead of ACCEPTED
    const formSubStatus = status === 'ACCEPTED' ? 'APPROVED' : status

    const updateData = { status: formSubStatus }
    if (notes !== undefined) updateData.notes = notes

    // Try form_submissions first
    let { data: updatedSub, error: updateError } = await supabase
      .from('form_submissions')
      .update(updateData)
      .eq('id', id)
      .select('*, form_definitions(category, title)')
      .single()

    // Fallback to join_applications
    if (updateError || !updatedSub) {
      const legacyUpdateData = { status }
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

    // Send pipeline email if status has a mapped template
    const eventKey = STATUS_EMAIL_MAP[status]
    if (eventKey) {
      const subData = updatedSub.data || updatedSub.form_data || {}
      const applicantName = subData.Name || subData["Full Name"] || subData.name || "Applicant"
      const applicantEmail = updatedSub.email || subData.Email || subData["Email Address"] || subData.email
      const formName = updatedSub.form_definitions?.title || updatedSub.type || 'Role'
      const category = updatedSub.form_definitions?.category?.toLowerCase() || ''
      const type = updatedSub.type?.toLowerCase() || ''

      // For non-application categories, use specialized templates
      let finalEventKey = eventKey
      if (status === 'ACCEPTED' || status === 'REJECTED') {
        if (category.includes('inquiry') || type.includes('inquiry')) {
          finalEventKey = status === 'ACCEPTED' ? 'inquiry_responded' : 'application_rejected'
        } else if (category.includes('org') || type.includes('org') || category.includes('partner') || type.includes('partnership')) {
          finalEventKey = status === 'ACCEPTED' ? 'org_accepted' : 'org_rejected'
        } else if (category.includes('ambassador')) {
          finalEventKey = status === 'ACCEPTED' ? 'ambassadorship_accepted' : 'ambassadorship_rejected'
        }
      }

      if (applicantEmail) {
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.mathsinitiatives.org.np'
        await sendTemplatedEmail(finalEventKey, applicantEmail, {
          applicant_name: applicantName,
          form_name: formName,
          role_type: formName,
          contact_message: subData.Message || subData.message || '',
          task_bank_url: task_bank_url || `${appUrl}/tasks`,
          task_deadline: task_deadline || 'TBD',
          scheduling_url: scheduling_url || '',
          buddy_name: buddy_name || 'Your team lead',
          buddy_email: buddy_email || '',
          team_name: team_name || 'MIN Nepal',
        })
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



