import { createAdminClient } from '@/lib/supabase/server'
import { withRole } from '@/lib/rbac'
import { logAudit } from '@/lib/audit'

export async function PATCH(request, { params }) {
  const { id } = await params
  const { user, profile, error: roleError } = await withRole(['ADMIN'])
  if (roleError) return Response.json({ error: roleError.message }, { status: roleError.status })

  const body = await request.json()
  const { name, username } = body

  // We explicitly limit this to editing name and username. We do not edit auth stuff here.
  if(!name || !username) {
     return Response.json({ error: "Missing name or username" }, { status: 400 })
  }

  const supabaseAdmin = await createAdminClient()

  // Update profile attributes
  const { data, error } = await supabaseAdmin
    .from('profiles')
    .update({ name, username })
    .eq('id', id)
    .select('name, username')
    .single()

  if (error) {
    if (error.code === '23505') { // Unique violation for username
      return Response.json({ error: "That username is already taken. Please pick another." }, { status: 400 })
    }
    return Response.json({ error: error.message }, { status: 500 })
  }

  await logAudit({
    actor_id: user.id,
    actor_name: profile.name,
    action: `UPDATED_USER_PROFILE`,
    entity_type: 'profiles',
    entity_id: id,
    meta: { target_name: data.name, target_username: data.username }
  })

  return Response.json(data)
}
