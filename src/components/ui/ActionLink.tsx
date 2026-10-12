import Link from "next/link";
import type { ReactNode } from "react";
import styles from "./ui.module.css";
export function ActionLink({ href, children }: { href: string; children: ReactNode }) {
  return <Link href={href} className={styles.action}>{children}<span aria-hidden="true">↗</span></Link>;
}
