import { createAdminClient } from '@/lib/supabase/server'
import { withRole } from '@/lib/rbac'
import { logAudit } from '@/lib/audit'

export async function PATCH(request, { params }) {
  const { id } = await params
  const { user, profile, error: roleError } = await withRole(['ADMIN'])
  if (roleError) return Response.json({ error: roleError.message }, { status: roleError.status })

  // Admin cannot modify their own role via this endpoint for safety
  if (id === user.id) {
    return Response.json({ error: "You cannot change your own role/status from here." }, { status: 400 })
  }

  const body = await request.json()
  const { role, password } = body
  const supabaseAdmin = await createAdminClient()
  let auditDetails = {}

  // 1. Handle Role Update
  if (role) {
    if (!['ADMIN', 'MANAGER', 'WRITER', 'WEBSITE_MANAGER'].includes(role)) {
      return Response.json({ error: "Invalid role specified." }, { status: 400 })
    }
    const { error: roleError } = await supabaseAdmin
      .from('profiles')
      .update({ role })
      .eq('id', id)
    
    if (roleError) return Response.json({ error: `Profile error: ${roleError.message}` }, { status: 500 })
    auditDetails.new_role = role
  }

  // 2. Handle Blind Password Reset (Admin capability)
  if (password) {
    if (password.length < 6) return Response.json({ error: "Password too short." }, { status: 400 })
    
    const { error: passError } = await supabaseAdmin.auth.admin.updateUserById(id, { 
      password: password 
    })
    
    if (passError) return Response.json({ error: `Auth error: ${passError.message}` }, { status: 500 })
    auditDetails.password_changed = true
  }

  // Log the comprehensive update
  const { data: targetUser } = await supabaseAdmin.from('profiles').select('name, email').eq('id', id).single()

  await logAudit({
    actor_id: user.id,
    actor_name: profile.name,
    action: 'UPDATED_USER_ACCOUNT',
    entity_type: 'profiles',
    entity_id: id,
    meta: { 
      target_email: targetUser?.email,
      ...auditDetails
    }
  })

  return Response.json({ success: true, user: targetUser })
}

export async function DELETE(request, { params }) {
  const { id } = await params
  const { user, profile, error: roleError } = await withRole(['ADMIN'])
  if (roleError) return Response.json({ error: roleError.message }, { status: roleError.status })

  // Admin cannot delete their own profile
  if (id === user.id) {
    return Response.json({ error: "You cannot delete your own profile. Safety first!" }, { status: 400 })
  }

  const supabaseAdmin = await createAdminClient()

  // 1. Get user details for audit logs before they are gone
  const { data: targetUser } = await supabaseAdmin.from('profiles').select('email, username').eq('id', id).single()

  // 2. Delete user in Auth
  // This will now succeed because we fixed the foreign key constraints in the migration
  const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(id)

  if (authError) {
    console.error('Auth deletion error:', authError)
    return Response.json({ error: `Auth Service Error: ${authError.message}` }, { status: 500 })
  }

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
