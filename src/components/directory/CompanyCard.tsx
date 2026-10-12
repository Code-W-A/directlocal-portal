import Link from "next/link";
import type { Company } from "@/lib/content/schemas";
import { companyPath } from "@/lib/seo/urls";
import styles from "./directory.module.css";
export function CompanyCard({ company }: { company: Company }) {
  if (company.status !== "published") return null;
  return <article className={styles.card}><h3><Link href={companyPath(company)}>{company.name}</Link></h3><p>{company.description}</p>{company.sponsored ? <p>Sponsorizat</p> : null}{company.phone ? <a href={`tel:${company.phone.replace(/ /g, "")}`}>Sună: {company.phone}</a> : null}</article>;
}
