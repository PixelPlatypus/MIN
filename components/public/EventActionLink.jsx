'use client'
import { captureEvent } from '@/lib/analytics'

export default function EventActionLink({ href, title, eventType, actionText }) {
  if (!actionText || !href) return null

  function handleClick() {
    captureEvent('event_registration_clicked', { title, event_type: eventType, url: href })
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className="btn-brand text-sm shrink-0 w-full sm:w-auto"
    >
      {actionText}
    </a>
  )
}
