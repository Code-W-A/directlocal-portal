'use client';
import Script from 'next/script';
import { useEffect, useState, useSyncExternalStore } from 'react';
import { usePathname } from 'next/navigation';
import { analyticsConsentEvent, analyticsHostAllowed, clearConsentMemory, analyticsPreferencesEvent, readAnalyticsConsent, saveAnalyticsConsent, startAnalytics, stopAnalytics, trackAnalyticsEvent, trackPageView, validMeasurementId, type AnalyticsConsent } from '@/lib/analytics';
import styles from './analytics.module.css';
const subscribe = () => () => {};
const clientHost = () => analyticsHostAllowed(location.hostname);
const serverHost = () => false;
const serverConsent = (): AnalyticsConsent => 'unknown';
function subscribeConsent(notify: () => void) {
  const update = () => { clearConsentMemory(); notify(); };
  window.addEventListener(analyticsConsentEvent, notify);
  window.addEventListener('storage', update);
  return () => { window.removeEventListener(analyticsConsentEvent, notify); window.removeEventListener('storage', update); };
}
export function Analytics({ measurementId, enabled }: { measurementId?: string; enabled: boolean }) {
  const pathname = usePathname();
  const allowed = useSyncExternalStore(subscribe, clientHost, serverHost) && enabled && validMeasurementId(measurementId);
  const consent = useSyncExternalStore(subscribeConsent, readAnalyticsConsent, serverConsent);
  const [preferences, setPreferences] = useState(false);
  useEffect(() => {
    if (!allowed) return;
    const show = () => setPreferences(true);
    window.addEventListener(analyticsPreferencesEvent, show);
    return () => {
      window.removeEventListener(analyticsPreferencesEvent, show);
    };
  }, [allowed]);
  useEffect(() => {
    if (!allowed) return;
    if (consent !== 'granted') { stopAnalytics(); return; }
    trackPageView(pathname);
    const click = (event: MouseEvent) => {
      const anchor = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>('a[data-analytics-event]') : null;
      if (!anchor) return;
      const name = anchor.dataset.analyticsEvent;
      if (name === 'phone_click' || name === 'company_website_click') trackAnalyticsEvent(name, { company_id: anchor.dataset.companyId });
    };
    document.addEventListener('click', click, true);
    return () => document.removeEventListener('click', click, true);
  }, [allowed, consent, pathname]);
  if (!allowed) return null;
  const choose = (value: 'granted' | 'denied') => { saveAnalyticsConsent(value); setPreferences(false); };
  return <>
    {consent === 'granted' ? <Script id="directlocal-ga4" src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`} strategy="afterInteractive" onReady={() => { startAnalytics(measurementId!); trackPageView(pathname); }} /> : null}
    {consent === 'unknown' || preferences ? <section role="region" aria-labelledby="analytics-consent-title" className={styles.banner}>
      <div><h2 id="analytics-consent-title">Ne ajuți să îmbunătățim DirectLocal?</h2><p>Cu acordul tău, folosim Google Analytics pentru statistici despre vizite și acțiuni. Alegerea este opțională și o poți schimba din „Preferințe cookies”. <a href="/contact/#statistici">Detalii despre statistici</a>.</p></div>
      <div className={styles.actions}><button type="button" onClick={() => choose('denied')}>Refuz statisticile</button><button type="button" onClick={() => choose('granted')}>Accept statisticile</button>{preferences ? <button type="button" onClick={() => setPreferences(false)}>Închide</button> : null}</div>
    </section> : null}
  </>;
}
export function AnalyticsPreferencesButton() {
  const allowed = useSyncExternalStore(subscribe, clientHost, serverHost);
  return allowed ? <button type="button" className={styles.preferences} onClick={() => window.dispatchEvent(new Event(analyticsPreferencesEvent))}>Preferințe cookies</button> : null;
}
