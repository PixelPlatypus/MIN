import { createAdminClient } from '@/lib/supabase/server'
import { withRole } from '@/lib/rbac'
import { logAudit } from '@/lib/audit'

export async function GET(request, { params }) {
  const { id } = await params
  const supabaseAdmin = await createAdminClient()
  
  const { data, error } = await supabaseAdmin
    .from('gallery')
    .select('*')
    .eq('id', id)
    .single()

  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json(data)
}

export async function PATCH(request, { params }) {
  const { id } = await params
  const { user, profile, error } = await withRole(['ADMIN', 'MANAGER', 'WEBSITE_MANAGER', 'WRITER'])
  if (error) return Response.json({ error: error.message }, { status: error.status })

  const json = await request.json()
  const supabaseAdmin = await createAdminClient()

  const { error: updateError } = await supabaseAdmin
    .from('gallery')
    .update({
      caption: json.caption,
      album: json.album,
      tags: json.tags,
      image_url: json.image_url
    })
    .eq('id', id)

  if (updateError) {
    return Response.json({ error: updateError.message }, { status: 500 })
  }

  await logAudit({
    actor_id: user.id,
    actor_name: profile.name,
    action: 'UPDATED_GALLERY_IMAGE',
    entity_type: 'gallery',
    entity_id: id,
    metadata: json
  })

  return Response.json({ success: true })
}

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
