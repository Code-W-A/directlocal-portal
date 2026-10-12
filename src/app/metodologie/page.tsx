import { contentFor, metadataFor } from "@/lib/content/public";
import { ContentView } from "@/templates/ContentView";
export async function generateMetadata() { return metadataFor("/metodologie/"); }
export default async function Page() { return <ContentView {...await contentFor("/metodologie/")} />; }
