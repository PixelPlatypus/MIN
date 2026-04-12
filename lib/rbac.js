// lib/rbac.js
import { createClient } from '@/lib/supabase/server'

/**
 * RBAC guard for API routes
 * @param {string[]} allowedRoles - Roles allowed to access the route
 * @returns {Promise<{user: Object, profile: Object, error: Object}>}
 */
export async function withRole(allowedRoles) {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return { error: { message: 'Unauthorized', status: 401 } }
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (profileError || !profile) {
    return { error: { message: 'Profile not found', status: 403 } }
  }

  if (!allowedRoles.includes(profile.role)) {
    return { error: { message: "You haven't been given this permission by the admin", status: 403 } }
  }

  return { user, profile, supabase }
}
