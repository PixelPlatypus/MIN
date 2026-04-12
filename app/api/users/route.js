import { createAdminClient } from '@/lib/supabase/server'
import { withRole } from '@/lib/rbac'

export async function GET() {
  const { user, error: roleError } = await withRole(['ADMIN', 'MANAGER', 'WEBSITE_MANAGER'])
  if (roleError) return Response.json({ error: roleError.message }, { status: roleError.status })

  const supabaseAdmin = await createAdminClient()

  // Fetch all profiles
  const { data: users, error } = await supabaseAdmin
    .from('profiles')
    .select('id, name, email, role, created_at')
    .order('created_at', { ascending: false })

  if (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }

  const usersWithSelf = users.map(u => ({
    ...u,
    isSelf: u.id === (user?.id) // user comes from withRole
  }))

  return Response.json(usersWithSelf)
}
