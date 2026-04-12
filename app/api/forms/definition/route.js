import { createAdminClient } from '@/lib/supabase/server'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const slug = searchParams.get('slug')

  if (!slug) return Response.json({ error: "Missing slug" }, { status: 400 })

  const supabase = await createAdminClient()
  const { data, error } = await supabase
    .from('form_definitions')
    .select('id, slug, title, description, fields, batch_name, category, is_active, deadline')
    .eq('slug', slug)
    .single()

  if (error) return Response.json({ error: "Form not found" }, { status: 404 })

  // Check if deadline has passed
  const isPastDeadline = data.deadline && new Date() > new Date(data.deadline)
  const effectivelyActive = data.is_active && !isPastDeadline

  // If inactive or past deadline, sanitize the payload to hide fields but keep identity for waitlist
  if (!effectivelyActive) {
    return Response.json({ 
      id: data.id, 
      slug: data.slug, 
      title: data.title, 
      category: data.category, 
      is_active: false,
      deadline_passed: isPastDeadline
    })
  }

  return Response.json(data)
}
