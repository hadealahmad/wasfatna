// Single owner of the analytics consent decision, and the only code allowed to
// load Google Analytics. Ported from SyrianZone's Lib/analyticsConsent.ts.
//
// The measurement id arrives as `window.GA_ID` from app.blade.php (runtime
// config, so an environment without GA_MEASUREMENT_ID ships nothing); gtag.js
// is fetched from here, and only after the visitor has agreed.
//
// SSR-safe: no `window`/`localStorage` access at import time, storage access is
// wrapped in try/catch, and the composables only read state after mount so the
// server render and hydration stay identical.
//
// Privacy signal: `navigator.globalPrivacyControl === true` is an explicit
// opt-out, so it resolves to "denied" and the banner is never shown.
import { onMounted, onUnmounted, ref, type Ref } from 'vue';

/** localStorage key holding the visitor's decision. */
export const ANALYTICS_CONSENT_KEY = 'wasfatna-analytics-consent';

/** The two answers a visitor can give. No value at all means "unset". */
export type AnalyticsConsent = 'granted' | 'denied';

/**
 * Paths that never send page views (private or account pages). Mirrors the
 * routes app.blade.php does not expose the measurement id on, so an in-app
 * navigation into them stays untracked too.
 */
const UNTRACKED_PATH_PREFIXES = ['/login', '/settings', '/dashboard', '/meal-plans/shared', '/my'];

const GTAG_SRC = 'https://www.googletagmanager.com/gtag/js';

type ConsentWindow = Window & {
  gtag?: (...args: unknown[]) => void;
  dataLayer?: unknown[];
  GA_ID?: string;
};

type ConsentListener = (consent: AnalyticsConsent | null) => void;

const listeners = new Set<ConsentListener>();

// 'idle' until a load is attempted, 'loaded' once gtag.js has run and the
// bootstrap queued the initial page view.
let scriptState: 'idle' | 'loading' | 'loaded' = 'idle';

function browserWindow(): ConsentWindow | null {
  return typeof window === 'undefined' ? null : (window as unknown as ConsentWindow);
}

function safeStorage(): Storage | null {
  try {
    return browserWindow()?.localStorage ?? null;
  } catch {
    // Blocked storage (private mode, cookie policy): analytics stays off and
    // the banner asks again next visit.
    return null;
  }
}

export function parseConsent(raw: unknown): AnalyticsConsent | null {
  return raw === 'granted' || raw === 'denied' ? raw : null;
}

function readConsent(): AnalyticsConsent | null {
  const storage = safeStorage();
  if (!storage) return null;
  try {
    return parseConsent(storage.getItem(ANALYTICS_CONSENT_KEY));
  } catch {
    return null;
  }
}

function writeConsent(consent: AnalyticsConsent | null): void {
  const storage = safeStorage();
  if (!storage) return;
  try {
    if (consent === null) storage.removeItem(ANALYTICS_CONSENT_KEY);
    else storage.setItem(ANALYTICS_CONSENT_KEY, consent);
  } catch {
    // Not persisted: the banner reappears next visit; nothing is loaded meanwhile.
  }
}

export function deniedByPrivacySignal(): boolean {
  const w = browserWindow();
  if (!w) return false;
  return (w.navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl === true;
}

/** The recorded decision, unless the browser's privacy signal overrides it. */
export function currentConsent(): AnalyticsConsent | null {
  return deniedByPrivacySignal() ? 'denied' : readConsent();
}

/** The measurement id exposed by app.blade.php; null when not configured. */
export function getMeasurementId(): string | null {
  const id = browserWindow()?.GA_ID;
  return typeof id === 'string' && id.trim() !== '' ? id.trim() : null;
}

/** Analytics is configured on this page and the visitor has not answered yet. */
export function isBannerPending(id: string | null, consent: AnalyticsConsent | null): boolean {
  return id !== null && consent === null;
}

export function subscribeConsent(listener: ConsentListener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function notifyListeners(): void {
  const consent = currentConsent();
  for (const listener of [...listeners]) listener(consent);
}

/** Path only: query strings and fragments can carry search terms and ids. */
function pathnameOf(url: string): string {
  try {
    return new URL(url, 'http://localhost').pathname;
  } catch {
    return url.split(/[?#]/)[0] || '/';
  }
}

function isTrackedPath(path: string): boolean {
  return !UNTRACKED_PATH_PREFIXES.some((prefix) => path === prefix || path.startsWith(`${prefix}/`));
}

/** Google's documented opt-out switch; stops an already-loaded gtag.js sending. */
function setOptOut(id: string, disabled: boolean): void {
  const w = browserWindow();
  if (!w) return;
  (w as unknown as Record<string, unknown>)[`ga-disable-${id}`] = disabled;
}

/**
 * Loads gtag.js and runs the bootstrap — only when the visitor has granted
 * consent and an id is configured. Idempotent.
 */
export function loadAnalytics(): boolean {
  const w = browserWindow();
  const id = getMeasurementId();
  if (!w || !id || typeof document === 'undefined') return false;
  if (currentConsent() !== 'granted') return false;
  if (scriptState !== 'idle') return scriptState === 'loaded';

  // A previous withdrawal in this tab must not silence a fresh grant.
  setOptOut(id, false);

  if (typeof w.gtag === 'function') {
    scriptState = 'loaded';
    return true;
  }

  const bootstrap = () => {
    const now = browserWindow();
    if (!now) return;
    now.dataLayer = now.dataLayer ?? [];
    // Same queue as Google's snippet: gtag.js reads the arguments object.
    now.gtag = function gtag() {
      // eslint-disable-next-line prefer-rest-params
      now.dataLayer?.push(arguments);
    };
    now.gtag('js', new Date());
    now.gtag('config', id, { page_location: now.location.origin + now.location.pathname });
  };

  scriptState = 'loading';

  const script = document.createElement('script');
  script.async = true;
  script.src = `${GTAG_SRC}?id=${encodeURIComponent(id)}`;
  script.referrerPolicy = 'no-referrer';
  script.dataset.wasfatnaAnalytics = 'true';
  // Carry the page nonce so the CSP accepts the injected script.
  const nonce = document.querySelector<HTMLScriptElement>('script[nonce]')?.nonce;
  if (nonce) script.nonce = nonce;
  script.addEventListener(
    'load',
    () => {
      scriptState = 'loaded';
      bootstrap();
    },
    { once: true },
  );
  script.addEventListener(
    'error',
    () => {
      scriptState = 'idle';
      script.remove();
    },
    { once: true },
  );
  document.head.appendChild(script);

  return true;
}

/** Records the visitor's answer, then loads or silences analytics right away. */
export function setConsent(consent: AnalyticsConsent): void {
  writeConsent(consent);

  if (consent === 'granted') {
    loadAnalytics();
  } else {
    const id = getMeasurementId();
    if (id) setOptOut(id, true);
  }

  notifyListeners();
}

/** Forgets the answer so the banner asks again (used by the privacy page). */
export function resetConsent(): void {
  writeConsent(null);
  const id = getMeasurementId();
  if (id) setOptOut(id, true);
  notifyListeners();
}

/** Page-view tracking for an Inertia navigation; no-ops without consent. */
export function trackPageView(url: string): boolean {
  const w = browserWindow();
  const id = getMeasurementId();
  if (!w || !id || typeof w.gtag !== 'function') return false;
  if (currentConsent() !== 'granted' || scriptState !== 'loaded') return false;

  const pagePath = pathnameOf(url);
  if (!isTrackedPath(pagePath)) return false;

  w.gtag('config', id, {
    page_path: pagePath,
    page_location: w.location.origin + pagePath,
  });
  return true;
}

/**
 * Reactive consent + measurement id for components. Both are null on the
 * server and on the first client render, so SSR and hydration match.
 */
export function useAnalyticsConsent(): {
  consent: Ref<AnalyticsConsent | null>;
  measurementId: Ref<string | null>;
} {
  const consent = ref<AnalyticsConsent | null>(null);
  const measurementId = ref<string | null>(null);
  let unsubscribe: (() => void) | null = null;

  onMounted(() => {
    measurementId.value = getMeasurementId();
    consent.value = currentConsent();
    unsubscribe = subscribeConsent((next) => {
      consent.value = next;
    });
  });

  onUnmounted(() => {
    unsubscribe?.();
  });

  return { consent, measurementId };
}
