declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

// Fires a GA4 pageview for the given SPA route. index.html sets
// send_page_view: false on the initial gtag config, so this is the only
// thing that ever reports a pageview — call it on first load and on every
// client-side route change so per-page traffic shows up in GA.
export function trackPageview(path: string) {
  if (typeof window.gtag !== 'function') return;
  window.gtag('event', 'page_view', {
    page_path: path,
    page_location: window.location.href,
    page_title: document.title,
  });
}
