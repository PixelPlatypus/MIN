export default function TermsPage() {
  return (
    <div className="pt-32 pb-24 container mx-auto px-6 max-w-4xl">
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="space-y-4">
          <h1 className="text-5xl font-bold tracking-tight">Terms of Use</h1>
          <p className="text-text-tertiary text-sm">Last Updated: April 2026</p>
        </div>

        <div className="prose dark:prose-invert max-w-none space-y-12">
          <section className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight text-primary">Agreement to Terms</h2>
            <p className="text-lg text-text-secondary dark:text-text-secondary-dark leading-relaxed">
              By accessing or using the website of Mathematics Initiatives in Nepal (MIN), 
              you agree to comply with and be bound by these Terms of Use.
            </p>
          </section>

          <section className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight text-primary">Use of Content</h2>
            <p className="text-lg text-text-secondary dark:text-text-secondary-dark leading-relaxed">
              The content on this website, including text, images, and educational materials, 
              is for personal and non-commercial use only. You may not reproduce or distribute 
              any content without explicit permission from MIN.
            </p>
          </section>

          <section className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight text-primary">User Submissions</h2>
            <p className="text-lg text-text-secondary dark:text-text-secondary-dark leading-relaxed">
              By submitting content or applications to MIN, you grant us a non-exclusive, 
              royalty-free right to use and display your submission for educational and promotional 
              purposes related to our mission.
            </p>
          </section>

          <section className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight text-primary">Disclaimers</h2>
            <p className="text-lg text-text-secondary dark:text-text-secondary-dark leading-relaxed">
              MIN provides educational content on an "as-is" basis. We make no warranties 
              regarding the accuracy or completeness of the information provided on our website.
            </p>
          </section>

          <section className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight text-primary">Modifications</h2>
            <p className="text-lg text-text-secondary dark:text-text-secondary-dark leading-relaxed">
              We reserve the right to modify these Terms of Use at any time. Your continued 
              use of the website constitutes acceptance of the modified terms.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
