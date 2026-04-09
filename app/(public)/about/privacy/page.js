import { motion } from 'framer-motion'

export default function PrivacyPage() {
  return (
    <div className="pt-32 pb-24 container mx-auto px-6 max-w-4xl">
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="space-y-4">
          <h1 className="text-5xl font-bold tracking-tight">Privacy Policy</h1>
          <p className="text-text-tertiary text-sm">Last Updated: April 2026</p>
        </div>

        <div className="prose dark:prose-invert max-w-none space-y-12">
          <section className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight text-primary">Introduction</h2>
            <p className="text-lg text-text-secondary dark:text-text-secondary-dark leading-relaxed">
              At Mathematics Initiatives in Nepal (MIN), we are committed to protecting your privacy. This Privacy Policy 
              explains how we collect, use, and safeguard your personal information when you visit our website 
              (mathsinitiatives.org.np) or interact with our services.
            </p>
          </section>

          <section className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight text-primary">Information We Collect</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="glass p-8 rounded-3xl space-y-4">
                <h3 className="text-xl font-bold">Personal Information</h3>
                <p className="text-sm text-text-secondary dark:text-text-secondary-dark">
                  We may collect your name, email address, phone number, and other details when you apply for 
                  volunteering, submit content, or contact us.
                </p>
              </div>
              <div className="glass p-8 rounded-3xl space-y-4">
                <h3 className="text-xl font-bold">Usage Data</h3>
                <p className="text-sm text-text-secondary dark:text-text-secondary-dark">
                  We collect information about how you interact with our website, including IP addresses, 
                  browser types, and page views, using PostHog analytics.
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight text-primary">How We Use Your Information</h2>
            <ul className="space-y-4 list-disc list-inside text-text-secondary dark:text-text-secondary-dark leading-relaxed">
              <li>To provide and improve our educational services.</li>
              <li>To communicate with you regarding your applications or inquiries.</li>
              <li>To analyze website performance and user engagement.</li>
              <li>To issue and verify certificates of achievement.</li>
            </ul>
          </section>

          <section className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight text-primary">Data Security</h2>
            <p className="text-lg text-text-secondary dark:text-text-secondary-dark leading-relaxed">
              We implement industry-standard security measures to protect your data. All sensitive information 
              is handled through secure channels, and we do not sell your personal data to third parties.
            </p>
          </section>

          <section className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight text-primary">Contact Us</h2>
            <p className="text-lg text-text-secondary dark:text-text-secondary-dark leading-relaxed">
              If you have any questions about this Privacy Policy, please contact us at 
              <a href="mailto:contact@mathsinitiatives.org.np" className="text-primary hover:underline ml-1">contact@mathsinitiatives.org.np</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
