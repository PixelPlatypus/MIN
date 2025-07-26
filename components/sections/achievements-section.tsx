"use client"

import { motion } from "framer-motion"
import { Users, Award, BookOpen, Calendar, Target, Globe } from "lucide-react"

export const AchievementsSection = () => {
  const currentYear = new Date().getFullYear()
  const foundingYear = 2020
  const yearsOfImpact = currentYear - foundingYear

  const achievements = [
    {
      number: "1400+",
      label: "Underprivileged Students Reached",
      icon: Users,
      description: "Providing free math resources, workshops, and tutoring to underserved communities."
    },
    {
      number: "50+",
      label: "Active Volunteers & Collaborators",
      icon: Award,
      description: "Dedicated educators and partners fostering interactive, exploratory math learning."
    },
    {
      number: "15+",
      label: "Ongoing Programs & Camps",
      icon: BookOpen,
      description: "Flagship initiatives like JMOC, Olymprep, M³ Bootcamp, and empowerment camps."
    },
    {
      number: `${yearsOfImpact}`,
      label: "Years of Impact",
      icon: Calendar,
      description: "Since inception, driving scalable math education innovations recognized worldwide."
    },
    {
      number: "100%",
      label: "Dedication to Equity",
      icon: Target,
      description:
        "Empowering students equally through gender-specific initiatives and open access resources."
    },
    {
      number: "∞",
      label: "Possibilities Created",
      icon: Globe,
      description:
        "Expanding reach nationally and internationally via collaborations, contests, and digital platforms."
    }
  ]

  return (
    <section aria-labelledby="achievements-section" className="py-32 relative overflow-hidden bg-min-background">
      {/* Background radial pattern */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgba(205, 170, 114, 0.4) 1px, transparent 0)`,
          backgroundSize: "50px 50px"
        }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          id="achievements-section"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <div className="inline-flex items-center space-x-2 glass rounded-full px-6 py-3 mb-8">
            <span className="w-2 h-2 bg-min-accent rounded-full" />
            <span className="text-white/90 text-sm font-semibold uppercase tracking-wide">Our Impact</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight">
            What <span className="min-gradient-accent">MIN Has Achieved</span>
          </h2>
          <p className="text-white/75 text-lg md:text-xl">
            Numbers that tell the story of our commitment to mathematical excellence, equity, and innovation.
          </p>
        </motion.div>

        {/* Achievements Grid */}
        <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {achievements.map(({ number, label, icon: Icon, description }, index) => (
            <motion.article
              key={label}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.15 }}
              viewport={{ once: true }}
              className="group glass-card rounded-3xl p-8 text-center cursor-default shadow-lg hover:shadow-2xl transition-shadow"
              aria-label={`${label}: ${number}. ${description}`}
            >
              <motion.div
                className="glass-light rounded-2xl flex items-center justify-center mx-auto mb-6 w-20 h-20 group-hover:scale-110 transition-transform"
                aria-hidden="true"
              >
                <Icon className="w-10 h-10 text-min-primary" />
              </motion.div>
              <motion.h3
                className="text-5xl font-bold text-white mb-3 min-gradient-accent group-hover:scale-110 transition-transform"
                aria-live="polite"
              >
                {number}
              </motion.h3>
              <p className="text-white/90 font-semibold text-lg mb-2">{label}</p>
              <p className="text-white/70 text-sm leading-relaxed max-w-[280px] mx-auto">{description}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
