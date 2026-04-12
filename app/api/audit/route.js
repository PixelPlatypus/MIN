import { createAdminClient } from '@/lib/supabase/server'
import { withRole } from '@/lib/rbac'

export const dynamic = 'force-dynamic'

export async function GET(request) {
  const { error: roleError } = await withRole(['ADMIN', 'MANAGER', 'WEBSITE_MANAGER'])
  if (roleError) return Response.json({ error: roleError.message }, { status: roleError.status })

  const { searchParams } = new URL(request.url)
  const actorId = searchParams.get('actor_id')
  const action = searchParams.get('action')
  const entityType = searchParams.get('entity_type')

  const supabaseAdmin = await createAdminClient()

  let query = supabaseAdmin
    .from('audit_log')
    .select('*')
    .order('created_at', { ascending: false })

  if (actorId) query = query.eq('actor_id', actorId)
  if (action) query = query.ilike('action', `%${action}%`)
  if (entityType) query = query.eq('entity_type', entityType)

  const { data: logs, error } = await query.limit(300)

  if (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }

  return Response.json(logs)
}

/**
 * Trigger manual cleanup of old logs
 * Normally scheduled via pg_cron but can be called here
 */
export async function DELETE(request) {
  const { error: roleError } = await withRole(['ADMIN'])
  if (roleError) return Response.json({ error: roleError.message }, { status: roleError.status })

  const supabaseAdmin = await createAdminClient()
  
  // Call the purge function we created in the migration
  const { error } = await supabaseAdmin.rpc('purge_old_audit_logs')

  if (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }

  return Response.json({ success: true, message: 'Logs older than 30 days purged.' })
}
