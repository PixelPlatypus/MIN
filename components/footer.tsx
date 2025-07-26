"use client"

import { motion } from "framer-motion"
import Image from "next/image"

export const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="py-12 sm:py-16 relative overflow-hidden border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
          <motion.div
            className="flex items-center space-x-3 sm:space-x-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: true }}
          >
            <div className="relative">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center">
                <Image src="/images/min-logo.png" alt="MIN" width={32} height={32} className="rounded-lg" />
              </div>
            </div>
            <div>
              <div className="font-bold text-lg sm:text-xl text-white min-gradient-accent">MIN</div>
              <div className="text-white/60 text-xs sm:text-sm">Mathematics Initiatives Nepal</div>
            </div>
          </motion.div>

          <motion.div
            className="text-white/60 text-xs sm:text-sm text-center md:text-right"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            viewport={{ once: true }}
          >
            © {currentYear} Mathematics Initiatives in Nepal. All rights reserved.
          </motion.div>
        </div>
      </div>
    </footer>
  )
}
