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
    <html>
      <head>
        <title>Critical Error | MIN</title>
      </head>
      <body style={{ backgroundColor: '#000', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', margin: 0, fontFamily: 'system-ui, sans-serif' }}>
        <div style={{ textAlign: 'center', maxWidth: '500px', padding: '2rem' }}>
          <h1 style={{ fontSize: '4rem', margin: 0, color: '#ff4444' }}>500</h1>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>Critical System Failure</h2>
          <p style={{ color: '#aaa', marginBottom: '2rem', lineHeight: 1.5 }}>
            A fatal error prevented the application from loading. Our technical team has been automatically notified and will investigate immediately.
          </p>
          <button 
            onClick={() => window.location.reload()}
            style={{ 
              background: '#fff', 
              color: '#000', 
              border: 'none', 
              padding: '12px 24px', 
              borderRadius: '8px', 
              fontSize: '1rem', 
              fontWeight: 'bold', 
              cursor: 'pointer' 
            }}
          >
            Reload Page
          </button>
        </div>
      </body>
    </html>
  )
}
