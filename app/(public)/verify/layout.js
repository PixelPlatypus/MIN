export const metadata = {
  title: 'Verify Certificate',
  description: 'Instantly verify the authenticity of any Mathematics Initiatives in Nepal (MIN) certificate by entering the certificate ID or scanning the QR code.',
  keywords: ['Verify Certificate', 'MIN Certificate', 'Nepal Math Certificate', 'Certificate Verification', 'Mathematics Initiatives Nepal'],
  openGraph: {
    title: 'Certificate Verification | MIN',
    description: 'Instantly verify the authenticity of any MIN certificate by entering the certificate ID.',
    images: [{ url: '/images/og-default.png', width: 1200, height: 630, alt: 'Certificate Verification — MIN' }],
  },
  alternates: { canonical: '/verify' },
}

export default function Layout({ children }) {
  return children
}
