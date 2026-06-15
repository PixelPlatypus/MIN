// app/(public)/verify/[id]/page.js
import { createAdminClient } from '@/lib/supabase/server'
import { headers } from 'next/headers'
import Link from 'next/link'
import { ShieldCheck, ShieldWarning, Warning, ArrowLeft, DownloadSimple, Check, Globe, Trophy } from '@phosphor-icons/react/dist/ssr'

export async function generateMetadata({ params }) {
  const { id } = await params
  return {
    title: `Verify Certificate - MIN Nepal`,
    description: `Certificate Verification Portal. ID: ${id}`,
  }
}

export default async function VerifyDetailPage({ params }) {
  const { id } = await params
  const adminSupabase = await createAdminClient()

  // Fetch certificate details by cert_uuid
  const { data: cert, error } = await adminSupabase
    .from('certificates')
    .select('*, events(title, certificates_enabled)')
    .eq('cert_uuid', id)
    .single()

  // 1. Not Found
  if (error || !cert) {
    return <ErrorState message="Certificate Not Found" description="The verification ID does not match any certificate in our registry. Please check the spelling or format." />
  }

  // 2. Draft / Hidden
  if (!cert.is_visible) {
    return <ErrorState message="Certificate Draft / Hidden" description="This certificate exists but has not been published or made visible by administrators yet." />
  }

  // 3. Revoked Certificate
  if (!cert.is_valid) {
    return (
      <VerificationWrapper cert={cert} status="REVOKED">
        <div className="glass rounded-[2rem] p-8 border border-coral/30 bg-coral/5 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-coral/10 border border-coral/20 flex items-center justify-center mx-auto text-coral">
            <ShieldWarning size={32} weight="duotone" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-coral">Certificate Revoked</h3>
            <p className="text-xs text-auto-secondary max-w-sm mx-auto">
              This certificate has been explicitly revoked by MIN administrators and is no longer valid.
            </p>
          </div>
        </div>
      </VerificationWrapper>
    )
  }

  // 4. Expired Certificate
  const isExpired = cert.expiry_date && new Date(cert.expiry_date) < new Date()
  if (isExpired) {
    return (
      <VerificationWrapper cert={cert} status="EXPIRED">
        <div className="glass rounded-[2rem] p-8 border border-amber-500/30 bg-amber-500/5 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto text-amber-500">
            <Warning size={32} weight="duotone" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-amber-500">Certificate Expired</h3>
            <p className="text-xs text-auto-secondary max-w-sm mx-auto">
              This certificate was valid but has passed its expiry date of{' '}
              {new Date(cert.expiry_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}.
            </p>
          </div>
        </div>
      </VerificationWrapper>
    )
  }

  // 5. Event suspended
  const isEventSuspended = cert.event_id && cert.events && !cert.events.certificates_enabled
  if (isEventSuspended) {
    return (
      <VerificationWrapper cert={cert} status="SUSPENDED">
        <div className="glass rounded-[2rem] p-8 border border-amber-500/30 bg-amber-500/5 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto text-amber-500">
            <Warning size={32} weight="duotone" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-amber-500">Verification Suspended</h3>
            <p className="text-xs text-auto-secondary max-w-sm mx-auto">
              Certificate verification for event "{cert.events?.title || cert.event_name}" is temporarily suspended.
            </p>
          </div>
        </div>
      </VerificationWrapper>
    )
  }


  // 5. Valid Certificate
  return (
    <VerificationWrapper cert={cert} status="VALID">
      <div className="glass rounded-[2rem] p-8 border border-green/30 bg-green/5 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-green/10 border border-green/20 flex items-center justify-center mx-auto text-green">
          <ShieldCheck size={32} weight="duotone" />
        </div>
        <div className="space-y-1">
          <h3 className="text-xl font-bold text-green">Authentic Credential Verified</h3>
          <p className="text-xs text-auto-secondary max-w-sm mx-auto">
            This certificate is a verified, authentic document issued by Mathematics Initiatives in Nepal.
          </p>
        </div>
      </div>
    </VerificationWrapper>
  )
}

function ErrorState({ message, description }) {
  return (
    <div className="min-h-[70vh] flex items-center justify-center py-20 px-6">
      <div className="max-w-md w-full text-center space-y-6 glass rounded-[2.5rem] p-10 border border-border dark:border-border-dark shadow-xl">
        <div className="w-16 h-16 rounded-full bg-coral/10 border border-coral/20 flex items-center justify-center mx-auto text-coral">
          <ShieldWarning size={32} weight="duotone" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">{message}</h2>
          <p className="text-xs text-auto-secondary leading-relaxed">{description}</p>
        </div>
        <div className="pt-4">
          <Link 
            href="/verify"
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-bold text-xs px-6 py-3 rounded-xl transition-all shadow-md shadow-primary/10"
          >
            <ArrowLeft size={14} />
            Go to Search Portal
          </Link>
        </div>
      </div>
    </div>
  )
}

async function VerificationWrapper({ cert, status, children }) {
  const headerList = await headers()
  const host = headerList.get('host') || 'mathsinitiatives.org.np'
  const xForwardedProto = headerList.get('x-forwarded-proto')
  const protocol = xForwardedProto || (
    host.includes('localhost') || 
    host.includes('127.0.0.1') || 
    host.includes('192.168.') || 
    host.includes('10.') || 
    host.includes(':3000')
      ? 'http'
      : 'https'
  )
  const verificationUrl = `${protocol}://${host}/verify/${cert.cert_uuid}`
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(verificationUrl)}`
  const isPdf = cert.pdf_url?.toLowerCase().endsWith('.pdf')

  return (
    <div className="container mx-auto px-6 py-24 space-y-12">
      <div className="flex items-center gap-4">
        <Link 
          href="/verify"
          className="p-2 rounded-xl bg-bg-secondary dark:bg-white/5 hover:bg-bg-tertiary dark:hover:bg-white/10 transition-all text-auto-tertiary hover:text-primary-dark dark:duration-75"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <span className="text-[10px] text-primary font-bold uppercase tracking-widest">Verification Result</span>
          <h2 className="text-2xl font-bold tracking-tight">Credential Certificate</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Verification Status Sidebar */}
        <div className="space-y-8 lg:col-span-1">
          {children}

          {/* Details Card */}
          <div className="glass rounded-[2rem] p-8 space-y-6 border border-border dark:border-border-dark">
            <h4 className="font-bold text-sm border-b border-border pb-3">Credential Details</h4>
            
            <div className="space-y-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-auto-tertiary block">Recipient Name</span>
                <span className="text-sm font-bold text-auto-primary">{cert.recipient_name}</span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-auto-tertiary block">Event Name</span>
                <span className="text-sm font-semibold text-auto-secondary">{cert.event_name || 'N/A'}</span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-auto-tertiary block">Program</span>
                <span className="text-xs font-medium text-auto-secondary font-mono">{cert.program_name}</span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-auto-tertiary block">Date of Issue</span>
                <span className="text-sm font-medium text-auto-secondary">
                  {new Date(cert.issued_date).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </span>
              </div>

              {cert.expiry_date && (
                <div>
                  <span className="text-[10px] uppercase font-bold text-auto-tertiary block">Expiry Date</span>
                  <span className="text-sm font-medium text-auto-secondary">
                    {new Date(cert.expiry_date).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                </div>
              )}

              <div>
                <span className="text-[10px] uppercase font-bold text-auto-tertiary block">Verification ID</span>
                <span className="text-[10px] font-mono text-auto-tertiary block select-all break-all bg-bg-secondary dark:bg-white/5 p-2 rounded-lg border border-border mt-1">
                  {cert.cert_uuid}
                </span>
              </div>
            </div>
          </div>

          {/* QR Code Card */}
          {status === 'VALID' && (
            <div className="glass rounded-[2rem] p-6 border border-border text-center space-y-4 flex flex-col items-center">
              <img 
                src={qrCodeUrl} 
                alt="Verification QR Code" 
                className="w-44 h-44 object-contain rounded-2xl border border-border p-2 bg-white"
              />
              <div className="space-y-1">
                <span className="text-xs font-bold block">Quick Verification QR Code</span>
                <span className="text-[10px] text-auto-tertiary leading-relaxed block px-4">
                  Scan this code with a mobile device to instantly verify this credential online.
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Certificate Preview Pane */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-sm">Certificate Document Preview</h4>
            {cert.pdf_url && (
              <a 
                href={cert.pdf_url} 
                download
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-bg-secondary dark:bg-white/5 border border-border hover:bg-bg-tertiary dark:hover:bg-white/10 px-4 py-2 rounded-xl text-xs font-bold transition-all text-auto-secondary"
              >
                <DownloadSimple size={14} />
                Open / Download File
              </a>
            )}
          </div>

          <div className="glass rounded-[2rem] p-4 border border-border dark:border-border-dark overflow-hidden flex items-center justify-center bg-black/5 dark:bg-white/5 relative min-h-[300px]">
            {cert.pdf_url ? (
              isPdf ? (
                <iframe 
                  src={`${cert.pdf_url}#toolbar=0`} 
                  className="w-full aspect-[4/3] sm:aspect-[1.414] rounded-2xl border-0" 
                  title="Certificate PDF Preview"
                />
              ) : (
                <img 
                  src={cert.pdf_url} 
                  alt={`${cert.recipient_name} Certificate`} 
                  className="w-full rounded-2xl border border-border object-contain max-h-[80vh]" 
                />
              )
            ) : (
              <div className="text-center py-20 text-auto-tertiary space-y-2">
                <Trophy size={48} className="mx-auto opacity-20" />
                <p className="text-xs font-medium">No document file preview available.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
