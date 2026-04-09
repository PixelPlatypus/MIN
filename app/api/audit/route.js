import { createAdminClient } from '@/lib/supabase/server'
import { withRole } from '@/lib/rbac'

export async function GET() {
  const { error: roleError } = await withRole(['ADMIN'])
  if (roleError) return Response.json({ error: roleError.message }, { status: roleError.status })

  const supabaseAdmin = await createAdminClient()

  const { data: logs, error } = await supabaseAdmin
    .from('audit_log')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(150)

  if (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }

  return Response.json(logs)
}
