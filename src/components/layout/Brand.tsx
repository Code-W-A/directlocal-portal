import Link from 'next/link';
import { site } from '@/config/site';
import styles from './layout.module.css';
export function Brand() {
  return <Link href="/" className={styles.brand}>
    <svg width="35" height="43" viewBox="0 0 35 43" aria-hidden="true"><path fill="#0861ee" d="M17.5 1A16 16 0 0 0 1.5 17c0 11 16 25 16 25s16-14 16-25a16 16 0 0 0-16-16Z"/><circle cx="17.5" cy="17" r="6.5" fill="white"/></svg>
    <span>{site.name}<small>Firme locale. Oameni reali.</small></span><span className="sr-only"> — acasă</span>
  </Link>;
}
