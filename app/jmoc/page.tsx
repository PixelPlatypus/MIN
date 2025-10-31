"use client"

import Link from "next/link"
import { motion, easeInOut } from "framer-motion"
import { Sparkles, ArrowRight, Quote } from "lucide-react"

import { MinFloatingElements } from "@/components/ui/min-floating-elements"
import { PopupNotice } from "@/components/ui/popup-notice"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { useShiningEffect } from "@/hooks/use-shining-effect"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { usePathname } from "next/navigation";
import Autoplay from "embla-carousel-autoplay";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: easeInOut },
  },
}

export default function JMOCPage() {
  const pathname = usePathname();
  const showPopupNotice = pathname !== "/jmoc";

  useShiningEffect();

  return (
    <div className="relative min-h-screen text-white">
      <MinFloatingElements />
      {showPopupNotice && <PopupNotice />}
      <Navigation />

      {/* Hero */}
      <section className="pt-24 sm:pt-32 pb-12 sm:pb-20 text-center">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div variants={itemVariants} initial="hidden" animate="visible">
            <div className="flex items-center justify-center gap-2 glass rounded-full px-4 sm:px-6 py-2 sm:py-3 mx-auto mb-6 sm:mb-8 w-fit">
              <Sparkles className="w-4 h-4 text-min-accent" />
              <span className="text-white/90 text-xs sm:text-sm font-medium">What is JMOC?</span>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: -40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: easeInOut }}>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight">
              <span className="block min-gradient-accent">Junior Mathematical Olympiad Camp</span>
            </h1>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: easeInOut, delay: 0.15 }}>
            <p className="text-white/80 text-base sm:text-lg md:text-xl font-light max-w-4xl mx-auto leading-relaxed mb-8 sm:mb-12 px-4">
              JMOC is a 8 week program by Mathematics Initiative in Nepal (MIN) where we fuse the fun and the familiar with the interesting and challenging—reaching beyond textbooks to cultivate true mathematical thinking.
            </p>
          </motion.div>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a href="https://bit/ly/JMOC25" target="_blank" rel="noopener noreferrer" className="group btn-min-accent text-min-primary px-6 sm:px-10 py-3 sm:py-4 rounded-full font-semibold text-sm sm:text-lg flex items-center justify-center space-x-2 w-full sm:w-auto shining-effect">Join JMOC</a>
            <Link href="#about">
              <motion.button initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: easeInOut, delay: 0.4 }} ref={useShiningEffect<HTMLButtonElement>()} data-hover="true">
                <span className="group glass text-white px-6 sm:px-10 py-3 sm:py-4 rounded-full font-semibold text-sm sm:text-lg hover:glass-hover transition-all duration-300 flex items-center justify-center space-x-2 w-full sm:w-auto shining-effect">
                    <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>Learn More</span>
                  </span>
              </motion.button>
            </Link>
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-12 sm:py-20">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: easeInOut }}>
            <div className="glass rounded-2xl p-6 sm:p-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 min-gradient-accent">Overview</h2>
              <p className="text-white/80 font-light leading-relaxed mb-6">
                At JMOC, we try to fuse the fun and the familiar with the interesting and not easy. We teach our aspirants mathematics by reaching beyond theoretical knowledge and more.
              </p>
              <p className="text-white/80 font-light leading-relaxed mb-6">
                It is a 2–3 month program guided by outstanding mentors from backgrounds in higher studies and even past IMO participants with honorable mentions at the biggest stage of competitive mathematics.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div className="bg-gray-800/40 rounded-xl p-5">
                  <h3 className="text-xl font-semibold text-white mb-3">Who is it for?</h3>
                  <p className="text-white/70 leading-relaxed">Aspirants from Grade VIII (Eight) to Grade X (Ten) seeking to explore mathematics beyond the course book in a comfortable environment for learning.</p>
                </div>
                <div className="bg-gray-800/40 rounded-xl p-5">
                  <h3 className="text-xl font-semibold text-white mb-3">What you’ll experience</h3>
                  <ul className="space-y-2 text-white/70">
                    <li>Conceptual depth beyond textbooks</li>
                    <li>Engaging sessions and problem-solving</li>
                    <li>Mentorship from accomplished mathematicians</li>
                    <li>Community of like-minded peers</li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>



      {/* Testimonials */}
      <section className="py-12 sm:py-20">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: easeInOut }}>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-8 min-gradient-accent">Testimonial</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  quote:
                    "My JMOC journey was like a kick start for my future Olympiads. JMOC is a once in a lifetime type of experience because of so many things I learned here during the 82 days.",
                  author: "Eroj Nepal",
                  role: "JMOC Gold Honour student",
                },
                {
                  quote:
                    "My experience was honestly amazing. Got to learn a lot of new things and met a bunch of like-minded people. The mentors were also very cooperative and patient, loved every minute of it!",
                  author: "Ira KC",
                  role: "JMOC Gold Honour student",
                },
                {
                  quote:
                    "Since I handle some combinatorics, and give extra lectures in number theory, it went fine for me. I got the opportunity to teach what I have been wanting to teach in number theory.",
                  author: "Rojan Dangol",
                  role: "Mentor",
                },
                {
                  quote: "The experience was very nice. I was fortunate to meet a lot of talented students.",
                  author: "Sakul Khatri",
                  role: "Mentor",
                },
                {
                  quote:
                    "Mathematics Initiatives in Nepal is doing a great work by providing directions to the current aspirants who will play the role of future candidates for representing Nepal.",
                  author: "Mr. Chabbi Dhungana",
                  role: "General Secretary of MAN",
                },
              ].map((t, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: easeInOut, delay: i * 0.05 }}>
                  <div className="glass rounded-2xl p-6 h-full min-h-[220px] flex flex-col justify-between">
                    <div className="flex items-start gap-3 mb-3">
                      <p className="text-white/90 italic leading-relaxed">"{t.quote}"</p>
                    </div>
                    <div className="text-white/80 font-medium">— {t.author}</div>
                    <div className="text-white/60 text-sm">{t.role}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-12 sm:py-20">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: easeInOut }}>
            <div className="glass rounded-2xl p-6 sm:p-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 min-gradient-accent">
                Frequently Asked Questions
              </h2>
              <p className="text-white/80 font-light leading-relaxed mb-6">
                Find answers to common questions about JMOC.
              </p>
              <Accordion type="single" collapsible className="w-full">
                <FAQItem
                  question="What is the cost of the program?"
                  answer="The cost for the program is NRS 250. Though we also offer financial aid for deserving students."
                />
                <FAQItem
                  question="Is financial aid available?"
                  answer="Financial aid is available for deserving students. Which can be seen in the Google Form."
                />
                <FAQItem
                  question="Who are the mentors?"
                  answer="Our mentors are experienced professionals and educators dedicated to guiding students."
                />
                <FAQItem
                  question="What is the focus of JMOC?"
                  answer="JMOC focuses on enhancing problem-solving skills and mathematical aptitude."
                />
                <FAQItem
                  question="What is the duration of the program?"
                  answer="The program runs for 8 weeks (2 months)."
                />
                <FAQItem
                  question="What are the eligible grades for the program?"
                  answer="Aspirants from Grade VIII to Grade X are eligible."
                />
                <FAQItem
                  question="How often does the program run?"
                  answer="The program runs once per year, typically at the end of the year."
                />
              </Accordion>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  return (
    <AccordionItem value={question}>
      <AccordionTrigger>{question}</AccordionTrigger>
      <AccordionContent>{answer}</AccordionContent>
    </AccordionItem>
  );
}