/** Only public catalog identifiers and aggregate flags may reach Analytics. */
export type AnalyticsEvent = 'phone_click' | 'company_website_click' | 'company_message_accepted' | 'company_submission_accepted' | 'search_no_results';
export type AnalyticsParameters = { company_id?: string; service_id?: string; county_id?: string; city_id?: string; has_text_query?: boolean; query_length?: number };
export const analyticsConsentKey = 'directlocal.analytics-consent.v1';
export const analyticsConsentEvent = 'directlocal:analytics-consent';
export const analyticsPreferencesEvent = 'directlocal:analytics-preferences';
export type AnalyticsConsent = 'granted' | 'denied' | 'unknown';
const consentLifetime = 180 * 24 * 60 * 60 * 1000;
let activeId: string | undefined;
let configuredId: string | undefined;
let lastPage: string | undefined;
let memoryConsent: {value: 'granted' | 'denied'; at: number} | undefined;
declare global {
  interface Window { dataLayer?: unknown[]; gtag?: (...args: unknown[]) => void }
}
export function analyticsHostAllowed(hostname: string) { return hostname === 'directlocal.ro'; }
export function validMeasurementId(value: string | undefined) { return !!value && /^G-[A-Z0-9]+$/.test(value); }
export function readAnalyticsConsent(): AnalyticsConsent {
  if (typeof window === 'undefined') return 'unknown';
  try {
    const saved = memoryConsent ?? JSON.parse(localStorage.getItem(analyticsConsentKey) || 'null');
    return saved && ['granted', 'denied'].includes(saved.value) && typeof saved.at === 'number' && Date.now() >= saved.at && Date.now() - saved.at < consentLifetime ? saved.value : 'unknown';
  } catch { return memoryConsent?.value ?? 'unknown'; }
}
export function safeAnalyticsReferrer(value: string) {
  try { const url = new URL(value); return ['https:', 'http:'].includes(url.protocol) ? url.origin : ''; } catch { return ''; }
}
export function analyticsParameters(input: AnalyticsParameters) {
  const output: Record<string, string | boolean | number> = {};
  for (const key of ['company_id', 'service_id', 'county_id', 'city_id'] as const) {
    const value = input[key];
    if (value && /^[a-z0-9-]{1,100}$/.test(value)) output[key] = value;
  }
  if (typeof input.has_text_query === 'boolean') output.has_text_query = input.has_text_query;
  if (typeof input.query_length === 'number' && Number.isFinite(input.query_length)) output.query_length = Math.max(0, Math.min(100, Math.floor(input.query_length)));
  return output;
}
function disabled(value: boolean, id: string) {
  (window as unknown as Record<string, unknown>)[`ga-disable-${id}`] = value;
}
function expireAnalyticsCookies() {
  for (const cookie of document.cookie.split(';')) {
    const name = cookie.split('=')[0].trim();
    if (!/^_ga(?:_|$)|^_gid$|^_gat(?:_|$)/.test(name)) continue;
    for (const domain of ['', '; domain=directlocal.ro', '; domain=.directlocal.ro']) document.cookie = `${name}=; Max-Age=0; path=/${domain}; SameSite=Lax; Secure`;
  }
}
export function clearConsentMemory() { memoryConsent = undefined; }
export function stopAnalytics() {
  if (typeof window === 'undefined') return;
  if (configuredId) {
    disabled(true, configuredId);
    window.gtag?.('consent', 'update', { analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
  }
  activeId = undefined; lastPage = undefined;
  expireAnalyticsCookies();
}
export function saveAnalyticsConsent(value: 'granted' | 'denied') {
  memoryConsent = { value, at: Date.now() };
  try { localStorage.setItem(analyticsConsentKey, JSON.stringify(memoryConsent)); } catch { /* The current document can still honor the choice. */ }
  if (value === 'denied') stopAnalytics();
  window.dispatchEvent(new CustomEvent(analyticsConsentEvent, { detail: value }));
}
export function startAnalytics(id: string) {
  if (!validMeasurementId(id) || !analyticsHostAllowed(location.hostname)) return;
  disabled(false, id);
  window.dataLayer ??= [];
  // The Google bootstrap contract uses an Arguments entry in dataLayer.
  // eslint-disable-next-line prefer-rest-params
  window.gtag ??= function () { window.dataLayer!.push(arguments); };
  window.gtag('consent', 'default', { analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
  window.gtag('consent', 'update', { analytics_storage: 'granted' });
  if (configuredId !== id) {
    window.gtag('js', new Date());
    window.gtag('config', id, { send_page_view: false, allow_google_signals: false, allow_ad_personalization_signals: false, page_location: location.origin + location.pathname, page_referrer: safeAnalyticsReferrer(document.referrer) });
    configuredId = id;
  }
  activeId = id;
}
export function trackPageView(pathname: string) {
  if (!activeId || !window.gtag || lastPage === pathname) return;
  window.gtag('event', 'page_view', { page_location: location.origin + pathname, page_referrer: lastPage ? location.origin + lastPage : safeAnalyticsReferrer(document.referrer), page_title: document.title, send_to: activeId });
  lastPage = pathname;
}
export function trackAnalyticsEvent(name: AnalyticsEvent, parameters: AnalyticsParameters = {}) {
  if (typeof window === 'undefined' || !activeId || !window.gtag || !analyticsHostAllowed(location.hostname)) return false;
  window.gtag('event', name, { ...analyticsParameters(parameters), page_location: location.origin + location.pathname, send_to: activeId, transport_type: 'beacon' });
  return true;
}
