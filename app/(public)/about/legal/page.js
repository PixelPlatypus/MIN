export default function LegalPage() {
  return (
    <div className="pt-28 pb-24 max-w-3xl mx-auto px-6">
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="space-y-4">
          <h1 className="text-headline text-5xl font-bold tracking-tight">Legal Notices</h1>
          <p className="text-text-tertiary-dynamic text-sm">Last Updated: April 2026</p>
        </div>

        <div className="space-y-16">
          <section className="space-y-6">
            <h2 className="text-headline text-3xl font-bold tracking-tight">Organizational Status</h2>
            <p className="text-lg text-text-secondary-dynamic leading-relaxed">
              Mathematics Initiatives in Nepal (MIN) is a registered non-profit organization in
              Kathmandu, Nepal, dedicated to mathematical education and outreach.
            </p>
          </section>

          <section className="space-y-6">
            <h2 className="text-headline text-3xl font-bold tracking-tight">Copyright Notice</h2>
            <p className="text-lg text-text-secondary-dynamic leading-relaxed">
              All content on this website, including but not limited to text, images, logos,
              and educational materials, is the property of MIN and protected by copyright laws.
              Unauthorized use or reproduction is strictly prohibited.
            </p>
          </section>

          <section className="space-y-6">
            <h2 className="text-headline text-3xl font-bold tracking-tight">Liability Disclaimer</h2>
            <p className="text-lg text-text-secondary-dynamic leading-relaxed">
              MIN shall not be held liable for any damages arising from the use of this website
              or the reliance on any information provided herein. Users access the site at
              their own risk.
            </p>
          </section>

          <section className="space-y-6">
            <h2 className="text-headline text-3xl font-bold tracking-tight">Trademarks</h2>
            <p className="text-lg text-text-secondary-dynamic leading-relaxed">
              The MIN logo and brand name are trademarks of Mathematics Initiatives in Nepal.
              Any use of these trademarks without prior written consent is prohibited.
            </p>
          </section>

          <section className="space-y-6">
            <h2 className="text-headline text-3xl font-bold tracking-tight">Governing Law</h2>
            <p className="text-lg text-text-secondary-dynamic leading-relaxed">
              These legal notices and any disputes arising from the use of this website shall
              be governed by the laws of Nepal.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
