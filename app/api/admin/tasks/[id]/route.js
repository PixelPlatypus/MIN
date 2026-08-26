import { createClient } from '@/lib/supabase/server'
import { withRole } from '@/lib/rbac'
import { logAudit } from '@/lib/audit'

export const dynamic = 'force-dynamic'

export async function GET(request, { params }) {
  const { id } = await params
  const { error: roleError } = await withRole(['ADMIN', 'SUPER_ADMIN', 'WEBSITE_MANAGER', 'HR'])
  if (roleError) return Response.json({ error: roleError.message }, { status: roleError.status })

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('id', id)
    .single()

  if (error) return Response.json({ error: error.message }, { status: 404 })
  return Response.json(data)
}

export async function PATCH(request, { params }) {
  const { id } = await params
  const { user, profile, error: roleError } = await withRole(['ADMIN', 'SUPER_ADMIN', 'WEBSITE_MANAGER', 'HR'])
  if (roleError) return Response.json({ error: roleError.message }, { status: roleError.status })

  try {
    const body = await request.json()
    const supabase = await createClient()

    const updateData = {
      ...body,
      updated_at: new Date().toISOString()
    }
    delete updateData.id
    delete updateData.created_at

    const { data, error } = await supabase
      .from('tasks')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) return Response.json({ error: error.message }, { status: 500 })

    await logAudit(supabase, user, 'UPDATE_TASK', {
      taskId: id,
      title: data.title
    })

    return Response.json(data)
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  const { id } = await params
  const { user, error: roleError } = await withRole(['ADMIN', 'SUPER_ADMIN', 'WEBSITE_MANAGER', 'HR'])
  if (roleError) return Response.json({ error: roleError.message }, { status: roleError.status })

  const supabase = await createClient()
  const { data: existing } = await supabase
    .from('tasks')
    .select('title')
    .eq('id', id)
    .single()

  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', id)

  if (error) return Response.json({ error: error.message }, { status: 500 })

  await logAudit(supabase, user, 'DELETE_TASK', {
    taskId: id,
    title: existing?.title
  })

  return Response.json({ success: true })
}
