import type { Catalog, ContentPage } from "@/lib/content/schemas";
import { AreaServicePage } from "./AreaServicePage";
export function LocalServicePage({ page, catalog }: { page: Extract<ContentPage, { kind: "local" }>; catalog: Catalog }) {
  return <AreaServicePage page={page} catalog={catalog} />;
}
