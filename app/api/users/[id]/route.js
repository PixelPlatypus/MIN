import { createAdminClient } from '@/lib/supabase/server'
import { withRole } from '@/lib/rbac'
import { logAudit } from '@/lib/audit'

export async function PATCH(request, { params }) {
  const { id } = await params
  const { user, profile, error: roleError } = await withRole(['ADMIN'])
  if (roleError) return Response.json({ error: roleError.message }, { status: roleError.status })

  // Admin cannot modify their own role via this endpoint for safety
  if (id === user.id) {
    return Response.json({ error: "You cannot change your own role." }, { status: 400 })
  }

  const body = await request.json()
  const { role } = body

  if (!['ADMIN', 'MANAGER', 'WRITER'].includes(role)) {
    return Response.json({ error: "Invalid role specified." }, { status: 400 })
  }

  const supabaseAdmin = await createAdminClient()

  const { data, error } = await supabaseAdmin
    .from('profiles')
    .update({ role })
    .eq('id', id)
    .select('name, email, role')
    .single()

  if (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }

  await logAudit({
    actor_id: user.id,
    actor_name: profile.name,
    action: `CHANGED_USER_ROLE_TO_${role}`,
    entity_type: 'profiles',
    entity_id: id,
    meta: { target_email: data.email }
  })

  return Response.json(data)
}

export async function DELETE(request, { params }) {
  const { id } = await params
  const { user, profile, error: roleError } = await withRole(['ADMIN'])
  if (roleError) return Response.json({ error: roleError.message }, { status: roleError.status })

  // Admin cannot delete their own profile
  if (id === user.id) {
    return Response.json({ error: "You cannot delete your own profile." }, { status: 400 })
  }

  const supabaseAdmin = await createAdminClient()

  // 1. Get user details for audit logs
  const { data: targetUser } = await supabaseAdmin.from('profiles').select('email, username').eq('id', id).single()

  // 2. Delete user in Auth (this heavily cascades down to profiles due to Supabase foreign keys)
  const { error } = await supabaseAdmin.auth.admin.deleteUser(id)

  if (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }

  // 3. Optional explicit row profile delete just in case cascading foreign keys aren't set up perfectly 
  await supabaseAdmin.from('profiles').delete().eq('id', id)

  // 4. Log the deletion
  await logAudit({
    actor_id: user.id,
    actor_name: profile.name,
    action: `DELETED_USER_ACCOUNT`,
    entity_type: 'profiles',
    entity_id: id,
    meta: { target_email: targetUser?.email, target_username: targetUser?.username }
  })

  return Response.json({ success: true })
}

