"use client"

import { motion, easeInOut } from "framer-motion"
import { useShiningEffect } from '@/hooks/use-shining-effect';
import { ArrowRight, Play, Sparkles } from "lucide-react"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: easeInOut,
    },
  },
}

export const HeroSection = () => {
  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20 sm:pt-24">


      <motion.div
        className="text-center max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Badge */}
        <motion.div
          variants={itemVariants}
          className="inline-flex items-center space-x-2 glass rounded-full px-4 sm:px-6 py-2 sm:py-3 mb-6 sm:mb-8"
        >
          <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-min-accent" />
          <span className="text-white/90 text-xs sm:text-sm font-medium">Math's Future: Crafted in Nepal, Powered by You.</span>
        </motion.div>

        {/* Main heading */}
        <motion.h1
          variants={itemVariants}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white mb-4 sm:mb-6 leading-tight"
        >
          Building Nepal’s
          <span className="block min-gradient-accent">Mathematical Future</span>
          <span className="block text-white/95">Together</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={itemVariants}
          className="text-white/80 text-base sm:text-lg md:text-xl lg:text-2xl font-light max-w-4xl mx-auto leading-relaxed mb-8 sm:mb-12 px-4"
        >
          Join us as we reshape the future of mathematics education in Nepal, nurturing the minds that will lead, innovate, and transform society one equation at a time.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4 sm:gap-16 justify-center items-center px-4 mb-12"
        >
          <motion.button
            className="group btn-min-primary text-white px-6 sm:px-10 py-3 sm:py-4 rounded-full font-semibold text-sm sm:text-lg flex items-center justify-center space-x-2 w-full sm:w-auto shining-effect"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            data-hover="true"
            ref={useShiningEffect<HTMLButtonElement>()}
            onClick={() => {
              const storyElement = document.getElementById("story")
              if (storyElement) {
                storyElement.scrollIntoView({ behavior: "smooth", block: "start" })
              }
            }}
          >
            <span>Discover Our Story</span>
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
          </motion.button>

          <motion.button
            className="group glass text-white px-6 sm:px-10 py-3 sm:py-4 rounded-full font-semibold text-sm sm:text-lg hover:glass-hover transition-all duration-300 flex items-center justify-center space-x-2 w-full sm:w-auto shining-effect"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            data-hover="true"
            ref={useShiningEffect<HTMLButtonElement>()}
            onClick={() => window.open("https://youtu.be/bUS8rBI9opk?si=lDzsZhziI9R8_NCM", "_blank")}
          >
            <Play className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Watch Our Journey</span>
          </motion.button>
        </motion.div>


      </motion.div>


    </section>
  )
}
