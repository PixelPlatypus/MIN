// lib/rateLimit.js
import { Ratelimit } from '@upstash/ratelimit'
import { redis } from './redis'

/**
 * Rate limiter wrapper
 * @param {Request} request - Next.js Request object
 * @param {Object} options - { requests, window } e.g. { requests: 20, window: '1m' }
 * @returns {Promise<boolean>} - True if rate limited
 */
export async function rateLimit(request, { requests, window }) {
  const ip = request.headers.get('x-forwarded-for') || 'anonymous'
  
  const ratelimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(requests, window),
  })

  const { success } = await ratelimit.limit(ip)
  return !success
}
