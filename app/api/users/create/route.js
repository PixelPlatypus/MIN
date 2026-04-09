import { createAdminClient } from '@/lib/supabase/server'
import { withRole } from '@/lib/rbac'
import { logAudit } from '@/lib/audit'

export async function POST(request) {
  const { user, profile, error: roleError } = await withRole(['ADMIN'])
  if (roleError) return Response.json({ error: roleError.message }, { status: roleError.status })

  const body = await request.json()
  const { name, username, email, password, role } = body

  if (!email || !password || !username) {
    return Response.json({ error: 'Missing required credentials fields.' }, { status: 400 })
  }

  const supabaseAdmin = await createAdminClient()

  // 1. Create auth user with provided credentials
  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { name, role }
  })

  if (authError) {
    return Response.json({ error: authError.message }, { status: 500 })
  }

  const newUserId = authData.user.id

  // 2. Wait for the Postgres trigger to create the profile row...
  // Usually instant, but let's give it a short safe delay.
  await new Promise(resolve => setTimeout(resolve, 500))

  // 3. Update the newly created profile with the requested username and role explicitly
  const { error: profileError } = await supabaseAdmin
    .from('profiles')
    .update({ username, role, name })
    .eq('id', newUserId)

  if (profileError) {
    // Note: User was created in Auth but profile update failed.
    return Response.json({ error: 'User created but profile/username update failed: ' + profileError.message }, { status: 500 })
  }

  // 4. Log the action
  await logAudit({
    actor_id: user.id,
    actor_name: profile.name,
    action: `CREATED_${role}_USER`,
    entity_type: 'profiles',
    entity_id: newUserId,
    meta: { created_email: email, created_username: username }
  })

  return Response.json({ success: true, id: newUserId })
}
