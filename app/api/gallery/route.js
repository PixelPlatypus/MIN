import { createClient, createAdminClient } from '@/lib/supabase/server'
import { withRole } from '@/lib/rbac'
import { logAudit } from '@/lib/audit'

export async function GET(request) {
  const supabase = await createClient()
  const { searchParams } = new URL(request.url)
  const album = searchParams.get('album')
  const tag = searchParams.get('tag')

  let query = supabase
    .from('gallery')
    .select('*')
    .order('created_at', { ascending: false })

  if (album && album !== 'ALL') {
    query = query.eq('album', album)
  }

  if (tag && tag !== 'ALL') {
    query = query.contains('tags', [tag])
  }

  const { data, error } = await query

  if (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }

  return Response.json(data)
}

export async function POST(request) {
  const { user, profile, error } = await withRole(['ADMIN', 'MANAGER'])
  if (error) return Response.json({ error: error.message }, { status: error.status })

  const body = await request.json()
  const supabaseAdmin = await createAdminClient()
  
  const insertData = {
    image_url: body.image_url || body.url,
    caption: body.caption || '',
    album: body.album || 'General',
    tags: body.tags || [],
    display_order: body.display_order || 0
  }

  // Attempt 1: Full insert with tags
  let result = await supabaseAdmin
    .from('gallery')
    .insert([insertData])
    .select()
    .single()

  // FALLBACK: If tags column is missing, retry without tags
  if (result.error && result.error.message.includes('column "tags" of relation "gallery" does not exist')) {
    console.warn('API Gallery: "tags" column missing. Retrying without tags...')
    const { tags, ...dataWithoutTags } = insertData
    result = await supabaseAdmin
      .from('gallery')
      .insert([dataWithoutTags])
      .select()
      .single()
  }

  if (result.error) {
    console.error('API Gallery: Fatal Insert Error:', result.error)
    return Response.json({ 
      error: result.error.message,
      hint: 'Ensure your gallery table has a tags (text[]) column and album (text) column.'
    }, { status: 500 })
  }

  await logAudit({
    actor_id: user.id,
    actor_name: profile.name,
    action: 'UPLOADED_GALLERY_IMAGE',
    entity_type: 'gallery',
    entity_id: result.data.id
  })

  return Response.json(result.data)
}
