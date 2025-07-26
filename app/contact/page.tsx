"use client"

import type React from "react"

import { motion } from "framer-motion"
import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Mail, MapPin, Phone, Send, Youtube, Instagram, Linkedin, Twitter } from "lucide-react"
import { FloatingSymbols } from "@/components/ui/floating-symbols"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted:", formData)

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setIsSuccessDialogOpen(true)
        setFormData({ name: "", email: "", subject: "", message: "" })
      } else {
        console.error("Form submission failed:", response.statusText)
        alert("Failed to send message. Please try again.")
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      alert("An error occurred. Please try again.")
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="min-h-screen bg-white relative">
      <FloatingSymbols />

      <Dialog open={isSuccessDialogOpen} onOpenChange={setIsSuccessDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Message Sent Successfully!</DialogTitle>
            <DialogDescription>
              Thank you for contacting us. We will get back to you shortly.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

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
                href="/programs"
                className="text-white/70 hover:text-white transition-colors text-sm tracking-wider uppercase font-light"
                data-hover="true"
              >
                Programs
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-[#16556d] to-[#356a72] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-8 text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
            <h1 className="text-6xl md:text-7xl font-light text-white mb-8">Get In Touch</h1>
            <p className="text-white/70 text-xl font-light max-w-3xl mx-auto">
              Ready to join our mathematical journey? We'd love to hear from you.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-20 bg-white relative z-10">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid lg:grid-cols-2 gap-20 items-start">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
            >
              <h3 className="text-4xl font-light text-[#16556d] mb-8">Contact Information</h3>

              <div className="space-y-8">
                <div className="flex items-center space-x-6 group" data-hover="true">
                  <div className="w-16 h-16 bg-[#cdaa72]/10 rounded-full flex items-center justify-center group-hover:bg-[#cdaa72] group-hover:scale-110 transition-all duration-300">
                    <Mail className="h-8 w-8 text-[#cdaa72] group-hover:text-white" />
                  </div>
                  <div>
                    <div className="text-[#16556d] font-light text-lg">Email</div>
                    <div className="text-[#356a72] font-light">info@min-nepal.org</div>
                  </div>
                </div>

                <div className="flex items-center space-x-6 group" data-hover="true">
                  <div className="w-16 h-16 bg-[#cdaa72]/10 rounded-full flex items-center justify-center group-hover:bg-[#cdaa72] group-hover:scale-110 transition-all duration-300">
                    <Phone className="h-8 w-8 text-[#cdaa72] group-hover:text-white" />
                  </div>
                  <div>
                    <div className="text-[#16556d] font-light text-lg">Phone</div>
                    <div className="text-[#356a72] font-light">+977-1-234-5678</div>
                  </div>
                </div>

                <div className="flex items-center space-x-6 group" data-hover="true">
                  <div className="w-16 h-16 bg-[#cdaa72]/10 rounded-full flex items-center justify-center group-hover:bg-[#cdaa72] group-hover:scale-110 transition-all duration-300">
                    <MapPin className="h-8 w-8 text-[#cdaa72] group-hover:text-white" />
                  </div>
                  <div>
                    <div className="text-[#16556d] font-light text-lg">Location</div>
                    <div className="text-[#356a72] font-light">Kathmandu, Nepal</div>
                  </div>
                </div>

                <div className="pt-8">
                  <h4 className="text-2xl font-light text-[#16556d] mb-6">Follow Us</h4>
                  <div className="flex space-x-6">
                    {[
                      { icon: Youtube, href: "https://www.youtube.com/@MathematicsInitiativesinNepal" },
                      { icon: Instagram, href: "https://www.instagram.com/min_nepal/" },
                      { icon: Linkedin, href: "https://np.linkedin.com/company/math-initiatives-in-nepal-min" },
                      { icon: Twitter, href: "https://x.com/nepal_min" },
                    ].map((social, index) => (
                      <motion.a
                        key={index}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-16 h-16 bg-[#16556d]/5 rounded-full flex items-center justify-center hover:bg-[#cdaa72] hover:text-white transition-all duration-300 group"
                        whileHover={{ scale: 1.1, y: -5 }}
                        data-hover="true"
                      >
                        <social.icon className="h-6 w-6 group-hover:scale-110 transition-transform" />
                      </motion.a>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-12 shadow-xl border border-gray-100"
            >
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <input
                      type="text"
                      name="name"
                      placeholder="Your Name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-0 py-4 bg-transparent border-0 border-b-2 border-gray-200 focus:border-[#cdaa72] focus:outline-none text-[#16556d] placeholder-gray-400 font-light transition-colors"
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      name="email"
                      placeholder="Your Email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-0 py-4 bg-transparent border-0 border-b-2 border-gray-200 focus:border-[#cdaa72] focus:outline-none text-[#16556d] placeholder-gray-400 font-light transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <input
                    type="text"
                    name="subject"
                    placeholder="Subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-0 py-4 bg-transparent border-0 border-b-2 border-gray-200 focus:border-[#cdaa72] focus:outline-none text-[#16556d] placeholder-gray-400 font-light transition-colors"
                  />
                </div>
                <div>
                  <textarea
                    name="message"
                    rows={4}
                    placeholder="Your Message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className="w-full px-0 py-4 bg-transparent border-0 border-b-2 border-gray-200 focus:border-[#cdaa72] focus:outline-none text-[#16556d] placeholder-gray-400 font-light resize-none transition-colors"
                  />
                </div>
                <motion.button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#16556d] to-[#356a72] text-white px-8 py-5 rounded-full hover:from-[#356a72] hover:to-[#cdaa72] transition-all duration-500 font-light tracking-wide text-lg"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  data-hover="true"
                >
                  <span className="flex items-center justify-center">
                    <Send className="mr-2 h-5 w-5" />
                    Send Message
                  </span>
                </motion.button>
              </form>
            </motion.div>
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
              © 2024 Mathematics Initiatives in Nepal. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
