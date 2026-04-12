import { createAdminClient } from '@/lib/supabase/server'
import { withRole } from '@/lib/rbac'
import { logAudit } from '@/lib/audit'

export async function GET() {
  const { error: roleError } = await withRole(['ADMIN', 'WEBSITE_MANAGER'])
  if (roleError) return Response.json({ error: roleError.message }, { status: roleError.status })

  const supabase = await createAdminClient()
  const { data, error } = await supabase
    .from('email_templates')
    .select('*')
    .order('name', { ascending: true })

  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json(data)
}

export async function POST(request) {
  const { user, profile, error: roleError } = await withRole(['ADMIN', 'WEBSITE_MANAGER'])
  if (roleError) return Response.json({ error: roleError.message }, { status: roleError.status })

  const body = await request.json()
  const supabase = await createAdminClient()

  const { data, error } = await supabase
    .from('email_templates')
    .insert([body])
    .select()
    .single()

  if (error) return Response.json({ error: error.message }, { status: 500 })

  await logAudit({
    actor_id: user.id,
    actor_name: profile.name,
    action: 'CREATE_EMAIL_TEMPLATE',
    entity_type: 'email_templates',
    entity_id: data.id,
    meta: { name: data.name, subject: data.subject }
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
    .from('email_templates')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) return Response.json({ error: error.message }, { status: 500 })

  await logAudit({
    actor_id: user.id,
    actor_name: profile.name,
    action: 'UPDATE_EMAIL_TEMPLATE',
    entity_type: 'email_templates',
    entity_id: id,
    meta: { name: data.name, updates }
  })

  return Response.json(data)
}
