import { createClient } from '@/lib/supabase/server'
import { withRole } from '@/lib/rbac'
import { logAudit } from '@/lib/audit'
import { revalidatePath } from 'next/cache'

export async function GET() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('site_settings')
    .select('*')
    .single()

  if (error && error.code !== 'PGRST116') { // PGRST116 is 'no rows'
    return Response.json({ error: error.message }, { status: 500 })
  }

  return Response.json(data || {}, {
    headers: {
      // No CDN caching — settings must always be fresh after admin saves
      'Cache-Control': 'no-store'
    }
  })
}

export async function PATCH(request) {
  const { user, profile, supabase, error } = await withRole(['ADMIN', 'WEBSITE_MANAGER'])
  if (error) return Response.json({ error: error.message }, { status: error.status })

  const body = await request.json()

  // Fetch old settings to compute detailed difference
  const { data: oldSettings } = await supabase
    .from('site_settings')
    .select('*')
    .eq('id', 'main')
    .single()

  const changes = {}
  if (oldSettings) {
    for (const key in body) {
      if (typeof body[key] === 'object') {
        if (JSON.stringify(body[key]) !== JSON.stringify(oldSettings[key])) {
          changes[key] = { from: oldSettings[key] || null, to: body[key] }
        }
      } else if (body[key] !== oldSettings[key]) {
        changes[key] = { from: oldSettings[key] || null, to: body[key] }
      }
    }
  } else {
    changes.initial_setup = "System properties initialized"
  }
  
  // Use upsert to handle both insert and update
  const { data, error: updateError } = await supabase
    .from('site_settings')
    .upsert({ 
      id: 'main', 
      ...body,
      updated_by_name: profile.name,
      updated_at: new Date().toISOString()
    })
    .select()
    .single()

  if (updateError) {
    return Response.json({ error: updateError.message }, { status: 500 })
  }

  // Only log if something actually changed to prevent spam
  if (Object.keys(changes).length > 0) {
    await logAudit({
      actor_id: user.id,
      actor_name: profile.name,
      action: 'UPDATED_SITE_SETTINGS',
      entity_type: 'site_settings',
      entity_id: null,
      meta: { changes, target_id: 'main' }
    })
  }

  // Bust Next.js page cache so homepage/mission shows fresh image immediately
  revalidatePath('/')
  revalidatePath('/about')
  revalidatePath('/admin/settings')

  return Response.json(data)
}
