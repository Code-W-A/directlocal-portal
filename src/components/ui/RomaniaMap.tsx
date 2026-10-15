import outline from './romania-outline.json';
import styles from './romania-map.module.css';

/** Decorative administrative map, without links or coverage indicators. */
export function RomaniaMap() {
  return <svg className={styles.map} data-romania-map aria-hidden="true" focusable="false" width="640" height="420" viewBox={outline.viewBox}>
    <g className={styles.counties}>
      {outline.counties.map(county => <path key={county.code} data-county={county.code} d={county.path} />)}
    </g>
    <g className={styles.labels}>
      {outline.counties.map(county => <text key={county.code} x={county.x} y={county.y} className={county.code === 'B' ? styles.capital : undefined}>{county.code}</text>)}
    </g>
  </svg>;
}
