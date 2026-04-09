import Navbar from '@/components/public/Navbar'
import Footer from '@/components/public/Footer'
import PageTransition from '@/components/public/PageTransition'

export default function PublicLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <PageTransition>
          {children}
        </PageTransition>
      </main>
      <Footer />
    </div>
  )
}
