// app/api/team/route.js
import { createClient } from '@/lib/supabase/server'
import { withRole } from '@/lib/rbac'
import { logAudit } from '@/lib/audit'

export async function GET(request) {
  const supabase = await createClient()
  const { searchParams } = new URL(request.url)
  const tenure = searchParams.get('tenure')
  const showRemoved = searchParams.get('all') === 'true'

  let query = supabase
    .from('team_members')
    .select('*')
    .order('display_order', { ascending: true })

  if (!showRemoved) {
    query = query.neq('status', 'REMOVED')
  }

  const { data, error } = await query

  if (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }

  // Intelligent Tenure Propagation Logic (Server-side)
  if (tenure) {
    const filterYear = parseInt(tenure)
    const filtered = data.filter(member => {
      const joinedYear = parseInt(member.tenure)
      if (isNaN(joinedYear)) return member.tenure === tenure // Fallback
      
      let leftYear = joinedYear
      if (member.farewell_date) {
        const farewellDate = new Date(member.farewell_date)
        const year = farewellDate.getFullYear()
        const month = farewellDate.getMonth() // 0-indexed (0: Jan, 5: Jun, 6: Jul)
        // If farewell in first half of year (June or earlier), show them only up to Year-1
        leftYear = month >= 6 ? year : year - 1
        
        // Ensure leftYear is at least joinedYear
        if (leftYear < joinedYear) leftYear = joinedYear
      } else if (member.status === 'ACTIVE') {
        leftYear = new Date().getFullYear()
      }
      
      // Member is visible if requested year falls between joined and left/current year
      return filterYear >= joinedYear && filterYear <= leftYear
    })
    return Response.json(filtered)
  }

  return Response.json(data)
}

export async function POST(request) {
  const { user, profile, supabase, error } = await withRole(['ADMIN', 'MANAGER', 'WEBSITE_MANAGER'])
  if (error) return Response.json({ error: error.message }, { status: error.status })

  const body = await request.json()
  const isArray = Array.isArray(body)

  const { data, error: insertError } = await supabase
    .from('team_members')
    .insert(isArray ? body : [body])
    .select()

  if (insertError) {
    return Response.json({ error: insertError.message }, { status: 500 })
  }

  await logAudit({
    actor_id: user.id,
    actor_name: profile.name,
    action: isArray ? 'BULK_CREATED_TEAM_MEMBERS' : 'CREATED_TEAM_MEMBER',
    entity_type: 'team_members',
    entity_id: isArray ? 'multiple' : data[0]?.id,
    meta: { count: data.length, names: data.map(m => m.name).slice(0, 5) }
  })

  return Response.json(isArray ? data : data[0])
}
