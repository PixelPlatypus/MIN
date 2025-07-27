'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';
import { MinFloatingElements } from '@/components/ui/min-floating-elements';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';

export default function RequestPartnershipPage() {
  const [formData, setFormData] = useState({
    personName: '',
    organizationName: '',
    contactNumber: '',
    contactEmail: '',
    category: '',
    collaborationIdea: '',
    goalsObjective: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSelectChange = (value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      category: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/request-partnership', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success('Partnership request submitted successfully!', {
          description: 'We have received your request and will get back to you soon.',
        });
        setFormData({
          personName: '',
          organizationName: '',
          contactNumber: '',
          contactEmail: '',
          category: '',
          collaborationIdea: '',
          goalsObjective: '',
        });
      } else {
        toast.error('Failed to submit partnership request.', {
          description: result.message || 'An unknown error occurred.',
        });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Network error or server is unreachable.', {
        description: 'Please check your internet connection and try again.',
      });
    }
    setIsSubmitting(false);
  };

  return (
    <>
      <MinFloatingElements />
      <Navigation />

      <section className="pt-24 sm:pt-32 pb-12 sm:pb-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto container-padding text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="inline-flex items-center space-x-2 glass rounded-full px-4 sm:px-6 py-2 sm:py-3 mb-6 sm:mb-8">
              <Plus className="w-3 h-3 sm:w-4 sm:h-4 text-min-accent" />
              <span className="text-white/90 text-xs sm:text-sm font-medium">Partnership Request</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 sm:mb-8">
              Request a <span className="min-gradient-accent">Partnership</span>
            </h1>
            <p className="text-white/70 text-base sm:text-lg lg:text-xl font-light max-w-4xl mx-auto leading-relaxed mb-8">
              Fill out the form below to request a partnership with us.
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
                  <Label htmlFor="personName" className="block text-white/90 text-sm font-medium mb-2">Person Name</Label>
                  <Input
                    id="personName"
                    name="personName"
                    type="text"
                    autoComplete="name"
                    required
                    className="w-full px-4 py-3 glass rounded-xl text-white placeholder-white focus:border-min-accent focus:outline-none transition-colors"
                    placeholder="Your Full Name"
                    value={formData.personName}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <Label htmlFor="organizationName" className="block text-white/90 text-sm font-medium mb-2">Organization Name</Label>
                  <Input
                    id="organizationName"
                    name="organizationName"
                    type="text"
                    autoComplete="organization"
                    required
                    className="w-full px-4 py-3 glass rounded-xl text-white placeholder-white/60 focus:border-min-accent focus:outline-none transition-colors"
                    placeholder="Your Organization Name"
                    value={formData.organizationName}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="contactNumber" className="block text-white/90 text-sm font-medium mb-2">Contact Number</Label>
                  <Input
                    id="contactNumber"
                    name="contactNumber"
                    type="tel"
                    autoComplete="tel"
                    required
                    className="w-full px-4 py-3 glass rounded-xl text-white placeholder-white/60 focus:border-min-accent focus:outline-none transition-colors"
                    placeholder="Your Contact Number"
                    value={formData.contactNumber}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <Label htmlFor="contactEmail" className="block text-white/90 text-sm font-medium mb-2">Contact Email</Label>
                  <Input
                    id="contactEmail"
                    name="contactEmail"
                    type="email"
                    autoComplete="email"
                    required
                    className="w-full px-4 py-3 glass rounded-xl text-white placeholder-white/60 focus:border-min-accent focus:outline-none transition-colors"
                    placeholder="your.email@example.com"
                    value={formData.contactEmail}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="category" className="block text-white/90 text-sm font-medium mb-2">Category for Partnership</Label>
                <Select onValueChange={handleSelectChange} value={formData.category} required>
                  <SelectTrigger className="w-full px-4 py-3 glass rounded-xl text-white placeholder-white focus:border-min-accent focus:outline-none font-light text-sm sm:text-base">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent className="glass-card">
                    <SelectItem value="educational">Educational</SelectItem>
                    <SelectItem value="research">Research</SelectItem>
                    <SelectItem value="community">Community</SelectItem>
                    <SelectItem value="sponsorship">Sponsorship</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="collaborationIdea" className="block text-white/90 text-sm font-medium mb-2">Collaboration Idea</Label>
                <Textarea
                  id="collaborationIdea"
                  name="collaborationIdea"
                  rows={4}
                  className="w-full px-4 py-3 glass rounded-xl text-white placeholder-white focus:border-min-accent focus:outline-none transition-colors"
                  placeholder="Describe your collaboration idea..."
                  value={formData.collaborationIdea}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="goalsObjective" className="block text-white/90 text-sm font-medium mb-2">Goals and Objective</Label>
                <Textarea
                  id="goalsObjective"
                  name="goalsObjective"
                  rows={4}
                  className="w-full px-4 py-3 glass rounded-xl text-white placeholder-white focus:border-min-accent focus:outline-none transition-colors"
                  placeholder="Outline your goals and objectives..."
                  value={formData.goalsObjective}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <Button
                  type="submit"
                  className="w-full glass-button text-white py-3 rounded-xl text-lg font-semibold transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Request'}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      </section>

      <Footer />
    </>
  );
}