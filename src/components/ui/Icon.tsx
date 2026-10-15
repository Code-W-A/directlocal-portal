const paths = {
  company: 'M4 21V3h12v18M16 9h4v12M2 21h20M8 7h4M8 11h4M8 15h4M9 21v-3h2v3',
  chevron: 'm6 9 6 6 6-6',
  check: 'm5 12 4 4L19 6',
  pin: 'M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0ZM15 10a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z',
  search: 'm21 21-5-5M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z',
  shield: 'm12 2 8 3v6c0 5-8 10-8 10S4 16 4 11V5l8-3Zm-4 9 3 3 5-6',
  file: 'M14 2H5v20h14V7l-5-5Zm0 0v6h5M8 12h8M8 16h8',
  people: 'M16 21v-3a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v3M13 6a4 4 0 1 1-8 0 4 4 0 0 1 8 0Zm4-3a4 4 0 0 1 0 8m2 3a4 4 0 0 1 3 4v3',
  sofa: 'M5 12V7a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v5M5 16h14M3 20v-2M21 20v-2M2 18v-6a2 2 0 0 1 4 0v2h12v-2a2 2 0 0 1 4 0v6H2Z',
  arrow: 'M4 12h16m-6-6 6 6-6 6',
  phone: 'm7 3 3 5-3 3a16 16 0 0 0 6 6l3-3 5 3v3c-10 3-21-8-18-18h4Z',
  mail: 'M3 5h18v14H3V5Zm0 0 9 8 9-8',
  city: 'M3 21V8h7v13M10 21V3h7v18M17 21V11h4v10M1 21h22M6 11v1m0 3v1m7-10v1m0 3v1m0 3v1',
} as const;
export function Icon({ name, className }: { name: keyof typeof paths; className?: string }) {
  return <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false"><path d={paths[name]} /></svg>;
}
