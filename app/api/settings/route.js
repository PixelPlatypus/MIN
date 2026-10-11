import { createPublicClient } from '@/lib/supabase/server'
import { withRole } from '@/lib/rbac'
import { logAudit } from '@/lib/audit'
import { revalidatePath } from 'next/cache'

export async function GET(request) {
  // Admin screens pass ?fresh to skip the CDN copy; public pages share a 60s edge cache.
  const fresh = new URL(request.url).searchParams.has('fresh')
  const { data, error } = await createPublicClient()
    .from('site_settings')
    .select('*')
    .eq('id', 'main')
    .single()

  if (error && error.code !== 'PGRST116') { // PGRST116 is 'no rows'
    return Response.json({ error: error.message }, { status: 500 })
  }

  return Response.json(data || {}, {
    headers: {
      'Cache-Control': fresh ? 'no-store' : 'public, s-maxage=60, stale-while-revalidate=300',
      // Freshness signals for AI crawlers (Perplexity, GPTBot, etc.)
      'Last-Modified': new Date().toUTCString(),
      'X-Content-Date': new Date().toISOString(),
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
  revalidatePath('/', 'layout') // navbar/footer on every public page read settings
  revalidatePath('/admin/settings')

  return Response.json(data)
}
