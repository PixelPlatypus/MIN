import { createClient } from '@/lib/supabase/server'
import { withRole } from '@/lib/rbac'
import { logAudit } from '@/lib/audit'

export async function PATCH(request, { params }) {
  const { id } = await params
  const { user, profile, supabase, error } = await withRole(['ADMIN'])
  if (error) return Response.json({ error: error.message }, { status: error.status })

  const body = await request.json()
  const { data, error: updateError } = await supabase
    .from('timeline_events')
    .update({ 
      ...body,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single()

  if (updateError) {
    return Response.json({ error: updateError.message }, { status: 500 })
  }

  await logAudit({
    actor_id: user.id,
    actor_name: profile.name,
    action: 'UPDATED_TIMELINE_EVENT',
    entity_type: 'timeline_events',
    entity_id: id,
    meta: { title: data.title }
  })

  return Response.json(data)
}

export async function DELETE(request, { params }) {
  const { id } = await params
  const { user, profile, supabase, error } = await withRole(['ADMIN'])
  if (error) return Response.json({ error: error.message }, { status: error.status })

  const { error: deleteError } = await supabase
    .from('timeline_events')
    .delete()
    .eq('id', id)

  if (deleteError) {
    return Response.json({ error: deleteError.message }, { status: 500 })
  }

  await logAudit({
    actor_id: user.id,
    actor_name: profile.name,
    action: 'DELETED_TIMELINE_EVENT',
    entity_type: 'timeline_events',
    entity_id: id
  })

  return Response.json({ success: true })
}
