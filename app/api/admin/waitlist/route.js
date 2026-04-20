import { createAdminClient } from '@/lib/supabase/server'
import { withRole } from '@/lib/rbac'
import { logAudit } from '@/lib/audit'

export async function GET() {
  const { error: roleError } = await withRole(['ADMIN', 'WEBSITE_MANAGER'])
  if (roleError) return Response.json({ error: roleError.message }, { status: roleError.status })

  const supabase = await createAdminClient()
  const { data, error } = await supabase
    .from('intake_reminders')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json(data)
}

export async function DELETE(request) {
  const { user, profile, error: roleError } = await withRole(['ADMIN', 'WEBSITE_MANAGER'])
  if (roleError) return Response.json({ error: roleError.message }, { status: roleError.status })

  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  
  if (!id) return Response.json({ error: 'ID is required' }, { status: 400 })

  const supabase = await createAdminClient()
  const { error } = await supabase
    .from('intake_reminders')
    .delete()
    .eq('id', id)

  if (error) return Response.json({ error: error.message }, { status: 500 })

  await logAudit({
    actor_id: user.id,
    actor_name: profile.name,
    action: 'DELETE_WAITLIST_ENTRY',
    entity_type: 'intake_reminders',
    entity_id: id
  })

  return Response.json({ success: true })
}
