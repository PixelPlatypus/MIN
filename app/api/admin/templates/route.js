import { createAdminClient } from '@/lib/supabase/server'
import { withRole } from '@/lib/rbac'
import { logAudit } from '@/lib/audit'
import { SYSTEM_EMAIL_TEMPLATES } from '@/lib/emailTemplates'

export const dynamic = 'force-dynamic'

export async function GET() {
  const { error: roleError } = await withRole(['ADMIN', 'SUPER_ADMIN', 'WEBSITE_MANAGER', 'HR'])
  if (roleError) return Response.json({ error: roleError.message }, { status: roleError.status })

  const supabase = await createAdminClient()
  const { data: dbTemplates, error } = await supabase
    .from('email_templates')
    .select('*')

  if (error) return Response.json({ error: error.message }, { status: 500 })

  const dbMap = new Map((dbTemplates || []).map(t => [t.id, t]))

  // Merge system defaults with database overrides
  const merged = SYSTEM_EMAIL_TEMPLATES.map(sysTpl => {
    const dbTpl = dbMap.get(sysTpl.id)
    if (dbTpl) {
      return {
        ...sysTpl,
        ...dbTpl,
        is_customized: true
      }
    }
    return {
      ...sysTpl,
      is_customized: false
    }
  })

  // Append any purely custom created templates in the DB
  const systemIds = new Set(SYSTEM_EMAIL_TEMPLATES.map(t => t.id))
  for (const dbTpl of (dbTemplates || [])) {
    if (!systemIds.has(dbTpl.id)) {
      merged.push({
        ...dbTpl,
        category: 'Custom',
        variables: ['applicant_name', 'form_name'],
        sample_variables: { applicant_name: 'Recipient Name', form_name: 'MIN Program' },
        is_customized: true
      })
    }
  }

  return Response.json(merged)
}

export async function PATCH(request) {
  const { user, profile, error: roleError } = await withRole(['ADMIN', 'SUPER_ADMIN', 'WEBSITE_MANAGER', 'HR'])
  if (roleError) return Response.json({ error: roleError.message }, { status: roleError.status })

  const body = await request.json()
  const { id, subject, body_markdown, from_name, from_email, name, description, action } = body

  if (!id || !subject || !body_markdown) {
    return Response.json({ error: 'ID, subject, and body markdown are required' }, { status: 400 })
  }

  const supabase = await createAdminClient()

  const payload = {
    id,
    subject,
    body_markdown,
    name: name || id,
    description: description || null,
    action: action || null,
    from_name: from_name || 'Mathematics Initiatives in Nepal',
    from_email: from_email || 'website@mathsinitiatives.org.np',
    updated_by: user.id,
    updated_at: new Date().toISOString()
  }

  const { data, error } = await supabase
    .from('email_templates')
    .upsert(payload)
    .select()
    .single()

  if (error) return Response.json({ error: error.message }, { status: 500 })

  await logAudit({
    actor_id: user.id,
    actor_name: profile.name,
    action: 'UPDATE_EMAIL_TEMPLATE',
    entity_type: 'email_templates',
    entity_id: id,
    meta: { name: payload.name, subject: payload.subject }
  })

  return Response.json({ ...data, is_customized: true })
}

export async function DELETE(request) {
  const { user, profile, error: roleError } = await withRole(['ADMIN', 'SUPER_ADMIN', 'WEBSITE_MANAGER', 'HR'])
  if (roleError) return Response.json({ error: roleError.message }, { status: roleError.status })

  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')

  if (!id) return Response.json({ error: 'ID is required' }, { status: 400 })

  const supabase = await createAdminClient()
  const { error } = await supabase
    .from('email_templates')
    .delete()
    .eq('id', id)

  if (error) return Response.json({ error: error.message }, { status: 500 })

  await logAudit({
    actor_id: user.id,
    actor_name: profile.name,
    action: 'RESET_EMAIL_TEMPLATE',
    entity_type: 'email_templates',
    entity_id: id
  })

  return Response.json({ success: true, message: 'Reset to system default' })
}
