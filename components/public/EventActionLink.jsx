'use client'
import { captureEvent } from '@/lib/analytics'

export default function EventActionLink({ href, title, eventType }) {
  function handleClick() {
    captureEvent('event_registration_clicked', { title, event_type: eventType, url: href })
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className="bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-2xl font-black text-sm shadow-xl shadow-primary/30 transition-all hover:-translate-y-1 active:scale-[0.98] shrink-0"
    >
      Proceed to Link
    </a>
  )
}
