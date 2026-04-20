// app/api/notices/public/route.js — Unauthenticated endpoint for the PopupNotice component
import { createAdminClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const supabase = await createAdminClient()
    const now = new Date().toISOString()

    const { data, error } = await supabase
      .from('popup_notices')
      .select('id, title, body, image_url, cta_text, cta_url, target_pages, starts_at, ends_at')
      .eq('is_active', true)
      .or(`starts_at.is.null,starts_at.lte."${now}"`)
      .or(`ends_at.is.null,ends_at.gte."${now}"`)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Public notices fetch error:', error)
      return Response.json([])
    }

    return Response.json(data || [], {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300'
      }
    })
  } catch (err) {
    return Response.json([])
  }
}
