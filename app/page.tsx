"use client"


import { MinFloatingElements } from "@/components/ui/min-floating-elements"
import { ClientOnly } from "@/components/client-only"
import { PopupNotice } from "@/components/ui/popup-notice"
import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/sections/hero-section"
import { StorySection } from "@/components/sections/story-section"
import { AchievementsSection } from "@/components/sections/achievements-section"
import { ProgramsSection } from "@/components/sections/programs-section"
import { ContactSection } from "@/components/sections/contact-section"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <div className="overflow-x-hidden">

      <ClientOnly>
        <MinFloatingElements />
      </ClientOnly>
      <PopupNotice />
      <Navigation />
      <HeroSection />
      <StorySection />
      <AchievementsSection />
      <ProgramsSection />
      <ContactSection />
      <Footer />
    </div>
  )
}
