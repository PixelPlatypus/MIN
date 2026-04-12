// app/api/events/route.js
import { createClient } from '@/lib/supabase/server'
import { withRole } from '@/lib/rbac'
import { logAudit } from '@/lib/audit'

export async function GET(request) {
  const supabase = await createClient()
  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status')

  let query = supabase
    .from('events')
    .select('*')
    .order('start_date', { ascending: false })

  if (status) {
    query = query.eq('status', status)
  }

  const { data, error } = await query

  if (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }

  return Response.json(data)
}

export async function POST(request) {
  const { user, profile, supabase, error } = await withRole(['ADMIN', 'MANAGER', 'WEBSITE_MANAGER', 'WRITER'])
  if (error) return Response.json({ error: error.message }, { status: error.status })

  const body = await request.json()
  const { data, error: insertError } = await supabase
    .from('events')
    .insert([{ ...body, created_by: user.id }])
    .select()
    .single()

  if (insertError) {
    return Response.json({ error: insertError.message }, { status: 500 })
  }

  await logAudit({
    actor_id: user.id,
    actor_name: profile.name,
    action: 'CREATED_EVENT',
    entity_type: 'events',
    entity_id: data.id,
    meta: { title: data.title }
  })

  return Response.json(data)
}
