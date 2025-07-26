"use client"

import { motion, cubicBezier } from "framer-motion";
import { useState, useMemo } from "react"
import { Calendar, Users } from "lucide-react"
import { MinFloatingElements } from "@/components/ui/min-floating-elements"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"

import teamData from "@/data/team.json"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
      ease: cubicBezier(0.22, 1, 0.36, 1),
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: cubicBezier(0.22, 1, 0.36, 1),
    },
  },
}

const MemberCard = ({ member, index }: { member: any; index: number }) => {
  return (
    <motion.div variants={itemVariants} className="group cursor-pointer" data-hover="true">
      <div className="glass-card rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 text-center group h-full relative overflow-hidden">
        {/* Avatar */}
        <div className="relative mb-4 sm:mb-6">
          <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 glass-light rounded-full mx-auto flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
            <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-min-accent to-min-light rounded-full flex items-center justify-center text-min-primary font-bold text-sm sm:text-base lg:text-lg">
              {member.name.charAt(0)}
            </div>
          </div>
        </div>

        <h4 className="text-base sm:text-lg lg:text-xl font-semibold text-white mb-2 group-hover:min-gradient-accent transition-colors">
          {member.name}
        </h4>
        <p className="text-white/80 font-medium text-xs sm:text-sm mb-2">{member.position}</p>
        <p className="text-white/60 font-light text-xs mb-4">{member.specialty}</p>

        <div className="mt-4 w-8 sm:w-12 h-0.5 bg-gradient-to-r from-min-accent to-min-light mx-auto transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
      </div>
    </motion.div>
  )
}

export default function TeamPage() {
  const [selectedYear, setSelectedYear] = useState(2025)
  const years = Object.keys(teamData)
    .map(Number)
    .sort((a, b) => b - a)

  // Calculate alumni count automatically
  const alumniCount = useMemo(() => {
    const currentYear = new Date().getFullYear()
    let total = 0
    Object.entries(teamData).forEach(([year, members]) => {
      if (Number.parseInt(year) < currentYear) {
        total += members.length
      }
    })
    return total
  }, [])

  return (
    <div className="min-h-screen overflow-x-hidden">
      <MinFloatingElements />

      {/* Navigation */}
      <Navigation />

      {/* Hero Section */}
      <section className="pt-24 sm:pt-32 pb-12 sm:pb-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto container-padding text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="inline-flex items-center space-x-2 glass rounded-full px-4 sm:px-6 py-2 sm:py-3 mb-6 sm:mb-8">
              <Users className="w-3 h-3 sm:w-4 sm:h-4 text-min-accent" />
              <span className="text-white/90 text-xs sm:text-sm font-medium">Meet the Visionaries</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 sm:mb-8">
              Behind Every <span className="min-gradient-accent">Great Idea</span>
            </h1>
            <p className="text-white/70 text-base sm:text-lg lg:text-xl font-light max-w-3xl mx-auto">
              Meet the brilliant minds who dare to reimagine mathematics education. These are the dreamers, builders,
              and changemakers making it all possible.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Year Selection */}
      <section className="py-8 sm:py-16 relative z-10">
        <div className="max-w-7xl mx-auto container-padding">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-center mb-8 sm:mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6 sm:mb-8 flex flex-col sm:flex-row items-center justify-center gap-2">
              Choose Your <span className="min-gradient-accent">Timeline</span>
            </h2>
            <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
              {years.map((year) => (
                <motion.button
                  key={year}
                  onClick={() => setSelectedYear(year)}
                  className={`relative px-4 sm:px-6 lg:px-8 py-2 sm:py-3 lg:py-4 rounded-full font-medium tracking-wide transition-all duration-300 text-sm sm:text-base ${
                    selectedYear === year ? "btn-min-accent text-min-primary" : "glass text-white hover:glass-hover"
                  }`}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  data-hover="true"
                >
                  <Calendar className="inline-block mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                  {year}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Team Members */}
      <section className="py-12 sm:py-20 relative z-10">
        <div className="max-w-7xl mx-auto container-padding">
          <motion.div
            key={selectedYear}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="text-center mb-12 sm:mb-16">
              <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 flex flex-col sm:flex-row items-center justify-center gap-2">
                Members of <span className="min-gradient-accent">{selectedYear}</span>
              </h3>
              <div className="flex items-center justify-center space-x-2 text-white/70">
                <Users className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="font-medium text-sm sm:text-base">
                  {teamData[selectedYear.toString() as keyof typeof teamData].length} Extraordinary Minds
                </span>
              </div>
            </div>

            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {teamData[selectedYear.toString() as keyof typeof teamData].map((member, index) => (
                <MemberCard key={`${member.name}-${index}`} member={member} index={index} />
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Team Stats */}
      <section className="section-padding relative overflow-hidden">
        <div className="max-w-7xl mx-auto container-padding text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: true }}
            className="mb-12 sm:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 sm:mb-8 flex flex-col sm:flex-row items-center justify-center gap-2">
              The Numbers Tell  <span className="min-gradient-accent">Our Story</span>
            </h2>
            <p className="text-white/70 text-base sm:text-lg lg:text-xl font-light max-w-3xl mx-auto">
              Every statistic represents a dream pursued, a challenge overcome, and a future transformed.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
            {[
              { number: "50+", label: "Active Dreamers" },
              { number: `${alumniCount}+`, label: "Alumni Changemakers" },
              { number: "∞", label: "Possibilities Ahead" },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: index * 0.2 }}
                viewport={{ once: true }}
                className="glass-card rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-center group"
                data-hover="true"
              >
                <div className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-3 sm:mb-4 group-hover:min-gradient-accent transition-colors">
                  {stat.number}
                </div>
                <div className="text-white/80 font-medium text-base sm:text-lg">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <div className="mt-20" />
{/* Footer */}
<Footer />
    </div>
  )
}
