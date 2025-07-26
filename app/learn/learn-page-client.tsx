"use client"

import { motion } from "framer-motion"
import { useState } from "react"

interface VideoCourse {
  id: string;
  title: string;
  description: string;
  videoCount: number;
  thumbnail: string;
  url: string;
  category: string;
}

interface FunSeries {
  id: string;
  title: string;
  description: string;
  videoCount: number;
  thumbnail: string;
  url: string;
  category: string;
}

interface ResourceItem {
  name: string;
  url: string;
  description: string;
}

interface ResourceCategory {
  category: string;
  title: string;
  resources: ResourceItem[];
}

import { Play, BookOpen, ExternalLink, Filter, Youtube } from "lucide-react"

import { MinFloatingElements } from "@/components/ui/min-floating-elements"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"

export default function LearnPage({ videoCourses, funSeries, resourcesData, videoCategories, resourceCategories }: { videoCourses: VideoCourse[], funSeries: FunSeries[], resourcesData: ResourceCategory[], videoCategories: string[], resourceCategories: string[] }) {




  const [selectedCategory, setSelectedCategory] = useState("All")
  const [activeTab, setActiveTab] = useState("courses")
  const [resourceCategory, setResourceCategory] = useState("All")

  const videoCategoriesState = videoCategories;
  const resourceCategoriesState = resourceCategories;

  const filteredPlaylists = videoCourses.filter((playlist: VideoCourse) => {
    const matchesCategory = selectedCategory === "All" || playlist.category === selectedCategory
    return matchesCategory
  })

  const filteredResources = resourcesData.filter((section: ResourceCategory) => {
    const matchesCategory = resourceCategory === "All" || section.category === resourceCategory
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
              <BookOpen className="w-3 h-3 sm:w-4 sm:h-4 text-min-accent" />
              <span className="text-white/90 text-xs sm:text-sm font-medium">Learning Reimagined</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 sm:mb-8">
              Think Different. <span className="min-gradient-accent">Learn Different.</span>
            </h1>
            <p className="text-white/70 text-base sm:text-lg lg:text-xl font-light max-w-3xl mx-auto">
              We believe learning should be extraordinary. That's why we've crafted resources that don't just teach
              mathematics — they inspire mathematical thinking.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Tab Navigation */}
      <section className="py-6 sm:py-8 sticky top-20 sm:top-24 z-30">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="flex justify-center space-x-3 sm:space-x-6">
            {[
              { id: "courses", label: "Video Courses", icon: Play },
              { id: "resources", label: "Resources", icon: BookOpen },
              { id: "fun", label: "Fun Series", icon: Youtube },
            ].map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 sm:px-6 py-2 sm:py-3 rounded-full font-medium tracking-wide transition-all duration-300 relative text-sm sm:text-base ${
                  activeTab === tab.id ? "btn-min-accent text-min-primary" : "glass text-white hover:glass-hover"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                data-hover="true"
              >
                <tab.icon className="h-3 w-3 sm:h-4 sm:w-4" />
                <span>{tab.label}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Video Courses Tab */}
      {activeTab === "courses" && (
        <section className="section-padding relative z-10">
          <div className="max-w-7xl mx-auto container-padding">
            {/* Category Filter */}
            <div className="flex justify-center mb-8 sm:mb-12">
              <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
                {videoCategoriesState.map((category) => (
                  <motion.button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-3 sm:px-4 py-2 rounded-full font-medium text-xs sm:text-sm transition-all duration-300 ${
                      selectedCategory === category
                        ? "btn-min-accent text-min-primary"
                        : "glass text-white hover:glass-hover"
                    }`}
                    whileHover={{ scale: 1.05 }}
                    data-hover="true"
                  >
                    <Filter className="inline-block mr-1 h-3 w-3" />
                    {category}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Playlists Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredPlaylists.map((playlist: VideoCourse, index: number) => (
                <motion.div
                  key={playlist.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: index * 0.1 }}
                  className="group cursor-pointer"
                  data-hover="true"
                >
                  <a
                    href={playlist.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="glass-card rounded-2xl sm:rounded-3xl overflow-hidden relative h-full block"
                  >
                    <div className="relative">
                      <img
                        src={playlist.thumbnail || "/placeholder.svg"}
                        alt={playlist.title}
                        className="w-full h-40 sm:h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-500" />
                      <div className="absolute top-3 sm:top-4 right-3 sm:right-4 glass rounded-full px-2 sm:px-3 py-1 text-white text-xs sm:text-sm font-medium">
                        {playlist.videoCount} videos
                      </div>
                      <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 btn-min-accent text-min-primary px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
                        {playlist.category}
                      </div>
                    </div>
                    <div className="p-4 sm:p-6">
                      <h3 className="text-lg sm:text-xl font-semibold text-white mb-3 group-hover:min-gradient-accent transition-colors">
                        {playlist.title}
                      </h3>
                      <p className="text-white/80 font-light leading-relaxed text-sm sm:text-base mb-4">
                        {playlist.description}
                      </p>
                      <div className="inline-flex items-center space-x-2 text-white/80 hover:text-white transition-colors font-medium text-sm">
                        <Play className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span>Start Learning</span>
                        <ExternalLink className="h-3 w-3" />
                      </div>
                    </div>
                  </a>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Resources Tab */}
      {activeTab === "resources" && (
        <section className="section-padding relative z-10">
          <div className="max-w-7xl mx-auto container-padding">
            {/* Category Filter for Resources */}
            <div className="flex justify-center mb-8 sm:mb-12">
              <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
                {resourceCategoriesState.map((category) => (
                  <motion.button
                    key={category}
                    onClick={() => setResourceCategory(category)}
                    className={`px-3 sm:px-4 py-2 rounded-full font-medium text-xs sm:text-sm transition-all duration-300 ${
                      resourceCategory === category
                        ? "btn-min-accent text-min-primary"
                        : "glass text-white hover:glass-hover"
                    }`}
                    whileHover={{ scale: 1.05 }}
                    data-hover="true"
                  >
                    <Filter className="inline-block mr-1 h-3 w-3" />
                    {category}
                  </motion.button>
                ))}
              </div>
            </div>

            <div className="space-y-12 sm:space-y-16">
              {filteredResources.map((section: ResourceCategory, index: number) => (
                <motion.div
                  key={section.category}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: index * 0.2 }}
                >
                  <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6 sm:mb-8 flex items-center">
                    <span className="min-gradient-accent">{section.title}</span>
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    {section.resources.map((resource: ResourceItem, idx: number) => (
                      <motion.a
                        key={idx}
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="glass-card rounded-xl p-4 sm:p-6 group relative block"
                        whileHover={{ y: -2 }}
                        data-hover="true"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="text-base sm:text-lg font-semibold text-white mb-2 group-hover:min-gradient-accent transition-colors">
                              {resource.name}
                            </h3>
                            <p className="text-white/80 font-light text-xs sm:text-sm mb-4">{resource.description}</p>
                            <div
                              className="inline-flex items-center space-x-2 text-white/70 hover:text-white transition-colors font-medium text-xs sm:text-sm"
                            >
                              <span>Explore Resource</span>
                              <ExternalLink className="h-3 w-3" />
                            </div>
                          </div>
                          <BookOpen className="h-5 w-5 sm:h-6 sm:w-6 text-min-accent ml-4" />
                        </div>
                      </motion.a>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Fun Series Tab */}
      {activeTab === "fun" && (
        <section className="section-padding relative z-10">
          <div className="max-w-7xl mx-auto container-padding">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 flex flex-col sm:flex-row items-center justify-center gap-2">
                Learning Should Be <span className="min-gradient-accent">Magical</span>
              </h2>
              <p className="text-white/70 text-base sm:text-lg font-light max-w-2xl mx-auto">
                Discover mathematics through wonder, curiosity, and joy. Because the best learning happens when you're
                having fun.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {funSeries.map((series: FunSeries, index: number) => (
                <motion.a
                  key={series.id}
                  href={series.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: index * 0.2 }}
                  className="group cursor-pointer glass-card rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden block"
                  data-hover="true"
                >
                  <div className="w-12 h-12 sm:w-16 sm:h-16 glass-light rounded-full flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform">
                    <Youtube className="h-6 w-6 sm:h-8 sm:w-8 text-min-primary" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold mb-4 group-hover:min-gradient-accent transition-colors">
                    {series.title}
                  </h3>
                  <p className="text-white/80 font-light leading-relaxed mb-6 text-sm sm:text-base">
                    {series.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm font-medium text-white/70">{series.videoCount} episodes</span>
                    <div
                      className="inline-flex items-center space-x-2 glass px-3 sm:px-4 py-2 rounded-full hover:glass-hover transition-colors"
                    >
                      <Play className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="text-xs sm:text-sm font-medium">Watch Magic</span>
                    </div>
                  </div>
                </motion.a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <div className="py-20"></div>
      <Footer />
    </div>
  )
}
