'use client'
import { Calendar } from '@phosphor-icons/react'
import PageHero from '@/components/public/PageHero'

export default function EventsHero({ settings, loading }) {
  return (
    <PageHero
      eyebrow={settings?.events_title}
      icon={<Calendar size={14} weight="bold" />}
      title={settings?.events_subtitle}
      description={settings?.events_description}
      loading={loading}
    />
  )
}
