// lib/audit.js
import { createClient } from '@/lib/supabase/server'

/**
 * Log an action to the audit log
 * @param {Object} params - { actor_id, actor_name, action, entity_type, entity_id, meta }
 */
export async function logAudit({ actor_id, actor_name, action, entity_type, entity_id, meta = {} }) {
  const supabase = await createClient()
  const { error } = await supabase.from('audit_log').insert({
    actor_id,
    actor_name,
    action,
    entity_type,
    entity_id,
    meta
  })

  if (error) {
    console.error('Audit log error:', error.message)
  }
}
