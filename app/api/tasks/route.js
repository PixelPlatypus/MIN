import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')
  const slug = searchParams.get('slug')

  const supabase = await createClient()
  let query = supabase
    .from('tasks')
    .select('*')
    .eq('status', 'published')
    .order('created_at', { ascending: false })

  if (slug) {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .single()

    if (error) return Response.json({ error: 'Task not found' }, { status: 404 })
    return Response.json(data)
  }

  if (category && category !== 'All') {
    query = query.eq('category', category)
  }

  const { data, error } = await query

  if (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }

  return Response.json(data || [])
}
