import ContactForm from '@/components/public/ContactForm'
import { Sparkle, Envelope, MapPin, Globe } from '@phosphor-icons/react/dist/ssr'

export const metadata = {
  title: 'Contact & Inquiries — Mathematics Initiatives in Nepal',
  description: 'Reach out to Mathematics Initiatives in Nepal (MIN) for inquiries, academic collaborations, and partnership proposals.'
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-bg-dynamic text-dynamic pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-black uppercase tracking-widest">
            <Sparkle size={14} weight="fill" />
            Get In Touch
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-dynamic">
            Contact & Inquiries
          </h1>
          <p className="text-base text-auto-secondary leading-relaxed">
            Have questions about our mathematical training camps, Olympiad resources, or interested in partnering with MIN? Send us a message and our team will get back to you promptly.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Info Side */}
          <div className="lg:col-span-5 space-y-6">
            <div className="glass p-8 rounded-[2.5rem] border border-border dark:border-white/10 space-y-6 shadow-sm">
              <h3 className="text-xl font-black text-dynamic">Organization Headquarters</h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-bg-secondary dark:bg-white/5 border border-border/50">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <MapPin size={20} weight="bold" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-auto-tertiary block">Location</span>
                    <p className="text-xs font-bold text-dynamic">Kathmandu, Nepal</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-2xl bg-bg-secondary dark:bg-white/5 border border-border/50">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Envelope size={20} weight="bold" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-auto-tertiary block">Email Address</span>
                    <a href="mailto:website@mathsinitiatives.org.np" className="text-xs font-bold text-primary hover:underline">
                      website@mathsinitiatives.org.np
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-2xl bg-bg-secondary dark:bg-white/5 border border-border/50">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Globe size={20} weight="bold" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-auto-tertiary block">Website</span>
                    <a href="https://www.mathsinitiatives.org.np" target="_blank" rel="noreferrer" className="text-xs font-bold text-primary hover:underline">
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
