import { createAdminClient } from '@/lib/supabase/server'
import { uploadToCloudinary } from '@/lib/cloudinary'
import { rateLimit } from '@/lib/rateLimit'

/**
 * Specialized public upload endpoint for Join Us applications (CVs, etc.)
 */
export async function POST(request) {
  // Strict Rate limit for public uploads (5 per minute)
  const limited = await rateLimit(request, { requests: 5, window: '1m' })
  if (limited) return Response.json({ error: 'Too many requests. Please try again in a minute.' }, { status: 429 })

  try {
    const formData = await request.formData()
    const file = formData.get('file')
    const category = formData.get('category') || 'UNKNOWN'

    if (!file) return Response.json({ error: 'No file provided' }, { status: 400 })

    // Validate type: Force PDF for CVs
    const allowedTypes = ['application/pdf']
    if (!allowedTypes.includes(file.type)) {
      return Response.json({ error: 'Only PDF files are allowed for CV uploads.' }, { status: 400 })
    }

    // Validate size (max 5MB for public uploads)
    if (file.size > 5 * 1024 * 1024) {
      return Response.json({ error: 'File too large. Maximum size is 5MB.' }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const adminSupabase = await createAdminClient()
    
    // We store in a dedicated 'applications' folder/bucket
    const fileName = `CV-${category}-${Date.now()}-${file.name.replace(/\s+/g, '-')}`
    
    // 1. Upload to Supabase Storage (applications bucket)
    const { data: storageData, error: storageError } = await adminSupabase.storage
      .from('documents')
      .upload(`applications/${fileName}`, buffer, {
        contentType: file.type,
        upsert: true
      })

    if (storageError) throw storageError

    const { data: { publicUrl } } = adminSupabase.storage
      .from('documents')
      .getPublicUrl(`applications/${fileName}`)

    let finalUrl = publicUrl
    
    // 2. Optional: Mirror to Cloudinary if available
    if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_CLOUD_NAME !== 'test') {
      try {
        const { url } = await uploadToCloudinary(buffer, { 
          folder: `min-website/applications/${category}`, 
          resource_type: 'raw' 
        })
        finalUrl = url
      } catch (cErr) {
        console.warn('Cloudinary mirror failed for public upload:', cErr.message)
      }
    }

    return Response.json({ 
      url: finalUrl,
      file_name: file.name
    })

  } catch (error) {
    console.error('Public Application Upload Error:', error)
    return Response.json({ 
      error: 'Upload failed', 
      details: error.message 
    }, { status: 500 })
  }
}
