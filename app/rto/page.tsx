"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useShiningEffect } from '@/hooks/use-shining-effect';
import { Suspense } from 'react';
import { motion, easeInOut } from 'framer-motion';
import { ArrowRight, Sparkles } from "lucide-react";
import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';

import { MinFloatingElements } from '@/components/ui/min-floating-elements';
import { PopupNotice } from '@/components/ui/popup-notice';
import roadmapData from '@/data/rto-roadmap.json';
import { TopicCard } from '@/components/rto/topic-card';
import { ResourcePanel } from '@/components/rto/resource-panel';

export default function RTOPage() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
  };

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
  };

  return (
    <div className="relative min-h-screen text-white">
        <MinFloatingElements />
        <PopupNotice />
        <Navigation />

        <main className="relative z-10 flex flex-col items-center justify-center min-h-screen w-full">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Hero Section */}
            <section className="text-center flex flex-col items-center justify-center min-h-screen">
              <motion.div
                variants={itemVariants}
                className="flex items-center space-x-2 glass rounded-full px-4 sm:px-6 py-2 sm:py-3 mx-auto mb-6 sm:mb-8"
              >
                <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-min-accent" />
                <span className="text-white/90 text-xs sm:text-sm font-medium">he Challenge Awaits</span>
              </motion.div>
              <motion.h1
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white mb-4 sm:mb-6 leading-tight"
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: easeInOut }}
              >
                <span className="block min-gradient-accent">Road to Olympiad</span>
              </motion.h1>
              <motion.p
                className="text-white/80 text-base sm:text-lg md:text-xl lg:text-2xl font-light max-w-4xl mx-auto leading-relaxed mb-8 sm:mb-12 px-4"
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: easeInOut, delay: 0.2 }}
              >
                Your comprehensive guide to navigating the RTO process and accessing essential study materials.
              </motion.p>

              <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
                <Link href="#selection-process">
                  <motion.button
                    className="group btn-min-primary text-white px-6 sm:px-10 py-3 sm:py-4 rounded-full font-semibold text-sm sm:text-lg flex items-center justify-center space-x-2 w-full sm:w-auto shining-effect"
                    data-hover="true"
                    ref={useShiningEffect<HTMLButtonElement>()}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: easeInOut, delay: 0.6 }}
                  >
                    <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>Selection Process</span>
                  </motion.button>
                </Link>
                <Link href="#roadmap">
                  <motion.button
                    className="group glass text-white px-6 sm:px-10 py-3 sm:py-4 rounded-full font-semibold text-sm sm:text-lg hover:glass-hover transition-all duration-300 flex items-center justify-center space-x-2 w-full sm:w-auto shining-effect"
                    data-hover="true"
                    ref={useShiningEffect<HTMLButtonElement>()}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: easeInOut, delay: 0.8 }}
                  >
                    <span>Roadmap</span>
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                </Link>
              </div>
            </section>

            {/* Olympiad Selection Process Section */}
            <section id="selection-process" className="mb-32">
              <h2 className="text-4xl font-bold text-center mb-12 min-gradient-accent">Olympiad Selection Process in Nepal</h2>
              <div className="overflow-x-auto glassmorphic-card p-6">
                <table className="min-w-full bg-transparent min-gradient-border">
                  <thead>
                    <tr className="bg-gray-700 bg-opacity-50">
                      <th className="px-4 py-2 border-b border-gray-600 text-left">Stage</th>
                      <th className="px-4 py-2 border-b border-gray-600 text-left">Description</th>
                      <th className="px-4 py-2 border-b border-gray-600 text-left">Focus Areas</th>
                      <th className="px-4 py-2 border-b border-gray-600 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-700">
                      <td className="px-4 py-2">1. School/Local Level Awareness</td>
                      <td className="px-4 py-2">Students learn about Olympiads through schools, clubs, or MIN outreach.</td>
                      <td className="px-4 py-2">General math interest, curiosity</td>
                      <td className="px-4 py-2">Attend math clubs, explore MIN resources, start basic problem solving.</td>
                    </tr>
                    <tr className="border-b border-gray-700">
                      <td className="px-4 py-2">2. District Mathematics Olympiad (DMO)</td>
                      <td className="px-4 py-2">First formal selection stage; open to school students.</td>
                      <td className="px-4 py-2">School-level math, basic problem-solving</td>
                      <td className="px-4 py-2">Study prealgebra, algebra, number theory basics, geometry, combinatorics; practice past DMO papers.</td>
                    </tr>
                    <tr className="border-b border-gray-700">
                      <td className="px-4 py-2">3. Provincial Mathematics Olympiad (PMO)</td>
                      <td className="px-4 py-2">Higher difficulty; selects for national level.</td>
                      <td className="px-4 py-2">Intermediate problem-solving</td>
                      <td className="px-4 py-2">Deepen knowledge in algebra, number theory, geometry, combinatorics; timed practice papers.</td>
                    </tr>
                    <tr className="border-b border-gray-700">
                      <td className="px-4 py-2">4. Nepal Mathematical Olympiad (NMO)</td>
                      <td className="px-4 py-2">National competition; top scorers shortlisted for training.</td>
                      <td className="px-4 py-2">Proof-writing, advanced problem-solving</td>
                      <td className="px-4 py-2">Learn rigorous proofs; solve harder problems; attempt past Top 100 problems.</td>
                    </tr>
                    <tr className="border-b border-gray-700">
                      <td className="px-4 py-2">5. National Camp & Selection Test</td>
                      <td className="px-4 py-2">Intensive training by MIN; final team chosen.</td>
                      <td className="px-4 py-2">All four major areas at IMO level</td>
                      <td className="px-4 py-2">Full mock Olympiads, advanced theory, weak area improvement.</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2">6. International Mathematical Olympiad (IMO)</td>
                      <td className="px-4 py-2">Nepal’s team represents the country internationally.</td>
                      <td className="px-4 py-2">Global-level competition</td>
                      <td className="px-4 py-2">Solve IMO past papers, strategize problem selection, manage time effectively.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>



            {/* Roadmap - From Beginner to IMO Section */}
            <section id="roadmap" className="mb-20">
              <h2 className="text-4xl font-bold text-center mb-12 min-gradient-accent">Roadmap – From Beginner to IMO</h2>


              <div className="space-y-12">
                {/* Phase 1 */}
                <div className="glassmorphic-card p-6">
                  <h3 className="text-2xl font-semibold mb-4 min-gradient-accent">Phase 1 – Foundation (Before DMO)</h3>
                  <p className="mb-4">Goal: Build strong school math fundamentals + start problem-solving mindset.</p>
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-transparent text-white min-gradient-border">
                      <thead>
                        <tr className="bg-gray-700 bg-opacity-50">
                          <th className="px-4 py-2 border-b border-gray-600 text-left">Focus Areas</th>
                          <th className="px-4 py-2 border-b border-gray-600 text-left">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-gray-700">
                          <td className="px-4 py-2">Arithmetic, Algebra basics</td>
                          <td className="px-4 py-2">Use AoPS Prealgebra; revise school math concepts.</td>
                        </tr>
                        <tr className="border-b border-gray-700">
                          <td className="px-4 py-2">Number theory basics</td>
                          <td className="px-4 py-2">Learn GCD, LCM, intro to modular arithmetic.</td>
                        </tr>
                        <tr className="border-b border-gray-700">
                          <td className="px-4 py-2">Geometry basics</td>
                          <td className="px-4 py-2">Study triangles, circles, coordinate geometry.</td>
                        </tr>
                        <tr className="border-b border-gray-700">
                          <td className="px-4 py-2">Combinatorics basics</td>
                          <td className="px-4 py-2">Counting, permutations, combinations.</td>
                        </tr>

                        <tr>
                          <td className="px-4 py-2">Exam skills</td>
                          <td className="px-4 py-2">Time management, elimination strategies.</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Phase 2 */}
                <div className="glassmorphic-card p-6">
                  <h3 className="text-2xl font-semibold mb-4 min-gradient-accent">Phase 2 – PMO Preparation</h3>
                  <p className="mb-4 text-white">Goal: Deepen concepts, transition to intermediate problem-solving.</p>
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-transparent text-white min-gradient-border">
                      <thead>
                        <tr className="bg-gray-700 bg-opacity-50">
                          <th className="px-4 py-2 border-b border-gray-600 text-left">Focus Areas</th>
                          <th className="px-4 py-2 border-b border-gray-600 text-left">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-gray-700">
                          <td className="px-4 py-2">Algebra deep dive</td>
                          <td className="px-4 py-2">Inequalities, quadratic equations.</td>
                        </tr>
                        <tr className="border-b border-gray-700">
                          <td className="px-4 py-2">Number theory</td>
                          <td className="px-4 py-2">Modular arithmetic, Diophantine equations.</td>
                        </tr>
                        <tr className="border-b border-gray-700">
                          <td className="px-4 py-2">Geometry intermediate</td>
                          <td className="px-4 py-2">Cyclic quadrilaterals, similarity.</td>
                        </tr>
                        <tr className="border-b border-gray-700">
                          <td className="px-4 py-2">Combinatorics advance</td>
                          <td className="px-4 py-2">Graph theory basics, pigeonhole principle.</td>
                        </tr>

                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Phase 3 */}
                <div className="glassmorphic-card p-6">
                  <h3 className="text-2xl font-semibold mb-4 min-gradient-accent">Phase 3 – NMO Progression</h3>
                  <p className="mb-4 text-white">Goal: Learn proof-writing and advanced problem-solving.</p>
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-transparent text-white min-gradient-border">
                      <thead>
                        <tr className="bg-gray-700 bg-opacity-50">
                          <th className="px-4 py-2 border-b border-gray-600 text-left">Focus Areas</th>
                          <th className="px-4 py-2 border-b border-gray-600 text-left">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-gray-700">
                          <td className="px-4 py-2">Proof-writing</td>
                          <td className="px-4 py-2">Practice clear, logical solutions.</td>
                        </tr>
                        <tr className="border-b border-gray-700">
                          <td className="px-4 py-2">Algebra</td>
                          <td className="px-4 py-2">Symmetric polynomials, AM-GM, Cauchy-Schwarz.</td>
                        </tr>
                        <tr className="border-b border-gray-700">
                          <td className="px-4 py-2">Number theory</td>
                          <td className="px-4 py-2">Euler’s theorem, Chinese Remainder Theorem.</td>
                        </tr>
                        <tr className="border-b border-gray-700">
                          <td className="px-4 py-2">Geometry</td>
                          <td className="px-4 py-2">Radical axis, transformations.</td>
                        </tr>
                        <tr className="border-b border-gray-700">
                          <td className="px-4 py-2">Combinatorics</td>
                          <td className="px-4 py-2">Inclusion–exclusion, generating functions.</td>
                        </tr>

                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Phase 4 */}
                <div className="glassmorphic-card p-6">
                  <h3 className="text-2xl font-semibold mb-4 min-gradient-accent">Phase 4 – IMO Training</h3>
                  <p className="mb-4 text-white">Goal: Reach international competition level.</p>
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-transparent text-white min-gradient-border">
                      <thead>
                        <tr className="bg-gray-700 bg-opacity-50">
                          <th className="px-4 py-2 border-b border-gray-600 text-left">Focus Areas</th>
                          <th className="px-4 py-2 border-b border-gray-600 text-left">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-gray-700">
                          <td className="px-4 py-2">Algebra</td>
                          <td className="px-4 py-2">Advanced inequalities, functional equations.</td>
                        </tr>
                        <tr className="border-b border-gray-700">
                          <td className="px-4 py-2">Number theory</td>
                          <td className="px-4 py-2">Quadratic residues, hard Diophantine problems.</td>
                        </tr>
                        <tr className="border-b border-gray-700">
                          <td className="px-4 py-2">Geometry</td>
                          <td className="px-4 py-2">Inversions, homothety, projective geometry.</td>
                        </tr>
                        <tr className="border-b border-gray-700">
                          <td className="px-4 py-2">Combinatorics</td>
                          <td className="px-4 py-2">Advanced graph theory, extremal problems.</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2">Full IMO simulation</td>
                          <td className="px-4 py-2">Timed 6-problem practice sets.</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2">Weak area fixing</td>
                          <td className="px-4 py-2">Focused training on problem areas.</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </section>

            {/* Resources Section (retained with updated props) */}
            <section className="mb-20">
              <h2 className="text-4xl font-bold text-center mb-12 min-gradient-accent">Essential Resources</h2>
              <p className="text-center mb-8 text-white">A curated list of essential resources for Math Olympiad preparation.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <ResourcePanel
                  title="Books & Study Guides"
                  resources={[
                    { name: 'The Art of Problem Solving, Vol. 1: The Basics', link: 'https://artofproblemsolving.com/store/item/aops-vol1' },
                    { name: 'The Art of Problem Solving, Vol. 2: And Beyond', link: 'https://artofproblemsolving.com/store/item/aops-vol2' },
                    { name: 'Problem-Solving Strategies', link: 'https://www.amazon.com/Problem-Solving-Strategies-Problem-Solvers-K-Engel/dp/0387982191' },
                    { name: 'Mathematical Olympiad Treasures', link: 'https://www.amazon.com/Mathematical-Olympiad-Treasures-Birkh%C3%A4user-Problem/dp/0817645821' },
                  ]}
                />
                <ResourcePanel
                  title="Online Platforms"
                  resources={[
                    { name: 'Art of Problem Solving (AoPS)', link: 'https://artofproblemsolving.com/' },
                    { name: 'Brilliant.org', link: 'https://brilliant.org/math/' },
                    { name: 'Khan Academy', link: 'https://www.khanacademy.org/math/algebra' },
                    { name: 'Geogebra', link: 'https://www.geogebra.org/' },
                  ]}
                />
                <ResourcePanel
                  title="Past Papers & Mocks"
                  resources={[
                    { name: 'IMO Official Website (Past Papers)', link: 'https://www.imo-official.org/problems.aspx' },
                    { name: 'AoPS Community Contests', link: 'https://artofproblemsolving.com/community/c_contests' },
                  ]}
                />
                <ResourcePanel
                  title="Community & Forums"
                  resources={[
                    { name: 'AoPS Community Forum', link: 'https://artofproblemsolving.com/community' },
                    { name: 'Math StackExchange', link: 'https://math.stackexchange.com/' },
                  ]}
                />
              </div>
            </section>


          </div>
        </main>

        <Footer />
      </div>
  );
}