import { createAdminClient } from '@/lib/supabase/server'

export async function POST(request) {
  const body = await request.json()
  const { email, category } = body

  if (!email || !category) {
    return Response.json({ error: "Email and Category are required" }, { status: 400 })
  }

  const supabase = await createAdminClient()
  
  const { error } = await supabase
    .from('intake_reminders')
    .insert([{ email, category }])

  // If it's a unique constraint violation, they are already on the list, which is fine
  if (error && error.code !== '23505') {
    return Response.json({ error: error.message }, { status: 500 })
  }

  return Response.json({ success: true, message: "Added to reminder list" })
}
