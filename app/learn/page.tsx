'use client';

import learnData from '../../data/learn.json';
import { useState } from 'react';
import { motion } from "framer-motion";
import { Play, BookOpen, Youtube, Filter, ExternalLink, FileText, X, Search } from "lucide-react";
import { MinFloatingElements } from "@/components/ui/min-floating-elements";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';

interface VideoCourse {
  id: string;
  title: string;
  description: string;
  url: string;
  category: string;
  thumbnail?: string;
  videoCount: number;
}

interface FunSeries {
  id: string;
  title: string;
  description: string;
  url: string;
  videoCount: number;
}

interface ResourceItem {
  name: string;
  url: string;
  description?: string;
}

interface ResourceCategory {
  category: string;
  resources: ResourceItem[];
}

export default function LearnPage() {
  const { videoCourses, funSeries, resourcesData } = learnData;

  const videoCategories = ["All", ...new Set<string>(videoCourses.map((course: any) => String(course.category)))];
  const resourceCategories = ["All", ...new Set<string>(resourcesData.map((resource: any) => String(resource.category)))];

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const [activeTab, setActiveTab] = useState('courses');

  const filteredPlaylists = videoCourses.filter(
    (playlist) =>
      (selectedCategory === 'All' || playlist.category === selectedCategory) &&
      (playlist.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
       (playlist.description && playlist.description.toLowerCase().includes(searchTerm.toLowerCase())))
  );

  const filteredResources = resourcesData.map(resourceCat => ({
    ...resourceCat,
    resources: resourceCat.resources.filter((resource: ResourceItem) =>
      resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (resource.description && resource.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      resource.url.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(resourceCat =>
    (selectedCategory === 'All' || resourceCat.category === selectedCategory) &&
    resourceCat.resources.length > 0
  );

  return (
    <div className="min-h-screen overflow-x-hidden">
      <MinFloatingElements />
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
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
              {[...new Set([...videoCategories, ...resourceCategories])].map((category) => (
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
                >
                  {category}
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Video Courses Tab */}
      {activeTab === "courses" && (
        <section className="section-padding relative z-10">
          <div className="max-w-7xl mx-auto container-padding">
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
            {/* Resources Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredResources.map((resourceCat) => (
                resourceCat.resources.map((resource: ResourceItem, index: number) => (
                  <motion.div
                    key={resource.url} // Using URL as key, assuming it's unique
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: index * 0.1 }}
                    className="group cursor-pointer"
                    data-hover="true"
                  >
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="glass-card rounded-2xl sm:rounded-3xl overflow-hidden relative h-full block"
                    >
                      <div className="p-4 sm:p-6">
                        <h3 className="text-lg sm:text-xl font-semibold text-white mb-3 group-hover:min-gradient-accent transition-colors">
                          {resource.name}
                        </h3>
                        {resource.description && (
                          <p className="text-white/80 font-light leading-relaxed text-sm sm:text-base mb-4">
                            {resource.description}
                          </p>
                        )}
                        <div className="inline-flex items-center space-x-2 text-white/80 hover:text-white transition-colors font-medium text-sm">
                          <FileText className="h-3 w-3 sm:h-4 sm:w-4" />
                          <span>View Resource</span>
                          <ExternalLink className="h-3 w-3" />
                        </div>
                      </div>
                    </a>
                  </motion.div>
                ))
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Fun Series Tab */}
      {activeTab === "fun" && (
        <section className="section-padding relative z-10">
          <div className="max-w-7xl mx-auto container-padding">
            {/* Fun Series Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {funSeries.map((series: FunSeries, index: number) => (
                <motion.div
                  key={series.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: index * 0.1 }}
                  className="group cursor-pointer"
                  data-hover="true"
                >
                  <a
                    href={series.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="glass-card rounded-2xl sm:rounded-3xl overflow-hidden relative h-full block"
                  >
                    <div className="relative p-4 sm:p-6">
                      <div className="absolute top-3 sm:top-4 right-3 sm:right-4 glass rounded-full px-2 sm:px-3 py-1 text-white text-xs sm:text-sm font-medium">
                        {series.videoCount} videos
                      </div>
                    </div>
                    <div className="p-4 sm:p-6">
                      <h3 className="text-lg sm:text-xl font-semibold text-white mb-3 group-hover:min-gradient-accent transition-colors">
                        {series.title}
                      </h3>
                      <p className="text-white/80 font-light leading-relaxed text-sm sm:text-base mb-4">
                        {series.description}
                      </p>
                      <div className="inline-flex items-center space-x-2 text-white/80 hover:text-white transition-colors font-medium text-sm">
                        <Youtube className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span>Watch Series</span>
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

      {/* Footer */}
      <div className="py-20"></div>
      <Footer />
    </div>
  );
}