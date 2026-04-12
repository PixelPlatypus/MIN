import { createClient } from '@/lib/supabase/server'
import { withRole } from '@/lib/rbac'
import { logAudit } from '@/lib/audit'

export async function GET() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('timeline_events')
    .select('*')
    .order('sort_order', { ascending: true })

  if (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }

  return Response.json(data)
}

export async function POST(request) {
  const { user, profile, supabase, error } = await withRole(['ADMIN'])
  if (error) return Response.json({ error: error.message }, { status: error.status })

  const body = await request.json()
  const { data, error: insertError } = await supabase
    .from('timeline_events')
    .insert([body])
    .select()
    .single()

  if (insertError) {
    return Response.json({ error: insertError.message }, { status: 500 })
  }

  await logAudit({
    actor_id: user.id,
    actor_name: profile.name,
    action: 'CREATED_TIMELINE_EVENT',
    entity_type: 'timeline_events',
    entity_id: data.id,
    meta: { title: data.title }
  })

  return Response.json(data)
}
