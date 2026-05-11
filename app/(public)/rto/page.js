import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Compass, Target, ArrowRight, MapPin, Flag, Award, ChevronRight, Globe, Library, FileText } from 'lucide-react'

const ICON_MAP = {
  MapPin, Flag, Award, Globe, Library, FileText
}

export default async function RTOPage() {
  const supabase = await createClient()
  const { data: settings } = await supabase
    .from('site_settings')
    .select('*')
    .eq('id', 'main')
    .single()

  const displayStages = settings?.rto_stages || []
  const displayRoadmap = settings?.rto_roadmap || []
  const displayResources = settings?.rto_resources || []

  return (
    <div className="pt-32 pb-24 space-y-32">
      <section className="container mx-auto px-6 relative">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 pill px-5 py-2.5 text-xs font-institutional tracking-[0.2em] text-text-secondary-dynamic">
            <Compass size={18} className="text-marigold" />
            {settings?.rto_title || 'Road to Olympiad'}
          </div>
          <h1 className="text-headline text-6xl md:text-8xl font-bold tracking-tight leading-[0.9]">
            {settings?.rto_subtitle || 'Your Path to the IMO'}
          </h1>
          <p className="text-xl md:text-2xl text-text-secondary-dynamic leading-relaxed font-medium max-w-3xl mx-auto">
            {settings?.rto_description || 'The structured journey from local mathematics competitions to the International Mathematical Olympiad stage.'}
          </p>
        </div>
      </section>

      <section className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-headline text-4xl font-bold tracking-tight">Olympiad Selection Process</h2>
            <p className="text-text-secondary-dynamic text-lg max-w-2xl mx-auto">
              The journey to the International Mathematical Olympiad (IMO) in Nepal involves several stages, designed to identify and nurture the most talented young mathematicians.
            </p>
          </div>

          <div className="relative">
            {/* Desktop horizontal progression bar — vertically centered on the icon (card p-8=32 + icon h-16/2=32 → 64px) */}
            <div className="hidden lg:block absolute top-[63px] left-[8%] right-[8%] h-[2px] bg-gradient-to-r from-marigold/15 via-marigold/70 to-marigold/15 rounded-full pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8 relative">
              {displayStages.map((stage, idx) => {
                const Icon = ICON_MAP[stage.icon] || Award
                const isLast = idx === displayStages.length - 1
                return (
                  <div key={stage.id} className="relative flex flex-col items-center">
                    <div className="bg-surface rounded-2xl p-8 border border-border flex flex-col items-center text-center hover:border-border-strong transition-colors w-full">
                      <div className="w-16 h-16 rounded-xl bg-bg-secondary flex items-center justify-center mb-6">
                        <Icon size={32} className="text-marigold" />
                      </div>
                      <h3 className="text-headline font-bold text-xl mb-3 tracking-tight">{stage.id}</h3>
                      <h4 className="text-sm font-bold text-text-secondary-dynamic mb-4 leading-tight min-h-[40px]">{stage.name}</h4>
                      <p className="text-xs text-text-tertiary-dynamic leading-relaxed mt-auto">
                        {stage.desc}
                      </p>
                    </div>
                    {!isLast && (
                      <ChevronRight
                        size={22}
                        strokeWidth={2.5}
                        className="lg:hidden text-marigold rotate-90 my-1"
                        aria-hidden
                      />
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-6">
        <div className="max-w-5xl mx-auto bg-surface rounded-3xl p-12 md:p-16 border border-border">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="space-y-6 flex-1 text-center md:text-left">
              <div className="w-16 h-16 rounded-xl bg-bg-secondary flex items-center justify-center mx-auto md:mx-0">
                <Target size={32} className="text-marigold" />
              </div>
              <h2 className="text-headline text-4xl font-bold tracking-tight">DMO Practice Questions</h2>
              <p className="text-lg text-text-secondary-dynamic leading-relaxed">
                Sharpen your problem-solving skills with a diverse set of District Mathematical Olympiad practice questions. Each set is designed to challenge and prepare you for the real competition.
              </p>
            </div>
            <Link
              href="/dmopractice"
              className="bg-headline text-bg px-10 py-5 rounded-xl font-bold text-lg hover:bg-accent transition-all flex items-center gap-3 shrink-0"
            >
              Start Practicing
              <ArrowRight size={24} />
            </Link>
          </div>
        </div>
      </section>

      {displayRoadmap.length > 0 && (
        <section className="border-y border-border">
          <div className="container mx-auto px-6 py-24 bg-bg-secondary/30">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-headline text-4xl font-bold tracking-tight">Roadmap: Beginner to IMO</h2>
              <p className="text-text-secondary-dynamic text-lg">Follow this structured path to master Olympiad mathematics step-by-step.</p>
            </div>

            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
              {displayRoadmap.map((phase, idx) => {
                const phaseColors = {
                  1: { bg: 'bg-marigold/5', border: 'border-marigold/20' },
                  2: { bg: 'bg-lotus-pink/5', border: 'border-lotus-pink/20' },
                  3: { bg: 'bg-diya-flame/5', border: 'border-diya-flame/20' },
                }
                const pc = phaseColors[idx + 1] || { bg: 'bg-bg-secondary', border: 'border-border' }

                return (
                  <div
                    key={phase.phase}
                    className={`rounded-2xl p-8 md:p-10 border ${pc.bg} ${pc.border}`}
                  >
                    <div className="flex items-start justify-between mb-8">
                      <div>
                        <span className="pill px-3 py-1.5 text-xs font-institutional tracking-[0.2em] text-text-secondary-dynamic mb-4 inline-block">
                          {phase.timeline}
                        </span>
                        <h3 className="text-headline text-3xl font-bold tracking-tight mb-2">{phase.phase}</h3>
                        <p className="text-sm font-bold text-text-secondary-dynamic">Goal: {phase.goal}</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {(phase.items || []).map((item, i) => (
                        <div key={i} className="flex gap-4 p-4 rounded-xl bg-bg-secondary border border-border">
                          <div className="w-8 h-8 shrink-0 rounded-xl bg-surface flex items-center justify-center font-bold text-sm text-text-secondary-dynamic">
                            {i + 1}
                          </div>
                          <div>
                            <h4 className="font-bold text-sm mb-1 text-text-primary-dynamic">{item.label}</h4>
                            <p className="text-xs text-text-tertiary-dynamic leading-relaxed">{item.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {displayResources.length > 0 && (
        <section className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-headline text-4xl font-bold tracking-tight">Essential Resources</h2>
              <p className="text-text-secondary-dynamic text-lg">Curated materials to accelerate your math journey.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {displayResources.map((category, idx) => {
                const Icon = ICON_MAP[category.icon] || Library
                return (
                  <div
                    key={category.title}
                    className="bg-surface rounded-2xl p-8 border border-border flex flex-col h-full hover:border-border-strong transition-colors"
                  >
                    <div className="w-12 h-12 rounded-xl bg-bg-secondary flex items-center justify-center mb-6">
                      <Icon size={24} className="text-marigold" />
                    </div>
                    <h3 className="text-headline text-xl font-bold mb-6 tracking-tight">{category.title}</h3>
                    <ul className="space-y-4">
                      {(category.items || []).map((item, i) => {
                        const name = typeof item === 'string' ? item : item.name
                        const url = typeof item === 'string' ? '#' : item.url
                        return (
                          <li key={i} className="flex items-start gap-3">
                            <ChevronRight size={16} className="text-marigold/30 shrink-0 mt-0.5" />
                            <a
                              href={url}
                              target={url.startsWith('http') ? '_blank' : '_self'}
                              rel="noopener noreferrer"
                              className={`text-sm leading-tight font-medium transition-all ${
                                url !== '#'
                                  ? 'text-text-secondary-dynamic hover:text-headline'
                                  : 'text-text-tertiary-dynamic'
                              }`}
                            >
                              {name}
                            </a>
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
