// app/api/upload/route.js
import { createClient, createAdminClient } from '@/lib/supabase/server'
import { uploadToCloudinary } from '@/lib/cloudinary'
import { rateLimit } from '@/lib/rateLimit'

export async function POST(request) {
  // Rate limit (20 uploads per minute)
  const limited = await rateLimit(request, { requests: 20, window: '1m' })
  if (limited) return Response.json({ error: 'Too many requests' }, { status: 429 })

  // Auth check (using regular client to verify session/role)
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  // Role check
  const { data: profile } = await supabase
    .from('profiles').select('role').eq('id', user.id).single()
  if (!profile || !['ADMIN','MANAGER'].includes(profile.role)) {
    return Response.json({ error: 'Forbidden' }, { status: 403 })
  }

  // Use Admin Client for Storage (to bypass RLS for uploads)
  const adminSupabase = await createAdminClient()

  const formData = await request.formData()
  const file = formData.get('file')
  const folder = formData.get('folder') || 'min-website/general'

  if (!file) return Response.json({ error: 'No file provided' }, { status: 400 })

  // Validate type and size
  const allowedTypes = ['image/jpeg','image/png','image/webp','image/gif','application/pdf']
  if (!allowedTypes.includes(file.type)) {
    return Response.json({ error: 'File type not allowed' }, { status: 400 })
  }
  if (file.size > 10 * 1024 * 1024) {
    return Response.json({ error: 'File too large (max 10MB)' }, { status: 400 })
  }

  const buffer = Buffer.from(await file.arrayBuffer())
  const resource_type = file.type === 'application/pdf' ? 'raw' : 'image'
  const bucketName = resource_type === 'raw' ? 'documents' : 'media'
  const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`

  try {
    console.log(`API Upload: Starting storage upload to bucket ${bucketName} for ${file.name}`)
    
    // 1. Upload to Supabase Storage (Primary)
    const { data: storageData, error: storageError } = await adminSupabase.storage
      .from(bucketName)
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: true
      })

    if (storageError) throw storageError

    const { data: { publicUrl } } = adminSupabase.storage
      .from(bucketName)
      .getPublicUrl(fileName)

    let finalUrl = publicUrl
    let cloudinaryId = null

    // 2. Attempt Cloudinary upload for optimization (Optional)
    if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_CLOUD_NAME !== 'test') {
      try {
        console.log('API Upload: Attempting Cloudinary optimization...')
        const { url, public_id } = await uploadToCloudinary(buffer, { folder, resource_type })
        finalUrl = url
        cloudinaryId = public_id
        console.log('API Upload: Cloudinary optimization success!')
      } catch (cErr) {
        console.warn('API Upload: Cloudinary optimization failed, using Supabase URL:', cErr.message)
      }
    } else {
      console.log('API Upload: Skipping Cloudinary (not configured)')
    }

    return Response.json({ 
      url: finalUrl, 
      supabase_url: publicUrl,
      public_id: cloudinaryId,
      file_name: file.name
    })

  } catch (error) {
    console.error('API Upload: Fatal Error:', error)
    return Response.json({ 
      error: 'Upload failed', 
      details: error.message 
    }, { status: 500 })
  }
}
