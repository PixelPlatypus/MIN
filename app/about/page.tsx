"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Target, Users, Award, Globe } from "lucide-react"
import { FloatingSymbols } from "@/components/ui/floating-symbols"
async function fetchTeamData() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/team`);
  if (!res.ok) {
    throw new Error('Failed to fetch team data');
  }
  return res.json();
}

export default async function AboutPage() {
  const teamData = await fetchTeamData();
  const currentYear = new Date().getFullYear()

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
                <motion.div
                  className="absolute -top-1 -right-1 text-[#cdaa72] text-xs font-serif"
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                >
                  π
                </motion.div>
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
                href="/team"
                className="text-white/70 hover:text-white transition-colors text-sm tracking-wider uppercase font-light"
                data-hover="true"
              >
                Team
              </Link>
              <Link
                href="/learn"
                className="text-white/70 hover:text-white transition-colors text-sm tracking-wider uppercase font-light"
                data-hover="true"
              >
                Learn
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-[#16556d] to-[#356a72] relative overflow-hidden">
        <motion.div
          className="absolute top-20 left-20 text-[#cdaa72] text-8xl opacity-10 font-serif"
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        >
          ∑
        </motion.div>

        <div className="max-w-7xl mx-auto px-8 text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
            <h1 className="text-6xl md:text-7xl font-light text-white mb-8">About MIN</h1>
            <p className="text-white/70 text-xl font-light max-w-3xl mx-auto">
              Discover our mission to transform mathematics education in Nepal
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-white relative z-10">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid lg:grid-cols-2 gap-16">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center mb-8">
                <Target className="h-8 w-8 text-[#cdaa72] mr-4" />
                <h2 className="text-4xl font-light text-[#16556d]">Our Mission</h2>
              </div>
              <p className="text-gray-600 font-light leading-relaxed text-lg mb-6">
                To make quality mathematics education accessible to all students in Nepal, regardless of their economic
                background or geographical location.
              </p>
              <p className="text-gray-600 font-light leading-relaxed text-lg">
                We believe that every student deserves the opportunity to explore the beauty and power of mathematics
                through innovative teaching methods and comprehensive support systems.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center mb-8">
                <Globe className="h-8 w-8 text-[#cdaa72] mr-4" />
                <h2 className="text-4xl font-light text-[#16556d]">Our Vision</h2>
              </div>
              <p className="text-gray-600 font-light leading-relaxed text-lg mb-6">
                To establish Nepal as a hub of mathematical excellence in South Asia, producing world-class
                mathematicians and problem solvers.
              </p>
              <p className="text-gray-600 font-light leading-relaxed text-lg">
                We envision a future where Nepali students compete confidently on international platforms and contribute
                significantly to global mathematical research and innovation.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-gray-50 relative z-10">
        <div className="max-w-7xl mx-auto px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-light text-[#16556d] mb-8">Our Values</h2>
            <p className="text-[#356a72] text-xl font-light max-w-3xl mx-auto">
              The principles that guide everything we do
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Accessibility",
                description: "Making quality education available to everyone",
                icon: Users,
              },
              {
                title: "Excellence",
                description: "Striving for the highest standards in everything we do",
                icon: Award,
              },
              {
                title: "Innovation",
                description: "Embracing new methods and technologies",
                icon: Target,
              },
              {
                title: "Community",
                description: "Building strong networks of learners and educators",
                icon: Globe,
              },
            ].map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-500 text-center group"
                data-hover="true"
              >
                <div className="w-16 h-16 bg-[#cdaa72] rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-[#f6f094] transition-colors">
                  <value.icon className="h-8 w-8 text-[#16556d]" />
                </div>
                <h3 className="text-xl font-light text-[#16556d] mb-4">{value.title}</h3>
                <p className="text-gray-600 font-light leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
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
              © {currentYear} Mathematics Initiatives in Nepal. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
