// lib/cloudinary.js
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name:  process.env.CLOUDINARY_CLOUD_NAME,
  api_key:     process.env.CLOUDINARY_API_KEY,
  api_secret:  process.env.CLOUDINARY_API_SECRET,
})

/**
 * Upload a file Buffer to Cloudinary
 * @param {Buffer} buffer
 * @param {Object} options - { folder, public_id, resource_type }
 * @returns {Promise<{url: string, public_id: string}>}
 */
export async function uploadToCloudinary(buffer, options = {}) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder:        options.folder || 'min-website',
        public_id:     options.public_id,
        resource_type: options.resource_type || 'image',
        transformation: options.resource_type === 'image'
          ? [{ quality: 'auto', fetch_format: 'auto' }]
          : undefined,
      },
      (error, result) => {
        if (error) return reject(error)
        resolve({ url: result.secure_url, public_id: result.public_id })
      }
    )
    stream.end(buffer)
  })
}

/**
 * Delete a file from Cloudinary
 * @param {string} public_id
 */
export async function deleteFromCloudinary(public_id) {
  return cloudinary.uploader.destroy(public_id)
}
