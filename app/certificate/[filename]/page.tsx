"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { CertificatePdfRenderer } from "@/components/ui/certificate-pdf-renderer";

interface CertificatePageProps {
  params: {
    filename: string;
  };
}

export default function CertificatePage({ params }: CertificatePageProps) {
  const router = useRouter();
  const { filename } = params;

  if (!filename) {
    router.push('/404');
    return null; // Or a loading indicator, or an empty div
  }

  const handlePdfError = () => {
    router.push(
      `https://xynhlm2rf2pfqxaz.public.blob.vercel-storage.com/${filename}`
    );
  };

  // Construct the full URL to the PDF hosted on Vercel Blob
  // Assuming the Vercel Blob URL structure is consistent
  const blobUrl = `https://${process.env.NEXT_PUBLIC_VERCEL_BLOB_STORE_ID}.public.blob.vercel-storage.com/${filename}`;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-3xl font-bold text-white mb-4">Your Certificate</h1>
      <div className="w-full max-w-3xl h-[80vh] bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <CertificatePdfRenderer filePath={blobUrl} onLoadError={handlePdfError} />
      </div>
    </div>
  );
}