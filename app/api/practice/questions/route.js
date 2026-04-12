import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { withRole } from '@/lib/rbac'
import { logAudit } from '@/lib/audit'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const setId = searchParams.get('set_id')
  
  const supabase = await createClient()
  let query = supabase.from('practice_questions').select('*').order('sort_order', { ascending: true })
  
  if (setId) {
    query = query.eq('set_id', setId)
  }

  const { data, error } = await query

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(request) {
  const { user, profile, supabase, error: rbacError } = await withRole(['ADMIN', 'WEBSITE_MANAGER'])
  if (rbacError) return NextResponse.json({ error: rbacError.message }, { status: rbacError.status })

  const body = await request.json()
  
  const { data, error } = await supabase
    .from('practice_questions')
    .insert([body])
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  await logAudit({
    action: 'CREATE_PRACTICE_QUESTION',
    entity_type: 'practice_questions',
    entity_id: data.id,
    meta: { question: data.question_text, set_id: data.set_id }
  })

  return NextResponse.json(data)
}

export async function PATCH(request) {
  const { user, profile, supabase, error: rbacError } = await withRole(['ADMIN', 'WEBSITE_MANAGER'])
  if (rbacError) return NextResponse.json({ error: rbacError.message }, { status: rbacError.status })

  const body = await request.json()
  const { id, ...updates } = body

  const { data, error } = await supabase
    .from('practice_questions')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  await logAudit({
    action: 'UPDATE_PRACTICE_QUESTION',
    entity_type: 'practice_questions',
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
    .from('practice_questions')
    .delete()
    .eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  await logAudit({
    action: 'DELETE_PRACTICE_QUESTION',
    entity_type: 'practice_questions',
    entity_id: id
  })

  return NextResponse.json({ success: true })
}
