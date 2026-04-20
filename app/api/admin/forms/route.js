import { createAdminClient } from '@/lib/supabase/server'
import { withRole } from '@/lib/rbac'
import { logAudit } from '@/lib/audit'
import { sendTemplatedEmail } from '@/lib/resend'

export async function GET() {
  const { error: roleError } = await withRole(['ADMIN', 'WEBSITE_MANAGER'])
  if (roleError) return Response.json({ error: roleError.message }, { status: roleError.status })

  const supabase = await createAdminClient()
  const { data, error } = await supabase
    .from('form_definitions')
    .select('*, email_templates(name)')
    .order('created_at', { ascending: false })

  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json(data)
}

export async function POST(request) {
  const { user, profile, error: roleError } = await withRole(['ADMIN', 'WEBSITE_MANAGER'])
  if (roleError) return Response.json({ error: roleError.message }, { status: roleError.status })

  const body = await request.json()
  const supabase = await createAdminClient()

  const { data, error } = await supabase
    .from('form_definitions')
    .insert([body])
    .select()
    .single()

  if (error) return Response.json({ error: error.message }, { status: 500 })

  await logAudit({
    actor_id: user.id,
    actor_name: profile.name,
    action: 'CREATE_FORM_DEFINITION',
    entity_type: 'form_definitions',
    entity_id: data.id,
    meta: { slug: data.slug, title: data.title }
  })

  return Response.json(data)
}

export async function PATCH(request) {
  const { user, profile, error: roleError } = await withRole(['ADMIN', 'WEBSITE_MANAGER'])
  if (roleError) return Response.json({ error: roleError.message }, { status: roleError.status })

  const body = await request.json()
  const { id, ...updates } = body
  const supabase = await createAdminClient()

  const { data, error } = await supabase
    .from('form_definitions')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) return Response.json({ error: error.message }, { status: 500 })

  // Trigger Notifications if form is being activated
  if (updates.is_active === true) {
    // 1. Find the previous state
    const { data: oldForm } = await supabase.from('form_definitions').select('is_active, category, slug').eq('id', id).single()
    
    // Only notify if it was previously inactive (or we are forcing it)
    // Actually, if we are activating, let's just notify everyone on that list
    const { data: reminders } = await supabase
      .from('intake_reminders')
      .select('*')
      .eq('category', data.category)

    if (reminders && reminders.length > 0) {
      console.log(`Notifying ${reminders.length} users about reopened intake: ${data.slug}`)
      
      // Send emails in background-ish (awaiting for safety in small scale)
      for (const r of reminders) {
        await sendTemplatedEmail('intake_reopened', r.email, {
          applicant_name: 'there',
          form_name: data.title,
          slug: data.slug
        })
      }

      // Clear reminders for this category now that they've been notified
      await supabase.from('intake_reminders').delete().eq('category', data.category)
    }
  }

  await logAudit({
    actor_id: user.id,
    actor_name: profile.name,
    action: 'UPDATE_FORM_DEFINITION',
    entity_type: 'form_definitions',
    entity_id: id,
    meta: { slug: data.slug, updates }
  })

  return Response.json(data)
}

export async function DELETE(request) {
  const { user, profile, error: roleError } = await withRole(['ADMIN', 'WEBSITE_MANAGER'])
  if (roleError) return Response.json({ error: roleError.message }, { status: roleError.status })

  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  
  if (!id) return Response.json({ error: 'ID is required' }, { status: 400 })

  const supabase = await createAdminClient()
  const { error } = await supabase
    .from('form_definitions')
    .delete()
    .eq('id', id)

  if (error) return Response.json({ error: error.message }, { status: 500 })

  await logAudit({
    actor_id: user.id,
    actor_name: profile.name,
    action: 'DELETE_FORM_DEFINITION',
    entity_type: 'form_definitions',
    entity_id: id,
    meta: { deleted: true }
  })

  return Response.json({ success: true })
}
