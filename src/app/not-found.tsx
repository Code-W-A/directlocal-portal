import { ActionLink } from "@/components/ui/ActionLink";
import styles from "./not-found.module.css";
export default function NotFound() {
  return <div className={`container ${styles.content}`}>
    <p>EROARE 404</p><h1>Pagina nu a fost găsită.</h1>
    <p>Adresa poate fi incorectă sau pagina nu mai este disponibilă.</p>
    <ActionLink href="/">Înapoi la pagina principală</ActionLink>
  </div>;
}
