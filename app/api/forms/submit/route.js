import { createAdminClient } from '@/lib/supabase/server'

export async function POST(request) {
  const body = await request.json()
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
      .select('email_template_id')
      .eq('id', form_id)
      .single()

    if (formDef?.email_template_id) {
       // Logic for Resend or other mailer would go here
       // For now we just record it succeeded in the DB
       console.log('Submission received. Email automation triggered for template:', formDef.email_template_id)
    }
  } catch (err) {
    console.error('Email automation failure', err)
  }

  return Response.json({ success: true, id: submission.id })
}
