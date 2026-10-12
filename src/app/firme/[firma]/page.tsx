import { notFound } from "next/navigation";
import { loadCatalog } from "@/lib/content/load";
import { metadataFor } from "@/lib/content/public";
import { CompanyPage } from "@/templates/CompanyPage";
export const dynamicParams = false;
type Props = { params: Promise<{ firma: string }> };
export async function generateStaticParams() { return (await loadCatalog()).companies.filter(c => c.status === "published").map(c => ({ firma: c.slug })); }
export async function generateMetadata({ params }: Props) { return metadataFor(`/firme/${(await params).firma}/`); }
export default async function Page({ params }: Props) {
  const catalog = await loadCatalog(); const { firma } = await params;
  const company = catalog.companies.find(c => c.slug === firma && c.status === "published");
  if (!company) notFound();
  return <CompanyPage company={company} catalog={catalog} />;
}
