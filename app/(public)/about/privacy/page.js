export default function PrivacyPage() {
  return (
    <div className="pt-28 pb-24 max-w-3xl mx-auto px-6">
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="space-y-4">
          <h1 className="text-headline text-5xl font-bold tracking-tight">Privacy Policy</h1>
          <p className="text-text-tertiary-dynamic text-sm">Last Updated: April 2026</p>
        </div>

        <div className="space-y-16">
          <section className="space-y-6">
            <h2 className="text-headline text-3xl font-bold tracking-tight">Introduction</h2>
            <p className="text-lg text-text-secondary-dynamic leading-relaxed">
              At Mathematics Initiatives in Nepal (MIN), we are committed to protecting your privacy. This Privacy Policy
              explains how we collect, use, and safeguard your personal information when you visit our website
              (mathsinitiatives.org.np) or interact with our services.
            </p>
          </section>

          <section className="space-y-6">
            <h2 className="text-headline text-3xl font-bold tracking-tight">Information We Collect</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-surface rounded-2xl p-8 border border-border space-y-4">
                <h3 className="text-headline text-xl font-bold">Personal Information</h3>
                <p className="text-sm text-text-secondary-dynamic">
                  We may collect your name, email address, phone number, and other details when you apply for
                  volunteering, submit content, or contact us.
                </p>
              </div>
              <div className="bg-surface rounded-2xl p-8 border border-border space-y-4">
                <h3 className="text-headline text-xl font-bold">Usage Data</h3>
                <p className="text-sm text-text-secondary-dynamic">
                  We collect information about how you interact with our website, including IP addresses,
                  browser types, and page views, using PostHog analytics.
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-headline text-3xl font-bold tracking-tight">How We Use Your Information</h2>
            <ul className="space-y-4 text-text-secondary-dynamic leading-relaxed" style={{ listStyle: 'disc', paddingLeft: '1.5rem' }}>
              <li>To provide and improve our educational services.</li>
              <li>To communicate with you regarding your applications or inquiries.</li>
              <li>To analyze website performance and user engagement.</li>
              <li>To issue and verify certificates of achievement.</li>
            </ul>
          </section>

          <section className="space-y-6">
            <h2 className="text-headline text-3xl font-bold tracking-tight">Data Security</h2>
            <p className="text-lg text-text-secondary-dynamic leading-relaxed">
              We implement industry-standard security measures to protect your data. All sensitive information
              is handled through secure channels, and we do not sell your personal data to third parties.
            </p>
          </section>

          <section className="space-y-6">
            <h2 className="text-headline text-3xl font-bold tracking-tight">Contact Us</h2>
            <p className="text-lg text-text-secondary-dynamic leading-relaxed">
              If you have any questions about this Privacy Policy, please contact us at
              <a href="mailto:contact@mathsinitiatives.org.np" className="text-headline hover:underline ml-1">contact@mathsinitiatives.org.np</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
