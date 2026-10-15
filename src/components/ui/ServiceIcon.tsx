/** Decorative service symbols; accessible service names remain ordinary HTML. */
const drawings: Record<string, string> = {
  'instalatori': 'M12 17h24v8H22v14h-8V25h-2z M18 10h12 M24 7v10 M32 30c0 0-5 6-5 9a5 5 0 0 0 10 0c0-3-5-9-5-9z',
  'electricieni': 'M26 5 12 27h11l-2 16 15-25H25z',
  'electrician-auto': 'M7 27l4-11h26l4 11v10H7z M11 37v5m26-5v5 M8 27h32 M27 18l-7 8h7l-5 7',
  'service-centrale': 'M13 5h23v37H13z M18 10h13v9H18z M24 24c-8 8-7 13 0 13s8-5 0-13z M17 42v3m15-3v3',
  'montaj-centrale-termice': 'M8 5h23v35H8z M13 10h13v10H13z M16 28h6 M35 20v20m-6-10h12 M12 40v4m15-4v4',
  'montaj-aer-conditionat': 'M5 10h38v16H5z M10 21h28 M16 30v9m8-9v13m8-13v9 M35 5v9m-4-4h8',
  'service-aer-conditionat': 'M5 9h38v17H5z M10 21h28 M14 31c6 0 6 10 0 10m10-10v12m8-12c-6 0-6 10 0 10',
  'incarcare-freon-aer-conditionat': 'M17 13h14v29H17z M21 7h6v6 M16 7h16 M31 18h5v-8h6 M20 28h8 M24 24v8',
  'montaj-pompe-de-caldura': 'M7 9h34v31H7z M25 15a10 10 0 1 0 0 20 10 10 0 0 0 0-20 M25 25l-5-7m5 7 7-2m-7 2-2 8 M10 40v4m27-4v4',
  'panouri-fotovoltaice': 'M10 16h28l6 23H4z M9 27h30 M19 16l-2 23m12-23 2 23 M24 39v6m-8 0h16 M24 4v5m-10-4 3 5m17-5-3 5',
  'reparatii-acoperisuri': 'M3 26 24 8l21 18 M9 23v17h30V23 M17 40V28h14v12 M31 14V6h7v14 M13 17l21 18',
  'curatenie': 'M31 5 18 28 M11 24l17 8-8 13L3 37z M10 36l-3 6m10-3-3 6 M34 23v10m-5-5h10',
  'curatenie-la-domiciliu': 'M4 21 24 5l20 16 M10 17v25h28V17 M30 22l-9 14 M15 32l12 6-5 6-12-6z',
  'service-auto': 'M7 25l5-12h24l5 12v13H7z M8 25h32 M12 31h5m14 0h5 M11 38v5m26-5v5',
  'vopsitorie-auto': 'M4 28l5-10h21l5 10v11H4z M9 39v4m21-4v4 M6 29h26 M34 8h9v10h-9z M32 13h-6 M37 18v8',
  'itp': 'M5 26l4-12h22l4 12v14H5z M7 26h26 M10 40v4m20-4v4 M13 33l4 4 8-9 M36 7l3 3 6-7',
  'renovari-apartamente': 'M5 23 24 7l19 16 M10 20v22h28V20 M17 42V29h14v13 M32 9l5-5 7 7-5 5z',
  'amenajari-interioare': 'M6 6h36v36H6z M6 16h36 M16 16v26 M23 23h13v7H23z M27 30v7',
};
export function ServiceIcon({ serviceIds = [], className }: { serviceIds?: readonly string[]; className?: string }) {
  const id = serviceIds.find(id => id === 'curatare-canapele' || drawings[id]);
  return <svg className={className} width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden="true" focusable="false" data-service-icon={id === 'curatare-canapele' ? 'upholstery-cleaning' : id ?? 'local-business'}>
    <rect x="4" y="4" width="40" height="40" rx="14" fill="#e5f0ff" />
    {id === 'curatare-canapele' ? <><path d="M11 26v-9a5 5 0 0 1 5-5h15a5 5 0 0 1 5 5v9M8 33v-8a3.5 3.5 0 0 1 7 0v3h17v-3a3.5 3.5 0 0 1 7 0v8H8ZM12 33v4m23-4v4M23.5 15v9" fill="#fff" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"/><path d="m38 5 1.5 4.5L44 11l-4.5 1.5L38 17l-1.5-4.5L32 11l4.5-1.5L38 5Z" fill="#88c4ee" stroke="currentColor" strokeWidth="1.3"/></> : <path d={id ? drawings[id] : 'M11 39V10h21v29M32 21h7v18H8m10-22h7m-7 7h7m-7 7h7M20 39v-5h5v5'} fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />}
  </svg>;
}
