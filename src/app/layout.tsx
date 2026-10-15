import type { Metadata } from "next";
import { site } from "@/config/site";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import "./globals.css";
export const metadata: Metadata = {
  title: { default: site.name, template: `%s | ${site.name}` },
  description: site.description,
  robots: { index: site.indexable, follow: true },
  ...(site.url ? { metadataBase: new URL(site.url) } : {}),
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ro"><head><link rel="preload" href="/fonts/manrope-latin-wght-normal.woff2" as="font" type="font/woff2" crossOrigin="anonymous" /><link rel="preload" href="/fonts/manrope-latin-ext-wght-normal.woff2" as="font" type="font/woff2" crossOrigin="anonymous" /></head><body>
    <a href="#continut" className="skip-link">Sari la conținut</a>
    <SiteHeader />
    <main id="continut" tabIndex={-1}>{children}</main>
    <SiteFooter />
  </body></html>;
}
