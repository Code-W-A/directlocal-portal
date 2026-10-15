"use client";
import { usePathname } from "next/navigation";
export function PrimaryNav({ items }: { items: readonly { label: string; href: string }[] }) {
  const path = usePathname();
  return <nav aria-label="Navigare principală">{items.map(item => {
    const active = !item.href.includes("#") && (path === item.href || path.startsWith(item.href) || (item.href === "/cauta/" && path.startsWith("/firme/")));
    return <a key={item.href} href={item.href} aria-current={active ? (path === item.href ? "page" : "location") : undefined}>{item.label}</a>;
  })}</nav>;
}
