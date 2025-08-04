"use client"

import { motion } from "framer-motion"
import { BookOpen, Users, Award, Globe, Video, MessageCircle } from "lucide-react"

const programs = [
  {
    title: "ETA Campaigns",
    description:
      "Free resources, workshops, and tutoring for underprivileged students, promoting interactive math learning beyond curriculum limits.",
    features: ["Free Resources", "Interactive Workshops", "Fun Activities", "Beyond Curriculum"],
    icon: BookOpen,
  },
  {
    title: "Olympiad Training",
    description:
      "Junior Mathematics Olympiad Camp (JMOC) and Olymprep programs designed for skill development and international competition preparation.",
    features: ["JMOC Training", "Olymprep Program", "International Prep", "Mathematical Thinking"],
    icon: Award,
  },
  {
    title: "Mathematical Modelling",
    description: "M³ Bootcamp focusing on real-world applications of mathematics and problem-solving techniques.",
    features: ["Real-world Applications", "Problem Solving", "Practical Skills"],
    icon: Globe,
  },
  {
    title: "Women in Mathematics",
    description:
      "Girls Mathematics Olympiad Camp and empowerment initiatives aimed at encouraging female participation in mathematics.",
    features: ["Girls Mathematical Olympiad Camp", "Mentorship", "Community Support"],
    icon: Users,
  },
  {
    title: "Digital Content",
    description:
      "YouTube series including ELI5(Explain Like I'm 5) for simplifying complex concepts and 'Road to Olympiad' training series.",
    features: ["ELI5 Series", "Road to Olympiad", "Concept Videos", "MadeEZ"],
    icon: Video,
  },
  {
    title: "Community Engagement",
    description:
      "Online communities on Discord and social media for collaboration, continuous learning, and peer support.",
    features: ["Discord Community", "Social Media", "Collaboration"],
    icon: MessageCircle,
  },
]

export const ProgramsSection = () => {
  return (
    <section className="py-32 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center space-x-2 glass rounded-full px-6 py-3 mb-8">
            <div className="w-2 h-2 bg-min-accent rounded-full" />
            <span className="text-white/90 text-sm font-medium">Our Programs</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            What MIN <span className="min-gradient-accent">Provides</span>
          </h2>
          <p className="text-white/70 text-xl max-w-3xl mx-auto leading-relaxed">
            Comprehensive programs designed to make mathematics accessible, engaging, and inspiring for all
          </p>
        </motion.div>

        {/* Programs Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {programs.map((program, index) => (
            <motion.div
              key={program.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <motion.div
                className="glass-card rounded-3xl p-8 h-full relative overflow-hidden group"
                whileHover={{ y: -10 }}
                data-hover="true"
              >
                {/* Gradient overlay */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-min-accent/20 to-min-light/20 rounded-bl-3xl opacity-50 group-hover:opacity-80 transition-opacity" />

                {/* Icon */}
                <div className="w-16 h-16 glass-light rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <program.icon className="w-8 h-8 text-min-primary" />
                </div>

                <h3 className="text-2xl font-bold text-white mb-4 group-hover:min-gradient-accent transition-all">
                  {program.title}
                </h3>

                <p className="text-white/80 leading-relaxed mb-6">{program.description}</p>

                <div className="space-y-3">
                  {program.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-min-accent rounded-full" />
                      <span className="text-white/70 text-sm font-medium">{feature}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
