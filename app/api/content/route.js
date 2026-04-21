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
    .order('display_order', { ascending: true })

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

  // Find current min display_order to place new item at the top
  const { data: minOrderData } = await supabase
    .from('content')
    .select('display_order')
    .order('display_order', { ascending: true })
    .limit(1)
    .single()
  
  const nextOrder = minOrderData ? minOrderData.display_order - 1 : 1

  const { data, error: insertError } = await supabase
    .from('content')
    .insert([{ ...body, display_order: nextOrder, submitted_by: user.id }])
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
