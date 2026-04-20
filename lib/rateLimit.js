// lib/rateLimit.js
import { Ratelimit } from '@upstash/ratelimit'
import { redis } from './redis'

/**
 * Basic IP-based sliding window rate limiter
 */
export async function rateLimit(request, { requests, window }) {
  const ip = request.headers.get('x-forwarded-for') || 'anonymous'
  
  const ratelimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(requests, window),
    prefix: '@upstash/ratelimit/ip'
  })

  const { success } = await ratelimit.limit(ip)
  return !success
}

/**
 * Specialized progressive lockout for login attempts
 * - 3 failures -> 5 minute lockout
 * - 5+ failures -> 15 minute lockout
 */
export async function getLoginLockout(ip) {
  const failureKey = `login_fail_count:${ip}`
  const count = await redis.get(failureKey) || 0
  
  if (count >= 5) return { locked: true, minutes: 15, remaining: await redis.ttl(failureKey) }
  if (count >= 3) return { locked: true, minutes: 5, remaining: await redis.ttl(failureKey) }
  
  return { locked: false, count }
}

export async function recordLoginFailure(ip) {
  const failureKey = `login_fail_count:${ip}`
  const count = await redis.incr(failureKey)
  
  // Set expiry based on failure tier if not already set
  // This essentially creates the "lockout" duration
  if (count === 3) {
    await redis.expire(failureKey, 300) // 5 minutes
  } else if (count >= 5) {
    await redis.expire(failureKey, 900) // 15 minutes
  } else if (count < 3) {
    // Small window to track sequential failures (e.g. 1 hour)
    const ttl = await redis.ttl(failureKey)
    if (ttl < 0) await redis.expire(failureKey, 3600)
  }
  
  return count
}

export async function resetLoginFailures(ip) {
  const failureKey = `login_fail_count:${ip}`
  await redis.del(failureKey)
}
