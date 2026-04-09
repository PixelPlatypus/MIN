import { createAdminClient } from '@/lib/supabase/server'
import { withRole } from '@/lib/rbac'
import { logAudit } from '@/lib/audit'

export async function GET() {
  try {
    const { profile, error: authError } = await withRole(['ADMIN', 'MANAGER'])
    if (authError) return Response.json({ error: authError.message }, { status: authError.status })

    const supabase = await createAdminClient()
    const { data, error } = await supabase
      .from('popup_notices')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) return Response.json({ error: error.message }, { status: 500 })
    return Response.json(data)
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const { user, profile, error: authError } = await withRole(['ADMIN'])
    if (authError) return Response.json({ error: authError.message }, { status: authError.status })

    const body = await request.json()
    const supabase = await createAdminClient()

    // Enforce: only one notice can be active at a time
    if (body.is_active) {
      await supabase
        .from('popup_notices')
        .update({ is_active: false })
        .eq('is_active', true)
    }

    const { data, error } = await supabase
      .from('popup_notices')
      .insert([body])
      .select()
      .single()

    if (error) return Response.json({ error: error.message }, { status: 500 })

    await logAudit({
      actor_id: user.id,
      actor_name: profile.name,
      action: 'CREATED_POPUP_NOTICE',
      entity_type: 'popup_notices',
      entity_id: data.id,
      meta: { title: data.title }
    })

    return Response.json(data)
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 })
  }
}
