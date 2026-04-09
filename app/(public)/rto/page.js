'use client'
import { motion } from 'framer-motion'
import { 
  Trophy, BookOpen, Compass, Target, 
  ChevronRight, Calculator, Globe, 
  Users, Library, FileText, ArrowRight,
  MapPin, Flag, Award, Sparkles
} from 'lucide-react'
import Link from 'next/link'

const stages = [
  { id: 'DMO', name: 'District Math Olympiad', desc: 'The first step. Open to thousands of students across districts in Nepal.', icon: MapPin },
  { id: 'PMO', name: 'Provincial Math Olympiad', desc: 'Top performers from districts compete at the provincial level.', icon: Flag },
  { id: 'NMO', name: 'National Math Olympiad', desc: 'The elite few battle it out nationally to enter the training camp.', icon: Award },
  { id: 'Camp', name: 'Olympiad Training Camp', desc: 'Intensive training for the national team prospects.', icon: Users },
  { id: 'IMO', name: 'International Math Olympiad', desc: 'Representing Nepal on the global stage.', icon: Globe },
]

const roadmap = [
  {
    phase: 'Phase 1 - Foundation',
    timeline: 'Before DMO',
    goal: 'Build strong school math fundamentals & start problem-solving mindset.',
    color: 'from-blue-500/20 to-cyan-500/20',
    borderColor: 'border-blue-500/30',
    iconColor: 'text-blue-500',
    items: [
      { label: 'Arithmetic, Algebra basics', desc: 'Use AoPS Prealgebra; revise school math concepts' },
      { label: 'Number theory basics', desc: 'Learn GCD, LCM, intro to modular arithmetic' },
      { label: 'Geometry basics', desc: 'Study triangles, circles, coordinate geometry' },
      { label: 'Combinatorics basics', desc: 'Counting, permutations, combinations' },
      { label: 'Exam skills', desc: 'Time management, elimination strategies' },
    ]
  },
  {
    phase: 'Phase 2 - PMO Prep',
    timeline: 'Intermediate',
    goal: 'Deepen concepts, transition to intermediate problem-solving.',
    color: 'from-emerald-500/20 to-teal-500/20',
    borderColor: 'border-emerald-500/30',
    iconColor: 'text-emerald-500',
    items: [
      { label: 'Algebra deep dive', desc: 'Inequalities, quadratic equations' },
      { label: 'Number theory', desc: 'Modular arithmetic, Diophantine equations' },
      { label: 'Geometry intermediate', desc: 'Cyclic quadrilaterals, similarity' },
      { label: 'Combinatorics advance', desc: 'Graph theory basics, pigeonhole principle' },
    ]
  },
  {
    phase: 'Phase 3 - NMO Progression',
    timeline: 'Advanced',
    goal: 'Learn proof-writing and advanced problem-solving.',
    color: 'from-purple-500/20 to-fuchsia-500/20',
    borderColor: 'border-purple-500/30',
    iconColor: 'text-purple-500',
    items: [
      { label: 'Proof-writing', desc: 'Practice clear, logical solutions' },
      { label: 'Algebra', desc: 'Symmetric polynomials, AM-GM, Cauchy-Schwarz' },
      { label: 'Number theory', desc: 'Euler’s theorem, Chinese Remainder Theorem' },
      { label: 'Geometry', desc: 'Radical axis, transformations' },
      { label: 'Combinatorics', desc: 'Inclusion–exclusion, generating functions' },
    ]
  },
  {
    phase: 'Phase 4 - IMO Training',
    timeline: 'Elite',
    goal: 'Reach international competition level.',
    color: 'from-coral/20 to-orange-500/20',
    borderColor: 'border-coral/30',
    iconColor: 'text-coral',
    items: [
      { label: 'Algebra', desc: 'Advanced inequalities, functional equations' },
      { label: 'Number theory', desc: 'Quadratic residues, hard Diophantine problems' },
      { label: 'Geometry', desc: 'Inversions, homothety, projective geometry' },
      { label: 'Combinatorics', desc: 'Advanced graph theory, extremal problems' },
      { label: 'Full IMO simulation', desc: 'Timed 6-problem practice sets' },
      { label: 'Weak area fixing', desc: 'Focused training on problem areas' },
    ]
  }
]

const resources = [
  {
    title: 'Books & Guides',
    icon: Library,
    items: [
      'The Art of Problem Solving, Vol. 1: The Basics',
      'The Art of Problem Solving, Vol. 2: And Beyond',
      'Problem-Solving Strategies',
      'Mathematical Olympiad Treasures',
    ]
  },
  {
    title: 'Online Platforms',
    icon: Globe,
    items: [
      'Art of Problem Solving (AoPS)',
      'Brilliant.org',
      'Khan Academy',
      'GeoGebra',
    ]
  },
  {
    title: 'Past Papers',
    icon: FileText,
    items: [
      'IMO Official Website (Past Papers)',
      'AoPS Community Contests',
      'MIN DMO Archives',
    ]
  },
  {
    title: 'Communities',
    icon: Users,
    items: [
      'AoPS Community Forum',
      'Math StackExchange',
      'MIN Discord Community',
    ]
  }
]

export default function RTOPage() {
  return (
    <div className="pt-32 pb-24 space-y-32">
      {/* Hero Section */}
      <section className="container mx-auto px-6 relative">
        <div className="absolute inset-0 bg-primary/5 dark:bg-primary/10 blur-[100px] rounded-full -z-10 w-3/4 h-3/4 mx-auto" />
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-primary/10 text-primary px-5 py-2.5 rounded-full text-sm font-black tracking-widest uppercase shadow-sm"
          >
            <Compass size={18} />
            The Challenge Awaits
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.5, type: 'spring' }}
            className="text-6xl md:text-8xl font-black tracking-tight leading-[0.9]"
          >
            Road to Olympiad
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl text-text-secondary dark:text-text-secondary-dark leading-relaxed max-w-3xl mx-auto font-medium"
          >
            Your comprehensive guide to navigating the RTO process, mastering advanced concepts, and accessing essential study materials.
          </motion.p>
        </div>
      </section>

      {/* Selection Process Timeline */}
      <section className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl font-black tracking-tight">Olympiad Selection Process</h2>
            <p className="text-text-secondary dark:text-text-tertiary text-lg max-w-2xl mx-auto">
              The journey to the International Mathematical Olympiad (IMO) in Nepal involves several stages, designed to identify and nurture the most talented young mathematicians.
            </p>
          </div>

          <div className="relative">
            {/* Connecting Line */}
            <div className="hidden lg:block absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-primary/10 via-primary/40 to-coral/40 -translate-y-1/2 rounded-full" />
            
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              {stages.map((stage, idx) => (
                <motion.div 
                  key={stage.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="glass rounded-3xl p-8 relative flex flex-col items-center text-center group border border-border dark:border-white/10 hover:border-primary/50 transition-all hover:-translate-y-2 shadow-sm hover:shadow-xl hover:shadow-primary/10 bg-white/50 dark:bg-[#111111]/50"
                >
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all shadow-inner">
                    <stage.icon size={32} />
                  </div>
                  <h3 className="font-black text-xl mb-3 tracking-tight">{stage.id}</h3>
                  <h4 className="text-sm font-bold text-text-secondary dark:text-text-tertiary mb-4 leading-tight min-h-[40px]">{stage.name}</h4>
                  <p className="text-xs text-text-tertiary leading-relaxed mt-auto">
                    {stage.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* DMO Practice Banner */}
      <section className="container mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto glass rounded-[3rem] p-12 md:p-16 border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent relative overflow-hidden"
        >
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/20 blur-[80px] rounded-full" />
          <div className="flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">
            <div className="space-y-6 flex-1 text-center md:text-left">
              <div className="w-16 h-16 rounded-3xl bg-primary/10 text-primary flex items-center justify-center mx-auto md:mx-0 shadow-inner">
                <Target size={32} />
              </div>
              <h2 className="text-4xl font-black tracking-tight">DMO Practice Questions</h2>
              <p className="text-lg text-text-secondary dark:text-text-tertiary leading-relaxed">
                Sharpen your problem-solving skills with a diverse set of District Mathematical Olympiad practice questions. Each set is designed to challenge and prepare you for the real competition.
              </p>
            </div>
            <Link 
              href="/dmopractice"
              className="bg-primary hover:bg-primary-dark text-white px-10 py-5 rounded-2xl font-black text-lg shadow-2xl shadow-primary/30 transition-all hover:-translate-y-1 active:scale-[0.98] flex items-center gap-3 shrink-0 group"
            >
              Start Practicing
              <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Roadmap Section */}
      <section className="container mx-auto px-6">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl font-black tracking-tight">Roadmap: Beginner to IMO</h2>
          <p className="text-text-secondary dark:text-text-tertiary text-lg">Follow this structured path to master Olympiad mathematics step-by-step.</p>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {roadmap.map((phase, idx) => (
            <motion.div
              key={phase.phase}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className={`glass rounded-[2.5rem] p-8 md:p-10 border-2 bg-gradient-to-br ${phase.color} ${phase.borderColor} shadow-sm relative overflow-hidden group`}
            >
               <div className={`absolute top-0 right-0 w-32 h-32 blur-[60px] rounded-full -z-10 ${phase.color}`} />
              <div className="flex items-start justify-between mb-8">
                <div>
                  <span className={`text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded-full bg-white/50 dark:bg-black/20 ${phase.iconColor} mb-4 inline-block`}>
                    {phase.timeline}
                  </span>
                  <h3 className="text-3xl font-black tracking-tight mb-2">{phase.phase}</h3>
                  <p className="text-sm font-bold text-text-secondary dark:text-text-tertiary">Goal: {phase.goal}</p>
                </div>
              </div>

              <div className="space-y-4">
                {phase.items.map((item, i) => (
                  <div key={i} className="flex gap-4 p-4 rounded-2xl bg-white/40 dark:bg-[#111111]/40 border border-border/50 dark:border-white/5 hover:bg-white/60 dark:hover:bg-[#222222]/60 transition-colors">
                    <div className={`w-8 h-8 shrink-0 rounded-full bg-white/50 dark:bg-black/20 flex items-center justify-center font-black text-sm ${phase.iconColor}`}>
                      {i + 1}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm mb-1">{item.label}</h4>
                      <p className="text-xs text-text-tertiary leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Resources Section */}
      <section className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl font-black tracking-tight">Essential Resources</h2>
            <p className="text-text-secondary dark:text-text-tertiary text-lg">Curated materials to accelerate your math journey.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {resources.map((category, idx) => (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="glass rounded-[2rem] p-8 border border-border dark:border-white/10 flex flex-col h-full bg-white/30 dark:bg-[#111111]/30 hover:border-text-tertiary/30 transition-colors"
              >
                <div className="w-12 h-12 rounded-2xl bg-bg-secondary dark:bg-white/5 flex items-center justify-center text-text-secondary dark:text-text-tertiary mb-6">
                  <category.icon size={24} />
                </div>
                <h3 className="text-xl font-black mb-6 tracking-tight">{category.title}</h3>
                <ul className="space-y-4 mt-auto">
                  {category.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <ChevronRight size={16} className="text-primary shrink-0 mt-0.5" />
                      <span className="text-sm text-text-secondary dark:text-text-tertiary leading-tight font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
