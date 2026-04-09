export default function CookiesPage() {
  return (
    <div className="pt-32 pb-24 container mx-auto px-6 max-w-4xl">
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="space-y-4">
          <h1 className="text-5xl font-bold tracking-tight">Cookie Policy</h1>
          <p className="text-text-tertiary text-sm">Last Updated: April 2026</p>
        </div>

        <div className="prose dark:prose-invert max-w-none space-y-12">
          <section className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight text-primary">What Are Cookies?</h2>
            <p className="text-lg text-text-secondary dark:text-text-secondary-dark leading-relaxed">
              Cookies are small text files placed on your device by a website. We use cookies 
              to provide essential website functions, remember your preferences, and analyze 
              site traffic.
            </p>
          </section>

          <section className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight text-primary">Types of Cookies We Use</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="glass p-8 rounded-3xl space-y-4">
                <h3 className="text-xl font-bold">Essential Cookies</h3>
                <p className="text-sm text-text-secondary dark:text-text-secondary-dark">
                  These cookies are necessary for the website to function correctly, including 
                  maintaining your login session and theme preferences.
                </p>
              </div>
              <div className="glass p-8 rounded-3xl space-y-4">
                <h3 className="text-xl font-bold">Analytics Cookies</h3>
                <p className="text-sm text-text-secondary dark:text-text-secondary-dark">
                  We use PostHog analytics cookies to understand how visitors interact with our 
                  site and improve our content and services.
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight text-primary">Managing Your Preferences</h2>
            <p className="text-lg text-text-secondary dark:text-text-secondary-dark leading-relaxed">
              Most web browsers allow you to control cookies through their settings. You can 
              choose to block or delete cookies at any time, but some website features 
              may not function correctly as a result.
            </p>
          </section>

          <section className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight text-primary">Third-Party Cookies</h2>
            <p className="text-lg text-text-secondary dark:text-text-secondary-dark leading-relaxed">
              We may use third-party services like PostHog and Cloudinary that may set 
              cookies on your device. These cookies are subject to the privacy policies of 
              their respective providers.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
