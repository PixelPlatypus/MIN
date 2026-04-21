/**
 * A robust fetch wrapper that handles common network issues,
 * implement retries, and properly handles timeouts.
 * Use this to eliminate "NetworkError" issues in the browser.
 */

export async function safeFetch(url, options = {}) {
  const {
    retries = 3,
    backoff = 300,
    timeout = 10000,
    ...fetchOptions
  } = options;

  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  let lastError;

  for (let i = 0; i <= retries; i++) {
    try {
      if (i > 0) {
        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, backoff * i));
      }

      const response = await fetch(url, {
        ...fetchOptions,
        signal: controller.signal
      });

      clearTimeout(id);
      return response;
    } catch (err) {
      lastError = err;
      
      // Only retry on network errors or specifically if the name is 'TypeError' (which often maps to NetworkError)
      // and not on AbortErrors (which are intentional)
      const isNetworkError = 
        err.name === 'TypeError' || 
        err.message?.includes('NetworkError') || 
        err.message?.includes('Failed to fetch');

      if (!isNetworkError || i === retries) {
        break;
      }
      
      console.warn(`[safeFetch] Attempt ${i + 1} failed, retrying...`, url);
    }
  }

  clearTimeout(id);
  throw lastError;
}
