import { contentFor, metadataFor } from "@/lib/content/public";
import { AboutPage } from "@/templates/AboutPage";
export async function generateMetadata() { return metadataFor("/despre-noi/"); }
export default async function Page() {
  const { page } = await contentFor("/despre-noi/");
  if (page.kind !== "editorial" || !page.about) throw new Error("The about page needs its structured editorial content.");
  return <AboutPage page={page} content={page.about} />;
}
