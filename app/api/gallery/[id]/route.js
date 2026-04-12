import { createAdminClient } from '@/lib/supabase/server'
import { withRole } from '@/lib/rbac'
import { logAudit } from '@/lib/audit'

export async function DELETE(request, { params }) {
  const { id } = await params
  const { user, profile, error } = await withRole(['ADMIN', 'MANAGER', 'WEBSITE_MANAGER', 'WRITER'])
  if (error) return Response.json({ error: error.message }, { status: error.status })

  const supabaseAdmin = await createAdminClient()
  const { error: deleteError } = await supabaseAdmin
    .from('gallery')
    .delete()
    .eq('id', id)

  if (deleteError) {
    return Response.json({ error: deleteError.message }, { status: 500 })
  }

  await logAudit({
    actor_id: user.id,
    actor_name: profile.name,
    action: 'DELETED_GALLERY_IMAGE',
    entity_type: 'gallery',
    entity_id: id
  })

  return Response.json({ success: true })
}
