export default function TermsPage() {
  return (
    <div className="pt-28 pb-24 max-w-3xl mx-auto px-6">
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="space-y-4">
          <h1 className="text-headline text-5xl font-bold tracking-tight">Terms of Use</h1>
          <p className="text-text-tertiary-dynamic text-sm">Last Updated: April 2026</p>
        </div>

        <div className="space-y-16">
          <section className="space-y-6">
            <h2 className="text-headline text-3xl font-bold tracking-tight">Agreement to Terms</h2>
            <p className="text-lg text-text-secondary-dynamic leading-relaxed">
              By accessing or using the website of Mathematics Initiatives in Nepal (MIN),
              you agree to comply with and be bound by these Terms of Use.
            </p>
          </section>

          <section className="space-y-6">
            <h2 className="text-headline text-3xl font-bold tracking-tight">Use of Content</h2>
            <p className="text-lg text-text-secondary-dynamic leading-relaxed">
              The content on this website, including text, images, and educational materials,
              is for personal and non-commercial use only. You may not reproduce or distribute
              any content without explicit permission from MIN.
            </p>
          </section>

          <section className="space-y-6">
            <h2 className="text-headline text-3xl font-bold tracking-tight">User Submissions</h2>
            <p className="text-lg text-text-secondary-dynamic leading-relaxed">
              By submitting content or applications to MIN, you grant us a non-exclusive,
              royalty-free right to use and display your submission for educational and promotional
              purposes related to our mission.
            </p>
          </section>

          <section className="space-y-6">
            <h2 className="text-headline text-3xl font-bold tracking-tight">Disclaimers</h2>
            <p className="text-lg text-text-secondary-dynamic leading-relaxed">
              MIN provides educational content on an &ldquo;as-is&rdquo; basis. We make no warranties
              regarding the accuracy or completeness of the information provided on our website.
            </p>
          </section>

          <section className="space-y-6">
            <h2 className="text-headline text-3xl font-bold tracking-tight">Modifications</h2>
            <p className="text-lg text-text-secondary-dynamic leading-relaxed">
              We reserve the right to modify these Terms of Use at any time. Your continued
              use of the website constitutes acceptance of the modified terms.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
