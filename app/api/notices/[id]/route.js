import { createAdminClient } from '@/lib/supabase/server'
import { withRole } from '@/lib/rbac'
import { logAudit } from '@/lib/audit'

export async function GET(request, { params }) {
  try {
    const { id } = await params
    const { profile, error: authError } = await withRole(['ADMIN', 'MANAGER', 'WEBSITE_MANAGER'])
    if (authError) return Response.json({ error: authError.message }, { status: authError.status })

    const supabase = await createAdminClient()
    const { data, error } = await supabase
      .from('popup_notices')
      .select('*')
      .eq('id', id)
      .single()

    if (error) return Response.json({ error: error.message }, { status: 404 })
    return Response.json(data)
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 })
  }
}

export async function PATCH(request, { params }) {
  try {
    const { id } = await params
    const { user, profile, error: authError } = await withRole(['ADMIN', 'WEBSITE_MANAGER'])
    if (authError) return Response.json({ error: authError.message }, { status: authError.status })

    const body = await request.json()
    const supabase = await createAdminClient()

    // Enforce: only one notice can be active at a time
    if (body.is_active) {
      await supabase
        .from('popup_notices')
        .update({ is_active: false })
        .eq('is_active', true)
        .neq('id', id)
    }

    const { data, error } = await supabase
      .from('popup_notices')
      .update(body)
      .eq('id', id)
      .select()
      .single()

    if (error) return Response.json({ error: error.message }, { status: 500 })

    await logAudit({
      actor_id: user.id,
      actor_name: profile.name,
      action: 'UPDATED_POPUP_NOTICE',
      entity_type: 'popup_notices',
      entity_id: id,
      meta: { title: data.title }
    })

    return Response.json(data)
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params
    const { user, profile, error: authError } = await withRole(['ADMIN', 'WEBSITE_MANAGER'])
    if (authError) return Response.json({ error: authError.message }, { status: authError.status })

    const supabase = await createAdminClient()

    const { error } = await supabase
      .from('popup_notices')
      .delete()
      .eq('id', id)

    if (error) return Response.json({ error: error.message }, { status: 500 })

    await logAudit({
      actor_id: user.id,
      actor_name: profile.name,
      action: 'DELETED_POPUP_NOTICE',
      entity_type: 'popup_notices',
      entity_id: id
    })

    return Response.json({ success: true })
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 })
  }
}
