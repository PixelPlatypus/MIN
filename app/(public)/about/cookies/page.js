export default function CookiesPage() {
  return (
    <div className="pt-28 pb-24 max-w-3xl mx-auto px-6">
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="space-y-4">
          <h1 className="text-headline text-5xl font-bold tracking-tight">Cookie Policy</h1>
          <p className="text-text-tertiary-dynamic text-sm">Last Updated: April 2026</p>
        </div>

        <div className="space-y-16">
          <section className="space-y-6">
            <h2 className="text-headline text-3xl font-bold tracking-tight">What Are Cookies?</h2>
            <p className="text-lg text-text-secondary-dynamic leading-relaxed">
              Cookies are small text files placed on your device by a website. We use cookies
              to provide essential website functions, remember your preferences, and analyze
              site traffic.
            </p>
          </section>

          <section className="space-y-6">
            <h2 className="text-headline text-3xl font-bold tracking-tight">Types of Cookies We Use</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-surface rounded-2xl p-8 border border-border space-y-4">
                <h3 className="text-headline text-xl font-bold">Essential Cookies</h3>
                <p className="text-sm text-text-secondary-dynamic">
                  These cookies are necessary for the website to function correctly, including
                  maintaining your login session and theme preferences.
                </p>
              </div>
              <div className="bg-surface rounded-2xl p-8 border border-border space-y-4">
                <h3 className="text-headline text-xl font-bold">Analytics Cookies</h3>
                <p className="text-sm text-text-secondary-dynamic">
                  We use PostHog analytics cookies to understand how visitors interact with our
                  site and improve our content and services.
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-headline text-3xl font-bold tracking-tight">Managing Your Preferences</h2>
            <p className="text-lg text-text-secondary-dynamic leading-relaxed">
              Most web browsers allow you to control cookies through their settings. You can
              choose to block or delete cookies at any time, but some website features
              may not function correctly as a result.
            </p>
          </section>

          <section className="space-y-6">
            <h2 className="text-headline text-3xl font-bold tracking-tight">Third-Party Cookies</h2>
            <p className="text-lg text-text-secondary-dynamic leading-relaxed">
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
