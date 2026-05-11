import { Calendar } from 'lucide-react'
export default function EventsHero({ settings }) {
  return (
    <section className="px-6 md:px-12 lg:px-20 pb-12">
      <div className="max-w-3xl mx-auto text-center space-y-6">
        <div className="pill inline-flex items-center gap-2 px-4 py-1.5"><Calendar size={14} className="text-marigold" /><span className="text-[10px] font-institutional tracking-[0.2em] text-text-tertiary-dynamic">{settings?.events_title || 'Program Overview'}</span></div>
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05] text-headline">{settings?.events_subtitle || 'Our Active Initiatives'}</h1>
        <p className="text-lg md:text-xl text-text-secondary-dynamic leading-relaxed max-w-2xl mx-auto">{settings?.events_description || 'Explore the workshops, seminars, and camps we organize throughout the year.'}</p>
      </div>
    </section>
  )
}
