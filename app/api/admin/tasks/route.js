import { createClient } from '@/lib/supabase/server'
import { withRole } from '@/lib/rbac'
import { logAudit } from '@/lib/audit'

export const dynamic = 'force-dynamic'

export async function GET(request) {
  const { user, profile, error: roleError } = await withRole(['ADMIN', 'SUPER_ADMIN', 'WEBSITE_MANAGER', 'HR'])
  if (roleError) return Response.json({ error: roleError.message }, { status: roleError.status })

  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')
  const status = searchParams.get('status')
  const search = searchParams.get('search')

  const supabase = await createClient()
  let query = supabase
    .from('tasks')
    .select('*')
    .order('created_at', { ascending: false })

  if (category && category !== 'All') {
    query = query.eq('category', category)
  }
  if (status && status !== 'All') {
    query = query.eq('status', status)
  }
  if (search) {
    query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%,category.ilike.%${search}%`)
  }

  const { data, error } = await query

  if (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }

  return Response.json(data || [])
}

export async function POST(request) {
  const { user, profile, error: roleError } = await withRole(['ADMIN', 'SUPER_ADMIN', 'WEBSITE_MANAGER', 'HR'])
  if (roleError) return Response.json({ error: roleError.message }, { status: roleError.status })

  try {
    const body = await request.json()
    const {
      title,
      slug,
      category = 'General',
      task_type = 'manual',
      external_url,
      description,
      deliverables,
      guidelines,
      deadline_type = 'fixed',
      deadline_date,
      duration_days = 7,
      difficulty = 'Intermediate',
      status = 'published',
      submission_url
    } = body

    if (!title?.trim()) {
      return Response.json({ error: 'Task title is required' }, { status: 400 })
    }

    const generatedSlug = slug?.trim() || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

    if (task_type === 'link' && !external_url?.trim()) {
      return Response.json({ error: 'External document link (Google Docs / Figma / Notion) is required for link tasks' }, { status: 400 })
    }

    const supabase = await createClient()

    const newTask = {
      title: title.trim(),
      slug: generatedSlug,
      category,
      task_type,
      external_url: external_url?.trim() || null,
      description: description?.trim() || null,
      deliverables: deliverables?.trim() || null,
      guidelines: guidelines?.trim() || null,
      deadline_type,
      deadline_date: deadline_date || null,
      duration_days: parseInt(duration_days) || 7,
      difficulty,
      status,
      submission_url: submission_url?.trim() || null,
      created_by: user.id,
      created_by_name: profile.name || profile.email,
      updated_at: new Date().toISOString()
    }

    const { data, error } = await supabase
      .from('tasks')
      .insert(newTask)
      .select()
      .single()

    if (error) {
      return Response.json({ error: error.message }, { status: 500 })
    }

    await logAudit(supabase, user, 'CREATE_TASK', {
      taskId: data.id,
      title: data.title,
      category: data.category
    })

    return Response.json(data, { status: 201 })
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 })
  }
}
