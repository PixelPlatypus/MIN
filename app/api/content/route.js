// app/api/content/route.js
import { createClient } from '@/lib/supabase/server'
import { withRole } from '@/lib/rbac'
import { logAudit } from '@/lib/audit'

export async function GET(request) {
  const supabase = await createClient()
  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status')
  const type = searchParams.get('type')

  let query = supabase
    .from('content')
    .select('*')
    .order('published_at', { ascending: false })

  if (status) query = query.eq('status', status)
  if (type && type !== 'ALL') query = query.eq('type', type)

  const { data, error } = await query

  if (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }

  return Response.json(data)
}

export async function POST(request) {
  const { user, profile, supabase, error } = await withRole(['ADMIN', 'MANAGER', 'WRITER', 'WEBSITE_MANAGER'])
  if (error) return Response.json({ error: error.message }, { status: error.status })

  const body = await request.json()
  
  // Writer can only create DRAFT
  if (profile.role === 'WRITER') {
    body.status = 'DRAFT'
  }

  const { data, error: insertError } = await supabase
    .from('content')
    .insert([{ ...body, submitted_by: user.id }])
    .select()
    .single()

  if (insertError) {
    return Response.json({ error: insertError.message }, { status: 500 })
  }

  await logAudit({
    actor_id: user.id,
    actor_name: profile.name,
    action: 'CREATED_CONTENT',
    entity_type: 'content',
    entity_id: data.id,
    meta: { title: data.title }
  })

  return Response.json(data)
}
