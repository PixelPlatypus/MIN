"use client"

'use client';

import { useState, useRef, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

interface PdfRendererProps {
  filePath: string;
  className?: string;
}

export const PdfRenderer = ({ filePath, className = '' }: PdfRendererProps) => {
  const [numPages, setNumPages] = useState<number>();
  const [pageNumber, setPageNumber] = useState<number>(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number>(0);

  useEffect(() => {
    pdfjs.GlobalWorkerOptions.workerSrc = new URL(
      'pdfjs-dist/build/pdf.worker.min.mjs',
      import.meta.url,
    ).toString();

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
            className="w-full flex justify-center items-center"
          >
            <Page pageNumber={pageNumber} width={containerWidth} />
          </Document>
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
