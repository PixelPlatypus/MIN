// Initial content for the submit-content page
'use client';

import React, { useState } from 'react';
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { MinFloatingElements } from "@/components/ui/min-floating-elements";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export default function SubmitContentPage() {
  const [formData, setFormData] = useState({
    title: '',
    name: '',
    email: '',
    link: '',
    tags: '',
    category: '',
    description: '',
  });
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/submit-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          authorEmail: formData.email,
          authorName: formData.name,
        }),
      });

      if (response.ok) {
        setIsSuccessDialogOpen(true);
        setFormData({
          title: '',
          name: '',
          email: '',
          link: '',
          tags: '',
          category: '',
          description: '',
        });
      } else {
        console.error('Form submission failed:', response.statusText);
        alert('Failed to submit content. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <MinFloatingElements />
      <Navigation />

      <Dialog open={isSuccessDialogOpen} onOpenChange={setIsSuccessDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Content Submitted Successfully!</DialogTitle>
            <DialogDescription>
              Thank you for your submission. Our team will review your content and get back to you soon.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <section className="pt-24 sm:pt-32 pb-12 sm:pb-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto container-padding text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="inline-flex items-center space-x-2 glass rounded-full px-4 sm:px-6 py-2 sm:py-3 mb-6 sm:mb-8">
              <Plus className="w-3 h-3 sm:w-4 sm:h-4 text-min-accent" />
              <span className="text-white/90 text-xs sm:text-sm font-medium">Content Submission</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 sm:mb-8">
              Submit Your <span className="min-gradient-accent">Content</span>
            </h1>
            <p className="text-white/70 text-base sm:text-lg lg:text-xl font-light max-w-4xl mx-auto leading-relaxed mb-8">
              Please provide a sharable link to your document (e.g., Google Drive, Dropbox, etc.). Our team will review
              your submission and publish quality content with full attribution.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-8 sm:py-12 relative z-10">
        <div className="max-w-4xl mx-auto container-padding">
          <div className="glass-card rounded-2xl sm:rounded-3xl p-6 sm:p-8">
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="title" className="block text-sm font-medium text-white/80 mb-2">Title</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-3 glass rounded-lg text-white placeholder-white/60 focus:border-min-accent focus:outline-none font-light text-sm sm:text-base"
                  placeholder="Enter title of your content"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-white/80 mb-2">Your Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 glass rounded-lg text-white placeholder-white/60 focus:border-min-accent focus:outline-none font-light text-sm sm:text-base"
                  placeholder="Enter your name"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-white/80 mb-2">Contact Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 glass rounded-lg text-white placeholder-white/60 focus:border-min-accent focus:outline-none font-light text-sm sm:text-base"
                  placeholder="Enter your contact email"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="link" className="block text-sm font-medium text-white/80 mb-2">Sharable Link</label>
                <input
                  type="text"
                  id="link"
                  name="link"
                  value={formData.link}
                  onChange={handleChange}
                  className="w-full px-4 py-3 glass rounded-lg text-white placeholder-white/60 focus:border-min-accent focus:outline-none font-light text-sm sm:text-base"
                  placeholder="https://example.com/your-document-link"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="tags" className="block text-sm font-medium text-white/80 mb-2">Tags (optional)</label>
                <input
                  type="text"
                  id="tags"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  className="w-full px-4 py-3 glass rounded-lg text-white placeholder-white/60 focus:border-min-accent focus:outline-none font-light text-sm sm:text-base"
                  placeholder="e.g., Geometry, Research, Number Theory etc."
                />
              </div>
              <div className="mb-4">
                <label htmlFor="category" className="block text-sm font-medium text-white/80 mb-2">Category</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 glass rounded-lg text-white focus:border-min-accent focus:outline-none font-light text-sm sm:text-base"
                  required
                >
                  <option value="">Select a category</option>
                  <option value="blog">Blog</option>
                  <option value="article">Article</option>
                  <option value="problem-set">Problem Set</option>
                  <option value="research-paper">Research Paper</option>
                </select>
              </div>
              <div className="mb-6">
                <label htmlFor="description" className="block text-sm font-medium text-white/80 mb-2">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={5}
                  className="w-full px-4 py-3 glass rounded-lg text-white placeholder-white/60 focus:border-min-accent focus:outline-none font-light text-sm sm:text-base"
                  placeholder="Provide a brief description of your content"
                ></textarea>
              </div>
              <motion.button
                type="submit"
                className="btn-min-accent text-min-primary px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold text-sm sm:text-base flex items-center space-x-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                data-hover="true"
                disabled={isLoading}
              >
                {isLoading ? 'Submitting...' : 'Submit Content'}
              </motion.button>
            </form>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}