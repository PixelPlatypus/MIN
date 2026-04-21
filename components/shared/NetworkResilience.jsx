'use client'
import { useEffect } from 'react'

/**
 * A component that globally patches window.fetch to include resilience 
 * against intermittent network errors, which are common in development 
 * environments like Next.js with Turbopack.
 */
export default function NetworkResilience() {
  useEffect(() => {
    const originalFetch = window.fetch;

    window.fetch = async function(...args) {
      const url = args[0]?.toString() || '';
      const isSupabaseAuth = url.includes('/auth/v1/user') || url.includes('/auth/v1/token');
      
      const maxRetries = isSupabaseAuth ? 1 : 3; // Fewer retries for auth to avoid locking
      const baseDelay = 800;

      for (let i = 0; i <= maxRetries; i++) {
        try {
          if (i > 0) {
            await new Promise(resolve => setTimeout(resolve, baseDelay * i * (Math.random() + 0.5)));
          }
          return await originalFetch(...args);
        } catch (err) {
          const isNetworkError = 
            err.name === 'TypeError' || 
            err.message?.includes('NetworkError') || 
            err.message?.includes('Failed to fetch') ||
            err.message?.includes('network error');

          // If it's a network error, we're online, and we have retries left...
          if (isNetworkError && i < maxRetries && navigator.onLine) {
            // Only log on the first retry to keep console clean, or use debug
            if (i === 0) console.debug(`[NetworkResilience] Initial fetch failed for ${url.split('?')[0]}. Retrying...`);
            continue;
          }
          
          throw err;
        }
      }
    };

    return () => {
      window.fetch = originalFetch;
    };
  }, []);

  return null;
}
