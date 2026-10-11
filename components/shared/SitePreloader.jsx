// First-visit intro, CSS only. It is server-rendered and plays on its own, so it needs no JS
// and never waits for hydration. The inline script in app/layout.js adds `.preloaded` to <html>
// (hiding it before first paint) on repeat visits in a session and on admin/login routes.
export default function SitePreloader() {
  return (
    <div className="site-preloader" aria-hidden="true">
      <div className="site-preloader-grid" />
      <div className="site-preloader-dial">
        <svg className="site-preloader-ring" viewBox="0 0 256 256">
          <circle cx="128" cy="128" r="120" pathLength="100" />
        </svg>
        <div className="site-preloader-hand"><span /></div>
        <div className="site-preloader-count" />
        <div className="site-preloader-logo">
          <div className="site-preloader-wordmark">MIN</div>
          <p>Nepal</p>
        </div>
      </div>
    </div>
  )
}
