"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Users, BookOpen, Award, Globe, Calendar } from "lucide-react"
import { FloatingSymbols } from "@/components/ui/floating-symbols"

const programs = [
  {
    title: "ETA Campaigns",
    description:
      "Free resources, workshops, and tutoring for underprivileged students, promoting interactive math learning beyond curriculum limits.",
    features: ["Free Resources", "Interactive Workshops", "Peer Tutoring", "Beyond Curriculum"],
    icon: BookOpen,
    color: "from-[#16556d] to-[#356a72]",
    duration: "Year-round",
    participants: "500+ students",
  },
  {
    title: "Olympiad Training",
    description:
      "Junior Mathematics Olympiad Camp (JMOC) and Olymprep programs designed for skill development and international competition preparation.",
    features: ["JMOC Training", "Olymprep Program", "International Prep", "Skill Development"],
    icon: Award,
    color: "from-[#356a72] to-[#cdaa72]",
    duration: "6 months",
    participants: "200+ students",
  },
  {
    title: "Mathematical Modelling",
    description: "M³ Bootcamp focusing on real-world applications of mathematics and problem-solving techniques.",
    features: ["Real-world Applications", "Problem Solving", "Practical Skills", "Industry Connections"],
    icon: Globe,
    color: "from-[#cdaa72] to-[#f6f094]",
    duration: "3 months",
    participants: "100+ students",
  },
  {
    title: "Women in Mathematics",
    description:
      "Girls Mathematics Olympiad Camp and empowerment initiatives aimed at encouraging female participation in mathematics.",
    features: ["Girls Olympiad Camp", "Mentorship", "Role Models", "Community Support"],
    icon: Users,
    color: "from-[#f6f094] to-[#cdaa72]",
    duration: "4 months",
    participants: "150+ students",
  },
  {
    title: "Digital Content",
    description:
      "YouTube series including 'eli5' for simplifying complex concepts and 'Road to Olympiad' training series.",
    features: ["ELI5 Series", "Road to Olympiad", "Concept Videos", "Online Learning"],
    icon: BookOpen,
    color: "from-[#16556d] to-[#cdaa72]",
    duration: "Ongoing",
    participants: "10,000+ views",
  },
  {
    title: "Community Engagement",
    description:
      "Online communities on Discord and social media for collaboration, continuous learning, and peer support.",
    features: ["Discord Community", "Social Media", "Peer Support", "Collaboration"],
    icon: Users,
    color: "from-[#356a72] to-[#16556d]",
    duration: "24/7",
    participants: "1,000+ members",
  },
]

export default function ProgramsPage() {
  return (
    <div className="min-h-screen bg-white relative">
      <FloatingSymbols />

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-40 bg-[#16556d]/95 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center space-x-3 group" data-hover="true">
              <div className="relative">
                <Image src="/images/min-logo.png" alt="MIN" width={45} height={45} className="rounded-xl" />
              </div>
              <div>
                <span className="text-white font-light text-xl tracking-wide">MIN</span>
                <div className="text-[#cdaa72] text-xs font-light">Math Initiatives</div>
              </div>
            </Link>

            <div className="flex items-center space-x-8">
              <Link
                href="/"
                className="flex items-center space-x-2 text-white/70 hover:text-white transition-colors text-sm tracking-wider uppercase font-light group"
                data-hover="true"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Home</span>
              </Link>
              <Link
                href="/about"
                className="text-white/70 hover:text-white transition-colors text-sm tracking-wider uppercase font-light"
                data-hover="true"
              >
                About
              </Link>
              <Link
                href="/team"
                className="text-white/70 hover:text-white transition-colors text-sm tracking-wider uppercase font-light"
                data-hover="true"
              >
                Team
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-[#16556d] to-[#356a72] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-8 text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
            <h1 className="text-6xl md:text-7xl font-light text-white mb-8">Our Programs</h1>
            <p className="text-white/70 text-xl font-light max-w-3xl mx-auto">
              Comprehensive programs designed to make mathematics accessible, engaging, and inspiring for all
            </p>
          </motion.div>
        </div>
      </section>

      {/* Programs Grid */}
      <section className="py-20 bg-white relative z-10">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {programs.map((program, index) => (
              <motion.div
                key={program.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group cursor-pointer"
                data-hover="true"
              >
                <div className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 h-full relative overflow-hidden">
                  <div
                    className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${program.color} rounded-bl-3xl flex items-center justify-center`}
                  >
                    <program.icon className="h-8 w-8 text-white" />
                  </div>

                  <h3 className="text-2xl font-light text-[#16556d] mb-4 group-hover:text-[#cdaa72] transition-colors pr-16">
                    {program.title}
                  </h3>

                  <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{program.duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{program.participants}</span>
                    </div>
                  </div>

                  <p className="text-gray-600 font-light leading-relaxed mb-6">{program.description}</p>

                  <div className="space-y-3">
                    {program.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-[#cdaa72] rounded-full" />
                        <span className="text-sm text-gray-500 font-light">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-br from-[#16556d] to-[#356a72] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl font-light text-white mb-8">Join Our Programs</h2>
            <p className="text-white/70 text-xl font-light max-w-3xl mx-auto mb-12">
              Ready to embark on your mathematical journey? Get in touch to learn more about our programs.
            </p>
            <Link
              href="/contact"
              className="inline-block bg-[#cdaa72] text-[#16556d] px-10 py-5 rounded-full hover:bg-[#f6f094] transition-all duration-500 font-light tracking-wide text-lg"
            >
              Get Started Today
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 bg-[#16556d] text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-8 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-4 mb-8 md:mb-0">
              <Image src="/images/min-logo.png" alt="MIN" width={50} height={50} className="rounded-xl" />
              <div>
                <div className="font-light text-xl">MIN</div>
                <div className="text-white/60 text-sm font-light">Mathematics Initiatives Nepal</div>
              </div>
            </div>
            <div className="text-white/60 text-sm font-light">
              © 2024 Mathematics Initiatives in Nepal. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
