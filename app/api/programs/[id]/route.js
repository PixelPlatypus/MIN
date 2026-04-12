// app/api/programs/[id]/route.js
import { createClient } from '@/lib/supabase/server'
import { withRole } from '@/lib/rbac'
import { logAudit } from '@/lib/audit'

export async function GET(request, { params }) {
  const { id } = await params
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('programs')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    return Response.json({ error: error.message }, { status: 404 })
  }

  return Response.json(data)
}

export async function PATCH(request, { params }) {
  const { id } = await params
  const { user, profile, supabase, error } = await withRole(['ADMIN', 'MANAGER', 'WEBSITE_MANAGER'])
  if (error) return Response.json({ error: error.message }, { status: error.status })

  const body = await request.json()
  const { data, error: updateError } = await supabase
    .from('programs')
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
    action: 'UPDATED_PROGRAM',
    entity_type: 'programs',
    entity_id: id,
    meta: { name: data.name }
  })

  return Response.json(data)
}

export async function DELETE(request, { params }) {
  const { id } = await params
  const { user, profile, supabase, error } = await withRole(['ADMIN', 'MANAGER', 'WEBSITE_MANAGER'])
  if (error) return Response.json({ error: error.message }, { status: error.status })

  const { error: deleteError } = await supabase
    .from('programs')
    .delete()
    .eq('id', id)

  if (deleteError) {
    return Response.json({ error: deleteError.message }, { status: 500 })
  }

  await logAudit({
    actor_id: user.id,
    actor_name: profile.name,
    action: 'DELETED_PROGRAM',
    entity_type: 'programs',
    entity_id: id
  })

  return Response.json({ success: true })
}
