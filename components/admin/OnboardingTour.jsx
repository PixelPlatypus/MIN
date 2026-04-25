'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ChevronRight, ChevronLeft, X, Sparkles, 
  LayoutDashboard, Users, Library, Globe, 
  ShieldCheck, History, Bell, Send, 
  Layers, Calendar, Calculator, ImageIcon,
  CheckCircle2
} from 'lucide-react'

const TOUR_STEPS = {
  ADMIN: [
    {
      title: "Command Center",
      description: "Welcome to the MIN Dashboard. Here you'll see a global overview of site health, recent forensic changes, and quick management actions.",
      icon: <LayoutDashboard size={24} className="text-primary" />,
      target: "overview"
    },
    {
      title: "Guardians of the Portal",
      description: "As an Admin, you can invite new staff members and manage their roles (Manager, Website Manager, Writer) in the Users section.",
      icon: <ShieldCheck size={24} className="text-green" />,
      target: "users"
    },
    {
      title: "Forensic Audit Trail",
      description: "Every change made by any staff member is recorded in the Audit Log with detailed 'before and after' diffs for total transparency.",
      icon: <History size={24} className="text-coral" />,
      target: "audit"
    },
    {
      title: "Core Infrastructure",
      description: "Control maintenance mode, update branding assets, and synchronize the site's global metadata in the Site Editor.",
      icon: <Globe size={24} className="text-primary" />,
      target: "settings"
    }
  ],
  MANAGER: [
    {
      title: "Talent Acquisition",
      description: "Review volunteer and ambassador applications. Track candidate motivations and manage the intake pipeline for each batch.",
      icon: <Send size={24} className="text-primary" />,
      target: "applications"
    },
    {
      title: "Our Active Force",
      description: "Keep the public Team page fresh. Manage member bios, positions, and seniority status for the entire MIN community.",
      icon: <Users size={24} className="text-green" />,
      target: "team"
    },
    {
      title: "Academic Initiatives",
      description: "Schedule events and update program taglines. Ensure the public roadmap accurately reflects MIN's impact across Nepal.",
      icon: <Calendar size={24} className="text-coral" />,
      target: "events"
    }
  ],
  WEBSITE_MANAGER: [
    {
      title: "Visual Identity",
      description: "Manage the landing page hero sections, mission statements, and institutional stats directly from the Site Editor.",
      icon: <Globe size={24} className="text-primary" />,
      target: "settings"
    },
    {
      title: "Visual Archive",
      description: "Upload high-quality event photos to the Gallery. Our system automatically optimizes them for web performance via Cloudinary.",
      icon: <ImageIcon size={24} className="text-green" />,
      target: "gallery"
    },
    {
      title: "Emergency Alerts",
      description: "Deploy urgent banners and popup notices across specific pages to inform users of critical updates or deadlines.",
      icon: <Bell size={24} className="text-coral" />,
      target: "notices"
    },
    {
      title: "Engagement Flow",
      description: "Build custom intake forms for new programs using our drag-and-drop Dynamic Form Builder.",
      icon: <Layers size={24} className="text-primary" />,
      target: "builder"
    }
  ],
  WRITER: [
    {
      title: "Editorial Suite",
      description: "Publish articles, upload PDFs, and manage the MIN resource library. Support for LaTeX and Rich Text formatting.",
      icon: <Library size={24} className="text-primary" />,
      target: "content"
    },
    {
      title: "Public Submissions",
      description: "Review and audit content submitted by the community. Approve high-quality problems for the public resource bank.",
      icon: <Send size={24} className="text-green" />,
      target: "submissions"
    },
    {
      title: "Olympiad Training",
      description: "Construct DMO Practice sets using our LaTeX question builder. Manage mock exams and verify diagrams for students.",
      icon: <Calculator size={24} className="text-coral" />,
      target: "dmopractice"
    }
  ]
}

export default function OnboardingTour({ role, profileName }) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isVisible, setIsVisible] = useState(true)
  const steps = TOUR_STEPS[role] || TOUR_STEPS.WRITER

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1)
    } else {
      completeOnboarding()
    }
  }

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const completeOnboarding = async () => {
    setIsVisible(false)
    try {
      await fetch('/api/admin/onboarding/complete', { method: 'POST' })
    } catch (err) {
      console.error('Failed to save onboarding status')
    }
  }

  if (!isVisible) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }} 
          className="absolute inset-0 bg-black/60 backdrop-blur-md" 
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }} 
          animate={{ opacity: 1, scale: 1, y: 0 }} 
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-lg glass rounded-[2.5rem] shadow-2xl border border-white/20 bg-white/95 dark:bg-black/90 overflow-hidden"
        >
          <div className="p-8 md:p-10 space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center">
                  <Sparkles size={18} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-text-secondary dark:text-text-secondary-dark">
                  Welcome, {profileName.split(' ')[0]}
                </span>
              </div>
              <button 
                onClick={completeOnboarding}
                className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full text-text-secondary dark:text-text-secondary-dark transition-all"
              >
                <X size={18} />
              </button>
            </div>

            {/* Content */}
            <div className="space-y-6">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 bg-bg-secondary dark:bg-white/5 rounded-2xl flex items-center justify-center shadow-xl border border-border dark:border-white/5">
                  {steps[currentStep].icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-black tracking-tight leading-tight mb-1 text-text-primary dark:text-text-primary-dark">
                    {steps[currentStep].title}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-black uppercase text-primary px-2 py-0.5 bg-primary/10 rounded-md">
                      {role.replace('_', ' ')} Guide
                    </span>
                    <span className="text-[9px] font-black uppercase text-text-secondary dark:text-text-secondary-dark">
                      Step {currentStep + 1} of {steps.length}
                    </span>
                  </div>
                </div>
              </div>
              
              <p className="text-sm leading-relaxed text-text-primary dark:text-text-primary-dark font-medium">
                {steps[currentStep].description}
              </p>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4">
              <div className="flex gap-1.5">
                {steps.map((_, i) => (
                  <div 
                    key={i} 
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      i === currentStep ? 'w-6 bg-primary' : 'w-1.5 bg-border dark:bg-white/10'
                    }`}
                  />
                ))}
              </div>
              
              <div className="flex items-center gap-3">
                {currentStep > 0 && (
                  <button 
                    onClick={handlePrev}
                    className="p-3 glass rounded-xl text-text-tertiary hover:text-text-primary transition-all"
                  >
                    <ChevronLeft size={20} />
                  </button>
                )}
                <button 
                  onClick={handleNext}
                  className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-black text-[11px] uppercase tracking-widest shadow-xl shadow-primary/20 hover:bg-primary-dark transition-all active:scale-95"
                >
                  {currentStep === steps.length - 1 ? (
                    <>Get Started <CheckCircle2 size={16} /></>
                  ) : (
                    <>Continue <ChevronRight size={16} /></>
                  )}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
