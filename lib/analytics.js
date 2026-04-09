// lib/analytics.js
import { track } from '@vercel/analytics'

/**
 * Capture a custom event in Vercel Analytics
 * @param {string} eventName 
 * @param {Object} properties 
 */
export function captureEvent(eventName, properties = {}) {
  if (typeof window !== 'undefined') {
    track(eventName, properties)
  }
}

/**
 * Identify a user (Note: Vercel Analytics doesn't have a direct equivalent to identify)
 * We treat this as a no-op to maintain API compatibility.
 */
export function identifyUser(distinctId, userProperties = {}) {
  // Vercel Analytics handles identifying users automatically via session/visitor tracking
  // Custom identification logic is not required for the standard setup.
}
