/**
 * Sanitize a string to prevent XSS by escaping HTML tags.
 * This is faster, safer for API text inputs, and removes the buggy jsdom dependency.
 */
export function sanitizeString(str) {
  if (typeof str !== 'string') return str
  return str.trim()
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
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
  for (const key of Object.keys(obj)) {
    const value = obj[key]
    if (typeof value === 'object') {
      sanitized[key] = sanitizeObject(value)
    } else if (typeof value === 'string') {
      sanitized[key] = sanitizeString(value)
    } else {
      sanitized[key] = value
    }
  }
  return sanitized
}
