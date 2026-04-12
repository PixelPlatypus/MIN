import { createAdminClient } from '@/lib/supabase/server'
import { withRole } from '@/lib/rbac'
import { logAudit } from '@/lib/audit'

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
