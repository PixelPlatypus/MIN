'use client'
import { useEffect } from 'react'
import { captureEvent } from '@/lib/analytics'

/**
 * Helper component to track events from server components
 * @param {string} eventName 
 * @param {Object} properties 
 */
export default function AnalyticsTracker({ eventName, properties }) {
  useEffect(() => {
    captureEvent(eventName, properties)
  }, [eventName, JSON.stringify(properties)])

  return null
}
