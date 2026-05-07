import { createClient } from '@/lib/supabase/server'
import { Sparkles, Heart, Target, Lightbulb, Users, Award } from 'lucide-react'

const values = [
  {
    title: 'Passion',
    desc: 'We are deeply passionate about mathematics and its potential to transform lives.',
    icon: <Heart size={20} className="text-marigold" />
  },
  {
    title: 'Accessibility',
    desc: 'Making quality math education available to every student in Nepal, regardless of background.',
    icon: <Users size={20} className="text-marigold" />
  },
  {
    title: 'Innovation',
    desc: 'Constantly exploring new ways to teach and engage with mathematical concepts.',
    icon: <Lightbulb size={20} className="text-marigold" />
  },
  {
    title: 'Excellence',
    desc: 'Striving for the highest standards in everything we do, from programs to content.',
    icon: <Award size={20} className="text-marigold" />
  },
]

export default async function AboutPage() {
  const supabase = await createClient()
  const { data: settings } = await supabase
    .from('site_settings')
    .select('*')
    .eq('id', 'main')
    .single()

  return (
    <div className="pt-32 pb-24 space-y-32">
      <section className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 pill px-5 py-2.5 text-xs font-institutional tracking-[0.2em] text-text-secondary-dynamic">
            <Sparkles size={16} className="text-marigold" />
            {settings?.about_hero_title || 'Our Mission'}
          </div>
          <h1 className="text-headline text-5xl md:text-7xl font-bold tracking-tight">
            {settings?.about_hero_title || 'Advancing Mathematics in Nepal'}
          </h1>
          <p className="text-xl text-text-secondary-dynamic leading-relaxed max-w-3xl mx-auto">
            {settings?.about_hero_description || 'Empowering the next generation of mathematical thinkers through education, competition, and community.'}
          </p>
        </div>
      </section>

      <section className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <div className="bg-surface rounded-2xl p-12 space-y-6 border border-border">
            <div className="w-16 h-16 rounded-xl bg-marigold/5 border border-marigold/10 flex items-center justify-center">
              <Target size={32} className="text-marigold" />
            </div>
            <h3 className="text-headline text-3xl font-bold">Our Vision</h3>
            <p className="text-lg text-text-secondary-dynamic leading-relaxed">
              {settings?.about_vision_text || 'A Nepal where every student has access to world-class mathematics education and the opportunity to compete on the global stage.'}
            </p>
          </div>

          <div className="bg-surface rounded-2xl p-12 space-y-6 border border-border">
            <div className="w-16 h-16 rounded-xl bg-marigold/5 border border-marigold/10 flex items-center justify-center">
              <Heart size={32} className="text-marigold" />
            </div>
            <h3 className="text-headline text-3xl font-bold">Our Mission</h3>
            <p className="text-lg text-text-secondary-dynamic leading-relaxed">
              {settings?.about_mission_text || 'To identify, nurture, and elevate mathematical talent across Nepal through olympiad training, mentorship, and community-building.'}
            </p>
          </div>
        </div>
      </section>

      <section className="border-y border-border">
        <div className="container mx-auto px-6 py-24">
          <div className="text-center mb-16 space-y-4">
            <span className="text-xs font-institutional tracking-[0.2em] text-text-tertiary-dynamic">Core Values</span>
            <h2 className="text-headline text-4xl md:text-5xl font-bold tracking-tight">What Drives Us</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value) => (
              <div
                key={value.title}
                className="bg-surface rounded-2xl p-8 border border-border hover:border-border-strong transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-bg-secondary flex items-center justify-center mb-6">
                  {value.icon}
                </div>
                <h4 className="text-headline text-xl font-bold mb-3">{value.title}</h4>
                <p className="text-sm text-text-secondary-dynamic leading-relaxed">
                  {value.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-6 py-12">
        <div className="max-w-5xl mx-auto bg-surface rounded-3xl p-12 md:p-24 flex flex-col md:flex-row items-center gap-16 border border-border">
          <div className="flex-1 space-y-6">
            <h2 className="text-headline text-4xl font-bold tracking-tight leading-tight">
              {settings?.about_rec_title || 'Recognized by the Mathematical Community'}
            </h2>
            <div className="max-w-xl">
              <p className="text-lg text-text-secondary-dynamic leading-relaxed">
                {settings?.about_rec_description || 'MIN has been recognized by national and international organizations for its contributions to mathematical education and olympiad training in Nepal.'}
              </p>
            </div>
            <div className="pt-4">
              <div className="flex items-center gap-4 mb-2">
                <div className="w-2 h-2 pill bg-diya-flame" />
                <span className="font-bold text-accent">
                  {settings?.about_rec_badge_title || 'Award of Excellence'}
                </span>
              </div>
              <div className="text-sm text-text-tertiary-dynamic">
                {settings?.about_rec_badge_desc || 'National Mathematics Society, Nepal'}
              </div>
            </div>
          </div>
          <div className="w-64 h-64 md:w-80 md:h-80 relative flex-shrink-0">
            {settings?.about_rec_image && (
              <img
                src={settings.about_rec_image}
                alt="Award"
                className="w-full h-full object-contain p-8"
              />
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
