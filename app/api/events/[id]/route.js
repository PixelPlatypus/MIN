// app/api/events/[id]/route.js
import { createClient, createAdminClient } from '@/lib/supabase/server'
import { withRole } from '@/lib/rbac'
import { logAudit } from '@/lib/audit'

export async function PATCH(request, { params }) {
  const { id } = await params
  const { user, profile, error } = await withRole(['ADMIN', 'MANAGER'])
  if (error) return Response.json({ error: error.message }, { status: error.status })

  const body = await request.json()
  const supabaseAdmin = await createAdminClient()

  const { data, error: updateError } = await supabaseAdmin
    .from('events')
    .update(body)
    .eq('id', id)
    .select()
    .single()

  if (updateError) {
    return Response.json({ error: updateError.message }, { status: 500 })
  }

  await logAudit({
    actor_id: user.id,
    actor_name: profile.name,
    action: 'UPDATED_EVENT',
    entity_type: 'events',
    entity_id: id,
    meta: { title: data.title }
  })

  return Response.json(data)
}

export async function DELETE(request, { params }) {
  const { id } = await params
  const { user, profile, error } = await withRole(['ADMIN', 'MANAGER'])
  if (error) return Response.json({ error: error.message }, { status: error.status })

  const supabaseAdmin = await createAdminClient()

  const { error: deleteError } = await supabaseAdmin
    .from('events')
    .delete()
    .eq('id', id)

  if (deleteError) {
    return Response.json({ error: deleteError.message }, { status: 500 })
  }

  await logAudit({
    actor_id: user.id,
    actor_name: profile.name,
    action: 'DELETED_EVENT',
    entity_type: 'events',
    entity_id: id
  })

  return Response.json({ success: true })
}
