// app/api/team/tenures/route.js
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createClient()

  // Get unique tenures ordered by year descending
  const { data, error } = await supabase
    .from('team_members')
    .select('tenure')
    .order('tenure', { ascending: false })

  if (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }

  // Extract unique values
  const uniqueTenures = [...new Set(data.map(m => m.tenure))]

  return Response.json(uniqueTenures)
}
