import { createAdminClient } from '@/lib/supabase/server'
import { withRole } from '@/lib/rbac'
import { logAudit } from '@/lib/audit'

export const dynamic = 'force-dynamic'

export async function PATCH(request, { params }) {
  try {
    const { id } = await params
    const { user, profile, error: roleError } = await withRole(['ADMIN', 'SUPER_ADMIN', 'MANAGER', 'WEBSITE_MANAGER', 'HR'])
    if (roleError) {
      return Response.json({ error: roleError.message }, { status: roleError.status })
    }

    const body = await request.json()
    const { status, admin_notes } = body

    const supabase = await createAdminClient()
    const updates = { updated_at: new Date().toISOString() }

    if (status) {
      if (!['PENDING', 'RESPONDED', 'ARCHIVED'].includes(status)) {
        return Response.json({ error: 'Invalid inquiry status' }, { status: 400 })
      }
      updates.status = status
    }

    if (admin_notes !== undefined) {
      updates.admin_notes = admin_notes
    }

    const { data, error } = await supabase
      .from('inquiries')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return Response.json({ error: error.message }, { status: 500 })
    }

    await logAudit({
      actor_id: user.id,
      actor_name: profile.name,
      action: 'UPDATE_INQUIRY',
      entity_type: 'inquiries',
      entity_id: id,
      meta: { status, has_notes: !!admin_notes }
    })

    return Response.json(data)
  } catch (fatalError) {
    return Response.json({ error: 'Internal Server Error', details: fatalError.message }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params
    const { user, profile, error: roleError } = await withRole(['ADMIN', 'SUPER_ADMIN', 'WEBSITE_MANAGER', 'HR'])
    if (roleError) {
      return Response.json({ error: roleError.message }, { status: roleError.status })
    }

    const supabase = await createAdminClient()
    const { error } = await supabase.from('inquiries').delete().eq('id', id)

    if (error) {
      return Response.json({ error: error.message }, { status: 500 })
    }

    await logAudit({
      actor_id: user.id,
      actor_name: profile.name,
      action: 'DELETE_INQUIRY',
      entity_type: 'inquiries',
      entity_id: id
    })

    return Response.json({ success: true })
  } catch (fatalError) {
    return Response.json({ error: 'Internal Server Error', details: fatalError.message }, { status: 500 })
  }
}
