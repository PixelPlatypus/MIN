import { notFound } from 'next/navigation';
import { PdfRenderer } from '@/components/ui/pdf-renderer';

interface CertificatePageProps {
  params: {
    filename: string;
  };
}

export default async function CertificatePage({ params }: CertificatePageProps) {
  const { filename } = await params;

  if (!filename) {
    notFound();
  }

  // Construct the full URL to the PDF hosted on Vercel Blob
  // Assuming the Vercel Blob URL structure is consistent
  const blobUrl = `https://${process.env.NEXT_PUBLIC_VERCEL_BLOB_STORE_ID}.public.blob.vercel-storage.com/${filename}`;  

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-3xl font-bold text-white mb-4">Your Certificate</h1>
      <div className="w-full max-w-3xl h-[80vh] bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <PdfRenderer filePath={blobUrl} />
      </div>
    </div>
  );
}