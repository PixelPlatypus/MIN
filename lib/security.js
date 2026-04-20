import DOMPurify from 'isomorphic-dompurify'

/**
 * Sanitize a string to prevent XSS
 */
export function sanitizeString(str) {
  if (typeof str !== 'string') return str
  return DOMPurify.sanitize(str.trim())
}

/**
 * Recursively sanitize an object or array
 */
export function sanitizeObject(obj) {
  if (!obj || typeof obj !== 'object') return obj

  if (Array.isArray(obj)) {
    return obj.map(v => sanitizeObject(v))
  }

  const sanitized = {}
  Object.keys(obj).forEach(key => {
    const value = obj[key]
    if (typeof value === 'object') {
      sanitized[key] = sanitizeObject(value)
    } else if (typeof value === 'string') {
      sanitized[key] = sanitizeString(value)
    } else {
      sanitized[key] = value
    }
  })
  return sanitized
}
