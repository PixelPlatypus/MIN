'use client';

import { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import dynamic from 'next/dynamic';
import { pdfjs } from 'react-pdf';

const Document = dynamic(() => import('react-pdf').then((mod) => mod.Document), {
  ssr: false,
});
const Page = dynamic(() => import('react-pdf').then((mod) => mod.Page), {
  ssr: false,
});

interface CertificatePdfRendererProps {
  filePath: string;
  className?: string;
  onLoadError?: (error: Error) => void;
}

export const CertificatePdfRenderer = ({ filePath, className = '', onLoadError }: CertificatePdfRendererProps) => {
  const [numPages, setNumPages] = useState<number>();
  const [pageNumber, setPageNumber] = useState<number>(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number>(0);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      pdfjs.GlobalWorkerOptions.workerSrc = new URL(
        'pdfjs-dist/build/pdf.worker.min.mjs',
        import.meta.url,
      ).toString();
    }

    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth);
      }
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
    setPageNumber(1); // Reset to first page on new document load
  }

  const goToNextPage = () =>
    setPageNumber((prevPageNumber) => prevPageNumber + 1);

  const goToPrevPage = () =>
    setPageNumber((prevPageNumber) => prevPageNumber - 1);

  if (!filePath) {
    return <p className="text-white/70">No file path provided for PDF display.</p>;
  }

  return (
    <div ref={containerRef} className={`my-4 ${className}`} style={{ height: '100%' }}>
      <div className="flex flex-col items-center h-full overflow-hidden">
        {containerWidth > 0 && (
          <Document
            file={filePath}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onLoadError}
            className="w-full flex justify-center items-center h-full"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={pageNumber}
                initial={{ opacity: 0, rotateY: 90, x: pageNumber > (pageNumber - 1) ? 100 : -100 }}
                animate={{ opacity: 1, rotateY: 0, x: 0 }}
                exit={{ opacity: 0, rotateY: -90, x: pageNumber > (pageNumber - 1) ? -100 : 100 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="w-full h-full flex justify-center items-center perspective-1000"
              >
                <Page pageNumber={pageNumber} width={containerWidth} />
              </motion.div>
            </AnimatePresence>
          </Document>
        )}
        {numPages && (
          <button
            onClick={goToPrevPage}
            disabled={pageNumber <= 1}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 px-4 py-2 rounded-md bg-black/30 backdrop-blur-md border border-white/20 disabled:opacity-50"
          >
            <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-transparent bg-clip-text">&larr;</span>
          </button>
        )}
        {numPages && (
          <button
            onClick={goToNextPage}
            disabled={pageNumber >= numPages}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 px-4 py-2 rounded-md bg-black/30 backdrop-blur-md border border-white/20 disabled:opacity-50"
          >
            <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-transparent bg-clip-text">&rarr;</span>
          </button>
        )}
        {numPages && (
          <div className="flex items-center justify-center mt-4 space-x-4">
            <button
              onClick={goToPrevPage}
              disabled={pageNumber <= 1}
              className="px-4 py-2 rounded-md bg-white/10 backdrop-blur-md border border-white/20 text-white disabled:opacity-50"
            >
              Previous
            </button>
            <p className="text-white">
              Page {pageNumber} of {numPages}
            </p>
            <button
              onClick={goToNextPage}
              disabled={pageNumber >= numPages}
              className="px-4 py-2 rounded-md bg-white/10 backdrop-blur-md border border-white/20 text-white disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};