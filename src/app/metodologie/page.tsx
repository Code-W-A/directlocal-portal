import { contentFor, metadataFor } from "@/lib/content/public";
import { MethodologyPage } from "@/templates/MethodologyPage";
export async function generateMetadata() { return metadataFor("/metodologie/"); }
export default async function Page() { return <MethodologyPage {...await contentFor("/metodologie/")} />; }
