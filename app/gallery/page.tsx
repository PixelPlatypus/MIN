"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import { Camera, X } from 'lucide-react'

import { MinFloatingElements } from "@/components/ui/min-floating-elements"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"

import galleryData from "@/data/gallery.json"

const categories = ["All", ...new Set(galleryData.map(item => item.category))];

export default function GalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedImage, setSelectedImage] = useState<(typeof galleryData)[0] | null>(null)

  const filteredImages = galleryData.filter((item) => {
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory
    return matchesCategory
  })

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
              <Camera className="w-3 h-3 sm:w-4 sm:h-4 text-min-accent" />
              <span className="text-white/90 text-xs sm:text-sm font-medium">Moments That Matter</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 sm:mb-8">
              Our <span className="min-gradient-accent">Journey</span> in Pictures
            </h1>
            <p className="text-white/70 text-base sm:text-lg lg:text-xl font-light max-w-3xl mx-auto">
              Every photograph tells a story. Every moment captures a dream being realized. Witness the transformation
              of mathematical education in Nepal through our lens.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-6 sm:py-8 sticky top-20 sm:top-24 z-30">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
            {categories.map((category) => (
              <motion.button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 sm:px-6 py-2 sm:py-3 rounded-full font-medium text-xs sm:text-sm transition-all duration-300 ${
                  selectedCategory === category
                    ? "btn-min-accent text-min-primary"
                    : "glass text-white hover:glass-hover"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                data-hover="true"
              >
                {category}
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="section-padding relative z-10">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredImages.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: index * 0.1 }}
                className="group cursor-pointer"
                data-hover="true"
                onClick={() => setSelectedImage(item)}
              >
                <div className="glass-card rounded-2xl sm:rounded-3xl overflow-hidden relative">
                  <div className="relative">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.title}
                      className="w-full h-48 sm:h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-500" />
                    <div className="absolute top-3 sm:top-4 right-3 sm:right-4 glass rounded-full px-2 sm:px-3 py-1 text-white text-xs sm:text-sm font-medium">
                      {item.category}
                    </div>
                  </div>
                  <div className="p-4 sm:p-6">
                    <h3 className="text-lg sm:text-xl font-semibold text-white mb-3 group-hover:min-gradient-accent transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-white/80 font-light leading-relaxed text-sm line-clamp-2">{item.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Space before footer */}
      <div className="py-20"></div>

      {/* Image Modal */}
      {selectedImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-min-dark-blue/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass-dark rounded-2xl sm:rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <img
                src={selectedImage.image || "/placeholder.svg"}
                alt={selectedImage.title}
                className="w-full h-64 sm:h-96 object-cover"
              />
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-3 sm:top-4 right-3 sm:right-4 w-8 h-8 sm:w-10 sm:h-10 glass rounded-full flex items-center justify-center text-white hover:glass-hover transition-colors"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 glass rounded-full px-3 sm:px-4 py-1 sm:py-2 text-white text-xs sm:text-sm font-medium">
                {selectedImage.category}
              </div>
            </div>
            <div className="p-6 sm:p-8">
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4 min-gradient-accent">
                {selectedImage.title}
              </h3>
              <p className="text-white/80 font-light leading-relaxed text-base sm:text-lg">{selectedImage.description}</p>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Footer */}
      <Footer />
    </div>
  )
}
