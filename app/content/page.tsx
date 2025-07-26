"use client"

"use client";

import React from "react"

import { motion } from "framer-motion"
import { BookOpen, FileText, Lightbulb, Calculator, Search, Filter, Plus, User, Calendar } from "lucide-react"

import { MinFloatingElements } from "@/components/ui/min-floating-elements"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { useRouter } from "next/navigation";


import contentData from "@/data/content.json"

interface ContentDataItem {
  id: number;
  title: string;
  description: string;
  category: string;
  author: string;
  date: string;
  tags: string[];
  slug: string;
  filePath: string;
  downloadLink: string;
}

export default function ContentPage() {

  const typedContentData: ContentDataItem[] = contentData as ContentDataItem[];
  const categories = ["All", ...new Set(typedContentData.map((item: ContentDataItem) => item.category))];

  const [selectedCategory, setSelectedCategory] = React.useState("All")
  const [searchTerm, setSearchTerm] = React.useState("")
  const router = useRouter();

  const filteredContent = typedContentData.slice(0, 2).filter((item) => {
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory
    const matchesSearch =
      searchTerm === "" ||
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    return matchesCategory && matchesSearch
  })

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Blog":
        return BookOpen
      case "Research Paper":
        return FileText
      case "Article":
        return Lightbulb
      case "Problem":
        return Calculator
      default:
        return BookOpen
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Blog":
        return "from-blue-500 to-blue-600"
      case "Research Paper":
        return "from-purple-500 to-purple-600"
      case "Article":
        return "from-green-500 to-green-600"
      case "Problem":
        return "from-orange-500 to-orange-600"
      default:
        return "from-min-primary to-min-secondary"
    }
  }

  const getRoutePrefix = (category: string) => {
    switch (category) {
      case "Blog":
        return "blog"
      case "Research Paper":
        return "research"
      case "Article":
        return "article"
      case "Problem":
        return "problem"
      default:
        return "content"
    }
  }

  const handleContentClick = (item: (typeof contentData)[0]) => {
    const routePrefix = getRoutePrefix(item.category)
    window.location.href = `/${routePrefix}/${item.slug}`
  }

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
              <span className="text-white/90 text-xs sm:text-sm font-medium">Knowledge Hub</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 sm:mb-8">
              Mathematical <span className="min-gradient-accent">Content</span> Library
            </h1>
            <p className="text-white/70 text-base sm:text-lg lg:text-xl font-light max-w-4xl mx-auto leading-relaxed mb-8">
              Discover a treasure trove of mathematical knowledge. From cutting-edge research papers to insightful
              articles, challenging problems to engaging blog posts - explore content created by our vibrant
              mathematical community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <motion.button
                onClick={() => router.push("/submit-content")}
                className="btn-min-accent text-min-primary px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold text-sm sm:text-base flex items-center space-x-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                data-hover="true"
              >
                <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Submit Your Content</span>
              </motion.button>
              <p className="text-white/60 text-sm font-light">Share your mathematical insights with the community</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Community Message */}
      <section className="py-12 sm:py-16 relative z-10">
        <div className="max-w-4xl mx-auto container-padding text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: true }}
            className="glass-card rounded-2xl sm:rounded-3xl p-6 sm:p-8"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Building Nepal's <span className="min-gradient-accent">Mathematical Community</span>
            </h2>
            <p className="text-white/80 leading-relaxed mb-6">
              We believe that knowledge grows when shared. This platform is designed to foster collaboration,
              innovation, and excellence in mathematical thinking across Nepal. Every piece of content here represents a
              contribution to our collective mathematical journey.
            </p>
            <p className="text-white/70 text-sm">
              <strong>Want to contribute?</strong> Submit your mathematical insights, research findings, problem
              solutions, or educational articles. Our team reviews all submissions and publishes quality content with
              full attribution to the authors.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="py-8 sm:py-12 sticky top-20 sm:top-24 z-30">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="flex flex-col gap-4 mb-8">
            {/* Search Input */}
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-white/60" />
              <input
                type="text"
                placeholder="Search content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 glass rounded-full text-white placeholder-white/60 focus:border-min-accent focus:outline-none font-light text-sm sm:text-base"
              />
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
              {categories.map((category) => (
                <motion.button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3 sm:px-4 py-2 rounded-full font-medium text-xs sm:text-sm transition-all duration-300 ${
                    selectedCategory === category
                      ? "btn-min-accent text-min-primary"
                      : "glass text-white hover:glass-hover"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  data-hover="true"
                >
                  <Filter className="inline-block mr-1 h-3 w-3" />
                  {category}
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Content Grid */}
      <section className="section-padding relative z-10">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredContent.map((item, index) => {
              const IconComponent = getCategoryIcon(item.category)
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: index * 0.1 }}
                  className="glass-card rounded-2xl sm:rounded-3xl overflow-hidden group cursor-pointer"
                  whileHover={{ y: -5 }}
                  data-hover="true"
                  onClick={() => handleContentClick(item)}
                >
                  <div className="p-4 sm:p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div
                        className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r ${getCategoryColor(item.category)} rounded-xl flex items-center justify-center`}
                      >
                        <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                      </div>
                      <div className="text-min-accent text-xs sm:text-sm font-medium">{item.category}</div>
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold text-white mb-3 group-hover:min-gradient-accent transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-white/80 text-sm leading-relaxed mb-4 line-clamp-3">{item.description}</p>
                    <div className="flex items-center justify-between text-xs text-white/60">
                      <div className="flex items-center space-x-2">
                        <User className="w-3 h-3" />
                        <span>{item.author}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(item.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>

          {filteredContent.length === 0 && (
            <div className="text-center py-12">
              <div className="text-white/60 text-lg mb-4">No content found matching your criteria</div>
              <p className="text-white/40 text-sm">Try adjusting your search or filter settings</p>
            </div>
          )}
        </div>
      </section>


      {/* Footer */}
      <div className="mt-20">
        <Footer />
      </div>
    </div>
  )
}
