"use client"

import React, { useRef } from "react"
import { motion, easeInOut } from "framer-motion"
import { useShiningEffect } from '@/hooks/use-shining-effect';
import { Target, Users, Award, Rocket, BookOpen, Globe } from "lucide-react"
import milestonesData from "@/data/story.json"

const iconMap = {
  Target: Target,
  BookOpen: BookOpen,
  Users: Users,
  Rocket: Rocket,
  Globe: Globe,
  Award: Award,
}

interface Milestone {
  year: string;
  title: string;
  description: string;
  icon: keyof typeof iconMap;
}

const milestones: Milestone[] = milestonesData as Milestone[];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
      delayChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: easeInOut,
    },
  },
}

export const StorySection = () => {
  return (
    <section id="story" className="py-20 sm:py-32 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-20"
        >
          <div className="inline-flex items-center space-x-2 glass rounded-full px-4 sm:px-6 py-2 sm:py-3 mb-6 sm:mb-8">
            <div className="w-2 h-2 bg-min-accent rounded-full" />
            <span className="text-white/90 text-xs sm:text-sm font-medium">Our Journey</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6">
            How MIN <span className="min-gradient-accent">Started</span>
          </h2>
          <p className="text-white/70 text-base sm:text-lg lg:text-xl max-w-3xl mx-auto leading-relaxed">
            From a small initiative to a nationwide movement transforming mathematics education
          </p>
        </motion.div>

        {/* Timeline */}
        <motion.div
          className="relative"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Timeline line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 sm:w-1 h-full bg-gradient-to-b from-min-primary via-min-accent to-min-light rounded-full" />

          {milestones.map((milestone, index) => (
            <motion.div
              key={milestone.year}
              variants={itemVariants}
              className={`relative flex items-center mb-12 sm:mb-20 ${
                index % 2 === 0 ? "flex-row" : "flex-row-reverse"
              }`}
            >
              <div className={`w-full sm:w-1/2 ${index % 2 === 0 ? "sm:pr-8 lg:pr-16" : "sm:pl-8 lg:pl-16"}`}>
                                <motion.div
                  className="glass-card rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 group shining-effect"
                  whileHover={{ y: -5, scale: 1.02 }}
                  data-hover="true"
                  ref={useShiningEffect<HTMLDivElement>()}
                >
                  <div
                    className={`flex items-center gap-4 sm:gap-6 mb-4 sm:mb-6 ${
                      index % 2 === 0 ? "sm:flex-row-reverse sm:text-right" : "flex-row"
                    }`}
                  >
                    <div className="w-12 h-12 sm:w-16 sm:h-16 glass-light rounded-xl sm:rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      {milestone.icon && (
                        React.createElement(iconMap[milestone.icon], { className: "w-6 h-6 sm:w-8 sm:h-8 text-min-primary" })
                      )}
                    </div>
                    <div className={index % 2 === 0 ? "sm:text-right" : "text-left"}>
                      <div className="text-2xl sm:text-3xl font-bold text-white">{milestone.year}</div>
                      <div className="text-lg sm:text-xl font-semibold min-gradient-accent">{milestone.title}</div>
                    </div>
                  </div>
                  <p className="text-white/80 leading-relaxed text-sm sm:text-base">{milestone.description}</p>
                </motion.div>
              </div>

              {/* Timeline dot */}
              <motion.div
                className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 sm:w-6 sm:h-6 glass-light rounded-full border-2 border-min-accent shadow-lg z-10 hidden sm:block"
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
