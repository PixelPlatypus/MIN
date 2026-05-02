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
    if (tenure === 'Alumni') {
      return Response.json(data.filter(m => m.status === 'ALUMNI'))
    }
    if (tenure === 'Advisors') {
      return Response.json(data.filter(m => m.is_advisor === true))
    }

    const filterYear = parseInt(tenure)
    const filtered = data
      .filter(member => {
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
      .map(member => {
        // Apply role_history override: if this member has a past role for this exact year,
        // override the displayed position with that historical role
        const roleHistory = member.social_links?.role_history
        const joinedYear = parseInt(member.tenure)
        if (Array.isArray(roleHistory) && roleHistory.length > 0) {
          const historicalRole = roleHistory.find(h => parseInt(h.year) === filterYear)
          if (historicalRole?.position) {
            return { ...member, position: historicalRole.position }
          }
        }
        
        // If the requested year is the year they joined, and no explicit role history was found, default to MINion
        if (filterYear === joinedYear) {
          return { ...member, position: 'MINion' }
        }

        return member
      })

    return Response.json(filtered)
  }

  return Response.json(data)
}

async function generateServerSlug(supabase, name, currentId = null, existingSlugs = []) {
  const baseSlug = name
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
  
  let finalSlug = baseSlug
  let counter = 1
  
  while (true) {
    // Check if it's in the current batch we are processing
    if (existingSlugs.includes(finalSlug)) {
       finalSlug = `${baseSlug}-${counter}`
       counter++
       continue
    }

    let query = supabase
      .from('team_members')
      .select('id')
      .eq('slug', finalSlug)
    
    if (currentId) query = query.neq('id', currentId)
    
    const { data } = await query.maybeSingle()
    
    if (!data) break
    
    finalSlug = `${baseSlug}-${counter}`
    counter++
  }
  
  return finalSlug
}

export async function POST(request) {
  const { user, profile, supabase, error: roleError } = await withRole(['ADMIN', 'MANAGER', 'WEBSITE_MANAGER'])
  if (roleError) return Response.json({ error: roleError.message }, { status: roleError.status })

  const body = await request.json()
  const isArray = Array.isArray(body)
  const items = isArray ? body : [body]

  // Automatically handle slugs for each item
  const usedSlugs = []
  for (const item of items) {
    item.slug = await generateServerSlug(supabase, item.name, null, usedSlugs)
    usedSlugs.push(item.slug)
  }

  // Role Restriction: Only ADMIN can assign 'President' role
  if (profile.role !== 'ADMIN') {
    const hasPresident = items.some(item => 
      item.position === 'President' || 
      item.social_links?.role_history?.some(h => h.position === 'President')
    )
    if (hasPresident) {
      return Response.json({ error: 'Only administrators can assign the President role.' }, { status: 403 })
    }
  }

  const { data, error: insertError } = await supabase
    .from('team_members')
    .insert(items)
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

export async function PATCH(request) {
  const { user, profile, supabase, error: roleError } = await withRole(['ADMIN', 'MANAGER', 'WEBSITE_MANAGER'])
  if (roleError) return Response.json({ error: roleError.message }, { status: roleError.status })

  const body = await request.json()
  const items = Array.isArray(body) ? body : [body]

  // Automatically handle slugs for updates if name changed or slug missing
  const patchedSlugs = []
  for (const item of items) {
     if (item.name) {
        item.slug = await generateServerSlug(supabase, item.name, item.id, patchedSlugs)
        patchedSlugs.push(item.slug)
     }
  }

  const { data, error: updateError } = await supabase
    .from('team_members')
    .upsert(items, { onConflict: 'id' })
    .select()

  if (updateError) {
    return Response.json({ error: updateError.message }, { status: 500 })
  }

  await logAudit({
    actor_id: user.id,
    actor_name: profile.name,
    action: 'BULK_UPDATED_TEAM_MEMBERS',
    entity_type: 'team_members',
    meta: { count: items.length }
  })

  return Response.json(data)
}
