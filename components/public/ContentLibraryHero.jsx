import Link from 'next/link'
import { Sparkles, Library } from 'lucide-react'
export default function ContentLibraryHero() {
  return (
    <section className="px-6 md:px-12 lg:px-20 pt-36 pb-12">
      <div className="max-w-3xl mx-auto text-center space-y-6">
        <div className="pill inline-flex items-center gap-2 px-4 py-1.5"><Library size={14} className="text-marigold" /><span className="text-[10px] font-institutional tracking-[0.2em] text-text-tertiary-dynamic">Library</span></div>
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05] text-headline">Knowledge &amp; Resources</h1>
        <p className="text-lg md:text-xl text-text-secondary-dynamic leading-relaxed max-w-2xl mx-auto">Discover a wealth of mathematical articles, challenging problems, and educational resources curated for students and teachers.</p>
        <div className="pt-4"><Link href="/submit-content" className="inline-flex items-center gap-2 bg-headline text-bg px-8 py-4 rounded-xl text-sm font-semibold tracking-wide hover:bg-accent hover:shadow-xl hover:shadow-accent/25 transition-all"><Sparkles size={16} />Contribute Your Knowledge</Link></div>
      </div>
    </section>
  )
}
