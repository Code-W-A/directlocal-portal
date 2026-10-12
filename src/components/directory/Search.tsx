"use client";
import { useState } from "react";
import Link from "next/link";
import { filterSearch, type SearchRow, type Filters } from "@/lib/content/search";
const empty: Filters = { service: "", county: "", city: "", query: "" };
export function Search({ rows }: { rows: SearchRow[] }) {
  const [filters, setFilters] = useState(empty);
  const areas = rows.flatMap(r => r.coverage);
  const services = [...new Map(areas.map(a => [a.serviceId, a.service])).entries()];
  const counties = [...new Map(areas.filter(a => !filters.service || a.serviceId === filters.service).map(a => [a.countyId, a.county])).entries()];
  const cities = [...new Map(areas.filter(a => (!filters.service || a.serviceId === filters.service) && (!filters.county || a.countyId === filters.county)).map(a => [a.cityId, `${a.city}, ${a.county}`])).entries()];
  const results = filterSearch(rows, filters);
  return <><div className="search-filters">
    <div className="filter-field"><label htmlFor="filter-service">Serviciu</label><select id="filter-service" value={filters.service} onChange={e => setFilters({ ...filters, service: e.target.value, county: "", city: "" })}><option value="">Toate serviciile</option>{services.map(([id, name]) => <option key={id} value={id}>{name}</option>)}</select></div>
    <div className="filter-field"><label htmlFor="filter-county">Județ</label><select id="filter-county" value={filters.county} onChange={e => setFilters({ ...filters, county: e.target.value, city: "" })}><option value="">Toate județele</option>{counties.map(([id, name]) => <option key={id} value={id}>{name}</option>)}</select></div>
    <div className="filter-field"><label htmlFor="filter-city">Oraș</label><select id="filter-city" value={filters.city} onChange={e => setFilters({ ...filters, city: e.target.value })}><option value="">Toate orașele</option>{cities.map(([id, name]) => <option key={id} value={id}>{name}</option>)}</select></div>
    <label>Nume sau descriere<input type="search" value={filters.query} onChange={e => setFilters({ ...filters, query: e.target.value })} /></label>
    <button type="button" onClick={() => setFilters(empty)}>Resetează filtrele</button>
  </div><p role="status">{results.length} {results.length === 1 ? "firmă găsită" : "firme găsite"}</p>
    {results.length ? <ul className="search-results">{results.map(row => <li key={row.id}><h2><Link href={row.href}>{row.name}</Link></h2><p>{row.description}</p></li>)}</ul> : <p>Nu există firme pentru selecția ta. Încearcă alte filtre.</p>}
    <noscript>Filtrele necesită JavaScript. Lista inițială și profilurile sunt disponibile mai jos.</noscript>
  </>;
}
