import ContactForm from '@/components/public/ContactForm'
import PageHero from '@/components/public/PageHero'
import { Sparkle, Envelope, MapPin, Globe } from '@phosphor-icons/react/dist/ssr'

export const metadata = {
  title: 'Contact & Inquiries — Mathematics Initiatives in Nepal',
  description: 'Reach out to Mathematics Initiatives in Nepal (MIN) for inquiries, academic collaborations, and partnership proposals.'
}

export default function ContactPage() {
  return (
    <div className="text-dynamic pb-24">
      <PageHero
        eyebrow="Get In Touch"
        icon={<Sparkle size={14} weight="fill" />}
        title="Contact & Inquiries"
        description="Have questions about our mathematical training camps, Olympiad resources, or interested in partnering with MIN? Send us a message and our team will get back to you promptly."
      />

      <div className="container mx-auto px-6 max-w-6xl animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Info Side */}
          <div className="lg:col-span-5 space-y-6">
            <div className="card-brand p-6 sm:p-8 space-y-6">
              <h3 className="text-xl font-black text-dynamic">Organization Headquarters</h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-primary/[0.04] dark:bg-white/5 border border-primary/10 dark:border-white/10">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 dark:bg-white/10 text-primary flex items-center justify-center shrink-0">
                    <MapPin size={20} weight="bold" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-black uppercase tracking-wider text-auto-tertiary block">Location</span>
                    <p className="text-xs font-bold text-dynamic">Kathmandu, Nepal</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-2xl bg-primary/[0.04] dark:bg-white/5 border border-primary/10 dark:border-white/10">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 dark:bg-white/10 text-primary flex items-center justify-center shrink-0">
                    <Envelope size={20} weight="bold" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-black uppercase tracking-wider text-auto-tertiary block">Email Address</span>
                    <a href="mailto:website@mathsinitiatives.org.np" className="text-xs font-bold text-primary hover:underline break-all">
                      website@mathsinitiatives.org.np
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-2xl bg-primary/[0.04] dark:bg-white/5 border border-primary/10 dark:border-white/10">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 dark:bg-white/10 text-primary flex items-center justify-center shrink-0">
                    <Globe size={20} weight="bold" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-black uppercase tracking-wider text-auto-tertiary block">Website</span>
                    <a href="https://www.mathsinitiatives.org.np" target="_blank" rel="noreferrer" className="text-xs font-bold text-primary hover:underline break-all">
                      mathsinitiatives.org.np
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form Side */}
          <div className="lg:col-span-7">
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  )
}
