'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';
import { MinFloatingElements } from '@/components/ui/min-floating-elements';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export default function CertificateRequestPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    joiningDate: '',
    team: '',
    position: '',
    contributions: '',
    submissionStatus: 'idle', // 'idle', 'loading', 'success', 'error'
    message: '',
  });
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormData((prev) => ({ ...prev, submissionStatus: 'loading', message: '' }));

    const joiningDate = new Date(formData.joiningDate);
    const today = new Date();

    // Calculate the difference in years
    const diffYears = today.getFullYear() - joiningDate.getFullYear();
    const diffMonths = today.getMonth() - joiningDate.getMonth();
    const diffDays = today.getDate() - joiningDate.getDate();

    // Check if at least one year has passed
    if (diffYears < 1 || (diffYears === 1 && (diffMonths < 0 || (diffMonths === 0 && diffDays < 0)))) {
      setFormData((prev) => ({
        ...prev,
        submissionStatus: 'error',
        message: 'You can only request a certificate after completing one year of contribution. Please try again later or contact the administrator.',
      }));
      alert('You can only request a certificate after completing one year of contribution. Please try again later or contact the administrator.');
      return;
    }

    try {
      const response = await fetch('/api/request-certificate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setFormData((prev) => ({ ...prev, submissionStatus: 'success', message: result.message }));
        setIsSuccessDialogOpen(true);
        setFormData({
          name: '',
          email: '',
          joiningDate: '',
          team: '',
          position: '',
          contributions: '',
          submissionStatus: 'idle',
          message: '',
        });
      } else {
        setFormData((prev) => ({ ...prev, submissionStatus: 'error', message: result.message || 'An unknown error occurred.' }));
        alert(`Failed to submit certificate request: ${result.message || 'An unknown error occurred.'}`);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setFormData((prev) => ({ ...prev, submissionStatus: 'error', message: 'Network error or server is unreachable.' }));
      alert('Network error or server is unreachable. Please try again later.');
    }
  };

  return (
    <>
      <MinFloatingElements />
      <Navigation />

      <Dialog open={isSuccessDialogOpen} onOpenChange={setIsSuccessDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Certificate Request Submitted!</DialogTitle>
            <DialogDescription>
              Your request for a certificate has been successfully submitted. We will review it and get back to you soon.
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
              <span className="text-white/90 text-xs sm:text-sm font-medium">Certificate Request</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 sm:mb-8">
              Request Your <span className="min-gradient-accent">Certificate</span>
            </h1>
            <p className="text-white/70 text-base sm:text-lg lg:text-xl font-light max-w-4xl mx-auto leading-relaxed mb-8">
              Fill out the form below to request your certificate based on your contributions to MIN.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-8 sm:py-12 relative z-10">
        <div className="max-w-4xl mx-auto container-padding">
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
                    placeholder="Your Full Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 glass rounded-xl text-white placeholder-white/60 focus:border-min-accent focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-white/90 text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="your.email@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 glass rounded-xl text-white placeholder-white/60 focus:border-min-accent focus:outline-none transition-colors"
                  />
                </div>
              </div>
              <div>
                <label className="block text-white/90 text-sm font-medium mb-2">Joining Date</label>
                <input
                  type="date"
                  name="joiningDate"
                  value={formData.joiningDate}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 glass rounded-xl text-white placeholder-white/60 focus:border-min-accent focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-white/90 text-sm font-medium mb-2">Team</label>
                <Select onValueChange={(value) => setFormData((prevData) => ({ ...prevData, team: value }))} value={formData.team} required>
                  <SelectTrigger id="team" className="w-full px-4 py-3 glass rounded-xl text-white focus:border-min-accent focus:outline-none font-light text-sm sm:text-base">
                    <SelectValue placeholder="Select your team" />
                  </SelectTrigger>
                  <SelectContent className="glass-card">
                    <SelectItem value="IT">IT</SelectItem>
                    <SelectItem value="Education">Education</SelectItem>
                    <SelectItem value="Content">Content</SelectItem>
                    <SelectItem value="Event & Marketing">Event & Marketing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-white/90 text-sm font-medium mb-2">Position</label>
                <input
                  type="text"
                  name="position"
                  placeholder="Your Position"
                  value={formData.position}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 glass rounded-lg text-white placeholder-white/90 focus:border-min-accent focus:outline-none font-light text-sm sm:text-base"
                />
              </div>
              <div>
                <Label htmlFor="contributions" className="block text-sm font-medium text-white/80 mb-2">Mention your Contributions</Label>
                  <textarea
                    id="contributions"
                    placeholder="Describe your contributions (e.g., projects, tasks, roles)"
                    value={formData.contributions}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 glass rounded-xl text-white placeholder-white/60 focus:border-min-accent focus:outline-none transition-colors min-h-[120px]"
                  />
              </div>
              <motion.button
                type="submit"
                className="btn-min-accent text-min-primary px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold text-sm sm:text-base flex items-center space-x-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                data-hover="true"
                disabled={formData.submissionStatus === 'loading'}
              >
                {formData.submissionStatus === 'loading' ? 'Submitting...' : 'Submit Request'}
              </motion.button>
              {formData.submissionStatus === 'success' && (
                <p className="text-green-500 text-center mt-2">{formData.message}</p>
              )}
              {formData.submissionStatus === 'error' && (
                <p className="text-red-500 text-center mt-2">{formData.message}</p>
              )}
            </form>
            <div className="mt-6 text-sm text-white/70">
              <h3 className="font-semibold text-white">Certificate Criteria:</h3>
              <ul className="list-disc list-inside">
                <li>70% Attendance</li>
                <li>70% Task/Project Completion & Minimum of 4-6 task completion (Monitored by Manager)</li>
                <li>1 Year Contribution (1 month break free break)</li>
              </ul>
            </div>
          </motion.div>
        </div>
      </section>
      <Footer />
    </>
  );
}