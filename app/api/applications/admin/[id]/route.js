import { createAdminClient } from '@/lib/supabase/server'
import { withRole } from '@/lib/rbac'
import { logAudit } from '@/lib/audit'
import { sendEmail } from '@/lib/resend'

export async function PATCH(request, { params }) {
  try {
    const { id } = await params
    console.log(`[PATCH /api/applications/admin/${id}] STARTING...`)
    
    console.log(`[PATCH /api/applications/admin/${id}] Verifying roles...`)
    const { user, profile, error } = await withRole(['ADMIN', 'MANAGER'])
    if (error) {
      console.error(`[PATCH /api/applications/admin/${id}] Role verification failed:`, error)
      return Response.json({ error: error.message }, { status: error.status })
    }
    console.log(`[PATCH /api/applications/admin/${id}] Role verified for ${profile.name}`)

    const body = await request.json()
    const { status, notes } = body
    console.log(`[PATCH /api/applications/admin/${id}] Body:`, { status, notes })
    
    if (!status) {
      console.error(`[PATCH /api/applications/admin/${id}] Missing status`)
      return Response.json({ error: 'Status is required' }, { status: 400 })
    }

    console.log(`[PATCH /api/applications/admin/${id}] Initializing admin client...`)
    const supabase = await createAdminClient()
    
    const updateData = { status }
    if (notes !== undefined) updateData.notes = notes

    console.log(`[PATCH /api/applications/admin/${id}] Updating database...`)
    const { data: updatedData, error: updateError } = await supabase
      .from('join_applications')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (updateError) {
      console.error(`[PATCH /api/applications/admin/${id}] Database update error:`, updateError)
      return Response.json({ error: updateError.message }, { status: 500 })
    }
    console.log(`[PATCH /api/applications/admin/${id}] Database updated successfully`)

    // Email Notification
    if (status === 'ACCEPTED' || status === 'REJECTED') {
      try {
        console.log(`[PATCH /api/applications/admin/${id}] Preparation for email to ${updatedData.email}...`)
        const isAccepted = status === 'ACCEPTED'
        const subject = isAccepted 
          ? '🎉 Congratulations! Your Application to MIN Nepal'
          : 'Thank you for your interest in MIN Nepal'
        
        const html = `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; border: 1px solid #eee; border-radius: 20px;">
            <img src="https://mathsinitiatives.org.np/logo.png" alt="MIN Nepal" style="width: 120px; margin-bottom: 30px;">
            <h1 style="color: #111; font-size: 24px; font-weight: 800; margin-bottom: 20px;">Hi ${updatedData.name},</h1>
            <p style="color: #444; font-size: 16px; line-height: 1.6;">
              ${isAccepted 
                ? `Inform you that your application as a <strong>${updatedData.role_type}</strong> has been <strong>ACCEPTED</strong>!`
                : `Thank you for your interest in joining MIN Nepal as a ${updatedData.role_type}. After careful consideration, we have decided to move forward with other candidates.`
              }
            </p>
            <p style="color: #888; font-size: 12px; text-align: center; margin-top: 40px;">
              Mathematics Initiatives Nepal (MIN Nepal)
            </p>
          </div>
        `

        console.log(`[PATCH /api/applications/admin/${id}] Sending email...`)
        await sendEmail({
          to: updatedData.email,
          subject,
          html
        })
        console.log(`[PATCH /api/applications/admin/${id}] Email sent successfully`)
      } catch (emailErr) {
        console.error(`[PATCH /api/applications/admin/${id}] Non-fatal email error:`, emailErr)
      }
    }

    console.log(`[PATCH /api/applications/admin/${id}] Logging audit...`)
    await logAudit({
      actor_id: user.id,
      actor_name: profile.name,
      action: `UPDATED_APPLICATION_STATUS_${status}`,
      entity_type: 'join_applications',
      entity_id: id,
      meta: { status, applicant: updatedData.name }
    })
    console.log(`[PATCH /api/applications/admin/${id}] SUCCESS`)

    return Response.json(updatedData)
  } catch (fatalError) {
    console.error(`[PATCH /api/applications/admin/UNKNOWN] FATAL ERROR:`, fatalError)
    return Response.json({ 
      error: 'Internal Server Error', 
      message: fatalError.message,
      stack: process.env.NODE_ENV === 'development' ? fatalError.stack : undefined
    }, { status: 500 })
  }
}



