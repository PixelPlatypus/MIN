import Link from 'next/link';
import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';
import { MinFloatingElements } from '@/components/ui/min-floating-elements';
import { ClientOnly } from '@/components/client-only';
import { PopupNotice } from '@/components/ui/popup-notice';

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen">
      <ClientOnly>
        <MinFloatingElements />
      </ClientOnly>
      <PopupNotice />
      <Navigation />
      <main className="flex flex-grow flex-col items-center justify-center text-white p-4 pt-24 overflow-x-hidden">
        <h1 className="text-6xl md:text-8xl font-bold text-min-accent mb-4 animate-pulse">
          404
        </h1>
        <h2 className="text-2xl md:text-4xl font-semibold text-white mb-8 text-center">
          Page Not Found
        </h2>
        <p className="text-lg md:text-xl text-gray-200 mb-12 text-center max-w-prose">
          Oops! The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <Link href="/" className="btn-min-accent px-8 py-4 rounded-full text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1">
            Go back home
        </Link>
      </main>
      <Footer />
    </div>
  );
}