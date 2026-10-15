import { contentFor, metadataFor } from "@/lib/content/public";
import { ContactPage } from "@/templates/ContactPage";
export async function generateMetadata() { return metadataFor("/contact/"); }
export default async function Page() { const { page } = await contentFor("/contact/"); return <ContactPage page={page} />; }
