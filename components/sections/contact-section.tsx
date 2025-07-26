"use client"

import React from "react"
import { motion } from "framer-motion"
import { useState } from "react"
import { Mail, MapPin, Phone, Send, Youtube, Instagram, Linkedin, Twitter, Facebook, LucideIcon } from "lucide-react"
import contactData from "@/data/contact.json"

interface ContactInfo {
  label: string;
  value: string;
  icon: keyof typeof iconMap;
}

interface SocialLink {
  icon: keyof typeof iconMap;
  href: string;
}

const iconMap: { [key: string]: LucideIcon } = {
  Mail: Mail,
  MapPin: MapPin,
  Phone: Phone,
  Youtube: Youtube,
  Instagram: Instagram,
  Linkedin: Linkedin,
  Twitter: Twitter,
  Facebook: Facebook,
}

export const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Message sent successfully!');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        alert('Failed to send message. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('An error occurred. Please try again later.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const contactInfo: ContactInfo[] = contactData.contactInfo as ContactInfo[];
  const socialLinks: SocialLink[] = contactData.socialLinks as SocialLink[];

  return (
    <section id="contact" className="py-32 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center space-x-2 glass rounded-full px-6 py-3 mb-8">
            <div className="w-2 h-2 bg-min-accent rounded-full" />
            <span className="text-white/90 text-sm font-medium">Get In Touch</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Contact <span className="min-gradient-accent">Us</span>
          </h2>
          <p className="text-white/70 text-xl max-w-3xl mx-auto leading-relaxed">
            Ready to join our mathematical journey? We'd love to hear from you.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            <h3 className="text-3xl font-bold text-white mb-8">Let's Connect</h3>

            <div className="space-y-6">
              {contactInfo.map((contact, index) => (
                <motion.div
                  key={index}
                  className="flex items-center space-x-4 glass-card rounded-2xl p-4 group"
                  whileHover={{ x: 10 }}
                  data-hover="true"
                >
                  <div className="w-14 h-14 glass-light rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    {contact.icon && React.createElement(iconMap[contact.icon], { className: "w-7 h-7 text-min-primary" })}
                  </div>
                  <div>
                    <div className="text-white/70 text-sm font-medium">{contact.label}</div>
                    <div className="text-white text-lg font-semibold">{contact.value}</div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Social Links */}
            <div className="mt-12">
              <h4 className="text-xl font-semibold text-white mb-6">Follow Us</h4>
              <div className="flex space-x-4">
                {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 glass-card rounded-xl flex items-center justify-center text-white/80 hover:text-white transition-all duration-300"
                  whileHover={{ scale: 1.1, y: -2 }}
                  data-hover="true"
                >
                  {/* Render social icon */}
                  {social.icon && React.createElement(iconMap[social.icon], { className: "w-6 h-6" })}
                </motion.a>
              ))}
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            viewport={{ once: true }}
            className="glass-card rounded-3xl p-8"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white/90 text-sm font-medium mb-2">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 glass rounded-xl text-white placeholder-white/60 focus:border-min-accent focus:outline-none transition-colors"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-white/90 text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 glass rounded-xl text-white placeholder-white/60 focus:border-min-accent focus:outline-none transition-colors"
                    placeholder="your@email.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-white/90 text-sm font-medium mb-2">Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 glass rounded-xl text-white placeholder-white/60 focus:border-min-accent focus:outline-none transition-colors"
                  placeholder="What's this about?"
                />
              </div>
              <div>
                <label className="block text-white/90 text-sm font-medium mb-2">Message</label>
                <textarea
                  name="message"
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 glass rounded-xl text-white placeholder-white/60 focus:border-min-accent focus:outline-none resize-none transition-colors"
                  placeholder="Tell us more..."
                />
              </div>
              <motion.button
                type="submit"
                className="w-full btn-min-accent text-min-primary px-8 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                data-hover="true"
              >
                <Send className="w-5 h-5" />
                <span>Send Message</span>
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
