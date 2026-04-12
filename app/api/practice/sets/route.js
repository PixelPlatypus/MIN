import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { withRole } from '@/lib/rbac'
import { logAudit } from '@/lib/audit'

export async function GET() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('practice_sets')
    .select('*, practice_questions(count)')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(request) {
  const { user, profile, supabase, error: rbacError } = await withRole(['ADMIN', 'WEBSITE_MANAGER'])
  if (rbacError) return NextResponse.json({ error: rbacError.message }, { status: rbacError.status })

  const body = await request.json()
  
  const { data, error } = await supabase
    .from('practice_sets')
    .insert([body])
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  await logAudit({
    action: 'CREATE_PRACTICE_SET',
    entity_type: 'practice_sets',
    entity_id: data.id,
    meta: { name: data.name, time_limit: data.time_limit }
  })

  return NextResponse.json(data)
}

export async function PATCH(request) {
  const { user, profile, supabase, error: rbacError } = await withRole(['ADMIN', 'WEBSITE_MANAGER'])
  if (rbacError) return NextResponse.json({ error: rbacError.message }, { status: rbacError.status })

  const body = await request.json()
  const { id, ...updates } = body

  const { data, error } = await supabase
    .from('practice_sets')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  await logAudit({
    action: 'UPDATE_PRACTICE_SET',
    entity_type: 'practice_sets',
    entity_id: id,
    meta: updates
  })

  return NextResponse.json(data)
}

export async function DELETE(request) {
  const { user, profile, supabase, error: rbacError } = await withRole(['ADMIN', 'WEBSITE_MANAGER'])
  if (rbacError) return NextResponse.json({ error: rbacError.message }, { status: rbacError.status })

  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')

  const { error } = await supabase
    .from('practice_sets')
    .delete()
    .eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  await logAudit({
    action: 'DELETE_PRACTICE_SET',
    entity_type: 'practice_sets',
    entity_id: id
  })

  return NextResponse.json({ success: true })
}
