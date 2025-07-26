'use client';

import dynamic from 'next/dynamic';

const DynamicPdfRenderer = dynamic(() => import('./pdf-renderer').then(mod => mod.PdfRenderer), { ssr: false });

interface ClientPdfRendererProps {
  filePath: string;
  className?: string;
}

export const ClientPdfRenderer: React.FC<ClientPdfRendererProps> = ({ filePath, className }) => {
  return <DynamicPdfRenderer filePath={filePath} className={className} />;
};