// lib/audit.js
import { createClient, createAdminClient } from '@/lib/supabase/server'

/**
 * Log an action to the audit log
 * @param {Object} params - { actor_id, actor_name, action, entity_type, entity_id, meta }
 */
export async function logAudit({ actor_id, actor_name, action, entity_type, entity_id, meta = {} }) {
  const supabase = await createClient()
  const supabaseAdmin = await createAdminClient()
  
  let finalActorId = actor_id
  let finalActorName = actor_name

  // If actor info isn't provided, try to get it from current session
  if (!finalActorId) {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      finalActorId = user.id
      const { data: profile } = await supabase.from('profiles').select('name').eq('id', user.id).single()
      finalActorName = profile?.name || user.email
    }
  }

  const { error } = await supabaseAdmin.from('audit_log').insert({
    actor_id: finalActorId,
    actor_name: finalActorName,
    action,
    entity_type,
    entity_id,
    meta: {
      ...meta,
      browser: typeof window !== 'undefined' ? window.navigator.userAgent : 'server-side',
      ip: 'logged'
    }
  })

  if (error) {
    console.error('Audit log error:', error.message)
  }
}
