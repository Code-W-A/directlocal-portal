import Link from "next/link";
import { ServiceIcon } from "@/components/ui/ServiceIcon";
import type { SearchRow } from "@/lib/content/search";
import { CompanyIdentity } from "./CompanyIdentity";
import { Icon } from "@/components/ui/Icon";
import styles from "./company-card.module.css";
export function CompanyCard({ row }: { row: SearchRow }) {
  const services = [...new Set(row.coverage.map(a => a.service))];
  const areas = [...new Set(row.coverage.map(a => a.city ? a.city + ', ' + a.county : 'Județul ' + a.county))];
  return <article className={styles.card} data-company-card>
    <div className={styles.body}>
      <CompanyIdentity serviceIds={row.coverage.map(area => area.serviceId)}><h3><Link data-list-entry href={row.href}>{row.name}</Link></h3></CompanyIdentity>
      {row.sponsored ? <p>Sponsorizat</p> : null}
      <ul className={styles.tags} aria-label="Servicii oferite">{services.map(service => <li key={service}><ServiceIcon serviceIds={row.coverage.filter(a => a.service === service).map(a => a.serviceId)} />{service}</li>)}</ul>
      <p className={styles.area}><Icon name="pin" /><span><strong>Zonă deservită</strong><span>{areas.join(" · ")}</span></span></p>
      <p className={styles.description}>{row.description}</p>
      {row.checkedAt ? <p className={styles.checked}>Surse consultate: <time dateTime={row.checkedAt}>{row.checkedAt.split("-").reverse().join(".")}</time></p> : null}
      <div className={styles.actions}>{row.phone ? <a className={styles.phone} href={'tel:' + row.phone.replace(/[^+\d]/g, "")} aria-label={'Sună ' + row.name + ' la ' + row.phone}><Icon name="phone" />{row.phone}</a> : null}{row.email ? <Link href={`${row.href}#mesaj`}>Trimite mesaj</Link> : null}<Link className={styles.profile} href={row.href} aria-label={'Vezi profilul ' + row.name}>Vezi profilul <Icon name="arrow" /></Link></div>
    </div>
  </article>;
}
