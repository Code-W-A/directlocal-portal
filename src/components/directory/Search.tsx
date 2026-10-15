"use client";
import { CompanyCard } from "./CompanyCard";
import { useState } from "react";
import Link from "next/link";
import { filterSearch, type SearchRow, type Filters } from "@/lib/content/search";
import { Icon } from "@/components/ui/Icon";
import styles from "./search.module.css";

import { SearchSelect } from "@/components/ui/SearchSelect";

const empty: Filters = { service: "", county: "", city: "", query: "" };
export function Search({ rows }: { rows: SearchRow[] }) {
  const [filters, setFilters] = useState(empty);
  const areas = rows.flatMap(r => r.coverage);
  const services = [...new Map(areas.map(a => [a.serviceId, a.service])).entries()].sort((a,b) => a[1].localeCompare(b[1], "ro"));
  const counties = [...new Map(areas.filter(a => !filters.service || a.serviceId === filters.service).map(a => [a.countyId, a.county])).entries()].sort((a,b) => a[1].localeCompare(b[1], "ro"));
  const cities = [...new Map(areas.filter(a => a.cityId && (!filters.service || a.serviceId === filters.service) && (!filters.county || a.countyId === filters.county)).map(a => [a.cityId, `${a.city}, ${a.county}`])).entries()].sort((a,b) => a[1].localeCompare(b[1], "ro"));
  const results = filterSearch(rows, filters);
  return <>
    <section className={styles.filters} aria-labelledby="filters-title">
      <div className={styles.panelHead}><div><h2 id="filters-title">Ce serviciu cauți?</h2><p>Rezultatele se actualizează pe măsură ce alegi filtrele.</p></div><button className={styles.reset} type="button" onClick={() => setFilters(empty)}>Resetează filtrele</button></div>
      <div className={styles.fields}>
        <SearchSelect id="filter-service" label="Serviciu" icon="service" placeholder="Toate serviciile" searchPlaceholder="Caută serviciu…" value={filters.service} options={services.map(([value, label]) => ({ value, label }))} onChange={service => setFilters({ ...filters, service, county: "", city: "" })} />
        <SearchSelect id="filter-county" label="Județ" icon="pin" placeholder="Toate județele" searchPlaceholder="Caută județ…" value={filters.county} options={counties.map(([value, label]) => ({ value, label }))} onChange={county => setFilters({ ...filters, county, city: "" })} />
        <SearchSelect id="filter-city" label="Oraș" icon="city" placeholder="Toate orașele" searchPlaceholder="Caută oraș…" value={filters.city} options={cities.map(([value, label]) => ({ value: value!, label }))} onChange={city => setFilters({ ...filters, city })} />
        <div className={`${styles.field} ${styles.query}`}><label htmlFor="filter-query">Nume sau descriere</label><div className={styles.control}><Icon name="search" /><input id="filter-query" type="search" placeholder="Caută după un nume sau un cuvânt" value={filters.query} onChange={e => setFilters({ ...filters, query: e.target.value })} /></div></div>
      </div>
    </section>
    <section className={styles.results} aria-labelledby="results-title">
      <div className={styles.resultsHead}><h2 id="results-title">Firme din director</h2><p role="status" aria-atomic="true">{results.length} {results.length === 1 ? "firmă găsită" : "firme găsite"}</p></div>
      <p className={styles.note}>Listare alfabetică. <Link href="/metodologie/">Vezi cum documentăm firmele.</Link></p>
      {results.length ? <ul className={styles.grid}>{results.map(row => <li key={row.id}><CompanyCard row={row} /></li>)}</ul> : <div className={styles.empty}><span className={styles.roundIcon}><Icon name="search" /></span><h3>Nu există firme pentru selecția ta.</h3><p>Încearcă alte filtre sau resetează selecția pentru a vedea toate firmele.</p><button type="button" className="button" onClick={() => setFilters(empty)}>Vezi toate firmele <Icon name="arrow" /></button></div>}
      <p className={styles.note}>Reprezinți o firmă? <Link href="/inscriere-firma/">Înscrie firma pentru verificare</Link>.</p>
      <noscript><p className={styles.note}>Filtrele necesită JavaScript. Lista firmelor și profilurile sunt disponibile pe această pagină.</p></noscript>
    </section>
  </>;
}
