'use client';
import { useState } from 'react';
import { homeSearchHref, type HomeDestination } from '@/lib/content/home-search';
import { Icon } from '@/components/ui/Icon';
import styles from './home.module.css';
import { SearchSelect } from '@/components/ui/SearchSelect';
export function HomeSearch({ destinations }: { destinations: HomeDestination[] }) {
  const [service, setService] = useState('');
  const [county, setCounty] = useState('');
  const [city, setCity] = useState('');
  const services = destinations.filter(d => !d.countyId);
  const counties = destinations.filter(d => d.serviceId === service && d.countyId && !d.cityId).toSorted((a,b) => a.county!.localeCompare(b.county!, 'ro'));
  const cities = destinations.filter(d => d.serviceId === service && d.countyId === county && d.cityId).toSorted((a,b) => a.city!.localeCompare(b.city!, 'ro'));
  return <div className={styles.searchWrap}>
    <form className={styles.search} aria-label="Caută servicii locale" action="/cauta/" onSubmit={event => { event.preventDefault(); window.location.assign(homeSearchHref(destinations, service, county, city)); }}>
      <div className={styles.searchField}><SearchSelect id="home-service" label="Serviciu" hideLabel icon="service" placeholder="Serviciu" searchPlaceholder="Caută serviciu…" value={service} options={services.map(d => ({ value: d.serviceId, label: d.service }))} onChange={next => { setService(next); setCounty(''); setCity(''); }} /></div>
      <div className={styles.searchField}><SearchSelect id="home-county" label="Județ" hideLabel icon="pin" placeholder="Județ" searchPlaceholder="Caută județ…" value={county} disabled={!service} options={counties.map(d => ({ value: d.countyId!, label: d.county! }))} onChange={next => { setCounty(next); setCity(''); }} /></div>
      <div className={styles.searchField}><SearchSelect id="home-city" label="Oraș" hideLabel icon="city" placeholder={county && !cities.length ? 'La nivel de județ' : 'Oraș'} searchPlaceholder="Caută oraș…" value={city} disabled={!county || !cities.length} describedBy={county && !cities.length ? 'county-coverage-note' : undefined} options={cities.map(d => ({ value: d.cityId!, label: d.city! }))} onChange={setCity} /></div>
      <button type="submit" className={`button ${styles.searchSubmit}`}>Caută <Icon name="arrow" /></button>
    </form>
    {county && !cities.length ? <p id="county-coverage-note" className={styles.searchNote} role="status">Consultă acoperirea la nivel de județ și confirmă localitatea cu firma.</p> : null}
    <noscript><p>Alege zona din legăturile de mai jos sau <a href="/cauta/">consultă toate firmele</a>.</p></noscript>
  </div>;
}
