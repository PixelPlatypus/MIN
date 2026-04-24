'use client'
import { useEffect } from 'react'

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    // Log error to console
    console.error('Next.js Global Fatal Error:', error)

    // Report error to admin via email
    try {
      fetch('/api/report-error', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          errorName: error.name || 'Fatal Global Error',
          errorMessage: error.message,
          errorStack: error.stack,
          url: window.location.href
        })
      }).catch(err => console.error('Failed to send error report:', err))
    } catch (e) {
      console.error('Error reporting logic failed:', e)
    }

    // Auto-redirect after 10 seconds
    const timer = setTimeout(() => {
      window.location.href = '/'
    }, 10000)

    return () => clearTimeout(timer)
  }, [error])

  return (
    <html lang="en">
      <head>
        <title>Critical Error | MIN</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body style={{ 
        backgroundColor: '#050505', 
        color: '#fff', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '100vh', 
        margin: 0, 
        fontFamily: 'system-ui, -apple-system, sans-serif',
        overflow: 'hidden'
      }}>
        {/* Background Mesh */}
        <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '60%', height: '60%', backgroundColor: 'rgba(255, 68, 68, 0.1)', borderRadius: '50%', filter: 'blur(120px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '50%', height: '50%', backgroundColor: 'rgba(22, 85, 109, 0.1)', borderRadius: '50%', filter: 'blur(100px)', pointerEvents: 'none' }} />

        <div style={{ 
          maxWidth: '500px', 
          width: '90%', 
          textAlign: 'center', 
          padding: '3rem', 
          backgroundColor: 'rgba(255, 255, 255, 0.05)', 
          border: '1px solid rgba(255, 255, 255, 0.1)', 
          backdropFilter: 'blur(30px)', 
          WebkitBackdropFilter: 'blur(30px)',
          borderRadius: '3.5rem', 
          boxShadow: '0 32px 64px -16px rgba(0,0,0,0.5)',
          position: 'relative',
          zIndex: 10
        }}>
          <div style={{ color: '#16556D', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.4em', marginBottom: '2.5rem', opacity: 0.8 }}>
            Mathematics Initiatives in Nepal
          </div>

          <div style={{ position: 'relative', margin: '0 auto 2.5rem', width: '100%' }}>
            <div style={{ width: '100%', aspectRatio: '16/9', borderRadius: '2rem', overflow: 'hidden', border: '1px solid rgba(255, 255, 255, 0.1)', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}>
              <img 
                src="/images/404page.gif" 
                alt="Critical error" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <div style={{ position: 'absolute', top: '-1rem', right: '-1rem', backgroundColor: '#ff4444', color: '#fff', width: '3.5rem', height: '3.5rem', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '1.25rem', boxShadow: '0 10px 20px rgba(255, 68, 68, 0.3)', transform: 'rotate(12deg)' }}>
              500
            </div>
          </div>

          <h1 style={{ fontSize: '3rem', fontWeight: '900', margin: '0 0 1rem', letterSpacing: '-0.05em', lineHeight: 0.95 }}>
            Critical <br /> 
            <span style={{ color: '#ff4444' }}>Failure</span>
          </h1>
          
          <p style={{ color: 'rgba(255, 255, 255, 0.5)', marginBottom: '2.5rem', lineHeight: 1.5, fontSize: '0.9rem' }}>
            A fatal error prevented the application from loading. Our technical team has been notified.
          </p>

          <button 
            onClick={() => window.location.reload()}
            style={{ 
              background: '#fff', 
              color: '#000', 
              border: 'none', 
              padding: '16px 32px', 
              borderRadius: '1rem', 
              fontSize: '0.8rem', 
              fontWeight: '900', 
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: '0 10px 20px rgba(255, 255, 255, 0.1)'
            }}
          >
            Reboot System
          </button>
        </div>
      </body>
    </html>
  )
}
