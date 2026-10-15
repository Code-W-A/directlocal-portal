import type { ReactNode } from 'react';
import { ServiceIcon } from '@/components/ui/ServiceIcon';
import styles from './company-identity.module.css';

export function CompanyIdentity({ children, serviceIds = [] }: { children: ReactNode; serviceIds?: readonly string[] }) {
  return <div className={styles.identity} data-company-identity>
    <span className={styles.badge} aria-hidden="true"><ServiceIcon serviceIds={serviceIds} /></span>
    <div className={styles.text}>{children}</div>
  </div>;
}
