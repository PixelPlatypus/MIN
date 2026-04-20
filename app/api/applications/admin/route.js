import { createAdminClient } from '@/lib/supabase/server'
import { withRole } from '@/lib/rbac'
import { logAudit } from '@/lib/audit'

export const dynamic = 'force-dynamic'

export async function GET(request) {
  try {
    const { error } = await withRole(['ADMIN', 'MANAGER', 'WEBSITE_MANAGER'])
    if (error) {
      return Response.json({ error: error.message }, { status: error.status })
    }

    const { searchParams } = new URL(request.url)
    const typeFilter = searchParams.get('type')

    const supabase = await createAdminClient()
    
    // Fetch from both legacy join_applications and new form_submissions
    const [ { data: legacyApps }, { data: subData } ] = await Promise.all([
      supabase.from('join_applications').select('*').order('created_at', { ascending: false }),
      supabase.from('form_submissions').select('*, form_definitions(category, batch_name)').order('created_at', { ascending: false })
    ])

    // Map join_applications into the unified format
    const legacyFormatted = (legacyApps || []).map(app => ({
      id: app.id,
      name: app.name,
      email: app.email,
      phone: app.phone || '',
      type: app.type || 'INQUIRY',
      batch_name: app.batch_name || 'GENERAL',
      status: app.status === 'APPROVED' ? 'ACCEPTED' : app.status,
      created_at: app.created_at,
      form_data: app.form_data
    }))

    // Map form_submissions data shape dynamically
    const modernFormatted = (subData || []).map(sub => {
      const name = sub.data.Name || sub.data["Full Name"] || sub.data.name || "Unknown Applicant"
      const email = sub.data.Email || sub.data["Email Address"] || sub.data.email || "No Email"
      const phone = sub.data.Phone || sub.data["Phone Number"] || sub.data.phone || ""
      const type = sub.form_definitions?.category || 'VOLUNTEER'
      const batch_name = sub.form_definitions?.batch_name || 'GENERAL'
      const status = sub.status === 'APPROVED' ? 'ACCEPTED' : sub.status

      return {
        id: sub.id,
        name,
        email,
        phone,
        type,
        batch_name,
        status,
        created_at: sub.created_at,
        form_data: sub.data
      }
    })

    // Combine and apply server-side type filtering if requested
    let combined = [...legacyFormatted, ...modernFormatted]
    
    if (typeFilter) {
      combined = combined.filter(item => item.type === typeFilter)
    }

    combined.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))

    return Response.json(combined)
  } catch (fatalError) {
    return Response.json({ error: 'Internal Server Error', details: fatalError.message }, { status: 500 })
  }
}

export async function DELETE(request) {
  try {
    const { user, profile, error } = await withRole(['ADMIN', 'WEBSITE_MANAGER']) 
    if (error) return Response.json({ error: error.message }, { status: error.status })

    const { searchParams } = new URL(request.url)
    const batch = searchParams.get('batch')
    const id = searchParams.get('id')

    const supabase = await createAdminClient()
    
    if (id) {
      // Individual delete
      const { error: err1 } = await supabase.from('form_submissions').delete().eq('id', id)
      const { error: err2 } = await supabase.from('join_applications').delete().eq('id', id)
      
      await logAudit({
        actor_id: user.id,
        actor_name: profile.name,
        action: 'DELETE_APPLICATION',
        entity_type: 'applications',
        entity_id: id
      })
      
      return Response.json({ success: true, idDeleted: id })
    } else if (batch) {
      // Find form IDs belonging to that batch
      const { data: forms } = await supabase.from('form_definitions').select('id').eq('batch_name', batch)
      if (forms && forms.length > 0) {
        const formIds = forms.map(f => f.id)
        await supabase.from('form_submissions').delete().in('form_id', formIds)
      }
      
      await logAudit({
        actor_id: user.id,
        actor_name: profile.name,
        action: 'DELETE_BATCH_APPLICATIONS',
        entity_type: 'form_submissions',
        meta: { batch_name: batch }
      })
    } else {
      await supabase.from('form_submissions').delete().neq('id', '00000000-0000-0000-0000-000000000000') 
      
      await logAudit({
        actor_id: user.id,
        actor_name: profile.name,
        action: 'CLEAR_ALL_APPLICATIONS',
        entity_type: 'form_submissions'
      })
    }

    return Response.json({ success: true, batchDeleted: batch })
  } catch (fatalError) {
    return Response.json({ error: 'Internal Server Error', details: fatalError.message }, { status: 500 })
  }
}

