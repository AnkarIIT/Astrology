// Minimal Google Analytics 4 loader. No-op unless VITE_GA_ID is configured.

const GA_ID = import.meta.env.VITE_GA_ID as string | undefined;

type GtagArgs = unknown[];

function gtag(...args: GtagArgs) {
  const w = window as unknown as { dataLayer?: GtagArgs[]; gtag?: (...a: GtagArgs) => void };
  w.dataLayer = w.dataLayer || [];
  w.dataLayer.push(args);
}

export function initAnalytics() {
  if (!GA_ID || document.querySelector(`script[data-ga-id]`)) return;
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  script.dataset.gaId = GA_ID;
  document.head.appendChild(script);
  gtag("js", new Date());
  gtag("config", GA_ID);
}

export function trackPageView(path: string) {
  if (!GA_ID) return;
  gtag("event", "page_view", { page_path: path, page_title: document.title });
}
