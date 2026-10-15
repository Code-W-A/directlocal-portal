/* Responsive derivatives are created ahead of export; no image server is required. */
export function LocalPhoto({ kind, className, sizes: customSizes, priority }: { kind: 'city' | 'sofa'; className?: string; sizes?: string; priority?: boolean }) {
  const city = kind === 'city';
  const name = city ? 'brasov-panorama' : 'canapea-albastra';
  const widths = city ? [480, 800, 1200] : [360, 720];
  const sizes = customSizes ?? (city ? '(max-width: 760px) calc(100vw - 32px), (max-width: 1200px) 45vw, 496px' : '(max-width: 480px) calc(100vw - 68px), (max-width: 760px) 130px, 200px');
  const eager = priority ?? city;
  return <picture className={className}>
    <source type="image/avif" srcSet={widths.map(w => `/images/${name}-${w}.avif ${w}w`).join(', ')} sizes={sizes} />
    <img src={`/images/${name}-${city ? 800 : 360}.webp`} srcSet={widths.map(w => `/images/${name}-${w}.webp ${w}w`).join(', ')} sizes={sizes} width={city ? 800 : 360} height={city ? 656 : 240} alt={city ? 'Acoperișuri și Biserica Sfântul Nicolae din Brașov, văzute de sus' : 'Canapea albastră cu perne verzi, într-un living — fotografie ilustrativă'} loading={eager ? 'eager' : 'lazy'} fetchPriority={eager ? 'high' : 'auto'} decoding="async" />
  </picture>;
}
