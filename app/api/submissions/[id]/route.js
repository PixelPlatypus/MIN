import { createClient, createAdminClient } from '@/lib/supabase/server'
import { withRole } from '@/lib/rbac'
import { logAudit } from '@/lib/audit'
import { sendEmail, generateMINThemeEmail } from '@/lib/resend'
import { slugify } from '@/lib/slugify'

export async function PATCH(request, { params }) {
  const { id } = await params
  console.log('PATCH submission request received for ID:', id)
  const { user, profile, error } = await withRole(['ADMIN', 'MANAGER', 'WRITER', 'WEBSITE_MANAGER'])
  if (error) {
    console.error('Auth Error in Submissions:', error)
    return Response.json({ error: error.message }, { status: error.status })
  }

  const body = await request.json()
  console.log('Submission Body:', body)
  const { status, note = '' } = body
  
  const supabaseAdmin = await createAdminClient()
  console.log('Admin Client Created')

  // 1. Get the submission data
  const { data: submission, error: fetchError } = await supabaseAdmin
    .from('content_submissions')
    .select('*')
    .eq('id', id)
    .single()

  if (fetchError) {
    console.error('Submission Fetch Error:', fetchError)
    return Response.json({ error: fetchError.message }, { status: 500 })
  }
  console.log('Submission found:', submission.title)

  // 2. Handle Approval Logic
  if (status === 'APPROVED' && submission.status !== 'APPROVED') {
    // A. Create the actual content entry
    const slug = slugify(submission.title) + '-' + Math.random().toString(36).substring(2, 6)
    
    const { data: newContent, error: contentError } = await supabaseAdmin
      .from('content')
      .insert([{
        title: submission.title,
        slug: slug,
        type: submission.type,
        content_type: submission.content_type === 'LINK' ? 'PDF' : submission.content_type,
        body: submission.body,
        pdf_url: submission.pdf_url,
        pdf_filename: submission.pdf_filename,
        author_name: submission.submitter_name,
        status: 'PUBLISHED',
        published_at: new Date().toISOString()
      }])
      .select()
      .single()

    if (contentError) {
      console.error('Content Creation Error:', contentError)
      return Response.json({ error: `Failed to create content: ${contentError.message}` }, { status: 500 })
    }
    console.log('Content created with ID:', newContent.id)

    // B. Mark submission as approved
    const { error: updateError } = await supabaseAdmin
      .from('content_submissions')
      .update({ 
        status: 'APPROVED', 
        reviewer_id: user.id, 
        reviewed_at: new Date().toISOString(),
        notes: note
      })
      .eq('id', id)

    if (updateError) {
      console.error('Submission Update Error:', updateError)
      return Response.json({ error: updateError.message }, { status: 500 })
    }
    console.log('Submission status updated to APPROVED')

    // C. Send email to submitter
    try {
      const liveUrl = `${process.env.NEXT_PUBLIC_APP_URL}/content/${slug}`
      const content = `
          <p>Great news! Your submission <strong>"${submission.title}"</strong> has been reviewed and approved by the MIN team.</p>
          <p>It is now live on our platform and accessible to students across Nepal.</p>
          <div style="margin: 30px 0; text-align: center;">
            <a href="${liveUrl}" style="background-color: #4361ee; color: white; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 8px;">View Your Published Work</a>
          </div>
          <p>Thank you so much for contributing to the Mathematics Initiatives in Nepal. Your effort helps make geometry and math education more accessible for everyone.</p>
      `
      
      await sendEmail({
        to: submission.submitter_email,
        subject: 'Your Content has been Published! - MIN Nepal',
        html: generateMINThemeEmail(`Hello ${submission.submitter_name},`, content)
      })
    } catch (mailErr) {
      console.error('Approval Email Failed:', mailErr)
      // We don't fail the whole request because the content IS published
    }

    await logAudit({
      actor_id: user.id,
      actor_name: profile.name,
      action: 'APPROVED_CONTENT_SUBMISSION',
      entity_type: 'content_submissions',
      entity_id: id,
      meta: { title: submission.title, content_id: newContent.id }
    })

    return Response.json({ success: true, message: 'Content published and user notified.' })
  }

  // 3. Handle Rejection Logic
  if (status === 'REJECTED') {
    const { error: rejectError } = await supabaseAdmin
      .from('content_submissions')
      .update({ 
        status: 'REJECTED', 
        reviewer_id: user.id, 
        reviewed_at: new Date().toISOString(),
        notes: note
      })
      .eq('id', id)

    if (rejectError) return Response.json({ error: rejectError.message }, { status: 500 })

    await logAudit({
      actor_id: user.id,
      actor_name: profile.name,
      action: 'REJECTED_CONTENT_SUBMISSION',
      entity_type: 'content_submissions',
      entity_id: id,
      meta: { title: submission.title }
    })

    return Response.json({ success: true, message: 'Submission rejected.' })
  }

  return Response.json({ error: 'Invalid status update' }, { status: 400 })
}
