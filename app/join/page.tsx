"use client"

import type React from "react"

import { motion } from "framer-motion"
import { useState } from "react"
import Image from "next/image"
import { Users, Building, Heart, Lightbulb, Target, Globe } from "lucide-react"
import { MinFloatingElements } from "@/components/ui/min-floating-elements"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import joinData from "@/data/join.json"

export default function JoinPage() {
  const [activeForm, setActiveForm] = useState<"volunteer" | "organization" | null>(null)
  const [volunteerForm, setVolunteerForm] = useState({
    name: "",
    email: "",
    phone: "",
    skills: "",
    motivation: "",
    availability: "",
  })
  const [organizationForm, setOrganizationForm] = useState({
    organizationName: "",
    contactPerson: "",
    email: "",
    phone: "",
    type: "",
    collaboration: "",
    goals: "",
  })

  const handleVolunteerSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Volunteer form submitted:", volunteerForm)
    // Handle form submission
    setVolunteerForm({ name: "", email: "", phone: "", skills: "", motivation: "", availability: "" })
    setActiveForm(null)
  }

  const handleOrganizationSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Organization form submitted:", organizationForm)
    // Handle form submission
    setOrganizationForm({
      organizationName: "",
      contactPerson: "",
      email: "",
      phone: "",
      type: "",
      collaboration: "",
      goals: "",
    })
    setActiveForm(null)
  }

  return (
    <div className="min-h-screen overflow-x-hidden">
      
      <MinFloatingElements />

      {/* Navigation */}
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 pb-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-8 text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
            <div className="inline-flex items-center space-x-2 glass rounded-full px-6 py-3 mb-8">
              <Heart className="w-4 h-4 text-min-accent" />
              <span className="text-white/90 text-sm font-medium">Be Part of Something Extraordinary</span>
            </div>
            <h1 className="text-6xl md:text-7xl font-bold text-white mb-8">
              Join the <span className="min-gradient-accent">Revolution</span>
            </h1>
            <p className="text-white/70 text-xl font-light max-w-4xl mx-auto leading-relaxed">
              We believe the most powerful force for change is people who care. Join us in reimagining mathematics
              education for every student in Nepal.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Google Form Buttons */}
      <section className="py-16 relative z-10">
        <div className="max-w-4xl mx-auto px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to <span className="min-gradient-accent">Get Started?</span>
            </h2>
            <p className="text-white/70 text-lg font-light max-w-2xl mx-auto mb-8">
              Choose your path and fill out our quick form to begin your journey with MIN.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            <motion.a
              href={joinData.volunteer.link}
              target="_blank"
              rel="noopener noreferrer"
              className="block glass-card rounded-3xl p-8 group text-center"
              whileHover={{ y: -5, scale: 1.02 }}
              data-hover="true"
            >
              <Users className="w-12 h-12 text-min-accent mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-3 transition-colors group-hover:min-gradient-accent">
                Volunteer Application
              </h3>
              <p className="text-white/80 font-light mb-6">
                Join our team of passionate educators and make a direct impact on students' lives.
              </p>
              <div className="btn-min-accent text-min-primary px-6 py-3 rounded-full font-semibold inline-block">
                {joinData.volunteer.text}
              </div>
            </motion.a>

            <motion.a
              href={joinData.partnership.link}
              target="_blank"
              rel="noopener noreferrer"
              className="block glass-card rounded-3xl p-8 group text-center"
              whileHover={{ y: -5, scale: 1.02 }}
              data-hover="true"
            >
              <Building className="w-12 h-12 text-min-accent mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-3 transition-colors group-hover:min-gradient-accent">
                Partnership Request
              </h3>
              <p className="text-white/80 font-light mb-6">
                Partner with us as an educational institution or organization to expand our reach.
              </p>
              <div className="btn-min-accent text-min-primary px-6 py-3 rounded-full font-semibold inline-block">
                {joinData.partnership.text}
              </div>
            </motion.a>
          </div>
        </div>
      </section>

      {/* Why Join Us */}
      <section className="py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold text-white mb-8">
              Why Your <span className="min-gradient-accent">Voice Matters</span>
            </h2>
            <p className="text-white/70 text-xl font-light max-w-3xl mx-auto">
              Every great movement starts with individuals who believe change is possible. Here's how you can make a
              difference.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {[
              {
                icon: Lightbulb,
                title: "Spark Innovation",
                description:
                  "Bring fresh perspectives to mathematical education. Your unique insights could be the breakthrough we need.",
              },
              {
                icon: Target,
                title: "Create Impact",
                description:
                  "Touch thousands of lives. Every student you help today becomes a problem-solver of tomorrow.",
              },
              {
                icon: Globe,
                title: "Build Legacy",
                description:
                  "Be part of Nepal's mathematical renaissance. Help us create a generation of mathematical thinkers.",
              },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="glass-card rounded-3xl p-8 text-center group"
                data-hover="true"
              >
                <div className="w-16 h-16 glass-light rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <item.icon className="w-8 h-8 text-min-primary" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4 group-hover:min-gradient-accent transition-colors">
                  {item.title}
                </h3>
                <p className="text-white/80 font-light leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Join Options */}
      <section className="py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold text-white mb-8">
              Choose Your <span className="min-gradient-accent">Path</span>
            </h2>
            <p className="text-white/70 text-xl font-light max-w-3xl mx-auto">
              Whether you're an individual with passion or an organization with vision, there's a perfect way for you to
              contribute.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Volunteer Card */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
              className="glass-card rounded-3xl p-8 group"
              data-hover="true"
            >
              <div className="w-20 h-20 glass-light rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Users className="w-10 h-10 text-min-primary" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-4 group-hover:min-gradient-accent transition-colors">
                Join as Volunteer
              </h3>
              <p className="text-white/80 font-light leading-relaxed mb-6">
                Share your passion for mathematics. Mentor students, create content, organize events, or contribute your
                unique skills to our mission.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  "Mentor aspiring mathematicians",
                  "Create educational content",
                  "Organize community events",
                  "Support digital initiatives",
                  "Share your expertise",
                ].map((item, index) => (
                  <li key={index} className="flex items-center text-white/70">
                    <div className="w-2 h-2 bg-min-accent rounded-full mr-3" />
                    <span className="text-sm font-medium">{item}</span>
                  </li>
                ))}
              </ul>
              <motion.a
                href={joinData.volunteer.link}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full btn-min-accent text-min-primary px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                data-hover="true"
              >
                Become a Volunteer
              </motion.a>
            </motion.div>

            {/* Organization Card */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              viewport={{ once: true }}
              className="glass-card rounded-3xl p-8 group"
              data-hover="true"
            >
              <div className="w-20 h-20 glass-light rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Building className="w-10 h-10 text-min-primary" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-4 group-hover:min-gradient-accent transition-colors">
                Partner Organization
              </h3>
              <p className="text-white/80 font-light leading-relaxed mb-6">
                Join forces with us as a school, college, educational institution, NGO, or corporate partner. Together,
                we can amplify our impact across Nepal.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  "School & college partnerships",
                  "Educational institution collaborations",
                  "Joint curriculum development",
                  "Student exchange programs",
                  "Community outreach initiatives",
                ].map((item, index) => (
                  <li key={index} className="flex items-center text-white/70">
                    <div className="w-2 h-2 bg-min-accent rounded-full mr-3" />
                    <span className="text-sm font-medium">{item}</span>
                  </li>
                ))}
              </ul>
              <motion.a
                href={joinData.partnership.link}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full btn-min-accent text-min-primary px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                data-hover="true"
              >
                Partner With Us
              </motion.a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Volunteer Form Modal */}
      {activeForm === "volunteer" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setActiveForm(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass-card rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-3xl font-bold text-white mb-6 min-gradient-accent">Join as Volunteer</h3>
            <form onSubmit={handleVolunteerSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white/90 text-sm font-medium mb-2">Full Name</label>
                  <input
                    type="text"
                    required
                    value={volunteerForm.name}
                    onChange={(e) => setVolunteerForm({ ...volunteerForm, name: e.target.value })}
                    className="w-full px-4 py-3 glass rounded-xl text-white placeholder-white/60 focus:border-min-accent focus:outline-none transition-colors"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label className="block text-white/90 text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    required
                    value={volunteerForm.email}
                    onChange={(e) => setVolunteerForm({ ...volunteerForm, email: e.target.value })}
                    className="w-full px-4 py-3 glass rounded-xl text-white placeholder-white/60 focus:border-min-accent focus:outline-none transition-colors"
                    placeholder="your@email.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-white/90 text-sm font-medium mb-2">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={volunteerForm.phone}
                  onChange={(e) => setVolunteerForm({ ...volunteerForm, phone: e.target.value })}
                  className="w-full px-4 py-3 glass rounded-xl text-white placeholder-white/60 focus:border-min-accent focus:outline-none transition-colors"
                  placeholder="+977-XXX-XXXXXXX"
                />
              </div>
              <div>
                <label className="block text-white/90 text-sm font-medium mb-2">Skills & Expertise</label>
                <textarea
                  rows={3}
                  required
                  value={volunteerForm.skills}
                  onChange={(e) => setVolunteerForm({ ...volunteerForm, skills: e.target.value })}
                  className="w-full px-4 py-3 glass rounded-xl text-white placeholder-white/60 focus:border-min-accent focus:outline-none resize-none transition-colors"
                  placeholder="Tell us about your mathematical background, teaching experience, or other relevant skills..."
                />
              </div>
              <div>
                <label className="block text-white/90 text-sm font-medium mb-2">Why do you want to volunteer?</label>
                <textarea
                  rows={3}
                  required
                  value={volunteerForm.motivation}
                  onChange={(e) => setVolunteerForm({ ...volunteerForm, motivation: e.target.value })}
                  className="w-full px-4 py-3 glass rounded-xl text-white placeholder-white/60 focus:border-min-accent focus:outline-none resize-none transition-colors"
                  placeholder="Share your motivation and what you hope to achieve..."
                />
              </div>
              <div>
                <label className="block text-white/90 text-sm font-medium mb-2">Availability</label>
                <input
                  type="text"
                  required
                  value={volunteerForm.availability}
                  onChange={(e) => setVolunteerForm({ ...volunteerForm, availability: e.target.value })}
                  className="w-full px-4 py-3 glass rounded-xl text-white placeholder-white/60 focus:border-min-accent focus:outline-none transition-colors"
                  placeholder="e.g., Weekends, 2-3 hours per week, flexible..."
                />
              </div>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setActiveForm(null)}
                  className="flex-1 glass px-6 py-3 rounded-xl text-white hover:glass-hover transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 btn-min-accent text-min-primary px-6 py-3 rounded-xl font-semibold transition-colors"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}

      {/* Organization Form Modal */}
      {activeForm === "organization" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setActiveForm(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass-card rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-3xl font-bold text-white mb-6 min-gradient-accent">Partner With Us</h3>
            <form onSubmit={handleOrganizationSubmit} className="space-y-6">
              <div>
                <label className="block text-white/90 text-sm font-medium mb-2">Organization Name</label>
                <input
                  type="text"
                  required
                  value={organizationForm.organizationName}
                  onChange={(e) => setOrganizationForm({ ...organizationForm, organizationName: e.target.value })}
                  className="w-full px-4 py-3 glass rounded-xl text-white placeholder-white/60 focus:border-min-accent focus:outline-none transition-colors"
                  placeholder="Your organization name"
                />
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white/90 text-sm font-medium mb-2">Contact Person</label>
                  <input
                    type="text"
                    required
                    value={organizationForm.contactPerson}
                    onChange={(e) => setOrganizationForm({ ...organizationForm, contactPerson: e.target.value })}
                    className="w-full px-4 py-3 glass rounded-xl text-white placeholder-white/60 focus:border-min-accent focus:outline-none transition-colors"
                    placeholder="Primary contact name"
                  />
                </div>
                <div>
                  <label className="block text-white/90 text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    required
                    value={organizationForm.email}
                    onChange={(e) => setOrganizationForm({ ...organizationForm, email: e.target.value })}
                    className="w-full px-4 py-3 glass rounded-xl text-white placeholder-white/60 focus:border-min-accent focus:outline-none transition-colors"
                    placeholder="contact@organization.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-white/90 text-sm font-medium mb-2">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={organizationForm.phone}
                  onChange={(e) => setOrganizationForm({ ...organizationForm, phone: e.target.value })}
                  className="w-full px-4 py-3 glass rounded-xl text-white placeholder-white/60 focus:border-min-accent focus:outline-none transition-colors"
                  placeholder="+977-XXX-XXXXXXX"
                />
              </div>
              <div>
                <label className="block text-white/90 text-sm font-medium mb-2">Organization Type</label>
                <select
                  required
                  value={organizationForm.type}
                  onChange={(e) => setOrganizationForm({ ...organizationForm, type: e.target.value })}
                  className="w-full px-4 py-3 glass rounded-xl text-white focus:border-min-accent focus:outline-none transition-colors"
                >
                  <option value="">Select organization type</option>
                  <option value="school">School/College</option>
                  <option value="ngo">NGO/Non-profit</option>
                  <option value="corporate">Corporate</option>
                  <option value="government">Government</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-white/90 text-sm font-medium mb-2">Collaboration Ideas</label>
                <textarea
                  rows={3}
                  required
                  value={organizationForm.collaboration}
                  onChange={(e) => setOrganizationForm({ ...organizationForm, collaboration: e.target.value })}
                  className="w-full px-4 py-3 glass rounded-xl text-white placeholder-white/60 focus:border-min-accent focus:outline-none resize-none transition-colors"
                  placeholder="How would you like to collaborate with MIN? What resources can you offer?"
                />
              </div>
              <div>
                <label className="block text-white/90 text-sm font-medium mb-2">Goals & Objectives</label>
                <textarea
                  rows={3}
                  required
                  value={organizationForm.goals}
                  onChange={(e) => setOrganizationForm({ ...organizationForm, goals: e.target.value })}
                  className="w-full px-4 py-3 glass rounded-xl text-white placeholder-white/60 focus:border-min-accent focus:outline-none resize-none transition-colors"
                  placeholder="What do you hope to achieve through this partnership?"
                />
              </div>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setActiveForm(null)}
                  className="flex-1 glass px-6 py-3 rounded-xl text-white hover:glass-hover transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 btn-min-primary text-white px-6 py-3 rounded-xl font-semibold transition-colors"
                >
                  Submit Partnership Request
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}

      <Footer />
    </div>
  )
}
