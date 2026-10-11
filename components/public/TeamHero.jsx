'use client'
import { useState, useEffect } from 'react'
import { UsersFour } from '@phosphor-icons/react'
import PageHero from '@/components/public/PageHero'

export default function TeamHero({ settings: initialSettings }) {
  const [settings, setSettings] = useState(initialSettings)
  const [loading, setLoading] = useState(!initialSettings)
  const [hasSeenAnimation, setHasSeenAnimation] = useState(false)

  useEffect(() => {
    const seen = sessionStorage.getItem('min_team_hero_seen')
    if (seen) {
      setHasSeenAnimation(true)
    } else {
      sessionStorage.setItem('min_team_hero_seen', 'true')
    }

    if (!initialSettings) {
      fetch('/api/settings')
        .then(res => res.json())
        .then(data => {
          setSettings(data)
          setLoading(false)
        })
        .catch(err => {
          console.error('Team settings load error', err)
          setLoading(false)
        })
    }
  }, [initialSettings])

  // Remount (rather than toggle props mid-animation) once we know the intro was already seen
  return (
    <PageHero
      key={hasSeenAnimation ? 'seen' : 'intro'}
      eyebrow={settings?.team_title}
      icon={<UsersFour size={14} weight="bold" />}
      title={settings?.team_subtitle}
      description={settings?.team_description}
      loading={loading}
      animate={!hasSeenAnimation}
    />
  )
}
